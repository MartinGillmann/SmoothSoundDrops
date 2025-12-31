import { useState } from "react";

export default function TimeSlider({ in_default, onValChanged, getText, in_style_background }) {

    const [currentValue, setCurrentValue] = useState(in_default); // Zeit in Sekunden

    const handleChange = (e) => {
        setCurrentValue(onValChanged(e.target.value));
    };

    return (
        <div className="w-full max-w-md mx-auto p-4">
            {getText(currentValue).length > 0
                && 
                <div className="text-center mb-2 text-gray-700 font-medium">
                    {getText(currentValue)}
                </div>
            }

            <input
                type="range"
                min="0"
                max="100"  // z.B. 5 Minuten
                value={currentValue}
                onChange={handleChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer
                   accent-blue-600
                   hover:accent-blue-700 transition"
                style={{
                    background: in_style_background
                }}
            />
        </div>
    );
}
