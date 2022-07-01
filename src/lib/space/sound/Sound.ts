import { type DaxSocket } from '$lib/hooks/getSocket';
import * as THREE from 'three';
import { PositionalAudio } from 'three';

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

// const loadBufferFromStream = (connection: Connection) => {
// 	const context = new AudioContext()
// 	connection.socket?.on("audio buffer", (buffer: any) => {

// 	})
// }

export class Sound extends PositionalAudio {
	public declare readonly name: string;
	public isMoving = false;
	private readonly socket: DaxSocket;
	constructor({
		name,
		url,
		listener,
		socket
	}: {
		name: string;
		url: string;
		listener: THREE.AudioListener;
		socket: DaxSocket;
	}) {
		super(listener);
		this.name = name;
		// this.socket = getSocket({
		// 	type: 'DESKTOP',
		// 	userId: getUser().id
		// });
		this.socket = socket;
		this.loadBufferFromStream();
		this.loadBuffer({ url });

		// this.connection.socket?.on('audio buffer', (buffer: any) => {
		// 	console.log(buffer);
		// });
	}

	private loadBufferFromStream = () => {
		const sampleRate = 4800;
		const context = new AudioContext();
		let startAt = 0;

		// this.connection.socket?.on('audio buffer', (chunk) => {
		// 	const floats = new Float32Array(chunk);

		// 	console.log(floats);
		// 	// const source = context.createBufferSource();
		// 	// const buffer = context.createBuffer(1, floats.length, sampleRate);
		// 	// source.buffer = buffer;

		// 	// super.setBuffer(buffer);
		// 	// source.connect(context.destination);
		// 	// startAt = Math.max(context.currentTime, startAt);
		// 	// source.start();
		// 	// startAt += buffer.duration;
		// });
	};
	public loadBuffer = async ({ url }: { url: string }) => {
		// const socket = await getSocket({
		// 	type: 'DESKTOP',
		// 	userId: getUser().id
		// });

		const audioLoader = new THREE.AudioLoader();

		const buildURL = `https://dax.michaelpalladino.io/assets/sounds/${url}`;

		audioLoader.load(buildURL, (loadedBuffer) => {
			super.setBuffer(loadedBuffer);

			// const context = new AudioContext();
			// const streamDest = context.createMediaStreamDestination();
			// const source = context.createBufferSource();

			// source.buffer = loadedBuffer;
			// source.connect(streamDest);
			// source.loop = false;

			// super.setMediaStreamSource(streamDest.stream);
			// super.source = source;

			// socket.on('start sound', (at: number) => {
			// 	if (this.isPlaying) return;
			// 	if (!this.isPlaying) {
			// 		this.source?.start(0, at);
			// 	}
			// });

			this.setBuffer(loadedBuffer);
			this.socket.on('start sound', (at: number) => {
				this.play();
				// if (this.isPlaying) return;

				// this.source?.start(0, at);
				// this.play();
			});
		});
	};

	public playAt({ time }: { time: number }) {
		return this;
	}

	public get currentPosition() {
		return super.position;
	}
}
