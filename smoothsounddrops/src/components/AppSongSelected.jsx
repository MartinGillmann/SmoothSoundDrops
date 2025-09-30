
//import Test from './Test';
import SongButton from '../components/SongButton';
import SongPic from '../components/SongPic';
import { useState, useEffect } from "react"
import backendApi from "../services/BackendApi";
import { getWholeSvg, getPartSvg, getCallbacks } from "../services/songPicConfig"
import { calcKeyId } from "../services/keyCalculator"
import React from "react";
import * as Tone from "tone";




function AppSongSelected({ the_song_data, song_btn_count }) {
    //console.log("In AppSongSelected ", the_song_data)

    const picWidth = window.innerWidth * 0.95;
    const picHeight = window.innerHeight * 0.8;
    const keyWidth = picWidth / 56;

    const picSplitPre = picHeight * 0.2
    const picSplitPos = picHeight * 0.1
    const picSplitZero = 1//picHeight * 0.0005
    const picSplitKeyB = picHeight * 0.1
    const picSplitMain = picHeight - picSplitPre - picSplitPos - picSplitZero - picSplitKeyB

    let actOnReset = null

    const [s_last_song_btn_count, set_last_song_btn_count] = useState(0)
    const [s_time_elapsed, set_time_elapsed] = useState(0);
    const [s_isActive, setIsActive] = useState(true);
    const [s_tone_sampler, set_tone_sampler] = useState(null)
    const [init_tones_played, set_init_tones_played] = useState([[-1], [-1], [-1], [-1], [-1]])
    const [s_tones_played, set_tones_played] = useState(init_tones_played)

    const [s_all_parts, set_all_parts] = useState([
        getPartSvg("Pre",
            40000, 10000,     // timeRange, timeOffset
            picSplitPre, picSplitPos + picSplitZero + picSplitKeyB + picSplitMain,
            false, false, false),
        getPartSvg("Main",
            10000, 0,         //  timeRange, timeOffset
            picSplitMain, picSplitPos + picSplitZero + picSplitKeyB,
            false, false, false),
        getPartSvg("Zero",
            100, 100,          // timeRange, timeOffset,
            picSplitZero, picSplitPos,
            true, false, false),
        getPartSvg("KeyB",              // name
            500, 0,                     // timeRange, timeOffset
            picSplitKeyB, picSplitPos,  // partHeight, yOffset
            false, true, true),         // useTones, debug, isKeyBoard
        getPartSvg("Pos",
            5000, -5000,      //   timeRange, timeOffset
            picSplitPos, 0,
            false, false, false)
    ])

    const playThisId = (uid) => {
        //console.log("In playThisId ", uid, typeof the_song_data, " ", the_song_data)
        const foundKey = the_song_data.find(item => item.id === uid);
        //console.log("T2: ", foundKey)
        const foundKeyId = calcKeyId(foundKey)
        //console.log("T3: ", foundKeyId)

        s_tone_sampler.triggerAttackRelease(foundKeyId.tone, foundKeyId.toneDuration)
    }

    const handleToneFill = (updatedStructAndIndex) => {
        const index = updatedStructAndIndex.index
        const update = updatedStructAndIndex.updatedStruct
        //console.log("handleToneFill(a) i:", index, " u:", update, " ex:", s_tones_played[index])

        let playedIndexed = [...s_tones_played[index]]
        for (const uid in update) {
            const uid1 = update[uid]
            const upId = uid1
            if (!s_tones_played[index].includes(upId)) {
                playedIndexed = [...playedIndexed, upId]
                //                console.log("Adding ", upId)
                playThisId(upId)
            }
            //            console.log("ZZEESS2 ", playedIndexed)
        }

        const newTonesPlayed = [...s_tones_played];
        newTonesPlayed[index] = playedIndexed;
        //        console.log("handleToneFill(b) i:", index, " u:", update, " ex:", newTonesPlayed[index])
        set_tones_played(newTonesPlayed);
    }


    useEffect(() => {
        const loadTone = async () => {
            const sampler = new Tone.Sampler({
                urls: {
                    C4: "C4.mp3",
                },
                release: 1,
                baseUrl: "https://tonejs.github.io/audio/salamander/",
            }).toDestination();
            Tone.loaded().then(() => {
                set_tone_sampler(sampler)
            })
        }

        loadTone()
    }, []);

    useEffect(() => {
        // Create an interval that updates the state every 250ms (4 times per second)
        const interval = setInterval(() => {
            set_time_elapsed((prevCount) => { return prevCount + (s_isActive ? 50 : 0) }); // Update state
        }, 50);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);

    }, [s_isActive]);

    useEffect(() => {
        const doResetNeeded = () => {
            if (s_last_song_btn_count !== song_btn_count) {
                actOnReset()
                set_last_song_btn_count(song_btn_count)
                //console.log("s_last_song_btn_count")

            }
        }

        doResetNeeded()
    }, [song_btn_count]);

    function actOnStartStop() {
        setIsActive((prevState) => !prevState);

    }

    actOnReset = () => {
        set_time_elapsed(0);
        set_tones_played(init_tones_played);
        setIsActive(true);
    }

    function actOnArrowRight() {
        if (!s_isActive) {
            setIsActive(true);
        } else {
            set_time_elapsed((prevCount) => { return prevCount + 10000 });
            set_tones_played(init_tones_played);
        }
    }

    function actOnArrowLeft() {
        if (!s_isActive) {
            setIsActive(true);
        } else {
            set_time_elapsed((prevCount) => { return prevCount - 5000 });
            set_tones_played(init_tones_played);
        }
    }

    function handleKeyPress(event) {
        if (event.type === "keydown" && event.code === "ArrowRight") {
            actOnArrowRight();
        }
        if (event.type === "keydown" && event.code === "ArrowLeft") {
            actOnArrowLeft();
        }
        if (event.type == "keydown" && event.code === "Space") {
            actOnStartStop();
        }
    }

    if (the_song_data === null) {
        return (<div />);
    }

    //console.log(picHeight, " pr:", picSplitPre, " ma:", picSplitMain, " po:", picSplitPos, " kb:", picSplitKB)

    const wholeSvg = getWholeSvg(picWidth, picHeight, keyWidth)
    //console.log("In App ", null)

    return (
        <div
            tabIndex={0}
            onKeyDown={handleKeyPress}
        >
            <div>El:{s_time_elapsed} isActive:{JSON.stringify(s_isActive)}</div>
            <div>
                <button onClick={actOnStartStop} >Run</button>
            </div>
            <div>
                <button onClick={actOnReset} >Reset</button>
            </div>
            <div>
                <button onClick={actOnArrowRight} >==&gt;</button>
            </div>
            <div>
                <button onClick={actOnArrowLeft} >&lt;==</button>
            </div>

            <SongPic
                data={the_song_data}
                wholeSvg={wholeSvg}
                timeElapsed={s_time_elapsed}
                allParts={s_all_parts}
                allNotesPlayed={s_tones_played}
                onToneFill={(updatedStructAndIndex) => handleToneFill(updatedStructAndIndex)}
            />
        </div>
    )
}


export default AppSongSelected;
