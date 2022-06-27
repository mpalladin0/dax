import type * as THREE from "three";
import type { Camera } from "./makeCamera";
import type { Renderer } from "./makeRenderer";

export function daxrender({
  renderer,
  scene,
  camera,
}: {
  renderer: Renderer;
  scene: THREE.Scene;
  camera: Camera;
}) {
  renderer.render(scene, camera);
}
