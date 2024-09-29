import { useEffect, useRef } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import * as THREE from 'three';

const CanvasContainer = styled.div`
  width: 100%;
  height: 100%;
`;

const Scene = ({ positions }) => {
  const meshRef = useRef();

  useEffect(() => {
    if (!positions.length || !meshRef.current) return;

    const geometry = new THREE.BufferGeometry();
    const vertices = new Float32Array(positions.flat());
    geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    geometry.computeVertexNormals();
    meshRef.current.geometry = geometry;
  }, [positions]);

  return (
    <mesh ref={meshRef}>
      <meshBasicMaterial wireframe color="blue" />
    </mesh>
  );
};

Scene.propTypes = {
  positions: PropTypes.array.isRequired,
};

const OrigamiCanvas = ({ positions }) => {
  return (
    <CanvasContainer>
      <Canvas>
        <ambientLight intensity={0.5} />
        <directionalLight position={[1, 1, 1]} intensity={0.5} />
        <Scene positions={positions} />
        <OrbitControls enableDamping />
      </Canvas>
    </CanvasContainer>
  );
};

OrigamiCanvas.propTypes = {
  positions: PropTypes.array.isRequired,
};

export default OrigamiCanvas;
