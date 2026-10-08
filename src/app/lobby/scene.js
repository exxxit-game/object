// The lab corridor in front of room 01's door (behind the room's back wall, z > 1.6):
// the same 1979 look and, along the north wall from left to right: a "soon" door, the
// experimenter's board (welcome and consent), door 1 (the room, src/rooms/01-control/
// scene.js) with its plaque, another "soon" door. Static parts are merged after load;
// the board and plaques change, so they stay apart. Sizes in metres; tiles follow the
// room's grid (the corridor runs x -3.4 to 3.0, z 1.65 to 3.45).
export const corridorHTML = `
<a-entity id="corridor">
  <a-entity merge-static>
    <a-plane rotation="-90 0 0" position="-0.2 0 2.55" width="6.4" height="1.8" surface="kind: linoleum"></a-plane>
    <a-plane rotation="90 0 0" position="-0.2 2.5 2.55" width="6.4" height="1.8" surface="kind: ceiling"></a-plane>
    <!-- north wall with the opening of door 1 (x 0.15 to 1.05, up to 2.05 m) -->
    <a-plane position="-1.625 1.25 1.65" width="3.55" height="2.5" surface="kind: block; tint: #8a9479"></a-plane>
    <a-plane position="2.025 1.25 1.65" width="1.95" height="2.5" surface="kind: block; tint: #8a9479"></a-plane>
    <a-plane position="0.6 2.275 1.65" width="0.9" height="0.45" surface="kind: block; tint: #8a9479"></a-plane>
    <a-plane position="-1.625 0.4 1.653" width="3.55" height="0.8" surface="kind: block; tint: #5d6650"></a-plane>
    <a-plane position="2.025 0.4 1.653" width="1.95" height="0.8" surface="kind: block; tint: #5d6650"></a-plane>
    <a-plane rotation="0 90 0" position="0.15 1.025 1.625" width="0.05" height="2.05" color="#3d3a34"></a-plane>
    <a-plane rotation="0 -90 0" position="1.05 1.025 1.625" width="0.05" height="2.05" color="#3d3a34"></a-plane>
    <a-plane rotation="90 0 0" position="0.6 2.05 1.625" width="0.9" height="0.05" color="#3d3a34"></a-plane>
    <!-- south and end walls -->
    <a-plane rotation="0 180 0" position="-0.2 1.25 3.45" width="6.4" height="2.5" surface="kind: block; tint: #8a9479"></a-plane>
    <a-plane rotation="0 180 0" position="-0.2 0.4 3.447" width="6.4" height="0.8" surface="kind: block; tint: #5d6650"></a-plane>
    <a-plane rotation="0 90 0" position="-3.4 1.25 2.55" width="1.8" height="2.5" surface="kind: block; tint: #858f74"></a-plane>
    <a-plane rotation="0 -90 0" position="3.0 1.25 2.55" width="1.8" height="2.5" surface="kind: block; tint: #858f74"></a-plane>
    <a-plane rotation="0 90 0" position="-3.397 0.4 2.55" width="1.8" height="0.8" surface="kind: block; tint: #59624c"></a-plane>
    <a-plane rotation="0 -90 0" position="2.997 0.4 2.55" width="1.8" height="0.8" surface="kind: block; tint: #59624c"></a-plane>
    <!-- rails at 0.8 m and baseboards -->
    <a-box position="-1.625 0.8 1.658" width="3.55" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="2.025 0.8 1.658" width="1.95" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-0.2 0.8 3.442" width="6.4" height="0.025" depth="0.012" color="#4a3b2c"></a-box>
    <a-box position="-3.392 0.8 2.55" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="2.992 0.8 2.55" width="0.012" height="0.025" depth="1.8" color="#4a3b2c"></a-box>
    <a-box position="-1.625 0.04 1.658" width="3.55" height="0.08" depth="0.012" color="#2b2d29"></a-box>
    <a-box position="2.025 0.04 1.658" width="1.95" height="0.08" depth="0.012" color="#2b2d29"></a-box>
    <a-box position="-0.2 0.04 3.442" width="6.4" height="0.08" depth="0.012" color="#2b2d29"></a-box>
    <a-box position="-3.392 0.04 2.55" width="0.012" height="0.08" depth="1.8" color="#2b2d29"></a-box>
    <a-box position="2.992 0.04 2.55" width="0.012" height="0.08" depth="1.8" color="#2b2d29"></a-box>
    <!-- door 1, corridor side: frame casing (the leaf itself belongs to the room) -->
    <a-box position="0.12 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="1.08 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="0.6 2.08 1.67" width="1.02" height="0.06" depth="0.04" color="#3d3a34"></a-box>
    <!-- closed doors of the rooms to come, mounted on the wall -->
    <a-box position="-3.08 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="-2.12 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="-2.6 2.08 1.67" width="1.02" height="0.06" depth="0.04" color="#3d3a34"></a-box>
    <a-entity rounded-box="width: 0.88; height: 2.03; depth: 0.03; radius: 0.006; color: #6a5641; roughness: 0.55" position="-2.6 1.02 1.665"></a-entity>
    <a-box position="-2.24 1.0 1.69" width="0.13" height="0.018" depth="0.018" material="color: #c9ccce; metalness: .8; roughness: .25"></a-box>
    <a-box position="1.84 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="2.8 1.055 1.67" width="0.06" height="2.11" depth="0.04" color="#3d3a34"></a-box>
    <a-box position="2.32 2.08 1.67" width="1.02" height="0.06" depth="0.04" color="#3d3a34"></a-box>
    <a-entity rounded-box="width: 0.88; height: 2.03; depth: 0.03; radius: 0.006; color: #6a5641; roughness: 0.55" position="2.32 1.02 1.665"></a-entity>
    <a-box position="1.96 1.0 1.69" width="0.13" height="0.018" depth="0.018" material="color: #c9ccce; metalness: .8; roughness: .25"></a-box>
    <!-- fluorescent fixtures -->
    <a-box position="-1.8 2.48 2.55" width="1.2" height="0.04" depth="0.16" material="color: #f4f6f8; emissive: #eef4ff; emissiveIntensity: 1.2"></a-box>
    <a-box position="1.2 2.48 2.55" width="1.2" height="0.04" depth="0.16" material="color: #f4f6f8; emissive: #eef4ff; emissiveIntensity: 1.2"></a-box>
    <!-- the experimenter's board frame -->
    <a-box position="-1.0 1.5 1.665" width="1.42" height="1.02" depth="0.03" color="#1b1c1e"></a-box>
  </a-entity>
  <a-entity light="type: point; color: #eef2ff; intensity: 1.6; distance: 0; decay: 0.8" position="-0.2 2.3 2.55"></a-entity>
  <a-entity id="lobbyBoard" panel="w: 1.3; h: 0.9; px: 1331; ref: 845; bg: #0e0f11" position="-1.0 1.5 1.684"></a-entity>
  <!-- plaques: room 1 beside its door, "soon" on the closed doors -->
  <a-entity id="plaqueOut" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="1.33 1.55 1.656"></a-entity>
  <a-entity id="soon1" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="-2.6 1.55 1.684"></a-entity>
  <a-entity id="soon2" panel="w: 0.32; h: 0.16; px: 640; bg: #15161a" position="2.32 1.55 1.684"></a-entity>
</a-entity>`;
