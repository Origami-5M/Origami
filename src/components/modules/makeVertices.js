import { getAxisPoints } from './axisCalculations';

const borderPoints = [];
let borderVertices = [];

const interpolatePoints = (start, end, numPoints) => {
  const points = [];
  const deltaX = (end.x - start.x) / (numPoints + 1);
  const deltaY = (end.y - start.y) / (numPoints + 1);
  const deltaZ = (end.z - start.z) / (numPoints + 1);

  points.push(start);

  for (let i = 1; i <= numPoints; i++) {
    points.push({
      x: start.x + deltaX * i,
      y: start.y + deltaY * i,
      z: start.z + deltaZ * i,
    });
  }

  return points;
};

const generateBorderPoints = (corners, pointsPerEdge = 9) => {
  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    const interpolatedPoints = interpolatePoints(start, end, pointsPerEdge);
    borderPoints.push(...interpolatedPoints);
    borderVertices.push(...interpolatedPoints);
  }

  return borderPoints;
};

const findBorderVertices = () => {
  const corners = [
    { x: 1.5, y: 1.5, z: 0 },
    { x: -1.5, y: 1.5, z: 0 },
    { x: -1.5, y: -1.5, z: 0 },
    { x: 1.5, y: -1.5, z: 0 },
  ];

  return corners;
};

const addVertices = () => {
  const { startPoint, endPoint } = getAxisPoints();
  generateBorderPoints([startPoint, endPoint]);
};

const changeBorderVertices = newData => {
  borderVertices = newData;
};

const corners = findBorderVertices();
borderVertices = generateBorderPoints(corners);

export { borderVertices, addVertices, changeBorderVertices };
