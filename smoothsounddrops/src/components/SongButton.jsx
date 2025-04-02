
function SongButton({ text, onSongBtn }) {
    function onBtnClick() {
        onSongBtn(text)
    }

    return (
        <div>
            <button onClick={onBtnClick} >{text}</button>
        </div>
    );
}

export default SongButton;
