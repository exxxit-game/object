// Short vibration on the controller that pressed something. Meta recommends
// confirming every press by sight, sound and touch. Silent without a controller.
export function pulse(controllerEl, strength = 0.6, ms = 80) {
  const tc = controllerEl && controllerEl.components && controllerEl.components['tracked-controls'];
  const gamepad = tc && tc.controller && tc.controller.gamepad;
  const actuator = gamepad && gamepad.hapticActuators && gamepad.hapticActuators[0];
  if (actuator && actuator.pulse) {
    try { actuator.pulse(strength, ms); } catch (e) { /* vibration unsupported */ }
  }
}
