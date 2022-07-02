<script lang="ts">
	import { getSocket, type DaxSocket } from '$lib/hooks/getSocket';
	import { getUser } from '$lib/hooks/getUser';

	import { onMount } from 'svelte';

	import type { WebGLRenderer } from 'three';

	export let renderer: WebGLRenderer;

	let xrSessionIsGranted: boolean = false;
	let socket: DaxSocket;
	onMount(async () => {
		socket = await getSocket({
			type: 'CONTROLLER',
			userId: getUser().id
		});

		// socket.on('buffer loaded', (isLoaded: boolean) => {
		// 	socket.emit('debug', `Buffer loaded::: ${isLoaded}`);
		// });

		// function checkBufferLoaded() {
		// 	socket.emit('is buffer loaded', (isLoaded: boolean) => {
		// 		if (isLoaded === false) {
		// 			setTimeout(checkBufferLoaded, 1000);
		// 		} else {
		// 			bufferLoaded = true;
		// 		}
		// 	});
		// }
	});

	let currentSession: XRSession | null;
	async function onSessionStarted(session) {
		session.addEventListener('end', onSessionEnded);
		await renderer.xr.setSession(session);
		// button.textContent = 'EXIT VR';
		currentSession = session;
	}

	function onSessionEnded(/*event*/) {
		if (!currentSession) return;
		currentSession.removeEventListener('end', onSessionEnded);
		currentSession = null;
	}

	function registerSessionGrantedListener() {
		if (navigator.xr) {
			if ('xr' in navigator) {
				// WebXRViewer (based on Firefox) has a bug where addEventListener
				// throws a silent exception and aborts execution entirely.
				if (/WebXRViewer\//i.test(navigator.userAgent)) return;
				navigator.xr.addEventListener('sessiongranted', () => {
					xrSessionIsGranted = true;
				});
			}
		}
	}

	async function requestSession() {
		if (navigator.xr) {
			let session: XRSession;
			try {
				session = await navigator.xr.requestSession('immersive-ar', {
					requiredFeatures: ['hit-test'],
					optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking', 'layers']
				});

				return session;
			} catch (err) {
				socket.emit('debug', `"Error requesting session: ${err}`);
			}
		}
	}

	async function activateXR() {
		registerSessionGrantedListener();
		socket.emit('debug', 'Activating XR');
		const session = await requestSession();
		renderer.xr.setSession(session!);
		onSessionStarted(session);
	}

	let bufferLoaded = false;
</script>

<div class="container">
	{#if !bufferLoaded}
		<button class="start-session-button loading-buffer">Loading...</button>
	{/if}

	{#if bufferLoaded}
		<button class="start-session-button loading-buffer" on:click={() => activateXR()}
			>Begin Experience</button
		>
	{/if}
</div>

<style>
	.container {
		margin: 1rem;
		text-align: center;
	}

	.loading-buffer {
		opacity: 50%;
	}
	.start-session-button {
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
</style>
