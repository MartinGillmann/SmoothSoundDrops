
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
                <rect
                    x={5}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    width={wholeSvg.picWidth / 5}
                    height={svgPart.partHeight}
                    fill="blue"
                    stroke="black" // Optional: Add stroke to highlight the rectangle
                    strokeWidth="1">
                </rect>
            }
            {
                <rect
                    x={0}
                    y={wholeSvg.picHeight - svgPart.partHeight - svgPart.yOffset}
                    width={wholeSvg.picWidth}
                    height={svgPart.partHeight}
                    fill="transparent"
                    stroke="black" // Optional: Add stroke to highlight the rectangle
                    strokeWidth="1">
                </rect>
            }


        {

            activeData/*data*/.map((entry, index) =>
            {
                const keyData = calcKeyData(entry, index, wholeSvg, svgPart, timeElapsed);

                //console.log("Testb SongPicPart ", keyData.yd)


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
            })
            }

        </>
    );
}


export default SongPicPart ;

