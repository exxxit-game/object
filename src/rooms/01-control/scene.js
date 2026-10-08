// Scene of room 01: a small booth like the one in Alloy & Abramson (1979, p. 450):
// a table with a black stand (23×23 cm) holding a yellow and a green light 5 cm
// from its top, a black box (15.5×7.5×4 cm) with a spring button, and a one-way
// mirror to the observation room with the relay equipment. The wall screen carries
// the words of the experimenter. Sizes in metres.
export const sceneHTML = `<a-scene renderer="antialias: true; colorManagement: true" background="color: #0b0b0d"
         cursor="rayOrigin: mouse" raycaster="objects: .clickable; far: 8"
         vr-mode-ui="enabled: true" loading-screen="enabled: false" xr-mode-ui="enabled: true">

  <a-entity id="rig" position="0 0 0.35" recenter="x: 0; z: 0.35; yaw: 0">
    <a-entity id="cam" camera look-controls="pointerLockEnabled: false" wasd-controls="acceleration: 12" position="0 1.6 0"
              room-bounds="minX: -1.4; maxX: 1.4; minZ: 0.1; maxZ: 1.2"></a-entity>
    <a-entity laser-controls="hand: left" raycaster="objects: .clickable; far: 8; lineColor: #f0c96a; lineOpacity: .6" grab-press></a-entity>
    <a-entity laser-controls="hand: right" raycaster="objects: .clickable; far: 8; lineColor: #f0c96a; lineOpacity: .6" grab-press></a-entity>
  </a-entity>

  <!-- lights -->
  <a-entity light="type: ambient; color: #c9cfd6; intensity: 0.55"></a-entity>
  <a-entity light="type: point; color: #ffe2b0; intensity: 2.2; distance: 0; decay: 0.6" position="0 2.18 -0.2"></a-entity>
  <a-sphere radius="0.045" position="0 2.22 -0.2" material="color: #fff3d6; emissive: #ffdca0; emissiveIntensity: 1.5"></a-sphere>
  <a-cylinder radius="0.006" height="0.24" position="0 2.38 -0.2" color="#111"></a-cylinder>

  <!-- walls -->
  <a-plane rotation="-90 0 0" position="0 0 0" width="3.2" height="3.2" material="color: #3b3935; roughness: .95"></a-plane>
  <a-plane rotation="90 0 0" position="0 2.5 0" width="3.2" height="3.2" material="color: #8b8a84; roughness: 1"></a-plane>
  <a-plane position="0 1.25 -1.6" width="3.2" height="2.5" material="color: #66705f; roughness: .95"></a-plane>
  <a-plane rotation="0 180 0" position="0 1.25 1.6" width="3.2" height="2.5" material="color: #66705f; roughness: .95"></a-plane>
  <a-plane rotation="0 -90 0" position="1.6 1.25 0" width="3.2" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <!-- left wall with the one-way mirror -->
  <a-plane rotation="0 90 0" position="-1.6 1.25 -1.25" width="0.7" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 1.25 0.95" width="1.3" height="2.5" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 0.5 -0.3" width="1.2" height="1.0" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane rotation="0 90 0" position="-1.6 2.15 -0.3" width="1.2" height="0.7" material="color: #616b5b; roughness: .95"></a-plane>
  <a-plane id="glass" rotation="0 90 0" position="-1.595 1.4 -0.3" width="1.2" height="0.8"
           material="color: #0b0d10; metalness: .9; roughness: .08; opacity: .94; transparent: true"></a-plane>
  <a-box position="-1.585 0.99 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <a-box position="-1.585 1.81 -0.3" width="0.05" height="0.03" depth="1.26" color="#2a2a2a"></a-box>
  <!-- baseboard -->
  <a-box position="0 0.04 -1.595" width="3.2" height="0.08" depth="0.01" color="#2b2d29"></a-box>
  <a-box position="0 0.04 1.595" width="3.2" height="0.08" depth="0.01" color="#2b2d29"></a-box>
  <a-box position="1.595 0.04 0" width="0.01" height="0.08" depth="3.2" color="#2b2d29"></a-box>
  <a-box position="-1.595 0.04 0" width="0.01" height="0.08" depth="3.2" color="#2b2d29"></a-box>

  <!-- observation room: desk with relay equipment, chair, the observer -->
  <a-box position="-2.4 1.25 -0.3" width="1.6" height="2.5" depth="2.4" material="color: #4a4d52; side: back; roughness: 1"></a-box>
  <a-entity id="obsLight" light="type: point; color: #dfe7ff; intensity: 0; distance: 0; decay: 1" position="-2.4 2.1 -0.3"></a-entity>
  <a-box position="-2.75 0.74 -0.3" width="0.6" height="0.04" depth="1.0" color="#5a4a3a"></a-box>
  <a-box position="-2.75 0.37 0.12" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-box position="-2.75 0.37 -0.72" width="0.5" height="0.72" depth="0.04" color="#3a3029"></a-box>
  <a-box position="-2.66 0.85 -0.5" width="0.24" height="0.18" depth="0.3" color="#2d2f33"></a-box>
  <a-box position="-2.66 0.82 -0.12" width="0.2" height="0.12" depth="0.22" color="#2d2f33"></a-box>
  <a-entity id="observer" visible="false" position="-3.0 0 -0.3" rotation="0 -90 0">
    <a-cylinder radius="0.16" height="0.56" position="0 0.78 0.02" color="#141416" roughness="1"></a-cylinder>
    <a-box width="0.42" height="0.1" depth="0.2" position="0 1.02 0.02" color="#141416" roughness="1"></a-box>
    <a-sphere radius="0.11" position="0 1.2 0.03" color="#141416" roughness="1"></a-sphere>
    <a-box width="0.3" height="0.12" depth="0.42" position="0 0.53 -0.2" color="#141416" roughness="1"></a-box>
    <a-box width="0.26" height="0.45" depth="0.1" position="0 0.23 -0.38" color="#141416" roughness="1"></a-box>
  </a-entity>
  <a-box position="-3.0 0.45 -0.3" width="0.4" height="0.04" depth="0.4" color="#2e3238"></a-box>
  <a-box position="-3.19 0.72 -0.3" width="0.03" height="0.5" depth="0.4" color="#2e3238"></a-box>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-2.84 0.22 -0.46" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.14" color="#777"></a-cylinder>
  <a-cylinder radius="0.015" height="0.45" position="-3.16 0.22 -0.46" color="#777"></a-cylinder>
  <!-- cable from the booth wall along the floor, up the desk's front edge, into the relay equipment -->
  <a-box position="-1.615 0.05 -0.6" width="0.03" height="0.08" depth="0.08" color="#2a2a2a"></a-box>
  <a-entity cable="radius: 0.007; points: -1.62 0.045 -0.6, -1.64 0.02 -0.6, -1.68 0.007 -0.6, -1.95 0.007 -0.62,
    -2.25 0.007 -0.63, -2.40 0.009 -0.61, -2.435 0.04 -0.6, -2.442 0.3 -0.595, -2.442 0.70 -0.59, -2.442 0.752 -0.585,
    -2.452 0.768 -0.58, -2.50 0.767 -0.575, -2.545 0.79 -0.57"></a-entity>

  <!-- experimenter screen -->
  <a-box position="0 1.86 -1.585" width="2.12" height="1.12" depth="0.03" color="#1b1c1e"></a-box>
  <a-entity id="screen" panel="w: 2.0; h: 1.0; px: 2048; ref: 1300; bg: #0e0f11" position="0 1.86 -1.565"></a-entity>

  <a-entity id="room">
    <a-entity blob-shadow="w: 1.3; h: 0.8; opacity: 0.5" position="0 0.003 -0.3"></a-entity>
    <!-- table: top at 0.84 m -->
    <a-box position="0 0.82 -0.3" width="1.0" height="0.04" depth="0.52" material="color: #4b4a47; roughness: .7"></a-box>
    <a-box position="-0.46 0.4 -0.52" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="0.46 0.4 -0.52" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="-0.46 0.4 -0.08" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>
    <a-box position="0.46 0.4 -0.08" width="0.04" height="0.8" depth="0.04" color="#2a2a2a"></a-box>

    <!-- stand 23×23 cm, black, lights 5 cm from the top facing the player -->
    <a-entity blob-shadow="w: 0.3; h: 0.12; opacity: 0.45" position="0 0.8425 -0.46"></a-entity>
    <a-box position="0 0.955 -0.46" width="0.23" height="0.23" depth="0.02" material="color: #0d0d0e; roughness: .6"></a-box>
    <a-box position="0 0.845 -0.47" width="0.23" height="0.01" depth="0.08" material="color: #0d0d0e; roughness: .6"></a-box>
    <a-sphere id="yellow" radius="0.016" position="-0.045 1.02 -0.448"
              material="color: #3a3310; emissive: #ffd23a; emissiveIntensity: 0"></a-sphere>
    <a-sphere id="green" radius="0.016" position="0.045 1.02 -0.448"
              material="color: #0f2a12; emissive: #38ff5a; emissiveIntensity: 0"></a-sphere>

    <!-- response box 15.5×7.5×4 cm, black, spring button in the centre -->
    <a-entity blob-shadow="w: 0.2; h: 0.11; opacity: 0.45" position="0 0.8425 -0.16"></a-entity>
    <a-box position="0 0.86 -0.16" width="0.155" height="0.04" depth="0.075" material="color: #0d0d0e; roughness: .6"></a-box>
    <a-entity id="button" position="0 0.88 -0.16">
      <a-cylinder id="buttonCap" class="clickable grabbable" radius="0.016" height="0.012" position="0 0.006 0"
                  material="color: #c9c5bb; roughness: .5"></a-cylinder>
    </a-entity>

    <!-- cables: box to stand lying on the table; from the stand over the back edge, hanging
         freely, onto the floor and along it to the wall socket (one radius above each surface) -->
    <a-entity cable="radius: 0.005; points: 0 0.852 -0.19, 0 0.846 -0.215, 0.006 0.845 -0.27,
      0.008 0.845 -0.34, 0.003 0.845 -0.40, 0 0.845 -0.44"></a-entity>
    <a-entity cable="radius: 0.006; points: 0 0.846 -0.50, 0 0.846 -0.535, 0 0.846 -0.556, 0 0.836 -0.568,
      0 0.80 -0.574, -0.01 0.55 -0.582, -0.03 0.25 -0.592, -0.06 0.06 -0.61, -0.11 0.008 -0.65,
      -0.30 0.006 -0.70, -0.75 0.006 -0.69, -1.20 0.006 -0.64, -1.46 0.006 -0.61, -1.55 0.012 -0.60,
      -1.575 0.045 -0.60"></a-entity>
    <a-box position="-1.585 0.05 -0.6" width="0.03" height="0.08" depth="0.08" color="#2a2a2a"></a-box>
  </a-entity>
</a-scene>
`;
