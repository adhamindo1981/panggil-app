/**
 * Web Speech API Voice Synthesis Engine for "Panggil / نداء"
 * Announces order readiness in Indonesian, Arabic, and English.
 */

import { AppLanguage } from '@/types/database';
import { translations } from './i18n/translations';

class PagerSpeechEngine {
  private synth: SpeechSynthesis | null = null;
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.loadVoices();
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.loadVoices();
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public isSupported(): boolean {
    return typeof window !== 'undefined' && 'speechSynthesis' in window;
  }

  /**
   * Finds the best voice matching the specified language
   */
  private getBestVoiceForLanguage(lang: AppLanguage): SpeechSynthesisVoice | null {
    if (!this.voices.length) this.loadVoices();

    const targetPrefix = lang === 'id' ? 'id' : lang === 'ar' ? 'ar' : 'en';
    const exactVoice = this.voices.find((v) => v.lang.toLowerCase().startsWith(targetPrefix));
    return exactVoice || this.voices[0] || null;
  }

  /**
   * Speaks the order readiness announcement
   */
  public announceOrderReady(
    orderNumber: string,
    customerName?: string,
    lang: AppLanguage = 'id'
  ): Promise<void> {
    return new Promise((resolve) => {
      if (!this.isSupported() || !this.synth) {
        resolve();
        return;
      }

      // Cancel any ongoing speech
      this.synth.cancel();

      const text = translations[lang].speech.orderReady(orderNumber, customerName);
      const utterance = new SpeechSynthesisUtterance(text);

      const targetVoice = this.getBestVoiceForLanguage(lang);
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      utterance.lang = lang === 'id' ? 'id-ID' : lang === 'ar' ? 'ar-SA' : 'en-US';
      utterance.rate = 0.95; // Slightly slower for clarity in cafe ambience
      utterance.pitch = 1.05;

      utterance.onend = () => resolve();
      utterance.onerror = () => resolve();

      this.synth.speak(utterance);
    });
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechEngine = new PagerSpeechEngine();
