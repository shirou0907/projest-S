// @ts-nocheck
<template>
  <div class="flex gap-2">
    <!-- {{ cameraConfig }} -->
    <div class="w-[30px] flex flex-col gap-1">
      <div
        v-for="(c, i) in listColors"
        :key="i"
        class="h-8 w-8 rounded-md"
        :class="{ 'border-2 border-primary': c == color }"
        :style="{ backgroundColor: c }"
        @click="color = c"
      ></div>

      <el-color-picker v-model="color"></el-color-picker>
    </div>

    <div id="three-scene" ref="threeRef" class="flex-1 cursor-move"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, reactive, nextTick } from 'vue'
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

const threeRef = ref<HTMLElement>()
const color = ref('')
const listColors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#00ffff', '#ff00ff', '#ffffff', '#000000']

const props = defineProps<{
  x: number
  y: number
  z: number
  color?: string
  background?: string
  fov?: number
  wireframe?: boolean
  model: string
}>()

const cameraConfig = reactive({
  x: props.x,
  y: props.y,
  z: props.z,
  fov: 45,
  wireframe: false,
})

const scene = new THREE.Scene()

const perspectiveCamera = new THREE.PerspectiveCamera(cameraConfig.fov, 4096 / 4096, 0.1, 1000)
perspectiveCamera.lookAt(new THREE.Vector3(0, 0, 0))
perspectiveCamera.fov = cameraConfig.fov
perspectiveCamera.position.set(cameraConfig.x, cameraConfig.y, cameraConfig.z)

const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
// renderer.setSize(200, 200)
renderer.toneMapping = THREE.ACESFilmicToneMapping
renderer.toneMappingExposure = 1.2
renderer.outputEncoding = THREE.sRGBEncoding
const controls = new OrbitControls(perspectiveCamera, renderer.domElement)
controls.update()
controls.enableRotate = true
controls.enableZoom = true
controls.enablePan = true
// controls.keys = {
//   LEFT: 'ArrowLeft', //left arrow
//   UP: 'ArrowUp', // up arrow
//   RIGHT: 'ArrowRight', // right arrow
//   BOTTOM: 'ArrowDown', // down arrow
// }

nextTick(() => {
  renderer.setSize(threeRef.value?.clientWidth, threeRef.value?.clientHeight)
  threeRef.value?.appendChild(renderer.domElement)
})

const hlight = new THREE.AmbientLight(props.color, 0.8)
scene.add(hlight)

watch(color, newValue => {
  hlight.color.setHex(`0x${newValue.slice(1)}`)
})

scene.background = new THREE.Color(props.background || '#000000')

const loadModel = async () => {
  const gltfLoader = new GLTFLoader()
  const gltf = await gltfLoader.loadAsync(props.model)
  // gltf.scene.material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

  // const meshs = gltf.scene.children.map((child: THREE.Mesh, index: number) => {
  //   console.log(child)

  //   child.updateMatrix()
  //   child.material = new THREE.MeshPhongMaterial({ color: 0xffff00, shininess: 10 })

  //   return child
  // })

  // scene.add(...meshs)
  scene.add(gltf.scene)
}

const render = async function () {
  await loadModel()

  renderer.render(scene, perspectiveCamera)
}

const animate = () => {
  requestAnimationFrame(animate)

  controls.update()
  perspectiveCamera.updateProjectionMatrix()
  cameraConfig.x = perspectiveCamera.position.x
  cameraConfig.y = perspectiveCamera.position.y
  cameraConfig.z = perspectiveCamera.position.z
  cameraConfig.fov = perspectiveCamera.fov

  controls.autoRotate = true
  controls.autoRotateSpeed = 5
  renderer.render(scene, perspectiveCamera)
}

render()
animate()
</script>

<route>
  {
    "name": "3js",
    "path": "/test-three-js",
    "meta": {
      "layout": "mockup",
      "test": true
    }
  }
</route>
