import '../styles/FaceDataPanel.css';
import React, { useEffect, useState } from 'react';
import * as THREE from 'three';
import { Stack, Paper, Button, Slider, Typography } from "@mui/material";
import { fetchModelUValues } from '../hooks/fetchModelUValues';
import { HoneybeeEnergyOpaqueConstruction } from '../types/HoneybeeEnergyOpaqueConstruction';

interface FaceDataPanelProps { selectedObject: THREE.Object3D | null }

function PanelItem(props: { label: React.ReactNode, value: string }) {
    return (
        <Stack direction="column">
            <p className="panel-item-heading">{props.label}:</p>
            <p className="panel-item-value">{props.value}</p>
        </Stack>
    );
}

function FaceData({ selectedObject }: { selectedObject: THREE.Object3D | null }) {
    return (
        <>
            <p className='heading'>Face Data</p>
            <PanelItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Exposure" value={selectedObject ? selectedObject.userData.boundary_condition.type : '-'} />
            <PanelItem label={<span>Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.area.toFixed(1) : '-'} />
            <PanelItem label="Construction Name" value={selectedObject ? selectedObject.userData.properties.energy.construction.identifier : '-'} />
            <PanelItem label={<span>R-Value (m<sup>2</sup>k/W)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.r_factor.toFixed(1) : '-'} />
            <PanelItem label={<span>U-Value (W/m<sup>2</sup>k)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.u_factor.toFixed(3) : '-'} />
        </>
    )
}

function UValueSliders() {
    const [constructions, setConstructions] = useState<HoneybeeEnergyOpaqueConstruction[]>([]);
    const SLIDER_MIN = 0.01;
    const SLIDER_MAX = 2.0;

    useEffect(() => {
        fetchModelUValues('model_constructions').then(data => {
            setConstructions(data);
        });
    });

    return (
        <>
            <p className="heading">U-Value (W/m2k)</p>
            <Stack direction="column">
                {constructions.map((construction, index) => (
                    // <PanelItem key={index} label={construction.identifier} value={construction.u_factor.toFixed(3)} />
                    <div key={index}>
                        <Typography className="slider-item-heading">
                            {construction.identifier}
                        </Typography>
                        <Slider
                            key={index}
                            defaultValue={Number(construction.u_factor.toFixed(3))}
                            step={0.01}
                            min={SLIDER_MIN}
                            max={SLIDER_MAX}
                            size="small"
                            valueLabelDisplay="auto"
                            color="secondary"
                        />
                    </div>
                ))}

            </Stack>
        </>
    );
}

function FacesPanel(props: FaceDataPanelProps) {
    const { selectedObject } = props;
    const [selectedPanel, setSelectedPanel] = useState('face-data');

    return (
        <Paper className="face-data-panel">
            <Button
                className={`panel-select-button ${selectedPanel === 'face-data' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('face-data')}>
                Face Data
            </Button>
            <Button
                className={`panel-select-button ${selectedPanel === 'u-values' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('u-values')}>
                U-Values
            </Button>
            {selectedPanel === 'face-data' ? <FaceData selectedObject={selectedObject} /> : <UValueSliders />}
        </Paper>
    );
}

export default FacesPanel;