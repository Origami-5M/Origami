import { useRef, useCallback, useState } from 'react';
import { useThree } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { paperAtom } from '../../atoms';
import { SEGMENT_NUM } from '../../constants/paper';
import BorderPoints from './ClosestVertex';
import * as THREE from 'three';
import paperShaderMaterial from './paperShaderMaterial';
import { handlePointerEvent, getPaperCorners } from './paperUtils';

const Paper = ({ position }) => {
  const meshRef = useRef();
  const { camera, raycaster } = useThree();
  const [colors] = useAtom(paperAtom);
  const [clickPoint, setClickPoint] = useState(null);
  const [mouseUpPoint, setMouseUpPoint] = useState(null);

  const handlePointerDown = useCallback(
    event =>
      handlePointerEvent(
        event,
        setClickPoint,
        '클릭 좌표:',
        camera,
        raycaster,
        meshRef
      ),
    [camera, raycaster]
  );

  const handlePointerUp = useCallback(
    event =>
      handlePointerEvent(
        event,
        setMouseUpPoint,
        'MouseUp 좌표:',
        camera,
        raycaster,
        meshRef
      ),
    [camera, raycaster]
  );

  const paperCorners = getPaperCorners();

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[3, 3, SEGMENT_NUM, SEGMENT_NUM]} />
        <paperShaderMaterial
          colorFront={new THREE.Color(colors.frontColor)}
          colorBack={new THREE.Color(colors.backColor)}
          side={THREE.DoubleSide}
        />
      </mesh>
      <BorderPoints
        corners={paperCorners}
        pointsPerEdge={9}
        clickPoint={clickPoint}
        mouseUpPoint={mouseUpPoint}
      />
    </group>
  );
};

export default Paper;
