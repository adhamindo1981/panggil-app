/**
 * Web Audio API Engine for "Panggil / نداء"
 * Upgraded Commercial Background Survival & Pager Synthesis Engine:
 *  - iOS Safari & Android Chrome Background Keep-Alive (Active Media Session via silent carrier loop)
 *  - Prevents WebSocket / Realtime suspension when phone screen is locked or pocketed
 *  - High-decibel synthesized square-wave pager double-beep (880Hz)
 */

class PagerAudioEngine {
  private ctx: AudioContext | null = null;
  private isBuzzing = false;
  private timerId: NodeJS.Timeout | null = null;
  private keepAliveOsc: OscillatorNode | null = null;
  private keepAliveGain: GainNode | null = null;
  private isUnlocked = false;

  private initContext(): AudioContext {
    if (!this.ctx || this.ctx.state === 'closed') {
      const AudioContextClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume().catch(console.warn);
    }
    return this.ctx;
  }

  /**
   * Unlocks AudioContext & initiates near-inaudible Background Keep-Alive loop
   * Critical for mobile background survival (iOS Safari & Android Chrome WebSocket continuity)
   */
  public async unlockAudioAndKeepAlive(): Promise<boolean> {
    try {
      const ctx = this.initContext();
      if (ctx.state === 'suspended') {
        await ctx.resume();
      }

      this.isUnlocked = true;

      // Setup near-inaudible background carrier loop if not already running
      if (!this.keepAliveOsc) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // 40Hz sub-audible carrier at microscopic gain (0.0001)
        osc.type = 'sine';
        osc.frequency.setValueAtTime(40, ctx.currentTime);
        gain.gain.setValueAtTime(0.0001, ctx.currentTime);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        this.keepAliveOsc = osc;
        this.keepAliveGain = gain;
      }

      // Configure Media Session API for iOS/Android lock screen continuity
      if (typeof window !== 'undefined' && 'mediaSession' in navigator) {
        try {
          navigator.mediaSession.metadata = new MediaMetadata({
            title: 'Panggil / نداء — Coaster Pager Active',
            artist: 'Monitoring Order Readiness',
            album: 'Smart Digital Pager',
          });
          navigator.mediaSession.playbackState = 'playing';

          // Handle media key actions to keep session alive
          navigator.mediaSession.setActionHandler('play', () => {
            if (this.ctx?.state === 'suspended') this.ctx.resume();
          });
          navigator.mediaSession.setActionHandler('pause', () => {
            // keep session active
          });
        } catch {
          // ignore MediaSession unsupported actions
        }
      }

      return true;
    } catch (e) {
      console.warn('Failed to unlock AudioContext / Keep-Alive:', e);
      return false;
    }
  }

  public getIsUnlocked(): boolean {
    return this.isUnlocked && this.ctx?.state === 'running';
  }

  /**
   * Plays a single short beep pulse (keypad clicks, UI feedback, buzz bursts)
   */
  public playBeepPulse(frequency = 800, duration = 0.08, type: OscillatorType = 'sine') {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + duration);
    } catch (e) {
      console.warn('Beep pulse error:', e);
    }
  }

  /**
   * Plays a high-decibel synthesized square-wave pager double-beep (880Hz)
   */
  public playPagerDoubleBeep(frequency = 880, duration = 0.15) {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Beep 1
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'square';
      osc1.frequency.setValueAtTime(frequency, now);

      gain1.gain.setValueAtTime(0, now);
      gain1.gain.linearRampToValueAtTime(0.45, now + 0.02);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + duration);

      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start(now);
      osc1.stop(now + duration);

      // Beep 2 (Interspersed burst: 880Hz + 1760Hz harmonic)
      const delay = duration + 0.08;
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'square';
      osc2.frequency.setValueAtTime(frequency * 2, now + delay);

      gain2.gain.setValueAtTime(0, now + delay);
      gain2.gain.linearRampToValueAtTime(0.4, now + delay + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + delay + duration);

      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(now + delay);
      osc2.stop(now + delay + duration);
    } catch (e) {
      console.warn('Pager beep playback error:', e);
    }
  }

  /**
   * Plays welcoming double chime
   */
  public playDualChime() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.exponentialRampToValueAtTime(1760, now + 0.18);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.35);
    } catch (e) {
      console.warn('Chime error:', e);
    }
  }

  /**
   * Starts high-urgency continuous pager buzzer alarm loop (880Hz double-beep pattern)
   */
  public startAlarmLoop(intervalMs = 1100) {
    if (this.isBuzzing) return;
    this.isBuzzing = true;

    // Trigger immediate double-beep
    this.playPagerDoubleBeep(880, 0.16);

    this.timerId = setInterval(() => {
      if (!this.isBuzzing) return;
      this.playPagerDoubleBeep(880, 0.16);
    }, intervalMs);
  }

  /**
   * Stops buzzer loop
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
