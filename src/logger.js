export default (silent) => {
  if (silent) {
    return () => {};
  }
  return (level, ...args) => console[level](...args);
};
