import * as THREE from 'three';
import { shaderMaterial } from '@react-three/drei';
import { extend } from '@react-three/fiber';

const PaperShaderMaterial = shaderMaterial(
  {
    colorFront: new THREE.Color(0xffffff),
    colorBack: new THREE.Color(0x000000),
  },

  `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
  `,

  `
  uniform vec3 colorFront;
  uniform vec3 colorBack;
  varying vec3 vNormal;
  void main() {
    if (gl_FrontFacing) {
      gl_FragColor = vec4(colorFront, 1.0);
    } else {
      gl_FragColor = vec4(colorBack, 1.0);
    }
  }
  `
);
extend({ PaperShaderMaterial });

export default PaperShaderMaterial;
