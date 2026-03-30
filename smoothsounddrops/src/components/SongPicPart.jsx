
import React from "react";
import { calcKeyData, isInTimeRange, allKeyboardKeys } from "../services/keyCalculator"
import { getUpdatedStructAndIndex } from "../services/songPicConfig"


function SongPicPart({ data, wholeSvg, timeElapsed, svgPart, notesPlayed, index, onToneFill, aktuelleNoten }) {
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
        const newData2 = [...newData];
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
            {
                // Debug
                svgPart.debug &&
                <>
                    <line
                        x1={50}
                        y1={50}
                        x2={100}
                        y2={100}
                    />
                    <rect
                        x={wholeSvg.picWidth * 0.75}
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
                // Rand um den Bereich (wholeSvg)
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
                // foreach element
                activeData/*data*/.map((entry, index) => {
                    if (entry.etype === "T") {
                        const keyData = calcKeyData(entry, index, wholeSvg, svgPart, timeElapsed);
                        // Es ist ein etype "T" => Echte Note
                        if (svgPart.isKeyBoard === false) {
                            // Es ist nicht das schwarz/weisse Keyboard
                            return (
                                <>
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
                                    <text
                                        xid={entry.id}
                                        xdebug={keyData.debug}
                                        x={keyData.x1 + (keyData.xd / 2)}
                                        y={keyData.y1 + keyData.yd - 1}
                                        textAnchor="middle"
                                        font-weight="bold"
                                        font-size="0.6rem"
                                    >{keyData.keyId.noteC.replaceAll('S', '#')}</text>
                                </>
                            );
                        } else {
                            // Es ist das schwarz/weisse Keyboard
                            if (keyData.keyId.isBlack) {
                                // Es ist eine schwarze Taste
                                let color = aktuelleNoten.includes(entry.pitch) ? "darkgray" : "black";
                                return (<rect
                                    xid={entry.id}
                                    xdebug={keyData.debug}
                                    key={entry.id}
                                    x={keyData.x1}
                                    y={keyData.y1}
                                    width={keyData.xd}
                                    height={keyData.yd}
                                    fill={color}
                                    stroke="black" 
                                    strokeWidth="1">
                                </rect>);
                            } else {
                                // Es ist eine weisse Taste
                                let color = aktuelleNoten.includes(entry.pitch) ? "darkgray" : "white";
                                return (<><rect
                                    xid={entry.id}
                                    xdebug={keyData.debug}
                                    key={entry.id}
                                    x={keyData.x1}
                                    y={keyData.y1}
                                    width={keyData.xd}
                                    height={keyData.yd}
                                    fill={color}
                                    stroke="black" // Optional: Add stroke to highlight the rectangle
                                    strokeWidth="1">
                                </rect>
                                    {keyData.keyId.noteC === "C" &&
                                        <text
                                            xid={entry.id}
                                            xdebug={keyData.debug}
                                            x={keyData.x1 + (keyData.xd / 2)}
                                            y={keyData.y1 + keyData.yd - 1}
                                            textAnchor="middle"
                                            font-weight="bold"
                                            font-size="0.6rem"
                                        >{keyData.keyId.tone}</text>}
                                </>);
                            }
                        }
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
                            <React.Fragment key={entry.id + "_"}>
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

