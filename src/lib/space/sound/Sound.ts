import type { Connection } from '$lib/Connection';
import { getConnection } from '$lib/utils/getConnection';
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
	private connection: Connection;
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
		this.connection = getConnection();
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
	public loadBuffer = ({ url }: { url: string }) => {
		const audioLoader = new THREE.AudioLoader();

		this.connection.socket?.on('session created', (socketId: string, session: any) => {
			console.log(socketId, session);
		});

		this.connection.socket?.on('returning to session', (socketId: string, sessionId: string) => {
			console.log('Returning to session: ', socketId, sessionId);
		});

		audioLoader.load(`assets/sounds/${url}`, (loadedBuffer) => {
			const context = new AudioContext();
			const streamDest = context.createMediaStreamDestination();
			const buffer = context.createBuffer(1, loadedBuffer.length, loadedBuffer.sampleRate);
			const source = context.createBufferSource();

			source.buffer = loadedBuffer;
			source.connect(streamDest);
			source.loop = false;
			// source.start();

			const playback = document.createElement('button');

			document.body.appendChild(playback);

			super.setMediaStreamSource(streamDest.stream);

			super.source = source;

			// playback.innerText = 'start';
			// playback.onclick = () => {
			// 	source.start(0, 0);
			// 	super.play();
			// };

			console.log(source, streamDest.stream);
		});
	};

	public playAt({ time }: { time: number }) {
		return this;
	}

	public get currentPosition() {
		return super.position;
	}
}

export default class SoundStream {
	// duration: number;
	mediaElement: HTMLAudioElement;
	constructor(url) {
		// this.duration = 0;
		this.mediaElement = new Audio(url);
		this.mediaElement.loop = true;
		this.mediaElement.preload = 'auto';
		this.mediaElement.crossOrigin = 'anonymous';
		this.mediaElement.onloadstart = (ev) => {
			console.log('Loading started: ', ev);
		};
		this.mediaElement.onloadeddata = (ev) => {
			console.log('Metadata loaded', ev);
		};

		this.mediaElement.onplay = (ev) => {
			console.log('Is playing', ev);
		};
		// var self = this;
		// this.mediaElement.addEventListener('loadedmetadata', function (_event) {
		// 	var dur = self.mediaElement.duration;
		// 	self.duration = dur;
		// 	// durationCallback(dur);
		// });
	}

	play() {
		this.mediaElement.play();
	}

	setTime(time) {
		let newTime = time / 1000;
		if (!newTime.isNan && newTime != undefined && isFinite(newTime)) {
			this.mediaElement.currentTime = newTime;
		}
	}
}
