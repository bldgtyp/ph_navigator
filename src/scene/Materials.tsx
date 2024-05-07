import * as THREE from 'three';
import { appColors } from '../styles/AppColors';
import { LineMaterial } from 'three/examples/jsm/lines/LineMaterial.js';

export const appMaterials = {
    // Surfaces
    groundShadowMaterial: new THREE.ShadowMaterial(
        {
            opacity: 0.3,
            transparent: true,
        }),
    geometryStandardMaterial: new THREE.MeshStandardMaterial(
        {
            color: appColors.SURFACE_WHITE,
            side: THREE.DoubleSide,
            flatShading: true,
        }),
    geometryWindowMaterial: new THREE.MeshStandardMaterial(
        {
            color: appColors.SURFACE_WHITE,
            opacity: 0.85,
            transparent: true,
            side: THREE.DoubleSide,
        }),
    geometryShadingMaterial: new THREE.MeshStandardMaterial(
        {
            color: appColors.SURFACE_WHITE,
            opacity: 0.60,
            transparent: true,
            side: THREE.DoubleSide,
        }),
    geometryHighlightMaterial: new THREE.MeshBasicMaterial(
        {
            color: appColors.SURFACE_HIGHLIGHT,
            side: THREE.DoubleSide,
        }),

    // Lines
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
    pipeLineMaterial: new LineMaterial(
        {
            color: appColors.PIPE_LINE_COLOR,
            linewidth: 0.04,
            worldUnits: true
        }),
    ductLineMaterial: new LineMaterial(
        {
            color: appColors.DUCT_LINE_COLOR,
            linewidth: 0.06,
            worldUnits: true
        }),
}