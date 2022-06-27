import * as THREE from "three";
export function makeRenderer(): Renderer {
  const renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  return renderer;
}

export type Renderer = THREE.WebGLRenderer;
