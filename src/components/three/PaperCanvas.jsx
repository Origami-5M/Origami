import * as THREE from 'three';
import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import styled from 'styled-components';
import Paper from './Paper';

const CanvasContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const PaperCanvas = () => {
  const [isInteracting, setIsInteracting] = useState(false);

  return (
    <CanvasContainer>
      <Canvas>
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
