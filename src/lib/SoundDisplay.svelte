<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import type { PositionalAudio } from 'three';
	import * as THREE from 'three';

	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
	import { Space } from './space/Space';
	import { getConnection } from './utils/getConnection';

	const clock = new THREE.Clock();

	const connection = getConnection();

	let space, sound, helper, el;
	onMount(() => {
		space = new Space({ connection });
		sound = space.coordinator.get({
			name: 'alright'
		});
		helper = new PositionalAudioHelper(sound as unknown as PositionalAudio);
	});

	const origin = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);

	connection.socket.on('sound placement from controller', (position: any) => {
		// console.log(position);
		// if (!sound) throw new Error('Sound not found.');
		// console.log(position);
		// newPosition.set(position.x, position.y, position.z);
		// const distanceFromOrigin = newPosition.distanceTo(origin);
		// if (distanceFromOrigin < 0.1) {
		// 	space.mesh.position.x = 0;
		// 	space.mesh.position.y = 0;
		// 	space.mesh.position.z = 0;
		// 	sound.setDirectionalCone(360, 360, 0.1);
		// 	//   space.camera.position.x = 0;
		// 	//   space.camera.position.y = 0;
		// 	//   space.camera.position.z = 0;
		// } else {
		// 	space.mesh.position.x = position.x * 10;
		// 	space.mesh.position.y = position.y * 10;
		// 	space.mesh.position.z = position.z * 10;
		// 	sound.setDirectionalCone(90, 120, 0.1);
		// }
		// space.mesh.lookAt(origin);
		// space.light.lookAt(origin);
		// helper.update();
	});

	// connection.socket.on('phone paired to desktop', (socketId: string) => {
	// 	console.log(socketId, 'paired');

	// 	isPaired = true;
	// });

	let xrActive = false;
	let phoneSupported = false;

	connection.socket.on('xr inactive', (socketId: string) => {
		xrActive = false;
	});

	connection.socket.on('xr active', (socketId: string) => {
		xrActive = true;
		clock.startTime = 0;
		clock.start();
		countdown();
	});

	// let fingerOnScreen = false;
	// connection.socket.on('finger on screen', (socketId: string) => {
	// 	fingerOnScreen = true;
	// });
	// connection.socket.on('finger off screen', (socketId: string) => {
	// 	fingerOnScreen = false;
	// });

	// connection.socket.on('is phone supported', (isSupported: boolean) => {
	// 	console.log(isSupported);
	// 	phoneSupported = isSupported;
	// });

	let finishedCountdown = false;
	let timeRemaining = 4;
	let displayRemaining = 4;
	const countdown = () => {
		const elapsed = clock.getDelta().toPrecision(1);
		timeRemaining = timeRemaining - Number(elapsed);
		if (timeRemaining >= 0) displayRemaining = timeRemaining;
		if (timeRemaining <= 0) {
			displayRemaining = 0;
		}
		if (timeRemaining <= -1) {
			displayRemaining = 0;
			finishedCountdown = true;
			playSound();
			return;
		} else window.requestAnimationFrame(countdown);

		// console.log(timeRemaining);
	};

	function playSound() {
		connection.socket.emit('play sound');
	}

	onMount(() => {
		const child = space.domElement;
		el.appendChild(child);

		space.renderLoop();
	});

	onDestroy(() => {
		const child = space.domElement;
		sound = null;
		el.removeChild(child);
		space = null;

		connection.socket?.disconnect();
	});
</script>

<div class="viewer" id="viewer" bind:this={el} />

<style>
	.viewer {
		pointer-events: auto;
	}
</style>
