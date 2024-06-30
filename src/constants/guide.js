const GUIDE_IMAGES = {
  plane: [
    '/src/assets/img/guide/plane-guide1.png',
    '/src/assets/img/guide/plane-guide2.png',
    '/src/assets/img/guide/plane-guide3.png',
    '/src/assets/img/guide/plane-guide4.png',
    '/src/assets/img/guide/plane-guide5.png',
    '/src/assets/img/guide/plane-guide6.png',
    '/src/assets/img/guide/plane-guide7.png',
    '/src/assets/img/guide/plane-guide8.png',
    '/src/assets/img/guide/plane-guide9.png',
    '/src/assets/img/guide/plane-guide10.png',
  ],
};

const GUIDE_STEPS = {
  plane: [
    {
      points: [
        { x: 0, y: 1.5, z: 0 },
        { x: 0, y: -1.5, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 0, y: 1.5, z: 0 },
        { x: 0, y: -1.5, z: 0 },
      ],
      axis: null,
      unfold: true,
      singleSide: false,
    },
  ],
};

const CHUNK_SIZE = 1000;

export { GUIDE_IMAGES, GUIDE_STEPS, CHUNK_SIZE };
