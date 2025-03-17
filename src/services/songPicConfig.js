
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

export const getPartSvg = (name, timeRange, timeOffset, partHeight, yOffset, useTones, debug, isKeyBoard) => {
    return { name, timeRange, timeOffset, partHeight, yOffset, useTones, debug, isKeyBoard };
}

export const getCallbacks = (repNubActive) => {
    return { repNubActive };
}

export const getUpdatedStructAndIndex = (updatedStruct, index) => {
    return { updatedStruct, index };
}

