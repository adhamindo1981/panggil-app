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
   * Plays a high-urgency, piercing commercial coaster pager alarm burst
   * Designed specifically to penetrate restaurant/cafe noise:
   *  - 3 sharp, rapid square-wave pulses (960Hz -> 1200Hz -> 1440Hz)
   *  - High audible gain (0.85) with fast attack and crisp decay
   */
  public playPagerAlarmBurst() {
    try {
      const ctx = this.initContext();
      const now = ctx.currentTime;

      // Pulse frequencies: sharp industrial pager profile
      const pulses = [
        { freq: 980, start: 0, dur: 0.11, gain: 0.85 },
        { freq: 1200, start: 0.15, dur: 0.11, gain: 0.85 },
        { freq: 1470, start: 0.30, dur: 0.14, gain: 0.90 },
      ];

      pulses.forEach(({ freq, start, dur, gain: targetGain }) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Square wave cuts through ambient room noise significantly better than sine/triangle
        osc.type = 'square';
        osc.frequency.setValueAtTime(freq, now + start);

        gain.gain.setValueAtTime(0, now + start);
        gain.gain.linearRampToValueAtTime(targetGain, now + start + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + start + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + start);
        osc.stop(now + start + dur);
      });
    } catch (e) {
      console.warn('Pager alarm burst error:', e);
    }
  }

  /**
   * Alias for backward compatibility
   */
  public playPagerDoubleBeep(frequency = 980, duration = 0.15) {
    this.playPagerAlarmBurst();
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
   * Starts high-urgency continuous commercial coaster pager alarm loop
   */
  public startAlarmLoop(intervalMs = 750) {
    if (this.isBuzzing) return;
    this.isBuzzing = true;

    // Trigger immediate alarm burst
    this.playPagerAlarmBurst();

    this.timerId = setInterval(() => {
      if (!this.isBuzzing) return;
      this.playPagerAlarmBurst();
    }, intervalMs);
  }

  /**
   * Test beep for user preview
   */
  public playTestPagerBeep() {
    this.playPagerAlarmBurst();
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
