import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export const makeHumanModel = ({
	scene,
	thickness,
	isWireframe
}: {
	scene: THREE.Scene;
	thickness?: number;
	isWireframe?: boolean;
}) => {
	const loader = new GLTFLoader();

	const group = new THREE.Group();

	const polarGridHelper = new THREE.PolarGridHelper(200, 32, 32, 128, 0x818182, 0xb5b5b5);

	polarGridHelper.material.transparent = true;
	polarGridHelper.material.opacity = 0.15;
	let line: THREE.LineSegments;
	let wireframe: THREE.LineSegments<
		THREE.EdgesGeometry<THREE.BufferGeometry>,
		THREE.LineBasicMaterial
	>;

	function setOpacity(amount: number) {
		wireframe.material.opacity = amount;
	}
	function setLineWidth(width: number) {
		wireframe.material.linewidth = width;
	}

	//   0x0000ff;

	//   polarGridHelper.position.y = -150;
	//   polarGridHelper.position.x = 200;
	scene.add(polarGridHelper);

	const url = `https://dax-mobile.michaelpalladino.io/assets/models/LeePerrySmith.glb`;

	loader.load(url, (gltf) => {
		const mesh = gltf.scene.children[0] as THREE.Mesh;
		group.scale.multiplyScalar(0.5);

		scene.add(group);
		group.updateMatrixWorld(true);

		console.log(mesh);

		const geometry = new THREE.EdgesGeometry(mesh.geometry); // or WireframeGeometry( geometry )
		const material = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
		wireframe = new THREE.LineSegments(geometry, material);
		wireframe.material.transparent = true;
		wireframe.material.opacity = 0.1;
		wireframe.material.linewidth = 0.05;
		wireframe.position.x = 4;
		// scene.add(wireframe);

		// const wireframe = new THREE.MeshStandardMaterial();
		// line = new THREE.LineSegments(wireframe);
		// line.material.transparent = true;
		// line.material.depthTest = true;
		// line.material.opacity = 0.05;
		// line.position.x = 4;

		group.add(wireframe);

		// if (isWireframe) group.add(wireframe);
		// if (!isWireframe) group.add(mesh);

		wireframe.rotateY(THREE.MathUtils.degToRad(180));

		// scene.add(new THREE.BoxHelper(group));
		// scene.add(new THREE.BoxHelper(scene));
	});

	group.position.setY(-0.9);
	group.position.setX(-2);

	function showPolarHelper(show: boolean) {
		if (show) scene.add(polarGridHelper);
		else scene.remove(polarGridHelper);
	}

	return {
		group,
		setOpacity,
		showPolarHelper,
		setLineWidth
	};
};
