import * as THREE from 'three';
import { appColors } from '../styles/AppColors';

export const appMaterials = {
    geometryStandardMaterial: new THREE.MeshStandardMaterial({ color: appColors.SURFACE_WHITE, side: THREE.DoubleSide }),
    geometryHighlightMaterial: new THREE.MeshBasicMaterial({ color: appColors.SURFACE_HIGHLIGHT, side: THREE.DoubleSide }),
    wireframeMaterial: new THREE.LineBasicMaterial({ color: appColors.OUTLINE, linewidth: 2 }),
}