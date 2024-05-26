
// HELPER GUI FOR MESSING WITH AO SETTINGS
import "../styles/Model.css";
import { useState } from 'react';
import { SceneSetup } from '../scene/SceneSetup';
import { Slider } from "@mui/material";

export function _AO_GUI_(props: { world: React.MutableRefObject<SceneSetup> }) {
    const { world } = props;
    const [bias, setBias] = useState(1.0);
    const [intensity, setIntensity] = useState(0.004);
    const [scale, setScale] = useState(8.0);
    const [radius, setRadius] = useState(625);
    const [res, setRes] = useState(0.0);

    const handleFovChange = (e: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) { return }
        world.current.saoPass.params.saoBias = newValue;
        setBias(newValue);
    };

    const handleIntensityChange = (e: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) { return }
        world.current.saoPass.params.saoIntensity = newValue;
        setIntensity(newValue);
    };
    const handleScaleChange = (e: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) { return }
        world.current.saoPass.params.saoScale = newValue;
        setScale(newValue);
    };
    const handleRadiusChange = (e: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) { return }
        world.current.saoPass.params.saoKernelRadius = newValue;
        setRadius(newValue);
    };
    const handleResChange = (e: any, newValue: number | number[]) => {
        if (Array.isArray(newValue)) { return }
        world.current.saoPass.params.saoMinResolution = newValue;
        setRes(newValue);
    };

    return (
        <div style={{ width: "50%", translate: "50% -200%" }}>
            <Slider key={"Bias"} value={bias} onChange={handleFovChange} min={-5.0} max={5.0} size="small" valueLabelDisplay="auto" step={0.01} />
            <Slider key={"Intensity"} value={intensity} onChange={handleIntensityChange} min={0.0} max={0.1} size="small" valueLabelDisplay="auto" step={0.001} />
            <Slider key={"Scale"} value={scale} onChange={handleScaleChange} min={-2.0} max={10.0} size="small" valueLabelDisplay="auto" step={0.01} />
            <Slider key={"Radius"} value={radius} onChange={handleRadiusChange} min={-2.0} max={100.0} size="small" valueLabelDisplay="auto" step={1} />
            <Slider key={"Res"} value={res} onChange={handleResChange} min={0.0} max={0.001} size="small" valueLabelDisplay="auto" step={0.0001} />
        </div>
    );
}
