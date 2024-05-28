import * as THREE from 'three';
import { PanelItem, IdentifierItem } from './PanelItems';

export function SpaceFloorSegmentData({ selectedObject }: { selectedObject: THREE.Object3D | null; }) {
    return (
        <><PanelItem label="Number" value={selectedObject ? selectedObject.userData.number : '-'} />
            <PanelItem label="Name" value={selectedObject ? selectedObject.userData.display_name : '-'} />
            <PanelItem label={<span>Gross Floor Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.floor_area.toFixed(1) : '-'} />
            <PanelItem label={<span>Net Floor Area (m<sup>2</sup>)</span>} value={selectedObject ? selectedObject.userData.weighted_floor_area.toFixed(1) : '-'} />
            <PanelItem label="TFA/iCFA Factor" value={selectedObject ? selectedObject.userData.weighting_factor?.toFixed(1) : '-'} />
            <IdentifierItem label="Identifier" value={selectedObject ? selectedObject.userData.identifier : '-'} />
        </>
    );
}
