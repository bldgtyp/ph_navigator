import '../styles/InfoPanel.css';
import React, { useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import * as THREE from 'three';
import { Stack, Paper, Button, Slider, Typography } from "@mui/material";
import { fetchModelServer } from '../hooks/fetchModelServer';
import { hbEnergyOpaqueConstruction } from '../types/honeybee_energy/construction/opaque';
import { useSelectedObjectContext } from '../contexts/selected_object_context';


function PanelItem(props: { label: React.ReactNode, value: string }) {
    return (
        <Stack direction="column">
            <p className="panel-item-heading">{props.label}:</p>
            <p className="panel-item-value">{props.value}</p>
        </Stack>
    );
}

function IdentifierItem(props: { label: React.ReactNode, value: string }) {
    return (
        <Stack direction="column">
            <p className="identifier-item-heading">{props.label}:</p>
            <p className="identifier-item-value">{props.value}</p>
        </Stack>
    );
}

function SpaceData({ selectedObject }: { selectedObject: THREE.Object3D | null }) {
    return (
        <>
            <PanelItem label="Number" value={selectedObject ? selectedObject.userData.number : '-'} />
            <PanelItem label="Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label={<span>Net Volume (m<sup>3</sup>)</span>} value={selectedObject ? selectedObject.userData.net_volume.toFixed(1) : '-'} />
            <PanelItem label="Avg. Clear Ceiling Height (m)" value={selectedObject ? selectedObject.userData.avg_clear_height.toFixed(1) : '-'} />
            <PanelItem label={<span>Gross Floor Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.floor_area.toFixed(1) : '-'} />
            <PanelItem label={<span>Net Floor Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.weighted_floor_area.toFixed(1) : '-'} />
            <PanelItem label="Avg. Weighting Factor" value={selectedObject ? selectedObject.userData.average_floor_weighting_factor.toFixed(1) : '-'} />
            <IdentifierItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
        </>
    )
}

function FaceData({ selectedObject }: { selectedObject: THREE.Object3D | null }) {
    return (
        <>
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Exposure" value={selectedObject ? selectedObject.userData.boundary_condition.type : '-'} />
            <PanelItem label={<span>Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.area.toFixed(1) : '-'} />
            <PanelItem label="Construction Name" value={selectedObject ? selectedObject.userData.properties.energy.construction.identifier : '-'} />
            <PanelItem label={<span>R-Value (m<sup>2</sup>k/W)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.r_factor.toFixed(1) : '-'} />
            <PanelItem label={<span>U-Value (W/m<sup>2</sup>k)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.u_factor.toFixed(3) : '-'} />
            <IdentifierItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
        </>
    )
}

function PipeData({ selectedObject }: { selectedObject: THREE.Object3D | null }) {
    return (
        <>
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Length (m)" value={selectedObject ? selectedObject.userData.length.toFixed(2) : '-'} />
            <PanelItem label="Material" value={selectedObject ? selectedObject.userData.material_value : '-'} />
            <PanelItem label="Diameter" value={selectedObject ? selectedObject.userData.diameter_value : '-'} />
            <PanelItem label="Insul. (m)" value={selectedObject ? selectedObject.userData.insulation_thickness.toFixed(2) : '-'} />
            <PanelItem label="Insul. Conductivity (W/mk)" value={selectedObject ? selectedObject.userData.insulation_conductivity.toFixed(2) : '-'} />
            <PanelItem label="Insul. Reflective" value={selectedObject ? selectedObject.userData.insulation_reflective : '-'} />
            <IdentifierItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
        </>
    )
}

function UValueSliders() {
    const { teamId, projectId, modelId } = useParams();
    const [constructions, setConstructions] = useState<hbEnergyOpaqueConstruction[]>([]);
    const SLIDER_MIN = 0.01;
    const SLIDER_MAX = 1.00;

    useEffect(() => {
        fetchModelServer<hbEnergyOpaqueConstruction[]>(`${teamId}/${projectId}/${modelId}/exterior_constructions`).then(data => {
            setConstructions(data);
        });
    }, [teamId, projectId, modelId]);

    return (
        <>
            <p className="heading">U-Values (W/m2k)</p>
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

function InfoDetails() {
    const selectedObjectContext = useSelectedObjectContext();
    if (selectedObjectContext.selectedObjectRef.current) {
        if (selectedObjectContext.selectedObjectRef.current.userData['type'] == "spaceGroup") {
            return <SpaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "faceMesh") {
            return <FaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "apertureMeshFace") {
            return <FaceData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else if (selectedObjectContext.selectedObjectRef.current.userData['type'] === "pipeSegmentLine") {
            return <PipeData selectedObject={selectedObjectContext.selectedObjectRef.current} />;
        } else { return <></> }
    }
    else {
        return <></>
    }
}

function InfoPanel() {
    const [selectedPanel, setSelectedPanel] = useState('face-data');
    return (
        <Paper className="face-data-panel">
            <Button
                className={`panel-select-button ${selectedPanel === 'face-data' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('face-data')}>
                Item Data
            </Button>
            <Button
                className={`panel-select-button ${selectedPanel === 'u-values' ? 'button-selected' : ''}`}
                onClick={() => setSelectedPanel('u-values')}>
                U-Values
            </Button>
            {selectedPanel === 'face-data' ? <InfoDetails /> : <UValueSliders />}
        </Paper>
    );
}

export default InfoPanel;