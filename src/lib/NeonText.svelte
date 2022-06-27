<script lang="ts">
	import * as THREE from 'three';
	import { getConnection } from './utils/getConnection';

	const clock = new THREE.Clock();

	const connection = getConnection();
	let isPaired = false;

	connection.socket.on('phone paired to desktop', (socketId: string) => {
		console.log(socketId, 'paired');

		isPaired = true;
	});

	let xrActive = false;
	let phoneSupported = false;

	connection.socket.on('xr inactive', (socketId: string) => {
		xrActive = false;
	});

	connection.socket.on('xr active', (socketId: string) => {
		xrActive = true;
		clock.startTime = 0;
		clock.start();
		countdown();
	});

	let fingerOnScreen = false;
	connection.socket.on('finger on screen', (socketId: string) => {
		fingerOnScreen = true;
	});
	connection.socket.on('finger off screen', (socketId: string) => {
		fingerOnScreen = false;
	});

	connection.socket.on('is phone supported', (isSupported: boolean) => {
		console.log(isSupported);
		phoneSupported = isSupported;
	});

	let finishedCountdown = false;
	let timeRemaining = 4;
	let displayRemaining = 4;
	const countdown = () => {
		// if (clock.elapsedTime === 0) timeRemaining = 3;
		// if (clock.elapsedTime === 1) timeRemaining = 2;
		// if (clock.elapsedTime === 2) timeRemaining = 1;
		// if (clock.elapsedTime === 3) {
		//   timeRemaining = 0;
		//   clock.stop();
		//   return;
		// }
		const elapsed = clock.getDelta().toPrecision(1);
		timeRemaining = timeRemaining - Number(elapsed);
		if (timeRemaining >= 0) displayRemaining = timeRemaining;
		if (timeRemaining <= 0) {
			displayRemaining = 0;
		}
		if (timeRemaining <= -1) {
			displayRemaining = 0;
			finishedCountdown = true;
			playSound();
			return;
		} else window.requestAnimationFrame(countdown);

		console.log(timeRemaining);
	};

	function playSound() {
		connection.socket.emit('play sound');
	}
</script>

<div class="neon-text center" style="pointer-events: none">
	<div class="centered" style="pointer-events: auto;">
		{#if isPaired}
			{#if phoneSupported}
				{#if xrActive}
					{#if finishedCountdown}
						{#if fingerOnScreen}
							<div class="neon">Moving sound!</div>
							<h5 style="color: white">Lift thumb off screen to stop.</h5>
						{/if}

						{#if !fingerOnScreen}
							<div class="neon">Rest thumb on phone screen</div>
							<h5 style="color: white">Now Playing "Alright" by Travis Scott</h5>
						{/if}
					{/if}
					{#if !finishedCountdown}
						<div class="neon">Starting in {displayRemaining.toFixed(0)}</div>
					{/if}
				{/if}

				{#if !xrActive}
					<div class="neon">Ready</div>
					<h5 style="color: white">Click "Start AR" on your phone.</h5>
				{/if}
			{/if}

			{#if !phoneSupported}
				<div class="neon">Using an iPhone?</div>
				<center>
					<h5 style="color: white; margin-bottom: 0%; padding-bottom: 0%">Pair your iPhone:</h5>
					<ol style="color: white; max-width: 32rem; h6">
						<li>
							Download <a href="https://apps.apple.com/us/app/webxr-viewer/id1295998056"
								>XR Viewer</a
							>
							on the Apple App Store.
						</li>
						<li>
							Visit <a href="https://dax.michaelpalladino.io">dax.michaelpalladino.io</a> from within
							XR Viewer.
						</li>
					</ol>
					<p style="color: darkgray; font-size: 0.67em">
						Safari on iOS doesn't support AR yet, so downloading XR Viewer is required for now.
					</p>
				</center>
			{/if}
		{/if}

		{#if !isPaired}
			<div class="neon">Waiting to pair..</div>
			<center>
				<h5 style="color: white; margin-bottom: 0%; padding-bottom: 0%">Pair your iPhone:</h5>
				<ol style="color: white; max-width: 32rem; h6">
					<li>
						Download <a href="https://apps.apple.com/us/app/webxr-viewer/id1295998056">XR Viewer</a>
						on the Apple App Store.
					</li>
					<li>
						Visit <a href="https://dax.michaelpalladino.io">dax.michaelpalladino.io</a> from within XR
						Viewer.
					</li>
				</ol>
				<p style="color: darkgray; font-size: 0.67em">
					Safari on iOS doesn't support AR yet, so downloading XR Viewer is required for now.
				</p>
				<h5 style="color: white; margin-bottom: 0%; padding-bottom: 0%">Pair your Android:</h5>
				<ol style="color: white; max-width: 32rem;">
					<li>
						Visit <a href="https://dax.michaelpalladino.io/">dax.michaelpalladino.io</a> on your phone.
					</li>
				</ol>
			</center>
		{/if}
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
