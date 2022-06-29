<script>
	import PairState from './PairState.svelte';
	import ThreeDisplay from './ThreeDisplay.svelte';

	// populated with data from the endpoint
	export let id;
</script>

<main>
	<PairState room={id} />
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
