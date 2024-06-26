const foldedHistoryStack = [];
const foldedHistoryQueue = [];

const activeButtons = (prev, next) => {
  if (foldedHistoryStack.length) {
    prev.disabled = false;
  }

  if (foldedHistoryQueue.length) {
    next.disabled = false;
  }
};

export { foldedHistoryStack, foldedHistoryQueue, activeButtons };
