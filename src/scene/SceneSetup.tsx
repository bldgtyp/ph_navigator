import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { appColors } from '../styles/AppColors';
import { defaultLightConfiguration } from './Lighting';


export class SceneSetup {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    labelRenderer: CSS2DRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;

    constructor() {
        // -- Scene
        this.scene = new THREE.Scene();
        this.scene.background = appColors.BACKGROUND_WHITE;

        // -- Geometry Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        // LabelRendered
        this.labelRenderer = new CSS2DRenderer()
        this.labelRenderer.setSize(window.innerWidth, window.innerHeight)
        this.labelRenderer.domElement.style.position = 'absolute'
        this.labelRenderer.domElement.style.top = '0px'
        this.labelRenderer.domElement.style.pointerEvents = 'none'
        document.body.appendChild(this.labelRenderer.domElement)

        // -- Camera
        const FOV = 45
        this.camera = new THREE.PerspectiveCamera(FOV, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera.position.set(30, 30, 30);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 0, 1);

        // -- Controls
        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.rotateSpeed = 1.5;
        this.controls.zoomSpeed = 3.0;

        // -- Grid Helpers
        const grid = new THREE.Group();

        const grid1 = new THREE.GridHelper(50, 50);
        grid1.material.color.set(appColors.GRID_LINE_LIGHT);
        grid1.material.vertexColors = false;
        grid.add(grid1);

        const grid2 = new THREE.GridHelper(50, 5);
        grid2.material.color.set(appColors.GRID_LINE_DARK);
        grid2.material.vertexColors = false;
        grid.add(grid2);

        grid.rotateX(Math.PI / 2);
        this.scene.add(grid);

        // --- Hemisphere Light
        const light_1 = new THREE.AmbientLight(appColors.SURFACE_WHITE, 0.5);
        this.scene.add(light_1);

        // -- Sunlight
        const light_2 = new THREE.DirectionalLight(defaultLightConfiguration.color, defaultLightConfiguration.intensity);
        light_2.position.set(0, 10, 25);
        light_2.castShadow = defaultLightConfiguration.castShadow;
        light_2.shadow.camera.updateProjectionMatrix();
        this.scene.add(light_2);

        // const lightHelper = new THREE.DirectionalLightHelper(light_2, 5);
        // scene.add(lightHelper);

        // const shadowHelper = new THREE.CameraHelper(light_2.shadow.camera);
        // scene.add(shadowHelper);
    }
}