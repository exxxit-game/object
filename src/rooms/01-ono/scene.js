// Scene markup of room 01 (the Ono booth), inserted into the page by room.js.
export const sceneHTML = `<a-scene renderer="antialias: true; colorManagement: true" background="color: #0b0b0d"
         cursor="rayOrigin: mouse" raycaster="objects: .clickable; far: 8"
         vr-mode-ui="enabled: true" loading-screen="enabled: false" xr-mode-ui="enabled: true">

  <a-entity id="rig" position="0 0 0.35" recenter="x: 0; z: 0.35; yaw: 0">
    <a-entity id="cam" camera look-controls="pointerLockEnabled: false" wasd-controls="acceleration: 12" position="0 1.6 0" room-bounds></a-entity>
    <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 8; lineColor: #f0c96a; lineOpacity: .6" reach-watch></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 8; lineColor: #f0c96a; lineOpacity: .6" reach-watch></a-entity>
  </a-entity>

  <!-- lights -->
  <a-entity light="type: ambient; color: #c9cfd6; intensity: 0.55"></a-entity>
  <a-entity light="type: point; color: #ffe2b0; intensity: 2.2; distance: 0; decay: 0.6" position="0 2.18 -0.3"></a-entity>
  <a-sphere radius="0.045" position="0 2.22 -0.3" material="color: #fff3d6; emissive: #ffdca0; emissiveIntensity: 1.5"></a-sphere>
  <a-cylinder radius="0.006" height="0.24" position="0 2.38 -0.3" color="#111"></a-cylinder>

  <!-- walls -->
  <a-plane rotation="-90 0 0" position="0 0 0" width="3.2" height="3.2" material="color: #3b3935; roughness: .95"></a-plane>
  <a-plane rotation="90 0 0" position="0 2.5 0" width="3.2" height="3.2" material="color: #8b8a84; roughness: 1"></a-plane>
  <a-plane position="0 1.25 -1.6" width="3.2" height="2.5" material="color: #66705f; roughness: .95"></a-plane>
  <a-plane rotation="0 180 0" position="0 1.25 1.6" width="3.2" height="2.5" material="color: #66705f; roughness: .95"></a-plane>
  <a-plane rotation="0 -90 0" position="1.6 1.25 0" width="3.2" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <!-- left wall with the observation window -->
  <a-plane rotation="0 90 0" position="-1.6 1.25 -1.25" width="0.7" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 1.25 0.95" width="1.3" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 0.5 -0.3" width="1.2" height="1.0" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 2.15 -0.3" width="1.2" height="0.7" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane id="glass" rotation="0 90 0" position="-1.595 1.4 -0.3" width="1.2" height="0.8"
           material="color: #0b0d10; metalness: .9; roughness: .08; opacity: .94; transparent: true"></a-plane>
  <a-box position="-1.59 1.4 -0.3" width="0.02" height="0.86" depth="1.26" material="color: #222; opacity: 0; transparent: true"></a-box>
  <a-box position="-1.585 0.99 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <a-box position="-1.585 1.81 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <!-- painting on the back wall -->
  <a-box position="0 1.5 1.585" width="0.98" height="0.98" depth="0.04" color="#3a2a1c"></a-box>
  <a-entity id="painting" panel="w: 0.86; h: 0.86; px: 768" rotation="0 180 0" position="0 1.5 1.562" look-watch></a-entity>
  <!-- baseboard -->
  <a-box position="0 0.04 -1.595" width="3.2" height="0.08" depth="0.01" color="#2b2d29"></a-box>

  <!-- observation room -->
  <a-box position="-2.4 1.25 -0.3" width="1.6" height="2.5" depth="2.4" material="color: #4a4d52; side: back; roughness: 1"></a-box>
  <a-entity id="obsLight" light="type: point; color: #dfe7ff; intensity: 0; distance: 0; decay: 1" position="-2.4 2.1 -0.3"></a-entity>
  <a-box position="-2.75 0.74 -0.3" width="0.6" height="0.04" depth="1.0" color="#5a4a3a"></a-box>
  <a-box position="-2.75 0.37 0.12" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-box position="-2.75 0.37 -0.72" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-box position="-2.68 0.82 -0.3" width="0.18" height="0.12" depth="0.28" color="#2d2f33"></a-box>
  <a-entity id="timerLabel" panel="w: 0.24; h: 0.09; px: 512" rotation="0 90 0" position="-2.588 0.82 -0.3"></a-entity>
  <a-sphere id="timerLed" radius="0.012" position="-2.62 0.89 -0.38" material="color: #300; emissive: #ff2a1a; emissiveIntensity: 0.2"></a-sphere>
  <a-cylinder radius="0.007" height="1.0" rotation="0 0 90" position="-2.1 0.77 -0.3" color="#111"></a-cylinder>
  <!-- empty chair -->
  <a-box position="-3.0 0.45 -0.3" width="0.4" height="0.04" depth="0.4" color="#2e3238"></a-box>
  <a-box position="-3.19 0.72 -0.3" width="0.03" height="0.5" depth="0.4" color="#2e3238"></a-box>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.46" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.46" color="#777"></a-cylinder>
  <a-box position="-2.75 0.775 0.0" width="0.22" height="0.01" depth="0.3" color="#e9e4d8" rotation="0 12 0"></a-box>

  <!-- experimenter screen -->
  <a-box position="0 1.86 -1.585" width="2.12" height="1.12" depth="0.03" color="#1b1c1e"></a-box>
  <a-entity id="screen" panel="w: 2.0; h: 1.0; px: 2048; ref: 1300; bg: #0e0f11" position="0 1.86 -1.565"></a-entity>

  <a-entity id="room">
    <!-- table -->
    <a-box position="0 0.82 -0.6" width="1.0" height="0.04" depth="0.52" material="color: #4b4a47; roughness: .7"></a-box>
    <a-box position="-0.46 0.4 -0.82" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="0.46 0.4 -0.82" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="-0.46 0.4 -0.38" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="0.46 0.4 -0.38" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <!-- counter and lamp -->
    <a-box position="0 1.24 -0.78" width="0.36" height="0.26" depth="0.07" color="#2d2f33"></a-box>
    <a-box position="0 0.99 -0.78" width="0.05" height="0.3" depth="0.05" color="#2d2f33"></a-box>
    <a-box position="0 0.85 -0.78" width="0.16" height="0.02" depth="0.1" color="#2d2f33"></a-box>
    <a-entity id="counter" panel="w: 0.24; h: 0.13; px: 512" position="0 1.22 -0.743"></a-entity>
    <a-sphere id="signal" radius="0.035" position="0 1.4 -0.78" material="color: #3a0806; emissive: #ff2a1a; emissiveIntensity: 0.05"></a-sphere>
    <!-- counter cable: along the table top, down the back edge, along the floor to the wall -->
    <a-cylinder radius="0.007" height="0.04" rotation="90 0 0" position="0 0.847 -0.845" color="#111"></a-cylinder>
    <a-cylinder radius="0.007" height="0.84" position="0 0.42 -0.866" color="#111"></a-cylinder>
    <a-cylinder radius="0.007" height="0.334" rotation="90 0 0" position="0 0.01 -1.033" color="#111"></a-cylinder>
    <a-cylinder radius="0.007" height="1.6" rotation="0 0 90" position="-0.8 0.01 -1.2" color="#111"></a-cylinder>
    <a-cylinder radius="0.007" height="0.9" rotation="90 0 0" position="-1.6 0.01 -0.75" color="#111"></a-cylinder>
    <!-- lever cables dangle, connected to nothing -->
    <a-cylinder radius="0.006" height="0.78" position="-0.28 0.41 -0.56" rotation="0 0 4" color="#151515"></a-cylinder>
    <a-cylinder radius="0.006" height="0.78" position="0 0.41 -0.56" rotation="0 0 -3" color="#151515"></a-cylinder>
    <a-cylinder radius="0.006" height="0.78" position="0.28 0.41 -0.56" rotation="0 0 5" color="#151515"></a-cylinder>
    <a-box position="-0.31 0.015 -0.5" width="0.03" height="0.03" depth="0.06" rotation="0 30 0" color="#c9b26a"></a-box>
    <a-box position="0.02 0.015 -0.48" width="0.03" height="0.03" depth="0.06" rotation="0 -20 0" color="#c9b26a"></a-box>
    <a-box position="0.3 0.015 -0.5" width="0.03" height="0.03" depth="0.06" rotation="0 50 0" color="#c9b26a"></a-box>
    <!-- buttons -->
    <a-entity id="startBtn" position="0.4 0.84 -0.47">
      <a-cylinder id="startHit" class="clickable" radius="0.05" height="0.03" position="0 0.015 0" material="color: #eeeeea; emissive: #ffffff; emissiveIntensity: .15"></a-cylinder>
      <a-entity id="startLabel" panel="w: 0.2; h: 0.05; px: 512" rotation="-90 0 0" position="0 0.002 0.085"></a-entity>
    </a-entity>
    <a-entity id="againBtn" position="0.4 0.84 -0.47" visible="false">
      <a-cylinder id="againHit" radius="0.05" height="0.03" position="0 0.015 0" material="color: #eeeeea; emissive: #ffffff; emissiveIntensity: .15"></a-cylinder>
      <a-entity id="againLabel" panel="w: 0.2; h: 0.05; px: 512" rotation="-90 0 0" position="0 0.002 0.085"></a-entity>
    </a-entity>
  </a-entity>
</a-scene>
`;
