import * as THREE from 'three';
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { appColors } from '../styles/AppColors';
import { appMaterials } from './Materials';
import { defaultLightConfiguration } from './Lighting';
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
// import { SAOPass } from 'three/examples/jsm/postprocessing/SAOPass.js';
// import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass.js';

export class SceneSetup {
    scene: THREE.Scene;
    renderer: THREE.WebGLRenderer;
    // composer: EffectComposer;
    labelRenderer: CSS2DRenderer;
    camera: THREE.PerspectiveCamera;
    controls: OrbitControls;
    groundGeometry: THREE.Group;
    buildingGeometryMeshes: THREE.Group;
    buildingGeometryOutlines: THREE.Group;
    buildingGeometryVertices: THREE.Group;
    spaceGeometryMeshes: THREE.Group;
    spaceGeometryOutlines: THREE.Group;
    spaceGeometryVertices: THREE.Group;
    sunPathDiagram: THREE.Group;
    pipeGeometry: THREE.Group;
    ventilationGeometry: THREE.Group;
    shadingGeometry: THREE.Group;

    constructor() {
        // -- Scene
        this.scene = new THREE.Scene();
        this.scene.background = appColors.BACKGROUND_WHITE;

        // -- Geometry Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio * 2); // Improves line quality

        // -- Shadows
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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
        this.camera.position.set(-25, 40, 30);
        this.camera.lookAt(0, 0, 0);
        this.camera.up.set(0, 0, 1);

        // -- Composer for Post Processing
        // this.composer = new EffectComposer(this.renderer);
        // let renderPass = new RenderPass(this.scene, this.camera);
        // this.composer.addPass(renderPass);
        // let saoPass = new SAOPass(this.scene, this.camera);
        // this.composer.addPass(saoPass);
        // const outputPass = new OutputPass();
        // this.composer.addPass(outputPass);

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
        const light_1 = new THREE.AmbientLight(appColors.SURFACE_WHITE, defaultLightConfiguration.indirectLightIntensity);
        this.scene.add(light_1);

        // -- Sunlight
        const light_2 = new THREE.DirectionalLight(defaultLightConfiguration.color, defaultLightConfiguration.intensity);
        light_2.position.set(-10, -10, 25);
        light_2.castShadow = defaultLightConfiguration.castShadow;
        light_2.shadow.camera.updateProjectionMatrix();
        light_2.shadow.camera.top = 25;
        light_2.shadow.camera.bottom = -25;
        light_2.shadow.camera.left = -25;
        light_2.shadow.camera.right = 25;

        this.scene.add(light_2);

        // -- Ground
        this.groundGeometry = new THREE.Group();
        const ground = new THREE.Mesh(
            new THREE.PlaneGeometry(50, 50),
            appMaterials.groundShadow
        );
        ground.receiveShadow = true;
        this.groundGeometry.add(ground);
        this.scene.add(this.groundGeometry);

        // -- Groups for the Loaded Geometry
        this.buildingGeometryMeshes = new THREE.Group();
        this.buildingGeometryMeshes.name = "Building Geometry | Meshes";
        this.scene.add(this.buildingGeometryMeshes);

        this.buildingGeometryOutlines = new THREE.Group();
        this.buildingGeometryOutlines.name = "Building Geometry | Outlines";
        this.scene.add(this.buildingGeometryOutlines);

        this.buildingGeometryVertices = new THREE.Group();
        this.buildingGeometryVertices.name = "Building Geometry | Vertices";
        this.scene.add(this.buildingGeometryVertices);

        this.sunPathDiagram = new THREE.Group();
        this.sunPathDiagram.name = "Sun Path Diagram";
        this.scene.add(this.sunPathDiagram);

        this.spaceGeometryMeshes = new THREE.Group();
        this.spaceGeometryMeshes.name = "Space Geometry | Meshes";
        this.scene.add(this.spaceGeometryMeshes);

        this.spaceGeometryOutlines = new THREE.Group();
        this.spaceGeometryOutlines.name = "Space Geometry | Outlines";
        this.scene.add(this.spaceGeometryOutlines);

        this.spaceGeometryVertices = new THREE.Group();
        this.spaceGeometryVertices.name = "Space Geometry | Vertices";
        this.scene.add(this.spaceGeometryVertices);

        this.pipeGeometry = new THREE.Group();
        this.pipeGeometry.name = "Pipe Geometry";
        this.scene.add(this.pipeGeometry);

        this.ventilationGeometry = new THREE.Group();
        this.ventilationGeometry.name = "Ventilation Geometry";
        this.scene.add(this.ventilationGeometry);

        this.shadingGeometry = new THREE.Group();
        this.shadingGeometry.name = "Shading Geometry";
        this.scene.add(this.shadingGeometry);

        // -- Show Helpers
        // const lightHelper = new THREE.DirectionalLightHelper(light_2, 5);
        // this.scene.add(lightHelper);

        // const shadowHelper = new THREE.CameraHelper(light_2.shadow.camera);
        // this.scene.add(shadowHelper);
    }
}