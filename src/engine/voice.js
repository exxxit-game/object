// Experimenter voice via the browser's speech synthesis.
// Silent when no voice for the requested language is installed.
let voice = null;

function pickVoice() {
  try {
    voice = speechSynthesis.getVoices().find(v => /^ru/i.test(v.lang)) || null;
  } catch (e) { /* speech synthesis unavailable */ }
}

try {
  pickVoice();
  speechSynthesis.onvoiceschanged = pickVoice;
} catch (e) { /* speech synthesis unavailable */ }

export function speak(text) {
  if (!voice || !window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.voice = voice;
    u.lang = voice.lang;
    u.rate = 0.92;
    u.pitch = 0.8;
    speechSynthesis.speak(u);
  } catch (e) { /* speech synthesis failed */ }
}
