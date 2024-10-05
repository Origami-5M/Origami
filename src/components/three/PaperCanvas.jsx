import * as THREE from 'three';
import { useState, useRef, useCallback } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { useAtom } from 'jotai';
import styled from 'styled-components';

import {
  borderVerticesAtom,
  closestVertexAtom,
  cameraAtom,
  raycasterAtom,
  sceneAtom,
} from '../../atoms';
import {
  getMousePositionIn3D,
  findClosestMesh,
} from './utils/borderVerticesUtils';
import Paper from './Paper';

const CanvasContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const PaperCanvas = () => {
  const containerRef = useRef();
  const [isInteracting, setIsInteracting] = useState(false);
  const [borderVertices] = useAtom(borderVerticesAtom);
  const [, setClosestVertex] = useAtom(closestVertexAtom);
  const [camera] = useAtom(cameraAtom);
  const [raycaster] = useAtom(raycasterAtom);
  const [scene] = useAtom(sceneAtom);

  const handleMouseMove = useCallback(
    event => {
      const mouse3DPoint = getMousePositionIn3D(
        event,
        containerRef,
        raycaster,
        camera,
        scene
      );

      if (mouse3DPoint) {
        const closestVertex = findClosestMesh(mouse3DPoint, borderVertices);

        setClosestVertex(closestVertex);
      } else {
        setClosestVertex(null);
      }
    },
    [borderVertices, camera, raycaster, scene]
  );

  return (
    <CanvasContainer ref={containerRef}>
      <Canvas onMouseMove={handleMouseMove}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <Paper position={[0, 0, 0]} setIsInteracting={setIsInteracting} />
        <OrbitControls
          enabled={!isInteracting}
          enableDamping={true}
          dampingFactor={0.25}
          enableZoom={true}
          minAzimuthAngle={-Math.PI}
          maxAzimuthAngle={Math.PI}
          minPolarAngle={Math.PI / 6}
          maxPolarAngle={Math.PI - Math.PI / 6}
          minDistance={3}
          maxDistance={5}
          mouseButtons={{
            LEFT: THREE.MOUSE.ROTATE,
            MIDDLE: THREE.MOUSE.DOLLY,
            RIGHT: null,
          }}
        />
      </Canvas>
    </CanvasContainer>
  );
};

export default PaperCanvas;
