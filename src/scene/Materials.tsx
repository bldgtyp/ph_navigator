import * as THREE from 'three';
import { appColors } from '../styles/AppColors';

export const appMaterials = {
    groundShadowMaterial: new THREE.ShadowMaterial(
        {
            opacity: 0.3,
            transparent: true,
        }),
    geometryStandardMaterial: new THREE.MeshStandardMaterial(
        {
            color: appColors.SURFACE_WHITE,
            side: THREE.DoubleSide,
        }),
    geometryWindowMaterial: new THREE.MeshStandardMaterial(
        {
            color: appColors.SURFACE_WHITE,
            opacity: 0.85, transparent: true,
            side: THREE.DoubleSide,
        }),
    geometryHighlightMaterial: new THREE.MeshBasicMaterial(
        {
            color: appColors.SURFACE_HIGHLIGHT,
            side: THREE.DoubleSide,
        }),
    wireframeMaterial: new THREE.LineBasicMaterial(
        {
            color: appColors.OUTLINE,
            linewidth: 2,
        }),
    dimensionLineMaterial: new THREE.LineBasicMaterial(
        {
            color: appColors.DIMENSION_LINE,
            linewidth: 2,
        }),
    sunpathLineMaterial: new THREE.LineDashedMaterial(
        {
            color: appColors.SUNPATH_LINE_COLOR,
            linewidth: 2,
            scale: 1,
            dashSize: 1,
            gapSize: 0.5,
        }),
}