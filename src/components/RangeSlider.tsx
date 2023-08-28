import React from "react";
import "./RangeSlider.css";

interface SliderProps {
    name: string;
    id: string;
    handleChange: (event: any) => void;
    min: number;
    max: number;
    defaultValue: number;
}

const RangeSlider: React.FC<SliderProps> = ({
    name,
    id,
    handleChange,
    min,
    max,
    defaultValue,
}) => {
    return (
        <div className="slider">
            <span className="value">{defaultValue}</span>
            <input
                type="range"
                name={name}
                id={id}
                onChange={handleChange}
                min={min}
                max={max}
                defaultValue={defaultValue}
                className="input"
            />
            <span className="label">{name}</span>
        </div>
    );
};

export default RangeSlider;
