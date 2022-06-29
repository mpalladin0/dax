<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { WebGLRenderer } from 'three';
	import { ARButton } from 'three/examples/jsm/webxr/ARButton';
	import { createScene } from './phone/XRScene';
	import { getConnection } from './utils/getConnection';

	const connection = getConnection();

	const { devicePixelRatio, innerHeight, innerWidth } = window;
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);
	renderer.xr.enabled = true;

	let html5QrCode: Html5Qrcode;
	const config = { fps: 10, qrbox: { width: 250, height: 250 } };

	onMount(() => {
		html5QrCode = new Html5Qrcode('reader');
	});

	function onScanSuccess(rendered, decoded) {
		const room = decoded.decodedText;
		connection.socket?.emit('pair controller to room', room);
	}
	function onScanFail() {}

	function startScanner() {
		html5QrCode
			.start({ facingMode: { exact: 'environment' } }, config, onScanSuccess, onScanFail)
			.then(() => {
				connection.socket?.emit('debug', 'Scanner started');

				connection.socket?.on('controller paired', async () => {
					await html5QrCode.stop().then(() => {
						html5QrCode.clear();
						paired = true;
					});
					connection.socket?.emit('debug', 'controller paired!');
					const overlay = document.getElementById('viewer-overlay');
					overlay.style.display = 'block';

					paired = true;
				});
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
	onMount(() => {
		const overlay = document.getElementById('viewer-overlay');
		overlay.style.display = 'none';
		rendererEl.appendChild(renderer.domElement);
		createScene(renderer, connection);
		rendererEl.appendChild(arButton);
	});
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
