<script lang="ts">
	import { getSocket } from '$lib/hooks/getSocket';

	import { onMount } from 'svelte';

	import PairState from './PairState.svelte';
	import ThreeDisplay from './ThreeDisplay.svelte';

	// populated with data from the endpoint
	export let roomId;
	export let userId;
	let romId = roomId;

	onMount(() => {
		const socket = getSocket({
			type: 'DESKTOP',
			userId: userId
		});

		socket.emit('join room', roomId);
	});

	// onMount(() => {
	// 	// const user = getUser();
	// 	// user.connection.socket?.emit('join room', {
	// 	// 	roomId,
	// 	// 	userId: user.id
	// 	// });
	// });

	// let qrCanvasContainer: HTMLDivElement;

	// onMount(() => {
	// 	const url = `https://dax.michaelpalladino.io/pair/${id}`;
	// 	const roomId = romId.id;
	// 	QRCode.toCanvas(
	// 		roomId,
	// 		{ errorCorrectionLevel: 'L', margin: 1, width: 350 },
	// 		(err, canvas: HTMLCanvasElement) => {
	// 			console.log(canvas);
	// 			console.log(err);
	// 			// qrCanvas = canvas;
	// 			qrCanvasContainer.appendChild(canvas);
	// 			// qrCanvas.appendChild(canvas);
	// 			// const container = document.getElementById('qr-container');
	// 			// container!.appendChild(canvas);
	// 		}
	// 	);
	// });
</script>

<main>
	<PairState room={roomId} />
	<ThreeDisplay />
</main>

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: black;
	}
	main {
		/* justify-self: center; */
		/* text-align: center; */
		padding: none;
		margin: none;
		/* margin: 0 auto; */
		background-color: transparent;
	}

	a:visited {
		color: blue;
	}

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4rem;
		font-weight: 100;
		line-height: 1.1;
		margin: 2rem auto;
		max-width: 14rem;
	}

	p {
		max-width: 14rem;
		margin: 1rem auto;
		line-height: 1.35;
	}

	@media (min-width: 480px) {
		h1 {
			max-width: none;
		}

		p {
			max-width: none;
		}
	}
</style>
