import * as THREE from "three";

export const makeMaterial = ({ texture }: { texture: THREE.Texture }) => {
  return new THREE.MeshLambertMaterial({
    map: texture,
    transparent: true,
  });
};
