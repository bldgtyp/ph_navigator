import '../styles/FaceDataPanel.css';
import * as THREE from 'three';
import { Stack, Paper } from "@mui/material";
import React from 'react';

interface FaceDataPanelProps {
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appStateRef: React.MutableRefObject<number | null>;
}

function PanelItem(props: { label: React.ReactNode, value: string }) {
    return (
        <Stack direction="column">
            <p className="panel-item-heading">{props.label}:</p>
            <p className="panel-item-value">{props.value}</p>
        </Stack>
    );
}

function Sidebar(props: FaceDataPanelProps) {
    const { selectedObjectRef, selectedObject, setSelectedObject, appStateRef: appStateRef } = props;
    return (
        <Paper className="face-data-panel">
            <p className='heading'>Face Attributes</p>
            <PanelItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Exposure" value={selectedObject ? selectedObject.userData.boundary_condition.type : '-'} />
            <PanelItem label={<span>Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.area.toFixed(1) : '-'} />
            <PanelItem label="Construction Name" value={selectedObject ? selectedObject.userData.properties.energy.construction.identifier : '-'} />
            <PanelItem label={<span>R-Value (m<sup>2</sup>k/W)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.r_factor.toFixed(1) : '-'} />
            <PanelItem label={<span>U-Value (W/m<sup>2</sup>k)</span>} value={selectedObject ? selectedObject.userData.properties.energy.construction.u_factor.toFixed(3) : '-'} />
        </Paper>
    );
}

export default Sidebar;