<script lang="ts">
	import * as Sentry from '@sentry/browser';
	import { BrowserTracing } from '@sentry/tracing';

	import { browser } from '$app/env';
	import App from '$lib/App.svelte';
	import { getUser } from '$lib/hooks/getUser';
	import LogRocket from 'logrocket';
	import { onMount } from 'svelte';

	LogRocket.init('iwm1s1/dax');

	onMount(() => {
		Sentry.init({
			dsn: 'https://96eb5155f5164df8b17cf103ba0673a7@o1304635.ingest.sentry.io/6545261',
			integrations: [new BrowserTracing()],
			release: 'dax-client@' + '1.0.0',

			// Set tracesSampleRate to 1.0 to capture 100%
			// of transactions for performance monitoring.
			// We recommend adjusting this value in production
			tracesSampleRate: 1.0,
			beforeSend(event, hint) {
				// Check if it is an exception, and if so, show the report dialog
				if (event.exception) {
					Sentry.showReportDialog({ eventId: event.event_id });
				}
				return event;
			}
		});

		LogRocket.identify(getUser().id);

		Sentry.setUser({ id: getUser().id });

		//@ts-ignore
		undefinedFunc();

		//@ts-ignore
		undefinedFunc2();
	});
</script>

{#if browser}
	<App />
{/if}
