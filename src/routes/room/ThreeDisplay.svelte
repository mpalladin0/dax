<script lang="ts">
	import type { Sound } from '$lib/space/sound/Sound';
	import * as THREE from 'three';

	import { Space } from '$lib/space/Space';

	import { getSocket } from '$lib/hooks/getSocket';
	import { getUser } from '$lib/hooks/getUser';
	import { onMount } from 'svelte';
	import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';
	// import { PositionalAudioHelper } from 'three/examples/jsm/helpers/PositionalAudioHelper';
	// @ts-ignore

	const origin = new THREE.Vector3(0, 0, 0);
	const newPosition = new THREE.Vector3(0, 0, 0);

	let space: Space, sound: Sound, helper: PositionalAudioHelper;

	let el;
	onMount(async () => {
		const socket = await getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});
		space = new Space({ socket });
		sound = space.coordinator.get({
			name: 'all_falls_down'
		}) as Sound;

		const helper = new PositionalAudioHelper(sound);

		socket.on('xr active', () => {
			space.mesh.add(helper);
		});

		space.renderLoop();

		socket.on('xr active', () => space.mesh.add(helper));
		const child = space.domElement;
		el.appendChild(child);
	});
</script>

<div id="viewer" bind:this={el} />
