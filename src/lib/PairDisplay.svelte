<script lang="ts">
	import { Html5Qrcode } from 'html5-qrcode';
	import { onMount } from 'svelte';
	import { WebGLRenderer } from 'three';
	// import WebXRPolyfill from 'webxr-polyfill.js';
	import { getSocket, type DaxSocket } from './hooks/getSocket';
	import { getUser } from './hooks/getUser';
	import { createScene } from './phone/XRScene';
	import { ARButton } from './utils/ARButton';
	import XrButton from './utils/XRButton.svelte';

	const { devicePixelRatio, innerHeight, innerWidth } = window;
	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);
	renderer.xr.enabled = true;

	let html5QrCode: Html5Qrcode;
	const config = { fps: 10, qrbox: { width: 250, height: 250 } };

	let socketReady = false;
	let socket: DaxSocket;
	let arButton;
	onMount(async () => {
		const rendererEl = document.getElementById('renderer')!;
		rendererEl.style.display = 'none';
		const pairedEl = document.getElementById('paired')!;
		pairedEl.style.display = 'none';

		socket = await getSocket({
			type: 'CONTROLLER',
			userId: getUser().id
		});

		socketReady = true;
		await createScene(renderer, socket);

		ARButton.registerSessionGrantedListener();
		// arButton = ARButton.createButton(renderer, {
		// 	requiredFeatures: ['hit-test'],
		// 	domOverlay: {
		// 		root: rendererEl
		// 	}
		// });

		socket.emit('debug', 'Controller connected.');

		html5QrCode = new Html5Qrcode('not-paired');
		// const overlay = document.getElementById('viewer-overlay');
		// overlay.style.display = 'none';
		rendererEl.appendChild(renderer.domElement);
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

	// function startScanner() {
	// 	html5QrCode
	// 		.start({ facingMode: { exact: 'environment' } }, config, onScanSuccess, onScanFail)
	// 		.then(() => {
	// 			socket.emit('debug', '[Controller] Scanner started');
	// 			socket.on('controller paired', async (roomId: string) => {
	// 				await html5QrCode.stop().then(() => {
	// 					html5QrCode.clear();
	// 					// paired = true
	// 				});
	// 				socket.emit('debug', `[Controller] Paired to room: ${roomId}`);
	// 				const overlay = document.getElementById('viewer-overlay');
	// 				overlay.style.display = 'block';
	// 				paired = true;
	// 				return;
	// 			});
	// 		});
	// }

	async function startScanner() {
		socket.emit('debug', 'Starting scanner');

		// return resolve(null);
		await html5QrCode
			.start({ facingMode: { exact: 'environment' } }, config, onScanSuccess, onScanFail)
			.then(() => {
				socket.emit('debug', '[Controller] Scanner started');
				socket.on('controller paired', async (roomId: string) => {
					await html5QrCode.stop();
					socket.emit('debug', `[Controller] Paired to room: ${roomId}`);
					const notPairedEl = document.getElementById('reader')!;
					notPairedEl.style.display = 'none';

					const pairedEl = document.getElementById('paired')!;
					pairedEl.style.display = 'inline';

					const rendererEl = document.getElementById('renderer')!;
					rendererEl.style.display = 'inline';
					// resolve(true);
				});
			});
	}

	async function activateXR() {
		let session: XRSession;
		let localReferenceSpace: XRReferenceSpace;
		let viewerSpace: XRReferenceSpace;

		try {
			session = await xr.requestSession('immersive-ar', {
				requiredFeatures: ['hit-test']
			});

			localReferenceSpace = await session.requestReferenceSpace('local');
			viewerSpace = await session.requestReferenceSpace('viewer');
			renderer.xr.setSession(session);
			renderer.xr.setReferenceSpace(viewerSpace);

			await createScene(renderer, socket, session, viewerSpace, localReferenceSpace);
		} catch (err) {
			socket.emit('debug', err);
		}
	}

	// let session: XRSession;
	// let gl: WebGLRenderingContext | WebGL2RenderingContext;
	// async function createImmersiveSession(xr: XRSystem): Promise<XRSession> {
	// 	try {
	// 		session = await xr.requestSession('immersive-ar', {
	// 			requiredFeatures: ['hit-test']
	// 		});
	// 		return session;
	// 	} catch (error) {
	// 		throw error;
	// 	}
	// }

	// async function beginSession() {
	// 	const session = await createImmersiveSession(xr);
	// 	gl = renderer.getContext();

	// 	session.updateRenderState({
	// 		baseLayer: new XRWebGLLayer(session, gl)
	// 	});

	// 	const referenceSpace = await session.requestReferenceSpace('local');
	// 	try {
	// 		await renderer.xr.setSession(session);
	// 		renderer.xr.setReferenceSpace(referenceSpace);
	// 	} catch (err) {
	// 		socket.emit('debug', err);
	// 	}

	// 	session.requestAnimationFrame(onXRFrame);

	// 	socket.emit('xr active');
	// }

	let xr: XRSystem;
	let xrSupported = false;
	onMount(async () => {
		xr = navigator.xr!;
		xrSupported = await xr.isSessionSupported('immersive-ar');
	});

	// let rendererEl: HTMLDivElement;
</script>

<div id="reader" width="100%" />
<div class="pairing" id="not-paired">
	<h1>Welcome to the DAX Controller.</h1>
	<p>After pairing, use your controller (this phone) to move the sound around spacially.</p>
	<p>Wherever your phone is, that's where the sound will appear to come from!</p>
	{#if socketReady}
		<h3 color="black">Pair your phone to continue.</h3>
		<button class="pairing-button" on:click={startScanner}> Start Pairing </button>
	{:else}
		<h3 color="black">Pair your phone to continue.</h3>
		<button class="pairing-button not-connected" on:click={startScanner}>Connecting... </button>
	{/if}
</div>
<div class="pairing" id="paired">
	<h1 color="black">Paired to room.</h1>
	<p>Your phone is now paired to the room.</p>
	<h3>Click "Start AR" to begin experience.</h3>
	{#if xrSupported}
		<XrButton {renderer} />
	{/if}
	<div id="renderer" />
</div>

<style>
	.pairing {
		margin: 1rem;
		text-align: center;
	}
	.pairing-button {
		display: block;
		width: 100%;
		border: none;
		background-color: deepskyblue;
		color: white;
		padding: 14px 28px;
		font-size: 16px;
		cursor: pointer;
		text-align: center;
		border-radius: 1rem;
		padding: 1rem;
	}

	.not-connected {
		opacity: 50%;
		cursor: not-allowed;
	}
</style>
