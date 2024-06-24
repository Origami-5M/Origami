import * as THREE from 'three';

/**
 * Add axis 임의의 축 좌표
 */
const firstAxisPoint = new THREE.Vector3(0.8, 1.5, 0);
const secondAxisPoint = new THREE.Vector3(0.8, -1.5, 0);

const axisMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });
const axisGeometry = new THREE.BufferGeometry().setFromPoints([
  firstAxisPoint,
  secondAxisPoint,
]);
const axis = new THREE.Line(axisGeometry, axisMaterial);

const divideAxis = (axis, n) => {
  const points = [];
  const pointA = axis.geometry.attributes.position.array.slice(0, 3);
  const pointB = axis.geometry.attributes.position.array.slice(3, 6);

  const deltaX = (pointB[0] - pointA[0]) / n;
  const deltaY = (pointB[1] - pointA[1]) / n;
  const deltaZ = (pointB[2] - pointA[2]) / n;

  for (let i = 0; i <= n; i++) {
    const x = pointA[0] + deltaX * i;
    const y = pointA[1] + deltaY * i;
    const z = pointA[2] + deltaZ * i;
    points.push(new THREE.Vector3(x, y, z));
  }

  return points;
};

const numDivisions = 100; // 임의의 숫자
const dividedPoints = divideAxis(axis, numDivisions);

console.log('dividedPoints', dividedPoints);

//dividedPoints를 기준으로 어느 면에 있는지 판별하기
// for (let i = 0; i <= dividedPoints.length; i++) {}

export { axis };
