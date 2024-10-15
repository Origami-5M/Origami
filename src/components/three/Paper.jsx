import React, { useRef, useState, useEffect } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import paperShaderMaterial from './utils/PaperShaderMaterial';

import { useAtom } from 'jotai';
import {
  paperAtom,
  cameraAtom,
  raycasterAtom,
  borderVerticesAtom,
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
import { generateBorderPoints } from './utils/borderVerticesUtils';
import { foldVertices } from './utils/foldVertices';
import { SEGMENT_NUM, PAPER_POSITION } from '../../constants/paper';
import TOAST_MESSAGE from '../../constants/toastMessage';
import BorderPoints from './BorderPoints';
import {
  rotateSelectedVertices,
  handleFoldedMeshClick,
} from './utils/rotateSelectedVertices';

const Paper = React.memo(({ setToastMessage }) => {
  const meshRef = useRef();
  const [paperVertices, setPaperVertices] = useState([]);

  const { camera, raycaster, scene, gl } = useThree();
  const [colors] = useAtom(paperAtom);
  const [, setCamera] = useAtom(cameraAtom);
  const [, setRaycaster] = useAtom(raycasterAtom);
  const [, setScene] = useAtom(sceneAtom);

  const [, setIsDragging] = useAtom(isDraggingAtom);
  const [closestVertex] = useAtom(closestVertexAtom);
  const [borderVertices, setBorderVertices] = useAtom(borderVerticesAtom);
  const [axisPoints, setAxisPoints] = useAtom(axisPointsAtom);
  const [selectedVertices, setSelectedVertices] = useAtom(selectedVerticesAtom);
  const [paperAllPositions, setPaperAllPositions] =
    useAtom(paperAllPositionAtom);
  const [rotateData, setRotateData] = useState([]);
  const [selectedRotateData, setSelectedRotateData] = useState(null);
  const paperCorners = computeBoundaryPoints(paperVertices);

  useEffect(() => {
    setCamera(camera);
    setRaycaster(raycaster);
    setScene(scene);

    setSelectedVertices(null);
    setAxisPoints(null);

    if (meshRef.current) {
      const geometry = meshRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position');
      const vertices = [];
      for (let i = 0; i < positionAttribute.count; i++) {
        vertices.push(
          new THREE.Vector3().fromBufferAttribute(positionAttribute, i)
        );
      }
      const paperAllPositions = meshRef.current.geometry.attributes.position;
      setPaperVertices(vertices);
      setPaperAllPositions(paperAllPositions);
    }
  }, []);

  const handlePointerDown = event => {
    if (closestVertex) {
      setSelectedVertices({
        point1: closestVertex,
        point2: null,
      });
      setIsDragging(true);
    } else {
      const rect = gl.domElement.getBoundingClientRect();
      const mouse = new THREE.Vector2();

      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, camera);

      handleFoldedMeshClick(rotateData, raycaster, setSelectedRotateData);
      setSelectedVertices({ point1: null, point2: null });
    }
  };

  const handlePointerUp = () => {
    if (closestVertex) {
      setSelectedVertices(prev => ({
        ...prev,
        point2: closestVertex,
      }));
    }

    if (selectedVertices?.point1 && closestVertex) {
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

    if (!selectedVertices || !selectedVertices.point1 || !closestVertex) {
      if (meshRef.current) {
        const positionAttribute = meshRef.current.geometry.attributes.position;
        const selectedVerticesSet = new Set(
          selectedRotateData.rotateVertexIndices
        );
        const totalRotation = Math.PI;
        const frames = 85;

        const clockwise = positionAttribute.array[2] > 0 ? true : false;

        rotateSelectedVertices(
          positionAttribute,
          selectedVerticesSet,
          totalRotation,
          frames,
          clockwise,
          selectedRotateData
        );
        setSelectedRotateData(null);
        setRotateData(prevRotateData =>
          prevRotateData.filter(data => data !== selectedRotateData)
        );
      }
    }
  };

  useEffect(() => {
    if (
      !axisPoints ||
      !paperAllPositions ||
      !selectedVertices?.point1 ||
      !selectedVertices?.point2 ||
      !camera ||
      !meshRef?.current ||
      !borderVertices
    ) {
      return;
    }

    const { point1, point2 } = selectedVertices;
    const { startPoint, endPoint } = axisPoints;

    if (JSON.stringify(point1) === JSON.stringify(point2)) {
      setToastMessage(TOAST_MESSAGE.SAME_POSITION);
      return;
    }

    const getRotateData = foldVertices(
      paperAllPositions,
      startPoint,
      endPoint,
      point1,
      camera,
      meshRef.current
    );
    setRotateData(prevRotateData => [...prevRotateData, getRotateData]);

    const foldedVertices = foldVertices(
      borderVertices,
      startPoint,
      endPoint,
      point1,
      camera,
      meshRef.current
    );
    const newBorderVertices = generateBorderPoints([
      axisPoints.startPoint,
      axisPoints.endPoint,
    ]);

    setBorderVertices([...foldedVertices, ...newBorderVertices]);
  }, [
    axisPoints,
    paperAllPositions,
    selectedVertices,
    camera,
    meshRef,
    // borderVertices,
  ]);

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
