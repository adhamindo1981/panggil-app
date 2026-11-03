/**
 * Web Audio API Engine for "Panggil / نداء"
 * Synthesizes realistic restaurant coaster pager buzzer frequencies.
 * Zero external audio files needed - works reliably offline and in low-bandwidth.
 */

class PagerAudioEngine {
  private ctx: AudioContext | null = null;
  private isBuzzing = false;
  private timerId: NodeJS.Timeout | null = null;

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  /**
   * Plays a single realistic buzzer beep pulse
   */
  public playBeepPulse(frequency = 1046.5, duration = 0.18, type: OscillatorType = 'square') {
    try {
      const ctx = this.initContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      // Smooth attack and decay envelope
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      console.warn('AudioContext playback blocked or failed:', e);
    }
  }

  /**
   * Plays realistic double-tone coaster pager alert sequence (e.g. 880Hz / 1760Hz burst)
   */
  public playDualChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Primary tone
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(880, now);
      osc1.frequency.exponentialRampToValueAtTime(1760, now + 0.15);

      gain1.gain.setValueAtTime(0.4, now);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);

      osc1.start(now);
      osc1.stop(now + 0.35);

      // Harmonized high piercing beep for ambient noise in crowded cafe
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'sine';
      osc2.frequency.setValueAtTime(2637, now + 0.1); // E7 tone
      gain2.gain.setValueAtTime(0.25, now + 0.1);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);

      osc2.start(now + 0.1);
      osc2.stop(now + 0.45);
    } catch (e) {
      console.warn('AudioContext chime failed:', e);
    }
  }

  /**
   * Starts an alarming coaster pager loop (Buzzer alarm)
   * Continues until stopAlarm() is called.
   */
  public startAlarmLoop(intervalMs = 1200) {
    if (this.isBuzzing) return;
    this.isBuzzing = true;

    const triggerBurst = () => {
      if (!this.isBuzzing) return;
      // 3 quick sharp beeps like a genuine restaurant pager
      this.playBeepPulse(2400, 0.12, 'square');
      setTimeout(() => this.playBeepPulse(2400, 0.12, 'square'), 180);
      setTimeout(() => this.playBeepPulse(2400, 0.18, 'square'), 360);
    };

    triggerBurst();
    this.timerId = setInterval(triggerBurst, intervalMs);
  }

  /**
   * Stops the continuous buzzer loop
   */
  public stopAlarmLoop() {
    this.isBuzzing = false;
    if (this.timerId) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  public getIsBuzzing(): boolean {
    return this.isBuzzing;
  }
}

export const audioEngine = new PagerAudioEngine();
