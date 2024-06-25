import { PAPER_BOUNDARY } from '../../constants';

const adjustCoordinateRange = (
  startPoint,
  endPoint,
  primaryAxis,
  secondaryAxis
) => {
  if (startPoint[primaryAxis] < -PAPER_BOUNDARY) {
    const scaleFactor =
      (-PAPER_BOUNDARY - endPoint[primaryAxis]) /
      (startPoint[primaryAxis] - endPoint[primaryAxis]);
    startPoint[primaryAxis] = -PAPER_BOUNDARY;
    startPoint[secondaryAxis] +=
      scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
    startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
  } else if (startPoint[primaryAxis] > PAPER_BOUNDARY) {
    const scaleFactor =
      (PAPER_BOUNDARY - endPoint[primaryAxis]) /
      (startPoint[primaryAxis] - endPoint[primaryAxis]);
    startPoint[primaryAxis] = PAPER_BOUNDARY;
    startPoint[secondaryAxis] +=
      scaleFactor * (endPoint[secondaryAxis] - startPoint[secondaryAxis]);
    startPoint.z += scaleFactor * (endPoint.z - startPoint.z);
  }

  return startPoint;
};

const getClampedPoint = (startPoint, endPoint) => {
  startPoint = adjustCoordinateRange(startPoint, endPoint, 'x', 'y');
  startPoint = adjustCoordinateRange(startPoint, endPoint, 'y', 'x');
  return startPoint;
};

const calculateCoordinate = (
  intervalVector,
  boundary,
  primaryAxis,
  secondaryAxis,
  vertexIntervalMidPoint
) => {
  const primaryValue = boundary;
  const secondaryValue =
    vertexIntervalMidPoint[secondaryAxis] +
    ((primaryValue - vertexIntervalMidPoint[primaryAxis]) *
      intervalVector[secondaryAxis]) /
      intervalVector[primaryAxis];
  const zValue =
    vertexIntervalMidPoint.z +
    ((primaryValue - vertexIntervalMidPoint[primaryAxis]) * intervalVector.z) /
      intervalVector[primaryAxis];
  return { primaryValue, secondaryValue, zValue };
};

export { adjustCoordinateRange, getClampedPoint, calculateCoordinate };
