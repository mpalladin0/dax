import * as THREE from 'three';
import type { Camera } from './makeCamera';
import type { Renderer } from './makeRenderer';
import { daxrender } from './render';

export const makeTexture = ({
	camera,
	scene,
	renderer
}: {
	camera: Camera;
	scene: THREE.Scene;
	renderer: Renderer;
}) => {
	const texture = new THREE.TextureLoader().load('assets/textures/crate.gif', () =>
		daxrender({
			camera: camera,
			scene: scene,
			renderer: renderer
		})
	);

	texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

	return texture;
};
