export const callbackPipe = (object) => {
  const { success, fail } = object;
  return [success, fail];
};
