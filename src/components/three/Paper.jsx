import * as THREE from 'three';
import PaperShaderMaterial from '../three/PaperShaderMaterial';

import { getRandomIndex } from '../../utils/getRandomIndex';
import { PAPERCOLORS, SEGMENT_NUM } from '../../constants/paper';

const Paper = props => {
  const [frontColorIndex, backColorIndex] = getRandomIndex(
    PAPERCOLORS.length - 1
  );
  const frontColor = PAPERCOLORS[frontColorIndex];
  const backColor = PAPERCOLORS[backColorIndex];

  return (
    <mesh {...props}>
      <planeGeometry args={[3, 3, SEGMENT_NUM, SEGMENT_NUM]} />
      <paperShaderMaterial
        colorFront={new THREE.Color(frontColor)}
        colorBack={new THREE.Color(backColor)}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

export default Paper;
