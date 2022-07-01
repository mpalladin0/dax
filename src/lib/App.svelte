<script lang="ts">
	import { browser } from '$app/env';

	import { onMount } from 'svelte';

	import PairDisplay from '../lib/PairDisplay.svelte';
	import SoundDisplay from '../lib/SoundDisplay.svelte';
	import { getSocket, type DaxSocket } from './hooks/getSocket';
	import { getUser } from './hooks/getUser';
	import MakeOrJoinRoom from './MakeOrJoinRoom.svelte';

	function isMobile() {
		if (!browser) return false;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		) {
			return true;
		} else return false;
	}

	function isDesktop() {
		if (!browser) return false;
		if (
			/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
		) {
			return false;
		} else return true;
	}

	onMount(() => {
		if (isDesktop()) {
			document.body.style.backgroundColor = 'black';
		}
	});

	let socket: DaxSocket;
	onMount(async () => {
		if (isDesktop()) {
			socket = await getSocket({
				type: 'DESKTOP',
				userId: getUser().id
			});
		}

		if (isMobile()) {
			socket = await getSocket({
				type: 'PHONE',
				userId: getUser().id
			});
		}
	});
</script>

{#if isDesktop()}
	<main>
		<MakeOrJoinRoom {socket} />
		<SoundDisplay {socket} />
		<!-- 
    <p>
      Visit <a href="https://svelte.dev">svelte.dev</a> to learn how to build Svelte
      apps.
    </p>

    <p>
      Check out <a href="https://github.com/sveltejs/kit#readme">SvelteKit</a>
      for the officially supported framework, also powered by Vite!
    </p> -->
	</main>
{/if}

{#if isMobile()}
	<main>
		<PairDisplay />
	</main>
{/if}

<style>
	:root {
		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell,
			'Open Sans', 'Helvetica Neue', sans-serif;
		background-color: transparent;
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
