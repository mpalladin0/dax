<script lang="ts">
	import { browser } from '$app/env';
	import App from '$lib/App.svelte';
	import { getUser } from '$lib/hooks/getUser';
	import LogRocket from 'logrocket';
	import { onMount } from 'svelte';

	LogRocket.init('iwm1s1/dax');

	onMount(() => {
		LogRocket.identify(getUser().id);
	});
</script>

{#if browser}
	<App />
{/if}
