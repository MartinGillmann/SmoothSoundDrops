import packageJson from "../../package.json";


class BackendApi {

    async getAvailableSongs() {
        const res = await fetch(`/backend/smoothsounddrops/availablesongs`);
        if (!res.ok) throw new Error("Fehler beim Laden der 'getAvailableSongs'");
            return await res.json();
    }

    async getSongData(songName) {
        const res = await fetch(`/backend/smoothsounddrops/songdata?songName=${songName}`);
        if (!res.ok) throw new Error("Fehler beim Laden der 'getSongData'");
        return await res.json();
    }
}

export default new BackendApi(); // Singleton

