import * as THREE from "three";
export const makeScene = () => {
  const scene = new THREE.Scene();
  scene.position.setY(-1);

  return scene;
};
