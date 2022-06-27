import * as THREE from "three";

export function makeCamera(): Camera {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    30000
  );
  camera.position.set(0, 30, 100);
  camera.lookAt(0, 0, 0);

  return camera as Camera;
}

export type Camera = THREE.PerspectiveCamera;
