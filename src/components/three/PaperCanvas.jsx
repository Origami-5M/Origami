import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

import styled from 'styled-components';
import * as THREE from 'three';
import Paper from './Paper';
import PointsMarker from './PointsMarker';
import { POINTS_MARKER_COLOR, RED_MARKER_COLOR } from '../../constants/paper';

const CanvasContainer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 1;
`;

const PaperCanvas = () => {
  return (
    <CanvasContainer>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <Paper position={[0, 0, 0]} />
        <PointsMarker position={[0, 0, 0]} color={POINTS_MARKER_COLOR} />
        <OrbitControls
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
