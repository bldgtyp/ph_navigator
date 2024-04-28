import './styles/App.css';
import Viewer from './components/Viewer';
import FaceDataPanel from './components/FaceDataPanel';
import Toolbar from './components/Toolbar';
import { useRef, useState } from 'react';
import * as THREE from 'three';

function App() {
  const [selectedObject, setSelectedObject] = useState<any>(null); // For React Rendering
  const selectedObjectRef = useRef<THREE.Object3D | null>(null); // For Three.js Rendering
  const hoveringVertex = useRef<THREE.Vector3 | null>(null); // For Three.js Rendering
  const selectedVertex = useRef<THREE.Vector3 | null>(null); // For Three.js Rendering
  const appState = useRef(null);

  return (
    <div className="App">
      <Viewer
        selectedObjectRef={selectedObjectRef}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        appState={appState}
        hoveringVertex={hoveringVertex}
      />
      <FaceDataPanel
        selectedObjectRef={selectedObjectRef}
        selectedObject={selectedObject}
        setSelectedObject={setSelectedObject}
        appState={appState}
      />
      <Toolbar appState={appState} />
    </div>
  );
}

export default App;