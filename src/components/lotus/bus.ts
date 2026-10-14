// Tiny shared state between the DOM and the 3D scene (no re-renders involved).
export const bus = {
  focus: -1, // index of the service whose petals should glow, -1 = none
  nx: 0, // pointer in normalised device coords
  ny: 0,
  last: -1e9, // performance.now() of the last pointer move
};
