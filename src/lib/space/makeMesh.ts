import * as THREE from 'three';
export const makeMesh = ({
	geometry,
	material
}: {
	geometry: THREE.BoxGeometry;
	material: THREE.MeshLambertMaterial;
}) => new THREE.Mesh(geometry, material);
