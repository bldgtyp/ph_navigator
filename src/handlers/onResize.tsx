
import { SceneSetup } from '../scene/SceneSetup';

export function onResize(world: SceneSetup) {
    world.camera.aspect = window.innerWidth / window.innerHeight;
    world.camera.updateProjectionMatrix();
    world.renderer.setSize(window.innerWidth, window.innerHeight);
}