import * as THREE from 'three';
import { getConnection } from '../../utils/getConnection';

export const makeSoundMesh = () => {
	const geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const mesh = new THREE.Mesh(geometry, material);

	mesh.material.transparent = true;
	mesh.material.opacity = 0.15;

	const connection = getConnection({ url: 'https://dax-server.michaelpalladino.io' });

	connection?.socket?.on('finger on screen', (socketId: string) => {
		mesh.material.opacity = 0.35;

		console.log('finger on');
	});

	connection?.socket?.on('finger off screen', (socketId: string) => {
		mesh.material.opacity = 0.15;
	});

	return mesh;
};
