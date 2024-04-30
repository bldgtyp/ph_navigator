import './styles/App.css';
import * as THREE from 'three';
import { useRef, useState } from 'react';
import Viewer from './components/Viewer';
import FaceDataPanel from './components/FaceDataPanel';
import Toolbar from './components/Toolbar';
import { AppState, states } from './components/AppState';
import { SceneSetup } from './scene/SceneSetup';

// ----------------------------------------------------------------------------
// Start the App
function App() {
  const world = useRef(new SceneSetup());

  const [selectedObject, setSelectedObject] = useState<any>(null); // For React Rendering
  const selectedObjectRef = useRef<THREE.Object3D | null>(null); // For THREE.js Rendering
  const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For THREE.js Rendering

  const appStateRef = useRef(states[0]); // For THREE.js Rendering
  const [appState, setAppState] = useState<AppState>(states[0]); // For React Rendering

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