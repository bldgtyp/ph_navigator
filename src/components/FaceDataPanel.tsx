import '../styles/FaceDataPanel.css';
import * as THREE from 'three';
import { Stack, Paper } from "@mui/material";

interface FaceDataPanelProps {
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appState: React.MutableRefObject<number | null>;
}

function PanelItem(props: { label: string, value: string }) {
    return (
        <Stack direction="column">
            <p className="panel-item-heading">{props.label}:</p>
            <p className="panel-item-value">{props.value}</p>
        </Stack>
    );
}

function Sidebar(props: FaceDataPanelProps) {
    const { selectedObjectRef, selectedObject, setSelectedObject, appState } = props;

    return (
        <Paper className="face-data-panel">
            <p className='heading'>Face Attributes</p>
            <PanelItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Exposure" value={selectedObject ? selectedObject.userData.boundary_condition.type : '-'} />
            <PanelItem label="Area" value={selectedObject ? selectedObject.userData.area.toFixed(1) : '-'} />
        </Paper>
    );
}

export default Sidebar;