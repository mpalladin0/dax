<script lang="ts" type="module">
	import { onMount } from 'svelte';
	import type { PositionalAudio } from 'three';
	import * as THREE from 'three';

	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
	import { Space } from './space/Space';
	import { getConnection } from './utils/getConnection';

	const connection = getConnection();
	const space = new Space({ connection });

	const sound = space.coordinator.get({
		name: 'alright'
	});

	const helper = new PositionalAudioHelper(sound as unknown as PositionalAudio);

	//   const start_button = document.createElement("button");
	//   start_button.innerText = "Start";
	//   document.body.appendChild(start_button);
	//   start_button.onclick = (e) => {
	//     sound.play();
	//   };

	const origin = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);

	connection.socket.on('sound placement from server', (position: any) => {
		if (!sound) throw new Error('Sound not found.');
		console.log(position);
		newPosition.set(position.x, position.y, position.z);
		// const newPosition = new THREE.Vector3(position.x, position.y, position.z);

		const distanceFromOrigin = newPosition.distanceTo(origin);

		if (distanceFromOrigin < 0.1) {
			//     // sound.posotion.x = position.x * 10
			space.mesh.position.x = 0;
			space.mesh.position.y = 0;
			space.mesh.position.z = 0;
			sound.setDirectionalCone(360, 360, 0.1);

			//   space.camera.position.x = 0;
			//   space.camera.position.y = 0;
			//   space.camera.position.z = 0;
		} else {
			space.mesh.position.x = position.x * 10;
			space.mesh.position.y = position.y * 10;
			space.mesh.position.z = position.z * 10;
			sound.setDirectionalCone(90, 120, 0.1);
		}

		space.mesh.lookAt(origin);
		space.light.lookAt(origin);
		helper.update();
	});

	const clock = new THREE.Clock();

	connection.socket.on('xr active', (socketId: string) => {
		space.orbit.autoRotate = false;
		space.mesh.add(helper);
		countdown();
	});

	function countdown() {
		if (clock.elapsedTime === 3 && clock.running) {
		}
		if (clock.elapsedTime === 2 && clock.running) {
		}
		if (clock.elapsedTime === 1 && clock.running) {
		}
		if (clock.elapsedTime == 0 && clock.running) {
			clock.stop();
			countdown();
		}
	}

	let el;

	onMount(() => {
		const child = space.domElement;
		// console.log(child);
		el.appendChild(child);
		// space.renderLoop();

		space.renderLoop();
	});

	//   onDestroy(() => {
	//     el.removeChild(child);
	//     child = null;
	//   });
</script>

<!-- <div bind:this={el} /> -->
<div class="viewer" id="viewer" bind:this={el} />

<style>
	.viewer {
		pointer-events: auto;
	}
</style>
