import * as THREE from 'three';
import { paper } from '../../three/Paper';
import { borderVertices, changeBorderVertices } from './makeVertices';

const prevHistory = [];
const nextHistory = [];

const saveHistory = history => {
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

    const lastHistory = prevHistory.pop();
    const prevPositions = lastHistory.paper;
    const prevVertices = lastHistory.borderVertices;

    paper.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(prevPositions, 3)
    );

    changeBorderVertices(prevVertices);
  }
};

const changeUnfoldVertex = () => {
  const lastHistory = prevHistory[prevHistory.length - 1];
  const prevVertices = lastHistory.borderVertices;
  changeBorderVertices(prevVertices);
};

const changeToNextFold = () => {
  if (nextHistory.length > 0) {
    const currentPositions = paper.geometry.attributes.position.array.slice();
    const currentBorderVertices = [...borderVertices];

    prevHistory.push({
      paper: currentPositions,
      borderVertices: currentBorderVertices,
    });

    const lastHistory = nextHistory.pop();
    const nextPositions = lastHistory.paper;
    const nextVertices = lastHistory.borderVertices;

    paper.geometry.setAttribute(
      'position',
      new THREE.BufferAttribute(nextPositions, 3)
    );
    changeBorderVertices(nextVertices);
  }
};

const checkActiveButtons = (prev, next) => {
  prev.disabled = prevHistory.length === 0;
  next.disabled = nextHistory.length === 0;
};

export {
  checkActiveButtons,
  saveHistory,
  changeToPrevFold,
  changeToNextFold,
  changeUnfoldVertex,
};
