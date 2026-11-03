/**
 * Screen Wake Lock API Manager for "Panggil / نداء"
 * Keeps the customer's phone display awake while waiting for order pickup.
 */

class ScreenWakeLockManager {
  private wakeLock: WakeLockSentinel | null = null;
  private isRequested = false;

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'wakeLock' in navigator;
  }

  /**
   * Request screen wake lock
   */
  public async requestWakeLock(): Promise<boolean> {
    if (!this.isSupported()) return false;
    this.isRequested = true;

    try {
      this.wakeLock = await navigator.wakeLock.request('screen');

      this.wakeLock.addEventListener('release', () => {
        // Automatically re-acquire if user tab comes back to visibility
        if (this.isRequested && document.visibilityState === 'visible') {
          this.requestWakeLock();
        }
      });

      return true;
    } catch (err) {
      console.warn('Screen WakeLock failed to acquire:', err);
      return false;
    }
  }

  /**
   * Release screen wake lock
   */
  public async releaseWakeLock() {
    this.isRequested = false;
    if (this.wakeLock !== null) {
      try {
        await this.wakeLock.release();
        this.wakeLock = null;
      } catch (err) {
        console.warn('Screen WakeLock release error:', err);
      }
    }
  }

  public getIsActive(): boolean {
    return this.wakeLock !== null && !this.wakeLock.released;
  }
}

export const wakeLockManager = new ScreenWakeLockManager();
