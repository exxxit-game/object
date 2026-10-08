// Moves the headset's debug link from the USB cable to Wi-Fi, so the owner can play
// untethered (an external battery strap powers the headset). After it reports success
// and the cable is unplugged, quest-check.mjs and the probe work over Wi-Fi unchanged.
// The Wi-Fi link does not survive a headset restart: then reconnect by address.
// Usage: node tools/quest-wifi.mjs         cable plugged in: switch to Wi-Fi
//        node tools/quest-wifi.mjs <ip>    no cable: reconnect to a known address
import { execFileSync } from 'node:child_process';

const PORT = 5555;
const adb = (...args) => execFileSync('adb', args, { encoding: 'utf8' }).trim();
const listed = () => adb('devices').split('\n').slice(1).map(line => line.split('\t'));
const ready = () => listed().filter(([, state]) => state === 'device').map(([id]) => id);

let ip = process.argv[2];
if (!ip) {
  const usb = ready().filter(id => !id.includes(':'));
  if (usb.length !== 1) {
    console.log(`Need exactly one headset on the cable, found ${usb.length}.`);
    process.exit(1);
  }
  ip = (adb('-s', usb[0], 'shell', 'ip', '-f', 'inet', 'addr', 'show', 'wlan0')
    .match(/inet (\d+\.\d+\.\d+\.\d+)/) || [])[1];
  if (!ip) {
    console.log('The headset is not on Wi-Fi.');
    process.exit(1);
  }
  adb('-s', usb[0], 'tcpip', String(PORT));
  await new Promise(resolve => setTimeout(resolve, 3000)); // adbd restarts in network mode
}

const target = `${ip}:${PORT}`;
console.log(adb('connect', target));
if (!ready().includes(target)) {
  const asleep = listed().some(([id, state]) => id === target && state === 'offline');
  console.log(asleep
    ? 'The headset is asleep (its Wi-Fi sleeps too): wake it with the power button or put it on, then run this again.'
    : 'No Wi-Fi link: the laptop and the headset must be on the same network.');
  process.exit(1);
}
adb('-s', target, 'reverse', 'tcp:3000', 'tcp:3000'); // the game at localhost:3000 in the headset
// "Worn" mode: the headset stays awake lying on the table, so the owner need not wear it
// for checks. It drains the battery: keep the headset charging; undo with `off`.
adb('-s', target, 'shell', 'am', 'broadcast', '-a', 'com.oculus.vrpowermanager.prox_close');
console.log(`Headset on Wi-Fi at ${target}, kept awake. Unplug the cable now.`);
console.log(`After a headset restart: node tools/quest-wifi.mjs ${ip}`);
console.log(`Let it sleep again: adb -s ${target} shell am broadcast -a com.oculus.vrpowermanager.automation_disable`);
