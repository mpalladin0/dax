<script lang="ts">
	import { goto } from '$app/navigation';
	import * as THREE from 'three';

	import { onMount } from 'svelte';
	import { generateUUID } from 'three/src/math/MathUtils.js';
	import { getConnection } from './utils/getConnection';

	const clock = new THREE.Clock();

	const connection = getConnection();
	// let isPaired = false;

	// connection.socket.on('phone paired to desktop', (socketId: string) => {
	// 	console.log(socketId, 'paired');

	// 	isPaired = true;
	// });

	// let xrActive = false;
	// let phoneSupported = false;

	// connection.socket.on('xr inactive', (socketId: string) => {
	// 	xrActive = false;
	// });

	// connection.socket.on('xr active', (socketId: string) => {
	// 	xrActive = true;
	// 	clock.startTime = 0;
	// 	clock.start();
	// 	countdown();
	// });

	// let fingerOnScreen = false;
	// connection.socket.on('finger on screen', (socketId: string) => {
	// 	fingerOnScreen = true;
	// });
	// connection.socket.on('finger off screen', (socketId: string) => {
	// 	fingerOnScreen = false;
	// });

	// connection.socket.on('is phone supported', (isSupported: boolean) => {
	// 	console.log(isSupported);
	// 	phoneSupported = isSupported;
	// });

	// let finishedCountdown = false;
	// let timeRemaining = 4;
	// let displayRemaining = 4;
	// const countdown = () => {
	// 	const elapsed = clock.getDelta().toPrecision(1);
	// 	timeRemaining = timeRemaining - Number(elapsed);
	// 	if (timeRemaining >= 0) displayRemaining = timeRemaining;
	// 	if (timeRemaining <= 0) {
	// 		displayRemaining = 0;
	// 	}
	// 	if (timeRemaining <= -1) {
	// 		displayRemaining = 0;
	// 		finishedCountdown = true;
	// 		playSound();
	// 		return;
	// 	} else window.requestAnimationFrame(countdown);

	// 	console.log(timeRemaining);
	// };

	// function playSound() {
	// 	connection.socket.emit('play sound');
	// }

	// let connection: Connection;
	let makeRoomId: string;
	let hasRoom: boolean = false;
	let hasRoomId: string;

	onMount(() => {
		// connection = getConnection() as Connection;
		connection.socket?.emit('rooms of user');
		connection.socket?.on('rooms of user', (socketId: string, roomId: string | null) => {
			if (socketId !== connection.socket.id) return;

			if (roomId) {
				hasRoom = true;
				hasRoomId = roomId;
			} else {
				hasRoom = false;
			}
		});

		connection.socket?.on('room created', (id: string) => {
			if (makeRoomId === id) {
				// console.log('Direct me to my room!');

				goto(`/room/${id}`);
			}
		});
	});

	onMount(() => {
		connection.socket?.emit('rooms of user');
		connection.socket?.on('rooms of user', (roomId: string) => {});
	});

	function onMakeRoom() {
		if (hasRoom) {
			// console.log(hasRoomId);
			goto(`/room/${hasRoomId}`);
		} else {
			makeRoomId = generateUUID();
			connection.socket?.emit('create room', makeRoomId);
		}
	}
</script>

<div class="neon-text center" style="pointer-events: none">
	<div class="centered" style="pointer-events: auto;">
		<div class="neon">Welcome to the DAX</div>
		<center>
			<h4 class="tagline" style="color: darkgray; margin-bottom: 2rem; margin-top: -1rem">
				An augmented reality audio controller for spacial audio
			</h4>
			<h4 style="margin-top: 8rem; color: white; margin-bottom: 0%; padding-bottom: 1rem">
				It looks like you're not in a room yet!
			</h4>
			<button class="make-room-btn" on:click={onMakeRoom}>Make a room</button>
			<!-- <h5 style="color: white; margin-bottom: 0%; padding-bottom: 0%">Make a room:</h5>
			<ol style="color: white; max-width: 32rem; h6">
				<li>
					Download <a href="https://apps.apple.com/us/app/webxr-viewer/id1295998056">XR Viewer</a>
					on the Apple App Store.
				</li>
				<li>
					Visit <a href="https://dax.michaelpalladino.io">dax.michaelpalladino.io</a> from within XR
					Viewer.
				</li>
			</ol> -->
			<!-- <hr
				style="background-color: darkgray; max-width: 32rem; border: none; height: 0.067rem; opacity: 30%"
			/>
			<h5 style="color: white; margin-bottom: 0%; padding-bottom: 0%;">Join an existing room:</h5>
			<ol style="color: white; max-width: 32rem;">
				<li>
					Visit <a href="https://dax.michaelpalladino.io/">dax.michaelpalladino.io</a> on your phone.
				</li>
			</ol> -->
		</center>
	</div>

	<svg>
		<defs>
			<filter id="stroke">
				<feMorphology operator="dilate" radius="1" in="SourceGraphic" result="outside" />
				<feMorphology operator="dilate" radius="2" in="outside" result="thickened" />
				<feComposite operator="out" in2="SourceGraphic" in="thickened" result="stroke" />
			</filter>

			<filter id="inner-glow">
				<feFlood flood-color="#e10b8d" />
				<feComposite in2="SourceAlpha" operator="out" />
				<feGaussianBlur stdDeviation="0.5" result="blur" />
				<feComposite operator="atop" in2="SourceGraphic" />
			</filter>

			<filter id="outer-glow">
				<!-- Thicken out the original shape -->
				<feMorphology operator="dilate" radius="1" in="SourceAlpha" result="thicken" />

				<!-- Use a gaussian blur to create the soft blurriness of the glow -->
				<feGaussianBlur in="thicken" stdDeviation="2.5" result="blurred" />

				<!-- Change the colour -->
				<feFlood flood-color="#db0273" result="glowColor" />

				<!-- Color in the glows -->
				<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

				<!--	Layer the effects together -->
				<feMerge>
					<feMergeNode in="softGlow_colored" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>

			<filter id="outer-glow1">
				<!-- Thicken out the original shape -->
				<feMorphology operator="dilate" radius="20" in="SourceAlpha" result="thicken" />

				<!-- Use a gaussian blur to create the soft blurriness of the glow -->
				<feGaussianBlur in="thicken" stdDeviation="25" result="blurred" />

				<!-- Change the colour -->
				<feFlood flood-color="#530139" result="glowColor" />

				<!-- Color in the glows -->
				<feComposite in="glowColor" in2="blurred" operator="in" result="softGlow_colored" />

				<!--	Layer the effects together -->
				<feMerge>
					<feMergeNode in="softGlow_colored" />
					<feMergeNode in="SourceGraphic" />
				</feMerge>
			</filter>
		</defs>
	</svg>
</div>

<style>
	:root {
		background: #000106;
		pointer-events: visible;
	}
	.tagline {
		font-style: italic;
	}
	.make-room-btn {
		background: transparent;
		border-radius: 1rem;
		border: none;
		color: #eeeeee;
		cursor: pointer;
		display: inline-block;
		font-family: sans-serif;
		font-size: 1rem;
		font-weight: bold;
		padding: 1rem;
		padding-left: 5rem;
		padding-right: 5rem;
		text-align: center;
		text-decoration: none;
	}
	@keyframes glowing {
		0% {
			border-color: rgb(0, 72, 255);
			color: rgb(0, 72, 255);
			box-shadow: 0 0 5px rgb(0, 72, 255);
		}
		50% {
			border-color: deepskyblue;
			color: deepskyblue;
			box-shadow: 0 0 20px deepskyblue;
		}
		100% {
			border-color: rgb(0, 72, 255);
			color: rgb(0, 72, 255);
			box-shadow: 0 0 5px rgb(0, 72, 255);
		}
	}
	.make-room-btn {
		animation: glowing 1300ms infinite;
	}
	.make-room-btn:active {
		transform: translateY(4px);
	}

	.center {
		/* border: 5px solid #ffff00; */
		z-index: 99;
		text-align: center;
		position: absolute;
		right: 0;
		left: 0;
		top: 0;
		bottom: auto;
		margin: auto;
	}

	.container {
		/* border: 5px solid blue; */
		position: relative;
		/* position: absolute;
    text-align: center; */
		/* position: absolute;
    display: flex;
    justify-content: center;
    align-items: center;
    border: 3px solid green; */

		/* left: 50%;
    top: 50%; */
		/* text-align: center; */
		/* background: "transparent"; */
		/* margin-bottom: -10%; */
		/* z-index: 99; */
	}

	.neon {
		font-family: 'Neon 80s';
		font-size: 5rem;
		color: #ffedff;
		padding: 30px;
		filter: url(#stroke) url(#inner-glow) url(#outer-glow) url(#outer-glow1);
		background: 'transparent';
	}

	a:visited {
		color: deepskyblue;
	}

	/* .neon {
    font-family: "Neon 80s";
    font-size: 1rem;
    color: #00008b;
    padding: 15px;
    filter: url(#stroke) url(#inner-glow) url(#outer-glow) url(#outer-glow1);
  } */
</style>
