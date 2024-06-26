import * as THREE from 'three';
import { paper } from '../../three/Paper';
import { borderVertices, changeBorderVertices } from './makeVertices';

const prevHistory = [];
const nextHistory = [];

const saveFoldHistory = history => {
  prevHistory.push(history);
  nextHistory.length = 0;
};

const changeToPrevFold = () => {
  if (prevHistory.length > 0) {
    const currentPositions = paper.geometry.attributes.position.array.slice();
    const currentBorderVertices = borderVertices.slice();

    nextHistory.push({
      paper: currentPositions,
      borderVertices: currentBorderVertices,
    });

    const lastIndex = prevHistory.pop();
    const prevPositions = lastIndex.paper;

    paper.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(prevPositions, 3)
    );
  }
};

const changeToNextFold = () => {
  if (nextHistory.length > 0) {
    const currentPositions = paper.geometry.attributes.position.array.slice();
    const currentBorderVertices = [...borderVertices];

    prevHistory.push({
      paper: currentPositions,
      borderVertices: currentBorderVertices,
    });

    const lastIndex = nextHistory.pop();
    const nextPositions = lastIndex.paper;

    paper.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(nextPositions, 3)
    );
  }
};

const checkActiveButtons = (prev, next) => {
  prev.disabled = prevHistory.length === 0;
  next.disabled = nextHistory.length === 0;
};

export {
  checkActiveButtons,
  saveFoldHistory,
  changeToPrevFold,
  changeToNextFold,
};
