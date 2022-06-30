<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import * as THREE from 'three';

	import { getSocket, type DaxSocket } from './hooks/getSocket';
	import { getUser, type User } from './hooks/getUser';
	import { Space } from './space/Space';
	import { getConnection } from './utils/getConnection';

	export let roomId;

	const clock = new THREE.Clock();

	const connection = getConnection();
	// const user = getUser();

	let socket: DaxSocket;
	let finishedCountdown = false;
	let timeRemaining = 4;
	let displayRemaining = 4;

	let space: Space, sound, el, user: User;
	onMount(() => {
		user = getUser();

		socket = getSocket({
			userId: user.id,
			type: 'DESKTOP'
		});
		space = new Space({ socket });
	});

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

		// connection.socket?.disconnect();
	});
</script>

<div class="viewer" id="viewer" bind:this={el} />

<style>
	.viewer {
		pointer-events: auto;
	}
</style>
