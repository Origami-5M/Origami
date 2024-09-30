import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { useAtom } from 'jotai';
import { paperAtom } from '../../atoms';
import { SEGMENT_NUM } from '../../constants/paper';
import BorderPoints from './ClosestVertex';
import * as THREE from 'three';
import paperShaderMaterial from './paperShaderMaterial';
import { handlePointerEvent } from './paperUtils';
import {
  updateBoundaryAndAxis,
  computeBoundaryPoints,
} from './computeBoundaryPoints';

const Paper = ({ position, setIsInteracting }) => {
  const meshRef = useRef();
  const { camera, raycaster, scene } = useThree();
  const [colors] = useAtom(paperAtom);
  const [clickPoint, setClickPoint] = useState(null);
  const [mouseUpPoint, setMouseUpPoint] = useState(null);
  const [axisPoints, setAxisPoints] = useState(null);
  const [paperVertices, setPaperVertices] = useState([]);

  useEffect(() => {
    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      const vertices = [];
      for (let i = 0; i < positionAttribute.count; i++) {
        vertices.push(
          new THREE.Vector3().fromBufferAttribute(positionAttribute, i)
        );
      }
      setPaperVertices(vertices);
    }
  }, []);

  const paperCorners = useMemo(
    () => computeBoundaryPoints(paperVertices),
    [paperVertices]
  );

  const handlePointerDown = useCallback(
    event => {
      if (paperCorners && paperCorners.length > 0) {
        const point = handlePointerEvent(
          event,
          setClickPoint,
          '클릭 좌표:',
          camera,
          raycaster,
          meshRef,
          paperCorners
        );

        if (point) {
          setClickPoint(point);
          setIsInteracting(true);
        }
      }
    },
    [camera, raycaster, setIsInteracting, paperCorners]
  );

  const handlePointerUp = useCallback(
    event => {
      if (paperCorners && paperCorners.length > 0) {
        const point = handlePointerEvent(
          event,
          setMouseUpPoint,
          'MouseUp 좌표:',
          camera,
          raycaster,
          meshRef,
          paperCorners
        );
        if (point) {
          setMouseUpPoint(point);
          if (clickPoint && point) {
            const updatedAxisPoints = updateBoundaryAndAxis(
              scene,
              paperVertices,
              clickPoint,
              point
            );
            if (updatedAxisPoints) {
              setAxisPoints(updatedAxisPoints);
            }
          }
        }
        setIsInteracting(false);
      }
    },
    [
      camera,
      raycaster,
      setIsInteracting,
      scene,
      paperVertices,
      paperCorners,
      clickPoint,
    ]
  );

  return (
    <group position={position}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <planeGeometry args={[5, 5, SEGMENT_NUM, SEGMENT_NUM]} />
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
        axisPoints={axisPoints}
      />
    </group>
  );
};

export default Paper;
