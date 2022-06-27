import * as THREE from 'three';
import {
	BoxBufferGeometry,
	Mesh,
	MeshBasicMaterial,
	PerspectiveCamera,
	PositionalAudio,
	Scene,
	WebGLRenderer
} from 'three';
import type { Connection } from '../Connection';

export function createScene(renderer: WebGLRenderer, connection: Connection) {
	const scene = new Scene();

	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 5000);

	const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
	const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
	const box = new Mesh(boxGeometry, boxMaterial);
	box.position.z = -3;

	// const testButton = document.createElement("button");
	// testButton.innerText = "Testing";
	// document.body.appendChild(testButton);

	scene.add(box);

	const controller = renderer.xr.getController(1);
	scene.add(controller);

	const listener = new THREE.AudioListener();
	camera.add(listener);

	const sound = new PositionalAudio(listener);
	box.add(sound);

	// let r_x = 0;
	// let r_y = 0;
	// let r_z = 0;

	// window.addEventListener('deviceorientation', (e) => {
	//     r_x = THREE.MathUtils.degToRad(e.alpha)
	//     r_y = THREE.MathUtils.degToRad(e.beta)
	//     r_z = THREE.MathUtils.degToRad(e.gamma)
	// })

	let selected = false;

	controller.addEventListener('selectstart', () => {
		connection.socket.emit('finger tap on');
		selected = true;
	});

	controller.addEventListener('selectend', () => {
		connection.socket.emit('finger tap off');
		selected = false;
	});

	if (navigator.xr) {
		navigator.xr.isSessionSupported('immersive-ar').then((isSupported) => {
			connection.socket.emit('is phone supported', isSupported);
		});
	}

	const memoPresentationState = () => {
		let cache = {};

		return (n) => {
			if (n in cache) {
				return cache[n];
			} else {
				let state = renderer.xr.isPresenting;
				cache[n] = state;

				if (state === true) connection.socket.emit('xr active');
				if (state === false) connection.socket.emit('xr inactive');

				return state;
			}
		};
	};

	const isPresenting = memoPresentationState();

	// // Render loop
	function renderLoop(timestamp: number, frame?: XRFrame) {
		isPresenting(renderer.xr.isPresenting);
		// box.rotation.y += 0.01;
		// box.rotation.x += 0.01;

		// Only render content if XR view is presenting.
		if (renderer.xr.isPresenting) {
			if (selected) {
				box.position.x = controller.position.x;
				box.position.y = controller.position.y;
				box.position.z = controller.position.z;

				////
				box.rotation.x = controller.rotation.x;
				box.rotation.y = controller.rotation.y;
				box.rotation.z = controller.rotation.z;

				const boxPositionPaylaod = {
					x: box.position.x,
					y: box.position.y,
					z: box.position.z,
					r_x: box.rotation.x,
					r_y: box.rotation.y,
					r_z: box.rotation.z
				};

				connection.socket.emit('sound placement from controller', boxPositionPaylaod);
			}

			renderer.render(scene, camera);
		}
	}
	// @ts-ignore
	renderer.setAnimationLoop(renderLoop);

	return scene;
}
