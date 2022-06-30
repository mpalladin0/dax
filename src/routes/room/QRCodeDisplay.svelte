<script lang="ts">
	import { onMount } from 'svelte';

	export let roomId: string;
	export let width: number = 360;

	const generate = () => {};

	onMount(() => {});
</script>

<div class="qr-code" />
<p>Room {roomId}</p>

<style>
	.qr-code {
		width: width;
	}
</style>
