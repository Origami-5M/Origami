const interpolatePoints = (start, end, numPoints) => {
  const points = [];
  const deltaX = (end.x - start.x) / (numPoints + 1);
  const deltaY = (end.y - start.y) / (numPoints + 1);
  const deltaZ = (end.z - start.z) / (numPoints + 1);

  points.push(start); // Add the starting corner

  for (let i = 1; i <= numPoints; i++) {
    points.push({
      x: start.x + deltaX * i,
      y: start.y + deltaY * i,
      z: start.z + deltaZ * i,
    });
  }

  return points;
};

const generateBorderPoints = (corners, pointsPerEdge) => {
  const borderPoints = [];

  for (let i = 0; i < corners.length; i++) {
    const start = corners[i];
    const end = corners[(i + 1) % corners.length];
    const interpolatedPoints = interpolatePoints(start, end, pointsPerEdge);
    borderPoints.push(...interpolatedPoints);
  }

  return borderPoints;
};

export { generateBorderPoints };
