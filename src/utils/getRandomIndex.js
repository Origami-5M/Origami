export const getRandomIndex = length => {
  const firstIndex = Math.floor(Math.random() * length);
  let secondIndex = 0;

  do {
    secondIndex = Math.floor(Math.random() * length);
  } while (secondIndex === firstIndex);

  return [firstIndex, secondIndex];
};
