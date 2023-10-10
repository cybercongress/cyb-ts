async function waitUntil(cond: () => boolean, timeoutDuration = 60000) {
  if (cond()) {
    return true;
  }

  const waitPromise = new Promise((resolve) => {
    const interval = setInterval(() => {
      if (cond()) {
        clearInterval(interval);
        resolve(true);
      }
    }, 10);
  });

  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error('waitUntil timed out!'));
    }, timeoutDuration);
  });

  return Promise.race([waitPromise, timeoutPromise]);
}

export { waitUntil };
