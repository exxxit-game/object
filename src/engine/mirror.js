// One-way mirror seen from the subject's side: it reflects the room. The reflection
// is captured once when the scene has loaded (a cube camera a little in front of the
// glass), so it costs nothing per frame; the player does not see themselves in it.
// The room still controls the glass opacity: when the observation room is lit, the
// glass turns see-through and the reflection fades with it.
AFRAME.registerComponent('mirror-glass', {
  schema: { size: { default: 256 }, delay: { default: 1200 }, offset: { default: 0.6 }, eye: { default: 1.4 }, intensity: { default: 1.8 } },
  init() {
    this.envMap = null;
    // A-Frame's material clears envMap whenever the material attribute changes (opacity).
    this.el.addEventListener('componentchanged', (e) => { if (e.detail.name === 'material') this.apply(); });
    const later = () => setTimeout(() => this.capture(), this.data.delay);
    if (this.el.sceneEl.hasLoaded) later(); else this.el.sceneEl.addEventListener('loaded', later);
  },
  capture() {
    const mesh = this.el.getObject3D('mesh');
    const sceneEl = this.el.sceneEl;
    if (!mesh || !sceneEl.renderer) return;
    const target = new THREE.WebGLCubeRenderTarget(this.data.size);
    const camera = new THREE.CubeCamera(0.05, 20, target);
    const pos = new THREE.Vector3();
    const quat = new THREE.Quaternion();
    this.el.object3D.getWorldPosition(pos);
    this.el.object3D.getWorldQuaternion(quat);
    const normal = new THREE.Vector3(0, 0, 1).applyQuaternion(quat);
    camera.position.copy(pos).addScaledVector(normal, this.data.offset).setY(this.data.eye);
    sceneEl.object3D.add(camera);
    mesh.visible = false;
    camera.update(sceneEl.renderer, sceneEl.object3D);
    mesh.visible = true;
    sceneEl.object3D.remove(camera);
    this.envMap = target.texture;
    this.apply();
  },
  apply() {
    const mesh = this.el.getObject3D('mesh');
    if (!mesh || !this.envMap) return;
    mesh.material.envMap = this.envMap;
    mesh.material.envMapIntensity = this.data.intensity;
    mesh.material.needsUpdate = true;
  }
});
