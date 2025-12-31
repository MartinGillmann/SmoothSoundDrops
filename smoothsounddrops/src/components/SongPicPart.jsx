
import React from "react";
import {calcKeyData, isInTimeRange, allKeyboardKeys} from "../services/keyCalculator"
import { getSongPicConfig, getUpdatedStructAndIndex } from "../services/songPicConfig"
//import { useState, useEffect } from "react"


function SongPicPart({ data, wholeSvg, timeElapsed, svgPart, notesPlayed, index, onToneFill }) {
    //console.log("In SongPicPart ", timeElapsed, " ", svgPart)
    //console.log(wholeSvg)
    //console.log(svgPart)
    //console.log("SongPicPart")

    if (svgPart.isKeyBoard === true) {
        //console.log("isKeyBoard(a) ", data)
        data = allKeyboardKeys()
        timeElapsed = 0
        //console.log("isKeyBoard(b) ", data)
    }

    const fillTone = (newData) => {
        const newData2 = [ ...newData ];
        onToneFill(getUpdatedStructAndIndex(newData2, index));
    };
    const fillToneIfAny = (newData) => {
        let newNotes = []
        for (const e in newData) {
            if (!notesPlayed.includes(newData[e].id)) {
                newNotes.push(newData[e].id)
            }
        }
        if (newNotes.length > 0) {
            fillTone(newNotes)
        }
    }



    const activeData = data.filter((k) => { return isInTimeRange(k, svgPart, timeElapsed) })

    if (svgPart.useTones === true) {
        fillToneIfAny(activeData)
    }

    //console.log("Testa SongPicPart ", svgPart.partHeight)

    return (
        <>
            {svgPart.debug &&
                <>
                <line
                    x1={50}
                    y1={50}
                    x2={100}
                    y2={100}
                />
                <rect
                    x={wholeSvg.picWidth *0.75}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    width={wholeSvg.picWidth / 10}
                    height={svgPart.partHeight}
                    fill="blue"
                    stroke="yellow" // Optional: Add stroke to highlight the rectangle
                    strokeWidth="10"
                />
                <rect
                    x={(wholeSvg.picWidth / 4) + 45}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    width={wholeSvg.picWidth / 5}
                    height={svgPart.partHeight}
                    fill="none"
                    stroke="black" // Optional: Add stroke to highlight the rectangle
                    strokeWidth="1">
                </rect>
                <text
                    x={0}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    textAnchor="start"
                    dominantBaseline="hanging"
                >
                    '{svgPart.name}' H:{wholeSvg.picHeight} ({svgPart.partHeight}/{svgPart.yOffset}) => yPos:{wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                </text>
                <text
                    x={wholeSvg.picWidth}
                    y={wholeSvg.picHeight - svgPart.yOffset}
                    textAnchor="end"
                    dominantBaseline="text-top"
                >
                    '{svgPart.name}' H:{wholeSvg.picHeight} ({svgPart.partHeight}/{svgPart.yOffset}) => yPos:{wholeSvg.picHeight - svgPart.yOffset}
                </text>

                </>
            }
            {
                <rect
                    x={0}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    width={wholeSvg.picWidth}
                    height={svgPart.partHeight}
                    fill="none"
                    stroke="black" // Optional: Add stroke to highlight the rectangle
                    strokeWidth="1">
                </rect>
            }


            {

                activeData/*data*/.map((entry, index) => {
                    if (entry.etype === "T") {
                        const keyData = calcKeyData(entry, index, wholeSvg, svgPart, timeElapsed);

                        /*
                        Testb SongPicPart  
                            Object { 
                            x1: 1491.7417410714286, 
                            xd: 14.139732142857142, 
                            y1: 512.64, 
                            yd: 38.44800000000001, 
                            color: "rgb(90, 255, 255)", 
                            key: {…}, 
                            keyId: {…}, 
                            debug: 'y1:38.44800000000001 y2:0 c:{"sSspeedTimeMs":200,"eSspeedTimeMs":500} key:{"pitch":"_8_FS_Gb","startMs":200,"endMs":500,"etype":"T","id":"931"} keyId:{"noteUid":52,"keyUid":"931","isBlack":true,"oktav":7,"noteC":"FS","noteI":3,"tone":"F#7","toneDuration":0.3}, partSvg:{"name":"KeyB","timeRange":500,"timeOffset":0,"partHeight":64.08000000000001,"yOffset":64.08000000000001,"useTones":false,"debug":true,"isKeyBoard":true}, 0' }
                        */
                        //console.log("Testb SongPicPart ", keyData)

                        return (
                            <rect
                                xid={entry.id}
                                xdebug={keyData.debug}
                                key={entry.id}
                                x={keyData.x1}
                                y={keyData.y1}
                                width={keyData.xd}
                                height={keyData.yd}
                                fill={keyData.color}
                                stroke="black" // Optional: Add stroke to highlight the rectangle
                                strokeWidth="1">
                            </rect>
                        );
                    } else if (
                        entry.etype === "A"
                        && svgPart.showTactLines === true
                    ) {

                        //console.log("activeData.map:  entry ", entry)
                        //console.log("activeData.map:  index ", index)
                        //console.log("activeData.map:  wholeSvg ", wholeSvg)
                        //console.log("activeData.map:  svgPart ", svgPart)
                        //console.log("activeData.map:  timeElapsed ", timeElapsed)

                        const keyData = calcKeyData(entry, index, wholeSvg, svgPart, timeElapsed);
                        //console.log("activeData.map:  keyData ", keyData)

                        return (
                            <React.Fragment key={entry.id+"_"}>
                                <text
                                    key={entry.id + "T"}
                                    x={(keyData.xd - keyData.x1) / 1.0}
                                    y={keyData.y1}
                                    textAnchor="end" fontSize="16" fill="black">
                                    {keyData.keytext}
                                </text>

                                <line
                                    xid={entry.id}
                                    xdebug={keyData.debug}
                                    key={entry.id}
                                    x1={keyData.x1}
                                    y1={keyData.y1}
                                    x2={keyData.xd - keyData.x1}
                                    y2={keyData.y1}
                                    stroke={keyData.color}
                                    strokeWidth="1"
                                    strokeDasharray="10 30"
                                />
                            </React.Fragment>
                        );
                    } else {
                        return null;
                    }
                })
            }

        </>
    );
}


export default SongPicPart;

