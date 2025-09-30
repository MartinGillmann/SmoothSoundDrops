
//import Test from './Test';
import SongButton from './components/SongButton';
import SongPic from './components/SongPic';
import { useState, useEffect } from "react"
import backendApi from "./services/BackendApi";
import { getWholeSvg, getPartSvg, getCallbacks } from "./services/songPicConfig"
import { calcKeyId } from "./services/keyCalculator"
import React from "react";
import * as Tone from "tone";
import AppSongSelected from './components/AppSongSelected';


function App() {

    const [s_availabel_songs, set_availabel_songs] = useState(null);
    const [s_selected_song, set_selected_song] = useState(null);
    const [s_song_btn_count, set_song_btn_count] = useState(0)
    const [the_song_data, set_the_song_data] = useState(null);

    useEffect(() => {
        const loadsAavailabelSongs = async () => {
            const loaded = await backendApi.getAvailableSongs()
            set_availabel_songs(loaded)
        }
        loadsAavailabelSongs()
    }, []);

    useEffect(() => {
        const loadSongData = async () => {
            const loadedData = await backendApi.getSongData(s_selected_song)
            set_the_song_data(loadedData);
        }

        if (s_selected_song !== null) {
            loadSongData();
        }
    }, [s_selected_song]);

    const onSongBtn = (song) => {
        set_selected_song(song)
        set_song_btn_count((p) => p+1)
    }
    const onResetSongBtn = () => {
        set_selected_song(null)
        set_the_song_data(null)
    }


    if (s_availabel_songs === null) {
        return (<div />);
    }
    //console.log("In App ", s_availabel_songs, " ", s_selected_song)


    return (
        <>
            {s_selected_song === null && <div>
                <div>Please select a song</div>
                { 
                    s_availabel_songs.map((e, i) =>
                    {
                        return (<SongButton text={e} key={i} onSongBtn={onSongBtn} />)
                    })
                }
            </div>}
            {s_selected_song !== null && <div>
                <SongButton text="Other song" onSongBtn={onResetSongBtn} />
            </div>}
            <hr></hr>
            <AppSongSelected the_song_data={the_song_data} song_btn_count={s_song_btn_count}>
            </AppSongSelected>
        </>
    )
}



export default App;
