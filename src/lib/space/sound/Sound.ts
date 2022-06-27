import * as THREE from 'three';
import { AudioContext, PositionalAudio } from 'three';

const unlockAudioContext = (audioCtx: AudioContext) => {
	console.log(audioCtx);
	if (audioCtx.state !== 'suspended') return;
	const b = document.body;
	const events = ['touchstart', 'touchend', 'mousedown', 'keydown'];
	events.forEach((e) => b.addEventListener(e, unlock, false));
	function unlock() {
		audioCtx.resume().then(clean);
	}
	function clean() {
		events.forEach((e) => b.removeEventListener(e, unlock));
	}
};

export class Sound extends PositionalAudio {
	public declare readonly name: string;
	public isMoving = false;
	constructor({
		name,
		url,
		listener
	}: {
		name: string;
		url: string;
		listener: THREE.AudioListener;
	}) {
		super(listener);
		this.name = name;
		this.loadBuffer({ url });
	}
	public loadBuffer = ({ url }: { url: string }) => {
		const audioLoader = new THREE.AudioLoader();

		audioLoader.load(`assets/sounds/${url}`, (buffer) => {
			console.log('Buffer loaded');
			super.setBuffer(buffer);

			const ctx = AudioContext.getContext();
			ctx.resume();
			console.log(ctx);
			unlockAudioContext(ctx);
		});
	};

	public get currentPosition() {
		return super.position;
	}
}
