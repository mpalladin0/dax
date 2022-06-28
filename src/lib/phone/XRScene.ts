import { makeHumanModel } from '$lib/space/makeHumanModel';
import { makeSoundMesh } from '$lib/space/sound/makeSoundMesh';
import * as THREE from 'three';
import {
	BoxBufferGeometry,
	MeshBasicMaterial,
	PerspectiveCamera,
	PositionalAudio,
	Scene,
	WebGLRenderer
} from 'three';
import type { Connection } from '../Connection';

export const createScene = (renderer: WebGLRenderer, connection: Connection) => {
	const scene = new Scene();

	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 5000);

	const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
	const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
	const box = makeSoundMesh();
	box.scale.multiplyScalar(0.5);
	box.position.z = -3;

	const humanModel = makeHumanModel({ scene, thickness: 0, isWireframe: false });
	humanModel.showPolarHelper(false);
	humanModel.group.position.set(0, 0, 0);
	humanModel.group.scale.multiplyScalar(0.9);
	// humanModel.setOpacity(1);
	// humanModel.setLineWidth(1);

	// humanModel.setOpacity(1);

	// const testButton = docufment.createElement("button");
	// testButton.innerText = "Testing";
	// document.body.appendChild(testButton);

	let selected = false;

	scene.add(box);

	const controllers: THREE.XRTargetRaySpace[] = [];

	for (let i = 0; i < 10; i++) {
		const controller = renderer.xr.getController(i);
		scene.add(controller);

		controller.addEventListener('selectstart', onSelectStart);
		controller.addEventListener('selectend', onSelectEnd);

		// @ts-ignore
		controllers.push(controller);
	}

	function onSelectStart() {
		connection.socket?.emit('finger tap on');
		selected = true;
	}
	function onSelectEnd() {
		connection.socket?.emit('finger tap off');
		selected = false;
	}

	const listener = new THREE.AudioListener();
	camera.add(listener);

	const sound = new PositionalAudio(listener);
	box.add(sound);

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

				if (state === true) {
					connection.socket.emit('xr active');
					const session = renderer.xr.getSession();

					if (!session) return;

					// connection.socket?.emit('debug', controllers);

					// const gamePads = navigator.getGamepads();
					// connection.socket?.emit('debug', gamePads);

					// onSessionStarted(session);

					// session.inputSources.forEach((entry) => {
					// 	connection.socket?.emit('deug', entry);
					// });

					// const controller = renderer.xr.getControllerGrip(0);
					// scene.add(controller);

					// session.addEventListener('inputsourceschange', (e) => {
					// 	connection.socket?.emit('debug', e.added);
					// });

					// controller.addEventListener('selectstart', () => {
					// 	connection.socket.emit('finger tap on');
					// 	selected = true;
					// });

					// controller.addEventListener('selectend', () => {
					// 	connection.socket.emit('finger tap off');
					// 	selected = false;
					// });

					// connection.socket?.emit('debug', session.inputSources);

					// connection.socket?.emit('debug', renderer.xr.getController(1));

					// session.inputSources.forEach((source) => {
					// 	connection.socket?.emit('debug', source);
					// });

					// session.addEventListener('selectstart', () => {
					// 	connection.socket?.emit('finger tap on');
					// });

					// session.addEventListener('selectend', () => {
					// 	connection.socket?.emit('finger tap off');
					// });

					// session.onselectstart = (e) => {
					// 	connection.socket?.emit('finger tap off');
					// };

					// session.onselectend = (e) => {
					// 	connection.socket?.emit('finger tap off');
					// };
				}
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
				for (const controller of controllers) {
					if (!controller.position.x) continue;
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
				// controllers.forEach((controller) => {

				// });

				// connection.socket.emit('sound placement from controller', boxPositionPaylaod);
			}

			renderer.render(scene, camera);
		}
	}
	// @ts-ignore
	renderer.setAnimationLoop(renderLoop);

	return scene;
};
