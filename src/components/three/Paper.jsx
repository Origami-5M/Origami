import React, { useRef, useState, useEffect } from 'react';
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
  axisPointsAtom,
} from '../../atoms';
import BorderPoints from './BorderPoints';
import {
  updateBoundaryAndAxis,
  computeBoundaryPoints,
} from './utils/computeBoundaryPoints';
import { SEGMENT_NUM, PAPER_POSITION } from '../../constants/paper';

const Paper = React.memo(() => {
  const meshRef = useRef();
  const [paperVertices, setPaperVertices] = useState([]);
  const [colors] = useAtom(paperAtom);

  const { camera, raycaster, scene } = useThree();
  const [, setCamera] = useAtom(cameraAtom);
  const [, setRaycaster] = useAtom(raycasterAtom);
  const [, setScene] = useAtom(sceneAtom);

  const [, setIsDragging] = useAtom(isDraggingAtom);
  const [closestVertex] = useAtom(closestVertexAtom);
  const [axisPoints, setAxisPoints] = useAtom(axisPointsAtom);
  const [selectedVertices, setSelectedVertices] = useAtom(selectedVerticesAtom);

  const paperCorners = computeBoundaryPoints(paperVertices);

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

  const handlePointerDown = () => {
    if (closestVertex) {
      setSelectedVertices({
        point1: closestVertex,
        point2: null,
      });
    } else {
      setSelectedVertices({ point1: null, point2: null });
    }

    if (closestVertex) {
      setIsDragging(true);
    }
  };
  const handlePointerUp = () => {
    if (closestVertex) {
      setSelectedVertices(prev => ({
        ...prev,
        point2: closestVertex,
      }));
    }

    if (selectedVertices.point1 && closestVertex) {
      const updatedAxisPoints = updateBoundaryAndAxis(
        scene,
        paperVertices,
        selectedVertices.point1,
        closestVertex
      );

      if (updatedAxisPoints) {
        setAxisPoints(updatedAxisPoints);
      }
    }
    setIsDragging(false);
  };

  useEffect(() => {
    const { point1, point2 } = selectedVertices;
    if (point1 === point2) {
    }
  }, [selectedVertices]);

  return (
    <group position={PAPER_POSITION}>
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
        axisPoints={axisPoints}
      />
    </group>
  );
});

export default Paper;
