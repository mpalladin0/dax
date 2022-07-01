import { getSocket, type DaxSocket } from '$lib/hooks/getSocket';
import { getUser } from '$lib/hooks/getUser';
import { isMobile } from '$lib/utils/isMobile';
import * as THREE from 'three';
import type { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';
import type { Sound } from './Sound';

export const makeSoundMesh = async (
	socketRef?: DaxSocket,
	sound?: Sound,
	helper?: PositionalAudioHelper
) => {
	const geometry = new THREE.BoxBufferGeometry(0.2, 0.2, 0.2);
	const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
	const mesh = new THREE.Mesh(geometry, material);

	mesh.material.transparent = true;
	mesh.material.opacity = 0.15;

	const socket = socketRef
		? socketRef
		: await getSocket({
				type: isMobile() ? 'CONTROLLER' : 'DESKTOP',
				userId: getUser().id
		  });

	socket.on('finger on screen', (socketId: string) => {
		mesh.material.opacity = 0.35;

		console.log('[Dax] Finger on screen');
	});

	socket.on('finger off screen', (socketId: string) => {
		mesh.material.opacity = 0.15;
		console.log('[Dax] Finger off screen');
	});

	const origin = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);
	if (helper && sound) helper.add(sound);

	socket.on('sound placement from controller', (position: any) => {
		console.log(position);
		newPosition.set(position.x, position.y, position.z);

		const distanceFromOrigin = newPosition.distanceTo(origin);

		if (distanceFromOrigin < 0.1) {
			mesh.position.x = 0;
			mesh.position.y = 0;
			mesh.position.z = 0;
			sound ? sound.setDirectionalCone(360, 360, 0.1) : null;
		} else {
			mesh.position.x = position.x * 10;
			mesh.position.y = position.y * 10;
			mesh.position.z = position.z * 10;
			sound ? sound.setDirectionalCone(90, 120, 0.1) : null;
		}

		helper ? helper.update() : null;
		sound ? sound.lookAt(origin) : null;
		mesh.lookAt(origin);
	});

	return mesh;
};
