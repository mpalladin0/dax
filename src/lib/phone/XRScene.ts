import type { DaxSocket } from '$lib/hooks/getSocket';
import { makeSoundMesh } from '$lib/space/sound/makeSoundMesh';
import * as THREE from 'three';
import { PerspectiveCamera, PositionalAudio, Scene, WebGLRenderer } from 'three';

export const createScene = async (renderer: WebGLRenderer, socket: DaxSocket) => {
	const scene = new Scene();

	document.body.style.margin = '0';
	document.body.style.height = '100%';
	document.body.style.overflow = 'hidden';

	let room: string;
	socket.on('controller paired', (roomId: string) => {
		socket.emit('debug', room);
		room = roomId;
	});

	const camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.02, 5000);

	// const boxGeometry = new BoxBufferGeometry(0.00762, 0.16002, 0.077978);
	// const boxMaterial = new MeshBasicMaterial({ color: 0xff0000 });
	const box = await makeSoundMesh(socket);
	box.scale.multiplyScalar(0.5);
	box.position.z = -3;

	// const humanModel = makeHumanModel({ scene, thickness: 0, isWireframe: false });
	// humanModel.showPolarHelper(false);
	// humanModel.group.position.set(0, 0, 0);
	// humanModel.group.scale.multiplyScalar(0.9);
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
		socket.emit('finger tap on', room);
		selected = true;
	}
	function onSelectEnd() {
		socket.emit('finger tap off', room);
		selected = false;
	}

	const listener = new THREE.AudioListener();
	camera.add(listener);

	const sound = new PositionalAudio(listener);
	box.add(sound);

	if (navigator.xr) {
		navigator.xr.isSessionSupported('immersive-ar').then((isSupported) => {
			socket.emit('is phone supported', isSupported);
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
					socket.emit('xr active', room);
					const session = renderer.xr.getSession();

					if (!session) return;
				}
				if (state === false) socket.emit('xr inactive', room);

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

					const position = {
						x: box.position.x,
						y: box.position.y,
						z: box.position.z,
						r_x: box.rotation.x,
						r_y: box.rotation.y,
						r_z: box.rotation.z
					};
					socket.emit('sound placement from controller', { room, position });
				}
			}

			renderer.render(scene, camera);
		}
	}
	// @ts-ignore
	renderer.setAnimationLoop(renderLoop);

	return scene;
};
