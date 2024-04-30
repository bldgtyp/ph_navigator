import './styles/App.css';
import Viewer from './components/Viewer';
import FaceDataPanel from './components/FaceDataPanel';
import Toolbar from './components/Toolbar';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { AppState } from './types/AppState';
import { SceneSetup } from './scene/SceneSetup';

function App() {
  const world = useRef(new SceneSetup());

  const [selectedObject, setSelectedObject] = useState<any>(null); // For React Rendering
  const selectedObjectRef = useRef<THREE.Object3D | null>(null); // For THREE.js Rendering
  const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering

  const appStateRef = useRef(null); // For THREE.js Rendering
  const [appState, setAppState] = useState<number | null>(AppState.None); // For React Rendering

  const dimensionLinesRef = useRef(new THREE.Group()); // For THREE.js Rendering
  world.current.scene.add(dimensionLinesRef.current);

  return (
    <div className="App">
      <Viewer
        world={world}
        selectedObjectRef={selectedObjectRef}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        appStateRef={appStateRef}
        hoveringVertex={hoveringVertex}
        dimensionLinesRef={dimensionLinesRef}
      />
      <FaceDataPanel
        selectedObjectRef={selectedObjectRef}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        appStateRef={appStateRef}
      />
      <Toolbar
        appStateRef={appStateRef}
        appState={appState}
        setAppState={setAppState} />
    </div>
  );
}

export default App;