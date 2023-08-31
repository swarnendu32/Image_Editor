import React from "react";
import "./Controllers.css";
import RangeSlider from "./RangeSlider";
import { generateFragmentShader } from "../utils/generateFragmentShader";

export interface ImageProps {
    brightness: number;
    setBrightness: React.Dispatch<React.SetStateAction<number>>;
    contrast: number;
    setContrast: React.Dispatch<React.SetStateAction<number>>;
    sharpness: number;
    setSharpness: React.Dispatch<React.SetStateAction<number>>;
    warmth: number;
    setWarmth: React.Dispatch<React.SetStateAction<number>>;
    tint: number;
    setTint: React.Dispatch<React.SetStateAction<number>>;
    shadow: number;
    setShadow: React.Dispatch<React.SetStateAction<number>>;
    saturation: number;
    setSaturation: React.Dispatch<React.SetStateAction<number>>;
    highlight: number;
    setHighlight: React.Dispatch<React.SetStateAction<number>>;
    exposure: number;
    setExposure: React.Dispatch<React.SetStateAction<number>>;
    greyScale: boolean;
    setGreyScale: React.Dispatch<React.SetStateAction<boolean>>;
    redChannelWeight: number;
    setRedChannelWeight: React.Dispatch<React.SetStateAction<number>>;
    greenChannelWeight: number;
    setGreenChannelWeight: React.Dispatch<React.SetStateAction<number>>;
    blueChannelWeight: number;
    setBlueChannelWeight: React.Dispatch<React.SetStateAction<number>>;
    dehaze: number;
    setDehaze: React.Dispatch<React.SetStateAction<number>>;
}

const Controllers: React.FC<ImageProps> = ({
    brightness,
    contrast,
    exposure,
    highlight,
    tint,
    saturation,
    shadow,
    sharpness,
    warmth,
    greyScale,
    redChannelWeight,
    greenChannelWeight,
    blueChannelWeight,
    dehaze,
    setBrightness,
    setContrast,
    setHighlight,
    setTint,
    setSaturation,
    setShadow,
    setSharpness,
    setWarmth,
    setExposure,
    setGreyScale,
    setRedChannelWeight,
    setGreenChannelWeight,
    setBlueChannelWeight,
    setDehaze
}) => {
    const brightnessOnChangeHandler = (event: any) => {
        setBrightness(event.target.value);
    };
    const contrastOnChangeHandler = (event: any) => {
        setContrast(event.target.value);
    };
    const sharpnessOnChangeHandler = (event: any) => {
        setSharpness(event.target.value);
    };
    const warmthOnChangeHandler = (event: any) => {
        setWarmth(event.target.value);
    };
    const tintOnChangeHandler = (event: any) => {
        setTint(event.target.value);
    };
    const shadowOnChangeHandler = (event: any) => {
        setShadow(event.target.value);
    };
    const saturationOnChangeHandler = (event: any) => {
        setSaturation(event.target.value);
    };
    const highlightOnChangeHandler = (event: any) => {
        setHighlight(event.target.value);
    };
    const exposureOnChangeHandler = (event: any) => {
        setExposure(event.target.value);
    };
    const greyScaleOnChangeHandler = (event: any) => {
        setGreyScale(!greyScale);
    };
    const dehazeOnChangeHandler = (event: any) => {
        setDehaze(event.target.value);
    };
    const redChannelWeightOnChangeHandler = (event: any) => {
        setRedChannelWeight(event.target.value);
    };
    const greenChannelWeightOnChangeHandler = (event: any) => {
        setGreenChannelWeight(event.target.value);
    };
    const blueChannelWeightOnChangeHandler = (event: any) => {
        setBlueChannelWeight(event.target.value);
    };
    
    return (
        <div className="pannel">
            <button
                className="btn"
                onClick={() => {
                    generateFragmentShader({
                        brightness,
                        contrast,
                        sharpness,
                        shadow,
                        saturation,
                        exposure,
                        highlight,
                        warmth,
                        tint,
                        redChannelWeight,
                        greenChannelWeight,
                        blueChannelWeight,
                        greyScale,
                        dehaze
                    });
                }}
            >
                Generate
            </button>
            <input
                type="radio"
                onChange={greyScaleOnChangeHandler}
                onClick={greyScaleOnChangeHandler}
                title="GreyScaling"
                checked={greyScale}
            />
            <RangeSlider
                name="brightness"
                id="brightness"
                handleChange={brightnessOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={brightness}
            />
            <RangeSlider
                name="contrast"
                id="contrast"
                handleChange={contrastOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={contrast}
            />
            <RangeSlider
                name="sharpness"
                id="sharpness"
                handleChange={sharpnessOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={sharpness}
            />
            <RangeSlider
                name="warmth"
                id="warmth"
                handleChange={warmthOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={warmth}
            />
            <RangeSlider
                name="tint"
                id="tint"
                handleChange={tintOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={tint}
            />
            <RangeSlider
                name="shadow"
                id="shadow"
                handleChange={shadowOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={shadow}
            />
            <RangeSlider
                name="saturation"
                id="saturation"
                handleChange={saturationOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={saturation}
            />
            <RangeSlider
                name="highlight"
                id="highlight"
                handleChange={highlightOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={highlight}
            />
            <RangeSlider
                name="exposure"
                id="exposure"
                handleChange={exposureOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={exposure}
            />
            <RangeSlider
                name="dehaze"
                id="dehaze"
                handleChange={dehazeOnChangeHandler}
                min={-100}
                max={100}
                defaultValue={dehaze}
            />
            <RangeSlider
                name="redChannelWeight"
                id="redChannelWeight"
                handleChange={redChannelWeightOnChangeHandler}
                min={0}
                max={100}
                defaultValue={redChannelWeight}
            />
            <RangeSlider
                name="greenChannelWeight"
                id="greenChannelWeight"
                handleChange={greenChannelWeightOnChangeHandler}
                min={0}
                max={100}
                defaultValue={greenChannelWeight}
            />
            <RangeSlider
                name="blueChannelWeight"
                id="blueChannelWeight"
                handleChange={blueChannelWeightOnChangeHandler}
                min={0}
                max={100}
                defaultValue={blueChannelWeight}
            />
        </div>
    );
};

export default Controllers;
