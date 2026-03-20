import { ImsBaseClass } from '../../lib/ImsBaseClass.js';
import { ImsModelData } from './ImsModelData.js';
import * as THREE from 'three';
import { template } from './template.js';
import { styles } from './styles.js';
import './ims-model-toolbar.js';

export class ImsModel extends ImsBaseClass {

  dataClass = ImsModelData;

  init$ = {
    onPlayPause: () => {
      this.#autoRotate = !this.#autoRotate;
      this.ref.toolbar.$.playStateIcon = this.#autoRotate ? 'pause' : 'play';
    },
  }

  /** @type {THREE.WebGLRenderer} */
  #renderer;
  /** @type {THREE.Scene} */
  #scene;
  /** @type {THREE.PerspectiveCamera} */
  #camera;
  /** @type {any} */
  #model;
  #autoRotate = true;
  #userInteracting = false;
  #pointerDownX = 0;
  #pointerDownY = 0;
  #rotationX = 0;
  #rotationY = 0;
  #startRotationX = 0;
  #startRotationY = 0;

  #animate = () => {
    if (this.#autoRotate && !this.#userInteracting && this.#model) {
      this.#model.rotation.y += 0.005;
    }
    this.#renderer.render(this.#scene, this.#camera);
  }

  #onPointerDown = (e) => {
    if (!e.isPrimary) return;
    this.#userInteracting = true;
    this.#pointerDownX = e.clientX;
    this.#pointerDownY = e.clientY;
    this.#startRotationX = this.#rotationX;
    this.#startRotationY = this.#rotationY;
    document.addEventListener('pointermove', this.#onPointerMove);
    document.addEventListener('pointerup', this.#onPointerUp);
  }

  #onPointerMove = (e) => {
    if (!e.isPrimary || !this.#model) return;
    this.#rotationY = this.#startRotationY + (e.clientX - this.#pointerDownX) * 0.01;
    this.#rotationX = this.#startRotationX + (e.clientY - this.#pointerDownY) * 0.01;
    this.#rotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, this.#rotationX));
    this.#model.rotation.y = this.#rotationY;
    this.#model.rotation.x = this.#rotationX;
  }

  #onPointerUp = (e) => {
    if (!e.isPrimary) return;
    this.#userInteracting = false;
    document.removeEventListener('pointermove', this.#onPointerMove);
    document.removeEventListener('pointerup', this.#onPointerUp);
  }

  #onWheel = (e) => {
    e.preventDefault();
    let fov = this.#camera.fov + e.deltaY * 0.05;
    this.#camera.fov = THREE.MathUtils.clamp(fov, 10, this.srcData.fov || 45);
    this.#camera.updateProjectionMatrix();
  }

  onResize = () => {
    let rect = this.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
    super.onResize();
    if (this.#renderer) {
      this.#renderer.setSize(rect.width, rect.height);
      this.#camera.aspect = rect.width / rect.height;
      this.#camera.updateProjectionMatrix();
    }
  }

  /**
   * @param {THREE.Scene} scene
   * @param {ArrayBuffer} buffer
   */
  async #loadGLTF(scene, buffer) {
    let { GLTFLoader } = await import('three/addons/loaders/GLTFLoader.js');
    let loader = new GLTFLoader();
    return new Promise((resolve, reject) => {
      loader.parse(buffer, '', (gltf) => {
        let model = gltf.scene;
        // Auto center and scale
        let box = new THREE.Box3().setFromObject(model);
        let center = box.getCenter(new THREE.Vector3());
        let size = box.getSize(new THREE.Vector3());
        let maxDim = Math.max(size.x, size.y, size.z);
        let scale = 2 / maxDim;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));
        scene.add(model);
        resolve(model);
      }, reject);
    });
  }

  async init() {
    this.#renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true,
    });
    this.#renderer.setPixelRatio(window.devicePixelRatio);
    this.#renderer.setSize(this.rect.width, this.rect.height);

    if (this.srcData.bgColor) {
      this.#renderer.setClearColor(new THREE.Color(this.srcData.bgColor));
    } else {
      this.#renderer.setClearAlpha(0);
    }

    this.#scene = new THREE.Scene();
    this.#camera = new THREE.PerspectiveCamera(
      this.srcData.fov || 45,
      this.rect.width / this.rect.height,
      0.1,
      1000
    );
    // @ts-ignore - position exists on Object3D
    this.#camera.position.z = 3;

    // Lighting
    let ambient = new THREE.AmbientLight(0xffffff, 0.6);
    this.#scene.add(ambient);
    let directional = new THREE.DirectionalLight(0xffffff, 0.8);
    // @ts-ignore - position exists on Object3D
    directional.position.set(5, 5, 5);
    this.#scene.add(directional);
    let backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    // @ts-ignore - position exists on Object3D
    backLight.position.set(-5, -3, -5);
    this.#scene.add(backLight);

    // Load model
    let modelUrl = this.srcData.srcList?.[0];
    if (modelUrl) {
      try {
        let resp = await fetch(modelUrl);
        let buffer = await resp.arrayBuffer();
        this.#model = await this.#loadGLTF(this.#scene, buffer);
        this.#autoRotate = this.srcData.autoplay !== false;
        this.ref.toolbar.$.playStateIcon = this.#autoRotate ? 'pause' : 'play';
      } catch (err) {
        this.onError(err);
      }
    }

    this.#renderer.setAnimationLoop(this.#animate);

    this.style.touchAction = 'none';
    this.addEventListener('pointerdown', this.#onPointerDown);
    this.addEventListener('wheel', this.#onWheel);
    this.$.progress = 100;
  }

  destroyCallback() {
    super.destroyCallback();
    this.#renderer?.setAnimationLoop(null);
    this.#renderer?.dispose();
    document.removeEventListener('pointermove', this.#onPointerMove);
    document.removeEventListener('pointerup', this.#onPointerUp);
  }
}

ImsModel.shadowStyles = styles;
ImsModel.template = template;

ImsModel.reg('ims-model');

export { ImsModelData };
export default ImsModel;
