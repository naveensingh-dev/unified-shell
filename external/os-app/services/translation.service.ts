import { Injectable, signal, computed, inject, PLATFORM_ID } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser } from '@angular/common';
import { firstValueFrom } from 'rxjs';

export type Lang = 'EN' | 'HI' | 'ZH' | 'ES' | 'AR' | 'FR' | 'DE' | 'JP' | 'PT' | 'RU';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  
  private currentLang = signal<Lang>('EN');
  private translations = signal<any>({});
  private fallbackTranslations = signal<any>({});
  private isLoading = signal<boolean>(false);

  lang = this.currentLang.asReadonly();
  loading = this.isLoading.asReadonly();

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      const saved = (localStorage.getItem('naveen_os_lang') as Lang) || 'EN';
      this.initTranslations(saved);
    }
  }

  private async initTranslations(l: Lang) {
    this.isLoading.set(true);
    try {
      // Always load English as fallback
      const enData = await firstValueFrom(this.http.get('/assets/i18n/en.json'));
      this.fallbackTranslations.set(enData);
      
      if (l !== 'EN') {
        const data = await firstValueFrom(this.http.get(`/assets/i18n/${l.toLowerCase()}.json`));
        this.translations.set(data);
      } else {
        this.translations.set(enData);
      }
      
      this.currentLang.set(l);
      this.updateHtmlAttributes(l);
    } catch (e) {
      console.error('Translation load error', e);
      // Fallback to English if load fails
      this.translations.set(this.fallbackTranslations());
      this.currentLang.set('EN');
    } finally {
      this.isLoading.set(false);
    }
  }

  private updateHtmlAttributes(l: Lang) {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.dir = l === 'AR' ? 'rtl' : 'ltr';
      document.documentElement.lang = l.toLowerCase();
    }
  }

  async setLang(l: Lang) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('naveen_os_lang', l);
    }
    
    this.isLoading.set(true);
    try {
      const data = await firstValueFrom(this.http.get(`/assets/i18n/${l.toLowerCase()}.json`));
      this.translations.set(data);
      this.currentLang.set(l);
      this.updateHtmlAttributes(l);
    } catch (e) {
      console.error('Translation load error', e);
    } finally {
      this.isLoading.set(false);
    }
  }

  translate(key: string): string {
    const val = this.getValue(this.translations(), key);
    if (val !== undefined && val !== null) return val;
    
    const fallbackVal = this.getValue(this.fallbackTranslations(), key);
    return fallbackVal !== undefined && fallbackVal !== null ? fallbackVal : key;
  }

  private getValue(obj: any, key: string): any {
    const parts = key.split('.');
    let current = obj;
    for (const part of parts) {
      if (current === undefined || current === null) return undefined;
      current = current[part];
    }
    return current;
  }

  getTranslations() {
    return this.translations();
  }
}
