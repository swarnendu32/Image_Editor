import React, { useState } from "react";
import "./App.css";
import CanvasFrame from "./components/CanvasFrame";
import Controllers from "./components/Controllers";

function App() {
    const [brightness, setBrightness] = useState(0);
    const [contrast, setContrast] = useState(0);
    const [sharpness, setSharpness] = useState(0);
    const [warmth, setWarmth] = useState(0);
    const [tint, setTint] = useState(0);
    const [shadow, setShadow] = useState(0);
    const [saturation, setSaturation] = useState(0);
    const [highlight, setHighlight] = useState(0);
    const [exposure, setExposure] = useState(0);
    const [dehaze, setDehaze] = useState(0);
    const [greyScale, setGreyScale] = useState(false);
    const [redChannelWeight, setRedChannelWeight] = useState(33);
    const [greenChannelWeight, setGreenChannelWeight] = useState(33);
    const [blueChannelWeight, setBlueChannelWeight] = useState(33);

    return (
        <div className="App">
            <CanvasFrame
                brightness={brightness}
                contrast={contrast}
                exposure={exposure}
                highlight={highlight}
                tint={tint}
                saturation={saturation}
                shadow={shadow}
                sharpness={sharpness}
                warmth={warmth}
                greyScale={greyScale}
                redChannelWeight={redChannelWeight}
                greenChannelWeight={greenChannelWeight}
                blueChannelWeight={blueChannelWeight}
                dehaze={dehaze}
            />
            {/* <Controllers
                brightness={brightness}
                contrast={contrast}
                exposure={exposure}
                highlight={highlight}
                tint={tint}
                saturation={saturation}
                shadow={shadow}
                sharpness={sharpness}
                warmth={warmth}
                greyScale={greyScale}
                redChannelWeight={redChannelWeight}
                greenChannelWeight={greenChannelWeight}
                blueChannelWeight={blueChannelWeight}
                dehaze={dehaze}
                setBrightness={setBrightness}
                setContrast={setContrast}
                setHighlight={setHighlight}
                setTint={setTint}
                setSaturation={setSaturation}
                setShadow={setShadow}
                setSharpness={setSharpness}
                setWarmth={setWarmth}
                setExposure={setExposure}
                setGreyScale={setGreyScale}
                setRedChannelWeight={setRedChannelWeight}
                setGreenChannelWeight={setGreenChannelWeight}
                setBlueChannelWeight={setBlueChannelWeight}
                setDehaze={setDehaze}
            /> */}
        </div>
    );
}

export default App;
