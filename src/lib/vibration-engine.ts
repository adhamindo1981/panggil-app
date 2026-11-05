/**
 * HTML5 Vibration API Engine for "Panggil / نداء"
 * Provides rhythmic vibration patterns mimicking physical coaster pagers.
 */

class PagerVibrationEngine {
  private isVibrating = false;
  private intervalId: NodeJS.Timeout | null = null;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'vibrate' in navigator;
  }

  /**
   * Triggers a single vibration pattern: [buzz, pause, buzz]
   */
  public triggerPattern(pattern: number[] = [500, 200, 500]): boolean {
    if (!this.isSupported()) return false;
    try {
      return navigator.vibrate(pattern);
    } catch (e) {
      console.warn('Vibration API error:', e);
      return false;
    }
  }

  /**
   * Starts a continuous repeating vibration loop until stopped
   */
  public startRepeatingVibration(pattern: number[] = [500, 200, 500], intervalMs = 1800) {
    if (this.isVibrating || !this.isSupported()) return;
    this.isVibrating = true;

    this.triggerPattern(pattern);
    this.intervalId = setInterval(() => {
      if (!this.isVibrating) return;
      this.triggerPattern(pattern);
    }, intervalMs);
  }

  /**
   * Stops any ongoing vibration
   */
  public stop() {
    this.isVibrating = false;
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.isSupported()) {
      try {
        navigator.vibrate(0);
      } catch (e) {
        console.warn('Vibrate cancel error:', e);
      }
    }
  }

  public getIsVibrating(): boolean {
    return this.isVibrating;
  }
}

export const vibrationEngine = new PagerVibrationEngine();
