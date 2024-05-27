import * as THREE from 'three';
import { PanelItem, IdentifierItem } from './PanelItems';

export function FaceData({ selectedObject }: { selectedObject: THREE.Object3D | null; }) {
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
    );
}
