import { atom } from 'jotai';
import { PAPERCOLORS } from '../constants/paper';
import { getRandomIndex } from '../utils/getRandomIndex';

export const paperAtom = atom(() => {
  const [frontColorIndex, backColorIndex] = getRandomIndex(
    PAPERCOLORS.length - 1
  );
  return {
    frontColor: PAPERCOLORS[frontColorIndex],
    backColor: PAPERCOLORS[backColorIndex],
  };
});

export const borderVerticesAtom = atom([]);
export const closestVertexAtom = atom();
