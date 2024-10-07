import { atom } from 'jotai';
import { PAPERCOLORS } from '../constants/paper';
import { getRandomIndex } from '../utils/getRandomIndex';

export const raycasterAtom = atom({});
export const cameraAtom = atom({});
export const sceneAtom = atom({});

export const paperAtom = atom(() => {
  const [frontColorIndex, backColorIndex] = getRandomIndex(
    PAPERCOLORS.length - 1
  );
  return {
    frontColor: PAPERCOLORS[frontColorIndex],
    backColor: PAPERCOLORS[backColorIndex],
  };
});
export const paperAllPositionAtom = atom({});

export const borderVerticesAtom = atom([]);
export const closestVertexAtom = atom({});
