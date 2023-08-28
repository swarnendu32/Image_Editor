import React from "react";
import "./CanvasFrame.css";
import Canvas from "./Canvas";

export interface Props {
    brightness: number;
    contrast: number;
    sharpness: number;
    warmth: number;
    tint: number;
    shadow: number;
    saturation: number;
    highlight: number;
    exposure: number;
    greyScale: boolean;
    redChannelWeight: number;
    greenChannelWeight: number;
    blueChannelWeight: number;
}

const CanvasFrame: React.FC<Props> = ({
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
}) => {
    return (
        <div className="frame">
            <Canvas
                imageUrl="http://localhost:8080/IMG_20230104_162445_714.jpg"
                brightness={brightness}
                contrast={contrast}
                sharpen={sharpness}
                warmth={warmth}
                tint={tint}
                shadow={shadow}
                saturation={saturation}
                highlight={highlight}
                exposure={exposure}
                greyScale={greyScale}
                redChannelWeight={redChannelWeight}
                greenChannelWeight={greenChannelWeight}
                blueChannelWeight={blueChannelWeight}
            />
        </div>
    );
};

export default CanvasFrame;
