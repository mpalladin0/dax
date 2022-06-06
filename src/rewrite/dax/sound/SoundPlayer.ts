import { Sound } from "./Sound";
import * as THREE from 'three'

export class SoundPlayer  {
    public readonly audio: THREE.PositionalAudio
    public readonly listener: THREE.AudioListener;

    constructor(url: string) {
        /** Load audio from url */
        new THREE.AudioLoader().load(url, this.onLoad, this.onProgress, this.onError)

        /** Create Listener and Positional Audio Objects */
        this.listener = new THREE.AudioListener()
        this.audio = new THREE.PositionalAudio(this.listener)
        
    }

    private readonly onLoad = (audioBuffer: AudioBuffer) => {
        const source = this.audio.context.createBufferSource()
        source.buffer = audioBuffer
        this.audio.setBuffer(source.buffer)
    }

    private readonly onProgress = () => {}
    private readonly onError = () => {}

    public readonly play = () => {}
    public readonly pause = () => {}
}