<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { WebGLRenderer } from 'three';
	import { ARButton } from 'three/examples/jsm/webxr/ARButton.js';
	import { getSocket, type DaxSocket } from './hooks/getSocket';
	import { getUser } from './hooks/getUser';
	import { createScene } from './phone/XRScene';

	const { devicePixelRatio, innerHeight, innerWidth } = window;
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);
	renderer.xr.enabled = true;

	let html5QrCode: Html5Qrcode;
	const config = { fps: 10, qrbox: { width: 250, height: 250 } };

	let socket: DaxSocket;
	onMount(async () => {
		socket = await getSocket({
			type: 'CONTROLLER',
			userId: getUser().id
		});

		socket.emit('debug', 'Controller connected.');

		html5QrCode = new Html5Qrcode('reader');
		const overlay = document.getElementById('viewer-overlay');
		overlay.style.display = 'none';
		rendererEl.appendChild(renderer.domElement);
		await createScene(renderer, socket);
		rendererEl.appendChild(arButton);
	});

	function onScanSuccess(rendered, decoded) {
		const room = decoded.decodedText;

		if (room === undefined) return;
		socket.emit(
			'pair controller to room',
			room,
			({
				status,
				message,
				context
			}: {
				status: string;
				message: string;
				context: {
					roomId: string;
				};
			}) => {
				if (status === 'ok') {
					socket.emit('debug', `[Controller -- Pair Success] ${context.roomId}`);
				}

				if (status === 'error') {
					socket.emit('debug', message);
				}
			}
		);
	}
	function onScanFail() {}

	function startScanner() {
		html5QrCode
			.start({ facingMode: { exact: 'environment' } }, config, onScanSuccess, onScanFail)
			.then(() => {
				socket.emit('debug', '[Controller] Scanner started');
				socket.on('controller paired', async (roomId: string) => {
					await html5QrCode.stop().then(() => {
						html5QrCode.clear();
						// paired = true
					});
					socket.emit('debug', `[Controller] Paired to room: ${roomId}`);
					const overlay = document.getElementById('viewer-overlay');
					overlay.style.display = 'block';
					paired = true;
					return;
				});

				// socket?.on('controller paired', async () => {
				// 	await html5QrCode.stop().then(() => {
				// 		html5QrCode.clear();
				// 		paired = true;
				// 	});
				// 	// connection.socket?.emit('debug', 'controller paired!');
				// 	const overlay = document.getElementById('viewer-overlay');
				// 	overlay.style.display = 'block';

				// 	paired = true;

				// 	return;
				// });

				// connection.socket?.on('controller disconnected', async () => {
				// 	paired = false;
				// 	const overlay = document.getElementById('viewer-overlay');
				// 	overlay.style.display = 'none';
				// });
			});
	}

	let videoEl;
	let paired = false;

	const arButton = ARButton.createButton(renderer, {
		requiredFeatures: ['hit-test'],
		domOverlay: {
			root: document.getElementById('viewer-overlay') as HTMLElement
		}
	});

	let rendererEl: HTMLDivElement;
</script>

<div id="viewer-overlay">
	<div id="viewer" bind:this={rendererEl} />
</div>

{#if !paired}
	<div style="color: transparent">
		<div id="reader" width="600px" />
		<button on:click={startScanner}>Pair</button>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
		<h1>Not paired</h1>
	</div>
{/if}
