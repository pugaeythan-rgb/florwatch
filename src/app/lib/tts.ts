// src/lib/tts.ts
export function speak(text: string) {
  if (typeof window === 'undefined') return;
  try {
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'es-MX'; // voz en español MX (cámbiala si quieres)
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(u);
  } catch {}
}
