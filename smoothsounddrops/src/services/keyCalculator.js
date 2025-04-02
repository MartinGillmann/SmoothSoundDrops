import {getSongPicConfig} from "./songPicConfig"

export const calcKeyId = (key) => {
    const sp = key.pitch.split("_");
    const oktav = parseInt(sp[1], 10) -1;
    let isBlack = false;
    if (sp.length === 4) {
        isBlack = true;
    }
    const noteToNumberMap = {
        "C":  0,
        "CS": 0,
        "D":  1,
        "DS": 1,
        "E":  2,
        "F":  3,
        "FS": 3,
        "G":  4,
        "GS": 4,
        "A":  5,
        "AS": 5,
        "B":  6,
    };
    const noteC = sp[2]
    const noteI = noteC.split(" ").map(note => noteToNumberMap[note] || 0)[0];
    let noteUid = (7 * oktav) + noteI;
    let keyUid = key.id

    let tone = null;
    if (isBlack) {
        tone = `${noteC[0]}#${oktav}`
    } else {
        tone = `${noteC[0]}${oktav}`
    }
    const toneDuration = (key.endMs - key.startMs) / 1000
    return { noteUid, keyUid, isBlack, oktav, noteC, noteI, tone, toneDuration };
}

const calcKeyColor = (key) => {
    const keyId = calcKeyId(key);

    // Base RGB values for each octave
    const octaveBaseColors = {
        1: [0, 0, 200],     // **Color.Blue**  
        2: [0, 200, 0],     // **Color.Green**  
        3: [128, 0, 128],   // **Color.Purple** 
        4: [200, 200, 0],   // **Color.Yellow**  
        5: [200, 0, 0],     // **Color.Red**  
        6: [200, 165, 0],   // **Color.Orange**  
        7: [0, 200, 200],   // **Color.Cyan**  
        8: [200, 0, 200],   // **Color.Magenta**  
    };

    // Get the base color for the given octave
    const baseColor = octaveBaseColors[keyId.oktav] || [200, 200, 200]; // Default to gray if octave is missing

    // Adjust the RGB channels based on the note index
    const adjustment = keyId.noteI * 30; // Adjust color slightly per note
    const red = Math.min(baseColor[0] + adjustment, 255); // Cap at 255
    const green = Math.min(baseColor[1] + adjustment, 255);
    const blue = Math.min(baseColor[2] + adjustment, 255);

    // Return the color as an RGB string
    return `rgb(${red}, ${green}, ${blue})`;

}

const timeCorrectedMSVal = (key, partSvg, timeElapsed) => {
    const sSspeedTimeMs = key.startMs - timeElapsed
    const eSspeedTimeMs = key.endMs - timeElapsed
    return {sSspeedTimeMs, eSspeedTimeMs}
}

export const isInTimeRange = (key, partSvg, timeElapsed) => {
    //console.log("In isInTimeRange")
    //console.log(key)
    //console.log(partSvg)
    //console.log(timeElapsed)

    const c = timeCorrectedMSVal(key, partSvg, timeElapsed)

    let ret = false
    if (c.eSspeedTimeMs < partSvg.timeOffset) {
        ret = false
    } else if (c.sSspeedTimeMs > (partSvg.timeOffset + partSvg.timeRange)) {
        ret = false
    } else {
        ret = true
    }

//    if (ret === true && cbOnValue !== null) {
//        partSvg.cbToParent(calcKeyId(key), timeElapsed)
//    }

//    const s1 = c.sSspeedTimeMs - partSvg.timeOffset
//    const e1 = c.eSspeedTimeMs - partSvg.timeOffset
//    let ret = ((s1 >= 0) || (e1 <= partSvg.timeRange)) // todo

    //console.log(c)
    //console.log(`Out isInTimeRange ${ret}`)
    return ret
}

const c_calculation = (partSvg, c1) => {
    const c2 = c1 - partSvg.timeOffset;
    const c4 = c2 * partSvg.partHeight / partSvg.timeRange;
    const c5 = c4 - partSvg.partHeight;
    const c6 = c5 * -1;
    //console.log("In c_calculation ", c1, " ", c2, " ", c4, " ", c5, " ", c6, " ", partSvg)
    return c6;
}

export const calcKeyData = (key, index, wholeSvg, partSvg, timeElapsed) => {

//    console.log("In calcKeyData")
//    console.log(key)
//    console.log(wholeSvg)
//    console.log(partSvg)
//    console.log(timeElapsed)

    const keyId = calcKeyId(key);
    //console.log(keyId)

    // X <<<<<<<<<<<<<<<<<<<
    let x1 = keyId.noteUid;
    let xd = 0;

    if (keyId.isBlack) {
        x1 *= wholeSvg.keyWidth;
        x1 += wholeSvg.keyWidth * 3 / 4;
        xd = wholeSvg.keyWidth / 2;
    }
    else {
        x1 *= wholeSvg.keyWidth;
        xd = wholeSvg.keyWidth;
    }
    //console.log(x1)
    //console.log(xd)

    // Y <<<<<<<<<<<<<<<<<<<
    const c = timeCorrectedMSVal(key, partSvg, timeElapsed)
    let y1 = c_calculation(partSvg, c.sSspeedTimeMs);
    let y2 = c_calculation(partSvg, c.eSspeedTimeMs);
    if (y2 < 0) { y2 = 0 }
    if (y1 > partSvg.partHeight) { y1 = partSvg.partHeight }
    let debug = `y1:${y1} y2:${y2}`
    //console.log(debug)


    const yd = y1 - y2;
    y1 -= yd
    const yOffset = wholeSvg.picHeight - partSvg.partHeight - partSvg.yOffset
    y1 = y1 + yOffset



    //console.log(y1)
    //console.log(yd)

    // Color <<<<<<<<<<<<<<<
    let color = calcKeyColor(key)
    //console.log(color)

    debug = `${debug} c:${JSON.stringify(c)} key:${JSON.stringify(key)} keyId:${JSON.stringify(keyId)}, partSvg:${JSON.stringify(partSvg)}, ${JSON.stringify(timeElapsed)}`

    const ret = { x1, xd, y1, yd, color, key, keyId, debug };
    //console.log(ret)
    return ret;
}


export const allKeyboardKeys = () => {
    const startMsW = 0
    const endMsW = 500
    const startMsB =200
    const endMsB = 500
    let ret = [
        
        { pitch: "_1_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_1_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_2_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_2_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_3_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_3_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_4_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_4_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_5_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_5_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_6_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_6_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_7_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_7_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_8_C", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_D", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_E", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_F", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_G", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_A", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },
        { pitch: "_8_B", startMs: startMsW, endMs: endMsW, etype: "T", id: -2 },

        { pitch: "_1_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_1_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_1_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_1_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_1_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_2_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_2_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_2_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_2_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_2_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_3_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_3_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_3_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_3_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_3_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_4_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_4_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_4_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_4_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_4_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_5_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_5_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_5_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_5_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_5_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_6_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_6_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_6_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_6_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_6_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_7_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_7_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_7_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_7_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_7_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },

        { pitch: "_8_CS_Db", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_8_DS_Eb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_8_FS_Gb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_8_GS_Ab", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
        { pitch: "_8_AS_Bb", startMs: startMsB, endMs: endMsB, etype: "T", id: -2 },
    ]

    for (const e in ret) {
        ret[e].id = e+1
//        console.log(e, " ", ret[e])
    }
    return ret
}
