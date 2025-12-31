
export const getSongPicConfig = () => {

        const picWidth = window.innerWidth * 0.95;
        const picHeight = window.innerHeight * 0.8;
        const keySize = picWidth / 56;
        const minTimeMS = 0;
        const maxTimeMS = 5000;
        const pixPerMS = 0.1;
        return { picWidth, picHeight, keySize, pixPerMS, minTimeMS, maxTimeMS };
}

export const getWholeSvg = (picWidth, picHeight, keyWidth) => {
    return { picWidth, picHeight, keyWidth };
}

export const getPartSvg = (name, timeRange, timeOffset, partHeight, yOffset, useTones, debug, isKeyBoard, showTactLines) => {
    return { name, timeRange, timeOffset, partHeight, yOffset, useTones, debug, isKeyBoard, showTactLines };
}

export const getPartSvg_V2 = (name, timeRange, timeOffset, partHeightPercent, partTopOffsetPercent, useTones, debug, isKeyBoard, showTactLines, picHeight) => {
    let partHeight = partHeightPercent*0.01 * picHeight;
    let yOffset = picHeight- (partTopOffsetPercent * 0.01 * picHeight)
    console.log(picHeight, partHeight, yOffset)
    return { name, timeRange, timeOffset, partHeight, yOffset, useTones, debug, isKeyBoard, showTactLines };
}

export const getPartSvg_V3 = (name, timeRange, timeOffset, partTop0PercentStart, partTop0PercentEnd, useTones, debug, isKeyBoard, showTactLines, picHeight) => {
    let A = partTop0PercentEnd - partTop0PercentStart;
    let B = partTop0PercentEnd;
    return getPartSvg_V2(name, timeRange, timeOffset, A, B, useTones, debug, isKeyBoard, showTactLines, picHeight)
}

export const getCallbacks = (repNubActive) => {
    return { repNubActive };
}

export const getUpdatedStructAndIndex = (updatedStruct, index) => {
    return { updatedStruct, index };
}

