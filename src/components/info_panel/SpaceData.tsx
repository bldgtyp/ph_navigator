import * as THREE from 'three';
import { PanelItem, IdentifierItem } from './PanelItems';

export function SpaceData({ selectedObject }: { selectedObject: THREE.Object3D | null; }) {
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
    );
}
