const GUIDE_IMAGES = {
  puppy: [
    '/src/assets/img/guide/puppy-guide1.png',
    '/src/assets/img/guide/puppy-guide2.png',
    '/src/assets/img/guide/puppy-guide3.png',
    '/src/assets/img/guide/puppy-guide4.png',
    '/src/assets/img/guide/puppy-guide5.png',
    '/src/assets/img/guide/puppy-guide6.png',
    '/src/assets/img/guide/puppy-guide7.png',
    '/src/assets/img/guide/puppy-guide8.png',
  ],
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
    '/src/assets/img/guide/plane-guide11.png',
    '/src/assets/img/guide/plane-guide12.png',
  ],
};

const GUIDE_STEPS = {
  puppy: [
    {
      points: [
        { x: 0, y: 2.1, z: 0 },
        { x: 0, y: -2.1, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 2.1, y: 0, z: 0 },
        { x: -2.1, y: 0, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [],
      axis: null,
      unfold: true,
      singleSide: false,
    },
    {
      points: [
        { x: -1.7, y: 0, z: 0 },
        { x: -1.2, y: -0.85, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 1.7, y: 0, z: 0 },
        { x: 1.2, y: -0.85, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 0, y: -2.1, z: 0 },
        { x: 0, y: -1.4, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 0, y: -2.1, z: 0 },
        { x: 0, y: -1.4, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: -1.8, y: 0, z: 0 },
        { x: 2.1, y: 0, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
  ],
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
      points: [],
      axis: null,
      unfold: true,
      singleSide: false,
    },
    {
      points: [
        { x: -1.5, y: 1.5, z: 0 },
        { x: 0, y: 0, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: -1.5, y: -1.5, z: 0 },
        { x: 0, y: 0, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 0, y: 1.5, z: 0 },
        { x: 0.62, y: 0.00019991115391304604, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: 0, y: -1.5, z: 0 },
        { x: 0.62, y: 0.00019991115391304604, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        { x: -1.5, y: 0, z: 0 },
        { x: -1, y: 0, z: 0 },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        {
          x: 0.6159830537825293,
          y: -0.8763932215130115,
          z: 0,
        },
        {
          x: 0.6159830537825293,
          y: 0.8763932215130115,
          z: 0,
        },
      ],
      axis: null,
      unfold: false,
      singleSide: false,
    },
    {
      points: [
        {
          x: 0.3198644103773862,
          y: 0.7579457641509544,
          z: 0,
        },
        {
          x: 0.48,
          y: 0,
          z: 0,
        },
      ],
      axis: null,
      unfold: false,
      singleSide: true,
    },
    {
      points: [
        {
          x: 0.3198644103773862,
          y: 0.7579457641509544,
          z: 0,
        },
        {
          x: 0.48,
          y: 0,
          z: 0,
        },
      ],
      axis: null,
      unfold: false,
      singleSide: true,
    },
    {
      points: [],
      axis: {
        startPoint: { x: 0.3198644103773862, y: 0.7579457641509544 },
        endPoint: {
          x: 0.48,
          y: 0,
        },
      },
      unfold: true,
      singleSide: true,
    },
    {
      points: [],
      axis: {
        startPoint: { x: 0.3198644103773862, y: 0.7579457641509544 },
        endPoint: {
          x: 0.48,
          y: 0,
        },
      },
      unfold: true,
      singleSide: true,
    },
  ],
};

const CHUNK_SIZE = 999;

export { GUIDE_IMAGES, GUIDE_STEPS, CHUNK_SIZE };
