<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';
	import { getSocket } from './hooks/getSocket';

	import { getUser, type User } from './hooks/getUser';
	import { Space } from './space/Space';

	export let roomId;

	const clock = new THREE.Clock();

	// const user = getUser();

	let finishedCountdown = false;
	let timeRemaining = 4;
	let displayRemaining = 4;

	let space: Space, sound, el, user: User;
	onMount(async () => {
		const socket = await getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});
		// user = getUser();
		space = new Space({ socket });
		const child = space.domElement;
		el.appendChild(child);

		space.renderLoop();
	});

	onDestroy(() => {
		const child = space.domElement;
		sound = null;
		el.removeChild(child);
		space = null;

		// connection.socket?.disconnect();
	});
</script>

<div class="viewer" id="viewer" bind:this={el} />

<style>
	.viewer {
		pointer-events: auto;
	}
</style>
