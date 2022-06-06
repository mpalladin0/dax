import * as THREE from 'three'
import { Loader } from 'three'

export function createAudio(url: string) {
    const listener = new THREE.AudioListener()
    const sound = new THREE.PositionalAudio(listener)

    const loader = new THREE.AudioLoader()
    loader.load(url, (buffer) => {
        sound.setBuffer(buffer)
        sound.setRefDistance(1)
        sound.setDistanceModel('inverse')
    })

    return sound
}