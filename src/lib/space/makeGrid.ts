import * as THREE from "three";
export const makeGrid = (): Grid => {
  const grid = new THREE.GridHelper(100, 300, 0x888888, 0x444444);

  return grid;
};
export type Grid = THREE.GridHelper;
