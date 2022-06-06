import * as THREE from 'three'

export class SoundDisplay {
    private readonly geometry: THREE.BoxGeometry
    private readonly material: THREE.MeshBasicMaterial
    private readonly element: THREE.Mesh<any, any>

    constructor() {
        this.geometry = new THREE.BoxBufferGeometry(0.16002, 0.16002, 0.077978);
        this.material = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        this.element = new THREE.Mesh(this.geometry, this.material)
    }

    public readonly setPos = (x: number, y: number, z: number) => {
        this.element.position.set(x, y, z)
    }

    public readonly lookAt = (vector: THREE.Vector3) => {
        this.element.lookAt(vector)
    }

    public readonly setColor = (color: THREE.Color) => {
        this.element.material.setHex(color)
    }
}