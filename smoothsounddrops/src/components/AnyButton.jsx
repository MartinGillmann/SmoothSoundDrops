

function AnyButton({ text, onclick }) {
    function onBtnClick() {
        if (onclick) {
            onclick(text)
        }
    }

    return (
        <div>
            <button
                onClick={onBtnClick}
                className="px-3 py-1 mb-2 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >{text}</button>
        </div>
    );
}

export default AnyButton;

