<script lang="ts">
	import { browser } from '$app/env';
	import App from '$lib/App.svelte';
</script>

{#if browser}
	<App />
{/if}
