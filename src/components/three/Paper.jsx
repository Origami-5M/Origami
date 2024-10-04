import { useRef, useCallback, useState, useMemo, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import paperShaderMaterial from './utils/PaperShaderMaterial';

import { useAtom } from 'jotai';
import {
  paperAtom,
  cameraAtom,
  raycasterAtom,
  sceneAtom,
  closestVertexAtom,
  isDraggingAtom,
  selectedVerticesAtom,
} from '../../atoms';
import BorderPoints from './BorderPoints';
import {
  updateBoundaryAndAxis,
  computeBoundaryPoints,
} from './utils/computeBoundaryPoints';
import { handlePointerEvent } from './utils/paperUtils';
import { SEGMENT_NUM } from '../../constants/paper';

const Paper = ({ position, setIsInteracting }) => {
  const meshRef = useRef();
  const [clickPoint, setClickPoint] = useState(null);
  const [mouseUpPoint, setMouseUpPoint] = useState(null);
  const [axisPoints, setAxisPoints] = useState(null);
  const [paperVertices, setPaperVertices] = useState([]);
  const [colors] = useAtom(paperAtom);

  const { camera, raycaster, scene } = useThree();
  const [, setCamera] = useAtom(cameraAtom);
  const [, setRaycaster] = useAtom(raycasterAtom);
  const [, setScene] = useAtom(sceneAtom);

  const [, setIsDragging] = useAtom(isDraggingAtom);
  const [closestVertex] = useAtom(closestVertexAtom);
  const [selectedVertices, setSelectedVertices] = useAtom(selectedVerticesAtom);

  const paperCorners = useMemo(
    () => computeBoundaryPoints(paperVertices),
    [paperVertices]
  );

  useEffect(() => {
    setCamera(camera);
    setRaycaster(raycaster);
    setScene(scene);

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
          setIsDragging(true);
        }
      }

      if (closestVertex) {
        setSelectedVertices(prev => ({
          ...prev,
          point1: closestVertex,
        }));
      } else {
        setSelectedVertices({ point1: null, point2: null });
      }
    },
    [
      camera,
      raycaster,
      setIsDragging,
      setIsInteracting,
      paperCorners,
      closestVertex,
      selectedVertices,
    ]
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
        setIsDragging(false);
      }

      if (closestVertex) {
        setSelectedVertices(prev => ({
          ...prev,
          point2: closestVertex,
        }));
      }
    },
    [
      camera,
      raycaster,
      setIsDragging,
      setIsInteracting,
      scene,
      paperVertices,
      paperCorners,
      clickPoint,
      closestVertex,
      selectedVertices,
    ]
  );

  useEffect(() => {
    const { point1, point2 } = selectedVertices;
    if (point1 === point2) {
      //선택된 두 점이 같을 때 접기 조건 충족안됨 예외처리
    }
  }, [selectedVertices]);

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
