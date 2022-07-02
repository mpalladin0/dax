import type { DaxSocket } from '$lib/hooks/getSocket';
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
	public bufferLoaded: boolean = false;
	public readonly url: string;
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
		this.bufferLoaded = false;
		// this.socket = getSocket({
		// 	type: 'DESKTOP',
		// 	userId: getUser().id
		// });
		this.socket = socket;
		this.url = url;
		this.loadBuffer();
		// this.loadBufferFromStream();
		// this.loadBuffer({ url });

		// this.connection.socket?.on('audio buffer', (buffer: any) => {
		// 	console.log(buffer);
		// });
	}

	public loadBuffer = async () => {
		const bufferLoadedEvent = new Event('buffer loaded');

		const audioLoader = new THREE.AudioLoader();

		const buildURL = `https://dax.michaelpalladino.io/assets/sounds/${this.url}`;

		const buffer = await audioLoader.loadAsync(buildURL, (state) => {
			console.log(state.loaded);
		});

		console.log('[Dax] Buffer loaded.');

		super.setBuffer(buffer);
		this.socket.emit('buffer loaded', true);
		this.bufferLoaded = true;

		dispatchEvent(bufferLoadedEvent);

		this.setBuffer(buffer);

		unlockAudioContext(this.context);
		this.socket.on('start sound', (at: number) => {
			super.play();
			// if (this.isPlaying) return;

			// this.source?.start(0, at);
			// this.play();
		});
		return true;

		// audioLoader.load(buildURL, (loadedBuffer) => {
		// 	super.setBuffer(loadedBuffer);
		// 	console.log('[Dax] Buffer loaded.');

		// 	this.socket.emit('buffer loaded', true);
		// 	this.bufferLoaded = true;

		// 	this.setBuffer(loadedBuffer);
		// 	this.socket.on('start sound', (at: number) => {
		// 		this.play();
		// 		// if (this.isPlaying) return;

		// 		// this.source?.start(0, at);
		// 		// this.play();
		// 	});

		// 	return true;

		// 	// const context = new AudioContext();
		// 	// const streamDest = context.createMediaStreamDestination();
		// 	// const source = context.createBufferSource();

		// 	// source.buffer = loadedBuffer;
		// 	// source.connect(streamDest);
		// 	// source.loop = false;

		// 	// super.setMediaStreamSource(streamDest.stream);
		// 	// super.source = source;

		// 	// socket.on('start sound', (at: number) => {
		// 	// 	if (this.isPlaying) return;
		// 	// 	if (!this.isPlaying) {
		// 	// 		this.source?.start(0, at);
		// 	// 	}
		// 	// });
		// });
	};

	public playAt({ time }: { time: number }) {
		return this;
	}

	public get currentPosition() {
		return super.position;
	}
}
