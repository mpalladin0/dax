<script lang="ts">
	import { goto } from '$app/navigation';

	import { onMount } from 'svelte';
	import { generateUUID } from 'three/src/math/MathUtils.js';
	import { getSocket, type DaxSocket } from './hooks/getSocket';
	import { getUser, type User } from './hooks/getUser';

	export let socket: DaxSocket;

	let hasRoom: boolean = false;
	let hasRoomId: string;

	let user: User;

	// let socket: DaxSocket;

	let generatedUUID;
	onMount(async () => {
		socket = await getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});

		generatedUUID = generateUUID();
	});

	async function onMakeRoom() {
		socket.emit(
			'create room',
			{
				roomId: generatedUUID
			},
			async ({ status, message }: { status: string; message: string }) => {
				if (status === 'ok') {
					await goto(`/room/${generatedUUID}`);
				}

				if (status === 'error') {
					if (message === 'user already has a room') {
						socket.emit(
							'leave room',
							async ({ status, message }: { status: string; message: string }) => {
								if (status === 'ok') {
									onMakeRoom();
								} else {
									throw new Error(status + ' ' + message);
								}
							}
						);
					}
					console.log('[Error] ', message);
				}
			}
		);
	}

	onMount(async () => {
		const socket = await getSocket({
			type: 'DESKTOP',
			userId: getUser().id
		});

		console.log('Resolved', socket);
	});
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
