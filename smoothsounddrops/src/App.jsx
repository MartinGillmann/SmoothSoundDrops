
//import Test from './Test';
import AnyButton from './components/AnyButton';
import { useState, useEffect } from "react"
import backendApi from "./services/BackendApi";
import React from "react";
import AppSongSelected from './components/AppSongSelected';
import ScreenTest from './components/ScreenTest';


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

    const path = window.location.pathname;
    const queri = new URLSearchParams(window.location.search);

    const queriHas = (txt) => {
        if (queri.has(txt)) {
            return true;
        }
        return [...queri.values()].some(v =>
            v.includes(txt) 
        );
    }

    if (s_availabel_songs === null) {
        return (<div />);
    }
    //console.log("In App ", s_availabel_songs, " ", s_selected_song)

    if (queriHas("screentest")) {
        return (
            <ScreenTest />
        );
    }

    return (
        <>
            {s_selected_song === null && <div>
                <div className="w-full mb-4 text-lg font-medium text-gray-700">Please select a song</div>
                {
                    s_availabel_songs.map((e, i) => {
                        return (<AnyButton text={e} key={i} onclick={onSongBtn} />)
                    })
                }
            </div>}

            <hr></hr>
            <AppSongSelected the_song_data={the_song_data} song_btn_count={s_song_btn_count} onResetSongBtn={onResetSongBtn}>
            </AppSongSelected>
        </>
    )
}



export default App;
