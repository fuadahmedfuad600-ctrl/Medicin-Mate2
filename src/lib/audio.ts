export const playReminderSound = (soundName: string, durationSec: number = 5) => {
  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();
    const filter = ctx.createBiquadFilter();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(filter);
    filter.connect(ctx.destination);

    const now = ctx.currentTime;
    
    // Smooth 5-second envelope
    gainNode.gain.setValueAtTime(0, now);
    
    if (soundName === 'default') {
      // Classic beep with nice harmonics, repeating over 5 seconds
      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      // Repeating beep pattern
      for (let i = 0; i < durationSec; i++) {
        const startTime = now + i;
        osc1.frequency.setValueAtTime(880, startTime);
        osc2.frequency.setValueAtTime(1760, startTime);
        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.1);
        gainNode.gain.linearRampToValueAtTime(0, startTime + 0.5);
      }
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);
      
    } else if (soundName === 'chime') {
      // Beautiful harmonic chime
      osc1.type = 'sine';
      osc2.type = 'sine';
      
      for (let i = 0; i < Math.ceil(durationSec / 2); i++) {
        const start = now + (i * 2);
        osc1.frequency.setValueAtTime(523.25, start); // C5
        osc2.frequency.setValueAtTime(659.25, start + 0.2); // E5
        
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(0.3, start + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.001, start + 1.5);
      }
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);
      
    } else if (soundName === 'digital') {
      // Modern digital pulse
      osc1.type = 'square';
      osc2.type = 'sawtooth';
      filter.type = 'lowpass';
      filter.frequency.value = 1000;
      
      for (let i = 0; i < durationSec * 2; i++) {
        const start = now + (i * 0.5);
        osc1.frequency.setValueAtTime(600, start);
        osc2.frequency.setValueAtTime(1200, start + 0.1);
        
        gainNode.gain.setValueAtTime(0, start);
        gainNode.gain.linearRampToValueAtTime(0.15, start + 0.05);
        gainNode.gain.linearRampToValueAtTime(0, start + 0.3);
      }

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);
      
    } else if (soundName === 'gentle') {
      // Smooth meditative bowl sound
      osc1.type = 'sine';
      osc2.type = 'triangle';
      
      osc1.frequency.value = 349.23; // F4
      osc2.frequency.value = 352.00; // Slight detune for phasing
      
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.linearRampToValueAtTime(0.4, now + 1.0);
      gainNode.gain.linearRampToValueAtTime(0.4, now + (durationSec - 1.5));
      gainNode.gain.linearRampToValueAtTime(0, now + durationSec);
      
      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + durationSec);
      osc2.stop(now + durationSec);
    }
  } catch (e) {
    console.error('Audio playback failed', e);
  }
};
