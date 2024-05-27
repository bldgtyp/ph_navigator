import * as THREE from 'three';
import { PanelItem, IdentifierItem } from './PanelItems';

export function PipeData({ selectedObject }: { selectedObject: THREE.Object3D | null; }) {
    return (
        <>
            <PanelItem label="Display Name" value={selectedObject ? selectedObject.name : '-'} />
            <PanelItem label="Type" value={selectedObject ? selectedObject.userData.face_type : '-'} />
            <PanelItem label="Length (m)" value={selectedObject ? selectedObject.userData.length.toFixed(2) : '-'} />
            <PanelItem label="Material" value={selectedObject ? selectedObject.userData.material_value : '-'} />
            <PanelItem label="Diameter" value={selectedObject ? selectedObject.userData.diameter_value : '-'} />
            <PanelItem label="Insul. (m)" value={selectedObject ? selectedObject.userData.insulation_thickness : '-'} />
            <PanelItem label="Insul. Conductivity (W/mk)" value={selectedObject ? selectedObject.userData.insulation_conductivity.toFixed(2) : '-'} />
            <PanelItem label="Insul. Reflective" value={selectedObject ? selectedObject.userData.insulation_reflective : '-'} />
            <IdentifierItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
        </>
    );
}
