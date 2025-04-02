

import {calcKeyData, allKeyboardKeys} from "../services/keyCalculator"
import {getSongPicConfig} from "../services/songPicConfig"
import {SongPicParts} from "./SongPicParts"

function SongPic({ data, wholeSvg, timeElapsed, allParts, allNotesPlayed, onToneFill }) {
    //console.log("In SongPic ", timeElapsed, " ", data)

    if (!data || !Array.isArray(data)) {
        return <div>No data available</div>;
    }

    return (
        <div>
            <svg 
                width={wholeSvg.picWidth} 
                height={wholeSvg.picHeight} 
                style={{ border: "1px solid black" }}>
                <SongPicParts data={data} wholeSvg={wholeSvg} timeElapsed={timeElapsed} allParts={allParts} allNotesPlayed={allNotesPlayed} onToneFill={onToneFill} />
            </svg>
        </div>
    );
}


export default SongPic;

