import * as THREE from 'three'

export function createDisplay(audio: THREE.PositionalAudio, scene: THREE.Scene) {
    const geometry = new THREE.BoxBufferGeometry(0.16002, 0.16002, 0.077978);
    const material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
    const element = new THREE.Mesh(geometry, material)

    scene.add(element)
    element.add(audio)

    return element
}