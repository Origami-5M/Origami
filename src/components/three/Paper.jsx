import * as THREE from 'three';
import PaperShaderMaterial from '../three/PaperShaderMaterial';
import { useAtom } from 'jotai';
import { paperAtom } from '../../atoms';
import { SEGMENT_NUM } from '../../constants/paper';

const Paper = props => {
  const [colors] = useAtom(paperAtom);

  return (
    <mesh {...props}>
      <planeGeometry args={[3, 3, SEGMENT_NUM, SEGMENT_NUM]} />
      <paperShaderMaterial
        colorFront={new THREE.Color(colors.frontColor)}
        colorBack={new THREE.Color(colors.backColor)}
        side={THREE.DoubleSide}
        wireframe={false}
      />
    </mesh>
  );
};

export default Paper;
