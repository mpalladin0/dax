<script lang="ts">
	import { onMount } from 'svelte';

	import { Connection } from '../lib/Connection';

	import NeonText from '../lib/NeonText.svelte';
	import PairDisplay from '../lib/PairDisplay.svelte';
	import SoundDisplay from '../lib/SoundDisplay.svelte';

	const connection = new Connection('https://dax-server.michaelpalladino.io');

	if (connection.isMobile) {
		console.log('Mobile ');
	}

	onMount(() => {
		if (connection.isDesktop) {
			document.body.style.backgroundColor = 'black';
		}
	});
</script>

{#if connection.isDesktop}
	<main>
		<NeonText />
		<SoundDisplay />
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

{#if connection.isMobile}
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
