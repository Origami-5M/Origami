import * as THREE from 'three';
import { POINTS_MARKER_SIZE } from '../../constants/paper';
const PointsMarker = ({ position, color }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[POINTS_MARKER_SIZE, 16, 16]} />
      <meshBasicMaterial color={color} />
    </mesh>
  );
};

export default PointsMarker;
