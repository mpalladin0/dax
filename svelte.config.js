import adapter from '@sveltejs/adapter-auto';
import preprocess from 'svelte-preprocess';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: preprocess(),

	kit: {
		adapter: adapter(),
		vite: {
			assetsInclude: ["**/*.gltf", "**/*.mp3", "**/*.glb",],
			build: {
				rollupOptions: {
					external: [
						"@sentry/browser",
						"@sentry/tracing"
					]
				}
			}
			
		}
	},
	files: {
		asserts: 'static',
	},

	
};

export default config;
