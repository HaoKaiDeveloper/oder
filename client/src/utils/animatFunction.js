function numAnimation(targetNum, el, range) {
  if (isNaN(targetNum)) {
    el.value = 0;
    return;
  }
  setTimeout(() => {
    const set = setInterval(() => {
      el.value += range;
      if (el.value >= targetNum) {
        el.value = Number(targetNum);
        clearInterval(set);
      }
    }, 10);
  }, 500);
}

export { numAnimation };
