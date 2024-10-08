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
  paperAllPositionAtom,
} from '../../atoms';
import {
  updateBoundaryAndAxis,
  computeBoundaryPoints,
} from './utils/computeBoundaryPoints';
import { foldingAnimation } from './utils/foldingAnimation';
import { SEGMENT_NUM, PAPER_POSITION } from '../../constants/paper';
import TOAST_MESSAGE from '../../constants/toastMessage';
import BorderPoints from './BorderPoints';

const Paper = React.memo(({ setToastMessage }) => {
  const meshRef = useRef();
  const [paperVertices, setPaperVertices] = useState([]);

  const { camera, raycaster, scene } = useThree();
  const [colors] = useAtom(paperAtom);
  const [, setCamera] = useAtom(cameraAtom);
  const [, setRaycaster] = useAtom(raycasterAtom);
  const [, setScene] = useAtom(sceneAtom);

  const [, setIsDragging] = useAtom(isDraggingAtom);
  const [closestVertex] = useAtom(closestVertexAtom);
  const [axisPoints, setAxisPoints] = useAtom(axisPointsAtom);
  const [selectedVertices, setSelectedVertices] = useAtom(selectedVerticesAtom);
  const [paperAllPositions, setPaperAllPositions] =
    useAtom(paperAllPositionAtom);

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
    if (
      !axisPoints ||
      !paperAllPositions ||
      !selectedVertices.point1 ||
      !selectedVertices.point2 ||
      !camera ||
      !meshRef?.current
    ) {
      return;
    }

    const { point1, point2 } = selectedVertices;
    const { startPoint, endPoint } = axisPoints;

    if (JSON.stringify(point1) === JSON.stringify(point2)) {
      setToastMessage(TOAST_MESSAGE.SAME_POSITION);
      return;
    }

    foldingAnimation(
      paperAllPositions,
      startPoint,
      endPoint,
      point1,
      camera,
      meshRef.current
    );
  }, [axisPoints, paperAllPositions, selectedVertices, camera, meshRef]);

  useEffect(() => {
    setSelectedVertices(null);
    setAxisPoints(null);

    if (meshRef.current) {
      const paperAllPositions = meshRef.current.geometry.attributes.position;
      setPaperAllPositions(paperAllPositions);
    }
  }, []);

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
