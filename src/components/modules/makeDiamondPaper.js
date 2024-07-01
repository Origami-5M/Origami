import * as THREE from 'three';
import { paper } from '../../three/Paper';

const makeDiamondPaper = angle => {
  const rotationMatrix = new THREE.Matrix4().makeRotationZ(angle);
  const positions = paper.geometry.attributes.position;
  const positionArray = positions.array;
  const rotatedPositions = new Float32Array(positionArray.length);

  for (let i = 0; i < positionArray.length; i += 3) {
    const originalVertex = new THREE.Vector3().fromArray(positionArray, i);
    const rotatedVertex = originalVertex.clone().applyMatrix4(rotationMatrix);
    rotatedVertex.toArray(rotatedPositions, i);
  }

  positions.array = rotatedPositions;
};

export { makeDiamondPaper };
