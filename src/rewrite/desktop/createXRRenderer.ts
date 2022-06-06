import * as THREE from 'three'

export function createXRRenderer(scene: THREE.Scene) {
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    renderer.xr.enabled = true

    return renderer
}