import * as THREE from "three";

export function makeCamera() {
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.01,
    30000
  );
  camera.position.set(0, 10, 20.5);
  camera.lookAt(0, 0, 0);

  return camera;
}
