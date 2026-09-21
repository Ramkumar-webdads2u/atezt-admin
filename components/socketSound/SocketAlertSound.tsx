export const playAlertSound = () => {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    // Two-tone alert: high beep → low beep
    const tones = [
      { freq: 880, start: 0, duration: 0.18 },
      { freq: 660, start: 0.22, duration: 0.18 },
    ];
    tones.forEach(({ freq, start, duration }) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
      gain.gain.exponentialRampToValueAtTime(
        0.001,
        ctx.currentTime + start + duration,
      );
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    });
  } catch {
    // AudioContext not available (SSR / blocked) — fail silently
  }
};

export const startAlertSound = (): (() => void) => {
  try {
    const ctx = new (
      window.AudioContext || (window as any).webkitAudioContext
    )();
    let stopped = false;

    const playBeep = () => {
      if (stopped) return;
      const tones = [
        { freq: 880, start: 0, duration: 0.18 },
        { freq: 660, start: 0.22, duration: 0.18 },
      ];
      tones.forEach(({ freq, start, duration }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.35, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + start + duration,
        );
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      });
      // Repeat every 1.2s
      setTimeout(() => playBeep(), 1200);
    };

    playBeep();

    return () => {
      stopped = true;
      ctx.close();
    };
  } catch {
    return () => {};
  }
};
