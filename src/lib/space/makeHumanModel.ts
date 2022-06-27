import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const makeHumanModel = ({ scene }: { scene: THREE.Scene }) => {
	const loader = new GLTFLoader();

	const group = new THREE.Group();

	const polarGridHelper = new THREE.PolarGridHelper(200, 32, 32, 128, 0x818182, 0xb5b5b5);

	polarGridHelper.material.transparent = true;
	polarGridHelper.material.opacity = 0.15;
	let line: THREE.LineSegments;

	function setOpacity(amount: number) {
		line.material.opacity = amount;
	}

	//   0x0000ff;

	//   polarGridHelper.position.y = -150;
	//   polarGridHelper.position.x = 200;
	scene.add(polarGridHelper);

	loader.load('assets/models/LeePerrySmith.glb', (gltf) => {
		const mesh = gltf.scene.children[0];
		group.scale.multiplyScalar(0.5);
		scene.add(group);
		group.updateMatrixWorld(true);

		const wireframe = new THREE.WireframeGeometry(mesh.geometry);
		line = new THREE.LineSegments(wireframe);
		line.material.transparent = true;
		line.material.depthTest = true;
		line.material.opacity = 0.05;
		line.position.x = 4;
		group.add(line);
	});

	group.position.setY(-0.9);
	group.position.setX(-2);

	return {
		group,
		setOpacity
	};
};
