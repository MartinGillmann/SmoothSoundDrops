
//import Test from './Test';
import AnyButton from '../components/AnyButton';
import SongPic from '../components/SongPic';
import { useState, useEffect } from "react"
import backendApi from "../services/BackendApi";
import { getWholeSvg, getPartSvg, getPartSvg_V2, getPartSvg_V3, getCallbacks } from "../services/songPicConfig"
import { calcKeyId } from "../services/keyCalculator"
import React from "react";
import * as Tone from "tone";
import TimeSlider from './TimeSlider';
import { useScreenSize } from "../hooks/useScreenSize"





function AppSongSelected({ the_song_data, song_btn_count, onResetSongBtn }) {
    //console.log("In AppSongSelected ", the_song_data)

    const calcHeight = () => {
        if (window.innerHeight === 669) {
            return 585;
        }
        return window.innerWidth * 0.83;
    }

    const picWidth = window.innerWidth * 0.95;
    const picHeight = calcHeight();
    const keyWidth = picWidth / 56;

    const picSplitPre = picHeight * 0.2
    const picSplitPos = picHeight * 0.1
    const picSplitZero = 1//picHeight * 0.0005
    const picSplitKeyB = picHeight * 0.1
    const picSplitMain = picHeight - picSplitPre - picSplitPos - picSplitZero - picSplitKeyB

    const timeSliderBackground = "linear-gradient(to right,#e5e7eb 0%, #e5e7eb 34%, red 34%, red 36%, #e5e7eb 36%, #e5e7eb 49%, green 49%, green 51%, #e5e7eb 51%, #e5e7eb)";

    let actOnReset = null

    const [s_last_song_btn_count, set_last_song_btn_count] = useState(0)
    const [s_time_elapsed, set_time_elapsed] = useState(0);
    const [s_isActive, setIsActive] = useState(true);
    const [s_speed, set_speed] = useState(1.0);
    const [s_tone_sampler, set_tone_sampler] = useState(null)
    const [init_tones_played, set_init_tones_played] = useState([[-1], [-1], [-1], [-1], [-1]])
    const [s_tones_played, set_tones_played] = useState(init_tones_played)

    const calcPartSvg = () => {
        let ret = [];

        //                                Time________      part.Height______________
        //                                Range Offset          Top0PercentStart,   Top0PercentEnd
        //                                                                                                  useTones
        //                                                                                                         debug
        //                                                                                                                isKeyBoard
        //                                                                                                                       showTactLines
        ret = [...ret, getPartSvg_V3("Main", 10000,     0,       0,                 46,                     false, false, false,  true, picHeight)];
        ret = [...ret, getPartSvg_V3("KeyB",   500,     0,      46,                 54,                     false, false,  true, false, picHeight)];
        ret = [...ret, getPartSvg_V3("Pos ", 10000, -10000,      54,               100,                      false, false, false,  true, picHeight)];

        ret = [...ret, getPartSvg("Zero",   100,   100, 0, 1,                                               true, false, false, false, picHeight)];
        return ret;

    }
    const [s_all_parts, set_all_parts] = useState(calcPartSvg())

    const playThisId = (uid) => {
        //console.log("In playThisId ", uid, typeof the_song_data, " ", the_song_data)
        const foundKey = the_song_data.find(item => item.id === uid);
        //console.log("T2: ", foundKey)
        if (foundKey.etype !== "T") {
            return;
        }
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
            set_time_elapsed((prevCount) =>
            {
                return prevCount + (s_isActive ? (50 * s_speed ) : 0)//todo
            }); // Update state
        }, 50);

        // Cleanup interval on component unmount
        return () => clearInterval(interval);

    }, [s_isActive, s_speed]);

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

    function speed_DecToSpeed(d) {
        if (d >= 50) {
            d -= 50;
            d *= 4;
            d /= 50
            d += 1;
            return d.toFixed(2);
        } else {
            return (0.06 * d - 2).toFixed(2);
        }
    }
    function speed_getText(decVal) {
        return "";
//        return "Speed: " + speed_DecToSpeed(decVal);
    }
    function speed_onValChanged(decVal) {
        set_speed(speed_DecToSpeed(decVal));
        setIsActive(true);
        return decVal;
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
            <div className="flex justify-start space-x-2">
                <AnyButton text="Other song" onclick={onResetSongBtn} />
                <AnyButton text="Start/Stop" onclick={actOnStartStop} />
                <AnyButton text="Reset" onclick={actOnReset} />
                <AnyButton text="==>" onclick={actOnArrowRight} />
                <AnyButton text="<==" onclick={actOnArrowLeft} />
                <div>{s_time_elapsed}ms</div>
                <TimeSlider  
                    in_default={50}
                    onValChanged={speed_onValChanged}
                    getText={speed_getText}
                    in_style_background={timeSliderBackground}
                />
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
