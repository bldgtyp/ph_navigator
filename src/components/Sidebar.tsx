import '../styles/Sidebar.css';
import * as THREE from 'three';

interface SidebarProps {
    selectedObjectRef: React.MutableRefObject<THREE.Object3D | null>;
    selectedObject: THREE.Object3D | null
    setSelectedObject: React.Dispatch<React.SetStateAction<THREE.Object3D | null>>;
    appState: React.MutableRefObject<number | null>;
}

function Sidebar(props: SidebarProps) {
    const { selectedObjectRef, selectedObject, setSelectedObject, appState } = props;

    return (
        <div className="sidebar">
            <h2>Face Data</h2>
            <h3>AppState: {appState.current}</h3>
            <p>Display Name: {selectedObject ? selectedObject.userData.display_name : 'None'}</p>
            <p>Face-Type: {selectedObject ? selectedObject.userData.face_type : 'None'}</p>
            <p>Area: {selectedObject ? selectedObject.userData.area : 'None'}</p>
        </div>
    );
}

export default Sidebar;