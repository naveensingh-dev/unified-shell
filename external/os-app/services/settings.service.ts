import { Injectable, signal, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type OSTheme = 'classic-dark' | 'neon-pulse' | 'minimal-light' | 'high-contrast';
export type Wallpaper = 'dynamic-mesh' | 'aurora-gradient' | 'solid-slate' | 'cyber-grid';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  private platformId = inject(PLATFORM_ID);
  private isBrowser = isPlatformBrowser(this.platformId);

  // Use a number for pixel-perfect control
  fontSize = signal<number>(this.getStoredNumber('os-font-size-px', 18));
  theme = signal<OSTheme>(this.getStoredString('os-theme', 'classic-dark') as OSTheme);
  wallpaper = signal<Wallpaper>(this.getStoredString('os-wallpaper', 'dynamic-mesh') as Wallpaper);
  lowMotion = signal<boolean>(this.getStoredString('os-low-motion', 'false') === 'true');
  classicMode = signal<boolean>(this.getStoredString('os-classic-mode', 'false') === 'true');

  constructor() {
    // Persistence
    effect(() => this.setStoredString('os-font-size-px', this.fontSize().toString()));
    effect(() => this.setStoredString('os-theme', this.theme()));
    effect(() => this.setStoredString('os-wallpaper', this.wallpaper()));
    effect(() => this.setStoredString('os-low-motion', this.lowMotion().toString()));
    effect(() => this.setStoredString('os-classic-mode', this.classicMode().toString()));

    // Apply System State to Root
    effect(() => {
      if (!this.isBrowser) return;
      const root = document.documentElement;
      
      // HD Font Scaling
      root.style.setProperty('--font-size-base', `${this.fontSize()}px`);
      
      const themes: OSTheme[] = ['classic-dark', 'neon-pulse', 'minimal-light', 'high-contrast'];
      const wallpapers: Wallpaper[] = ['dynamic-mesh', 'aurora-gradient', 'solid-slate', 'cyber-grid'];
      
      themes.forEach(t => root.classList.remove(`theme-${t}`));
      wallpapers.forEach(w => root.classList.remove(`wp-${w}`));
      
      root.classList.add(`theme-${this.theme()}`);
      root.classList.add(`wp-${this.wallpaper()}`);
      
      if (this.lowMotion()) root.classList.add('low-motion');
      else root.classList.remove('low-motion');

      if (this.classicMode()) root.classList.add('classic-mode');
      else root.classList.remove('classic-mode');
    });
  }

  private getStoredString(key: string, fallback: string): string {
    if (this.isBrowser) {
      return localStorage.getItem(key) || fallback;
    }
    return fallback;
  }

  private getStoredNumber(key: string, fallback: number): number {
    if (this.isBrowser) {
      const val = localStorage.getItem(key);
      return val ? Number(val) : fallback;
    }
    return fallback;
  }

  private setStoredString(key: string, val: string) {
    if (this.isBrowser) {
      localStorage.setItem(key, val);
    }
  }

  updateFontSize(size: number) { 
    if (size >= 10 && size <= 24) {
      this.fontSize.set(size); 
    }
  }
  updateTheme(theme: OSTheme) { this.theme.set(theme); }
  updateWallpaper(wp: Wallpaper) { this.wallpaper.set(wp); }
  toggleLowMotion() { this.lowMotion.update(v => !v); }
  toggleClassicMode() { this.classicMode.update(v => !v); }
}
