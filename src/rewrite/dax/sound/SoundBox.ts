import * as THREE from 'three'
import { EventDispatcher, MeshBasicMaterial, WebGLRenderer } from 'three'

export class SoundBox extends THREE.EventDispatcher {
    length = 0.1
    width = 0.1
    height = 0.1

    private readonly texture: THREE.Texture
    private readonly geometry: THREE.BoxGeometry
    private readonly material: THREE.MeshBasicMaterial

    public readonly element: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial>

    constructor() {
        super()

        /** Box Geometry */
        // this.geometry = new THREE.BoxGeometry(0.00762, 0.16002, 0.077978)
        this.geometry = new THREE.BoxBufferGeometry(0.16002, 0.16002, 0.077978);
        this.material = new MeshBasicMaterial({ color: 0xff0000 })
        this.element = new THREE.Mesh(this.geometry, this.material)

        this.element.addEventListener('change-x', (x: any) => { this.element.position.setX(x.update) })
        this.element.addEventListener('change-y', (y: any) => {  this.element.position.setY(y.update) })
        this.element.addEventListener('change-z', (z: any) => { this.element.position.setZ(z.update) })

    }


    public readonly setLength = (v: number) => this.length = v
    public readonly setWidth = (v: number) => this.width = v
    public readonly setHeight = (v: number) => this.height = v

}