import { atom } from 'jotai';

export const isDraggingAtom = atom(false);
export const selectedVerticesAtom = atom({ point1: null, point2: null });
