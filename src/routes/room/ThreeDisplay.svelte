<script lang="ts">
	import type { Sound } from '$lib/space/sound/Sound';
	import * as THREE from 'three';

	import { Space } from '$lib/space/Space';

	import { getSocket, type DaxSocket } from '$lib/hooks/getSocket';
	import { getUser } from '$lib/hooks/getUser';
	import { onMount } from 'svelte';
	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper.js';
	// import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';
	// @ts-ignore

	let socket: DaxSocket;
	let space: Space, sound: Sound, helper: PositionalAudioHelper;

	onMount(() => {
		socket = getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});
		space = new Space({ socket });
		sound = space.coordinator.get({
			name: 'all_falls_down'
		}) as Sound;

		space.renderLoop();
		helper = new PositionalAudioHelper(sound);
	});

	onMount(() => {
		socket.on('xr active', () => space.mesh.add(helper));
	});

	const origin = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);
	onMount(() => {
		socket.on('sound placement from controller', (position: any) => {
			// console.log(position);
			if (!sound) return;
			newPosition.set(position.x, position.y, position.z);

			const distanceFromOrigin = newPosition.distanceTo(origin);

			if (distanceFromOrigin < 0.1) {
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
	});

	let el;
	onMount(() => {
		const child = space.domElement;
		el.appendChild(child);
	});
</script>

<div id="viewer" bind:this={el} />
