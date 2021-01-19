import { Camera, Scene, PlaneBufferGeometry, Vector2, ShaderMaterial, Mesh, WebGLRenderer } from 'THREE'
import vertexShader from './shader/shader.vert'
import fragmentShader from './shader/shader.frag'

type Props = {
	x: number
	y: number
	z: number
	q: number
}

const shader = (node: HTMLCanvasElement, props: Props) => {
	let camera: Camera
	let scene: Scene
	let renderer: WebGLRenderer
	let uniforms: { [key in string]: { type: string; value: any } }
	let running: boolean = true

	const init = () => {
		scene = new Scene()
		camera = new Camera()

		const geometry = new PlaneBufferGeometry(2, 2)

		uniforms = {
			iTime: {
				type: 'f',
				value: 1.0,
			},
			iResolution: {
				type: 'v2',
				value: new Vector2(),
			},
			iX: {
				type: 'f',
				value: props.x,
			},
			iY: {
				type: 'f',
				value: props.y,
			},
			iZ: {
				type: 'f',
				value: props.z,
			},
			iQ: {
				type: 'f',
				value: props.q,
			},
		}

		const material = new ShaderMaterial({
			uniforms: uniforms,
			vertexShader,
			fragmentShader,
		})

		const mesh = new Mesh(geometry, material)
		scene.add(mesh)

		uniforms.iResolution.value.x = node.offsetWidth
		uniforms.iResolution.value.y = node.offsetHeight

		renderer = new WebGLRenderer({ canvas: node })
		renderer.setSize(node.offsetWidth, node.offsetHeight)
		renderer.setClearColor(0x000000)
	}

	const render = () => {
		uniforms.iTime.value += 0.05
		renderer.render(scene, camera)
	}

	const animate = () => {
		if (running) {
			requestAnimationFrame(animate)
			render()
		}
	}

	init()
	animate()

	return {
		update(newProps: Props) {
			uniforms.iX.value = newProps.x
			uniforms.iY.value = newProps.y
			uniforms.iZ.value = newProps.z
			uniforms.iQ.value = newProps.q
		},
		destroy() {
			running = false
		},
	}
}

export default shader
