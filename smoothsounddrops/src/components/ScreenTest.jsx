
import { useScreenSize } from "../hooks/useScreenSize"


export default function ScreenTest() {

    const { width, height } = useScreenSize();

    return (
        <>
            <p>window.inner: {width} x {height}</p>
        </>
    )
}

