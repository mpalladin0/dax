<script lang="ts">
	import { Space } from '$lib/space/Space';

	import { getSocket } from '$lib/hooks/getSocket';
	import { getUser } from '$lib/hooks/getUser';
	import { onMount } from 'svelte';
	// @ts-ignore

	// let space: Space,
	// let sound: Sound;

	let el;
	onMount(async () => {
		const socket = await getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});
		const space = new Space({ socket });
		// const sound = space.coordinator.get({
		// 	name: 'alright'
		// }) as Sound;

		space.renderLoop();

		// socket.on('xr active', () => space.mesh.add(helper));
		const child = space.domElement;
		el.appendChild(child);
	});
</script>

<div id="viewer" bind:this={el} />
