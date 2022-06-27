<script lang="ts">
	import { WebGLRenderer } from 'three';
	import { ARButton } from 'three/examples/jsm/webxr/ARButton';
	import { Connection } from './Connection';
	import { createScene } from './phone/XRScene';
	//   import { XRSpace } from "./dax/XRSpace";

	const connection = new Connection('https://dax-server.michaelpalladino.io');

	//   const xrSpace = new XRSpace(connection);
	const { devicePixelRatio, innerHeight, innerWidth } = window;

	const renderer = new WebGLRenderer({ antialias: true, alpha: true });
	renderer.setSize(innerWidth, innerHeight);
	renderer.setPixelRatio(devicePixelRatio);
	renderer.xr.enabled = true;

	const arButton = ARButton.createButton(renderer, {
		requiredFeatures: ['hit-test'],
		domOverlay: {
			root: document.body
		}
	});

	document.body.appendChild(renderer.domElement);

	createScene(renderer, connection);

	document.body.appendChild(arButton);
</script>
