import SongPicPart from "./SongPicPart"


export function SongPicParts({ data, wholeSvg, timeElapsed, allParts, allNotesPlayed, onToneFill }) {
    //console.log("In SongPicParts ", timeElapsed, " ", allNotesPlayed, " ")

    return (
        <>
        {
            allParts.map((part, index) => 
            {
                return (
                    <SongPicPart
                        data={data}
                        wholeSvg={wholeSvg}
                        timeElapsed={timeElapsed}
                        svgPart={part}
                        notesPlayed={allNotesPlayed[index]}
                        index={index}
                        onToneFill={onToneFill}
                        key={index} />
                );
            })
        }
        </>
    );
}
