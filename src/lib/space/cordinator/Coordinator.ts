import type { DaxSocket } from '$lib/hooks/getSocket';
import type * as THREE from 'three';
import { Sound } from '../sound/Sound';

interface SoundPosition {
	position: {
		x: number;
		y: number;
		z: number;
	};
}

export class Coordinator {
	private readonly sounds = new Map<string, Sound>();
	private readonly socket: DaxSocket;
	private readonly listener: THREE.AudioListener;

	constructor({ socket, listener }: { socket: DaxSocket; listener: THREE.AudioListener }) {
		this.socket = socket;
		this.listener = listener;

		socket?.on('move sound from desktop', (soundName: string, position: SoundPosition) =>
			this.onMoveFromPhone({ name: soundName, newPosition: position })
		);

		socket?.on('move sound from phone', (soundName: string, position: SoundPosition) =>
			this.onMoveFromPhone({ name: soundName, newPosition: position })
		);
	}

	public get = ({ name }: { name: string }) => {
		if (this.sounds.has(name)) return this.sounds.get(name);
		else return null;
	};

	public add = ({ name, url }: { name: string; url: string }) => {
		this.sounds.set(
			name,
			new Sound({
				name: name,
				url: url,
				listener: this.listener
			})
		);

		this.informDesktop({ name });
		this.informPhone({ name });

		return this.sounds.get(name)!;
	};

	private informDesktop = ({ name }) => {
		this.socket?.emit('add sound desktop', name);
	};
	private informPhone = ({ name }) => {
		this.socket?.emit('add sound phone', name);
	};

	private onMoveFromDesktop = ({
		name,
		newPosition
	}: {
		name: string;
		newPosition: SoundPosition;
	}) => {};
	private onMoveFromPhone = ({
		name,
		newPosition
	}: {
		name: string;
		newPosition: SoundPosition;
	}) => {};
}
