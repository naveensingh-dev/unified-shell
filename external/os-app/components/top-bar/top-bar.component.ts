import { Component, OnInit, OnDestroy, inject, signal, PLATFORM_ID, computed } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WindowStore } from '../../store/window.store';
import { IconService } from '../../services/icon.service';
import { TranslationService, Lang } from '../../services/translation.service';
import { TranslateDirective } from '../../core/directives/translate.directive';
import { ResumeService } from '../../services/resume.service';
import { SettingsService } from '../../services/settings.service';
import { QuantumLoaderComponent } from '../shared/quantum-loader.component';

@Component({
  selector: 'app-top-bar',
  standalone: true,
  imports: [CommonModule, TranslateDirective, QuantumLoaderComponent],
  template: `
    @if (ts.loading()) {
      <app-quantum-loader [fullScreen]="true" [appTranslateAttr]="{ label: 'common.decrypting' }"></app-quantum-loader>
    }

    <header id="prism-strip-wrapper" (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave()">
      <div id="prism-strip" role="banner" 
           [class.mobile-strip]="windowStore.isMobile()"
           [class.classic-strip]="settings.classicMode()">
        
        <!-- KINETIC LIGHT TRAIL -->
        @if (!settings.classicMode()) {
          <div class="light-trail" [style.left.px]="mouseX()" [style.opacity]="isHovering() ? 1 : 0"></div>
        }

        <div class="strip-section brand-cluster">
          <button class="brand-unit" (click)="windowStore.open('sys', {title:'System Overview'})">
            <span class="brand-ico main-logo" [innerHTML]="iconService.get('os')"></span>
            <span class="brand-name" appTranslate="topbar.brand" [useHtml]="true"></span>
          </button>
          
          @if (!windowStore.isMobile() && !settings.classicMode()) {
            <button class="nav-item mc-btn" 
                    [class.active]="windowStore.missionControl()" 
                    (click)="windowStore.toggleMissionControl()" 
                    [appTranslateAttr]="{ title: 'topbar.mission_control' }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="14" height="14">
                <rect x="3" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="3" width="7" height="7" rx="1"/>
                <rect x="14" y="14" width="7" height="7" rx="1"/>
                <rect x="3" y="14" width="7" height="7" rx="1"/>
              </svg>
            </button>
          }
        </div>

        @if (!windowStore.isMobile()) { <div class="strip-divider"></div> }

        <nav class="strip-section menu-cluster" aria-label="Work Modules" *ngIf="!windowStore.isMobile()">
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'about'"
                  (click)="handleNav('about', 'about')" appTranslate="topbar.about"></button>
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'experience'"
                  (click)="handleNav('exp', 'experience')" appTranslate="topbar.experience"></button>
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'projects'"
                  (click)="handleNav('proj', 'projects')" appTranslate="topbar.projects"></button>
        </nav>

        @if (!windowStore.isMobile()) { <div class="strip-divider"></div> }

        <!-- NEURAL LANGUAGE HUB -->
        <div class="strip-section lang-hub">
          <button class="lang-toggle" (click)="toggleLangMenu($event)" [class.active]="showLangMenu()">
            <span class="globe-ico">🌐</span>
            <span class="curr-lang">{{langNames[ts.lang()]}}</span>
          </button>

          @if (showLangMenu()) {
            <div class="lang-dropdown fade-in">
              <div class="dropdown-hd" appTranslate="topbar.select_lang"></div>
              @for (l of languages; track l) {
                <button class="lang-option" 
                        [class.active]="ts.lang() === l"
                        (click)="selectLang(l)">
                  <span class="l-name">{{langNames[l]}}</span>
                  @if (ts.lang() === l) { <span class="l-check">✓</span> }
                </button>
              }
            </div>
          }
        </div>

        @if (!windowStore.isMobile()) { <div class="strip-divider"></div> }

        <nav class="strip-section menu-cluster" aria-label="Technical Modules" *ngIf="!windowStore.isMobile()">
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'ai-lab'"
                  (click)="handleNav('ai', 'ai-lab')" appTranslate="topbar.ai_research"></button>
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'skills'"
                  (click)="handleNav('skills', 'skills')" appTranslate="topbar.skills"></button>
          <button class="nav-item" 
                  [class.active-link]="settings.classicMode() && activeSection() === 'settings'"
                  (click)="handleNav('sets', 'settings')" appTranslate="topbar.settings"></button>
        </nav>

        @if (!windowStore.isMobile()) { <div class="strip-divider"></div> }

        <div class="strip-section action-cluster" *ngIf="!windowStore.isMobile()">
          <button class="nav-item call-cta" (click)="handleNav('sch', 'contact')" appTranslate="dock.sch"></button>
          <button class="nav-item cv-cta" (click)="downloadResume()" appTranslate="common.resume"></button>
        </div>

        <div class="strip-spacer"></div>

        <div class="strip-section status-cluster">
          <button class="nav-item classic-toggle-btn" 
                  [class.active]="settings.classicMode()"
                  (click)="settings.toggleClassicMode()"
                  [title]="settings.classicMode() ? 'Switch to OS Mode' : 'Switch to Classic Mode'">
            <span class="tgl-ico">{{ settings.classicMode() ? '🖥️' : '📄' }}</span>
            <span class="tgl-txt">{{ settings.classicMode() ? 'OS_MODE' : 'CLASSIC' }}</span>
          </button>
          <div class="system-status" *ngIf="!windowStore.isMobile()">
            <span class="status-dot"></span>
            <span class="status-txt" appTranslate="common.active"></span>
          </div>
          <div class="clock-unit" aria-label="Current time">{{currentTime()}}</div>
        </div>
      </div>
    </header>
  `,
  styles: [`
    #prism-strip-wrapper {
      position: fixed; top: 0; left: 0; right: 0;
      padding: 8px 12px 0; z-index: 3000;
      display: flex; justify-content: center;
      pointer-events: none;
    }

    #prism-strip {
      pointer-events: auto;
      height: 34px; min-width: 800px;
      background: rgba(6, 8, 14, 0.6);
      backdrop-filter: blur(30px) saturate(200%);
      -webkit-backdrop-filter: blur(30px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.12);
      border-radius: 50px;
      display: flex; align-items: center; padding: 0 16px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 1px 1px rgba(255,255,255,0.1);
      position: relative;
      transition: all 0.4s var(--ease);
    }

    #prism-strip.mobile-strip {
      min-width: calc(100vw - 24px);
      justify-content: space-between;
    }

    #prism-strip.classic-strip {
      width: 100%;
      min-width: 100%;
      height: 60px;
      border-radius: 0;
      border: none;
      border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      background: rgba(255, 255, 255, 0.98);
      backdrop-filter: blur(10px);
      box-shadow: 0 2px 10px rgba(0,0,0,0.05);
      margin: 0;
      top: 0;
    }
    #prism-strip-wrapper:has(.classic-strip) {
      padding: 0;
      height: 60px;
    }
    #prism-strip.classic-strip .nav-item { color: #555; }
    #prism-strip.classic-strip .nav-item:hover { background: rgba(0,0,0,0.05); color: #000; }
    #prism-strip.classic-strip .brand-unit { color: #000; }
    #prism-strip.classic-strip .strip-divider { background: rgba(0,0,0,0.1); }
    #prism-strip.classic-strip .clock-unit { color: #000; }
    #prism-strip.classic-strip .status-txt { color: #888; }
    #prism-strip.classic-strip .lang-toggle { background: rgba(0,0,0,0.05); border-color: rgba(0,0,0,0.1); color: #000; }
    #prism-strip.classic-strip .lang-toggle .curr-lang { color: #000; }

    /* CLASSIC TOGGLE ENHANCED */
    .classic-toggle-btn {
      display: flex; align-items: center; gap: 8px;
      padding: 4px 12px; border-radius: 20px;
      background: rgba(86, 205, 250, 0.1); border: 1px solid rgba(86, 205, 250, 0.3);
      cursor: pointer; transition: all 0.3s;
    }
    .classic-toggle-btn:hover { background: rgba(86, 205, 250, 0.2); transform: translateY(-1px); }
    .classic-toggle-btn.active {
      background: #000; border-color: #333;
    }
    .classic-toggle-btn .tgl-ico { font-size: 0.9rem; }
    .classic-toggle-btn .tgl-txt { font-family: var(--font-m); font-size: 0.55rem !important; font-weight: 900; color: var(--ice); letter-spacing: 0.1em; }
    .classic-toggle-btn.active .tgl-txt { color: #fff; }

    /* KINETIC LIGHT TRAIL */
    .light-trail {
      position: absolute; top: 0; bottom: 0; width: 150px;
      background: radial-gradient(circle at center, rgba(86, 205, 250, 0.15) 0%, transparent 70%);
      pointer-events: none; transform: translateX(-50%);
      transition: left 0.15s ease-out, opacity 0.3s;
      mix-blend-mode: plus-lighter; z-index: 0;
    }

    .strip-section { display: flex; align-items: center; gap: 4px; position: relative; z-index: 1; }
    
    .strip-divider { width: 1px; height: 14px; background: rgba(255,255,255,0.1); margin: 0 12px; }
    .strip-spacer { flex: 1; }

    /* BRAND CLUSTER */
    .brand-unit { 
      display: flex; align-items: center; gap: 8px; color: #fff; font-weight: 800; 
      font-family: var(--font-d); font-size: 0.85rem !important;
      transition: transform 0.2s var(--ease);
      background: none; border: none; cursor: pointer;
    }
    .brand-unit:active { transform: scale(0.96); }
    .brand-unit ::ng-deep em { color: var(--ice); font-style: normal; }
    .brand-ico { display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; color: var(--ice); }
    .brand-ico.main-logo { width: 18px; height: 18px; }
    ::ng-deep .brand-ico svg { width: 100%; height: 100%; }

    .mc-btn { margin-left: 4px; padding: 4px; border-radius: 4px; display: flex; align-items: center; justify-content: center; background: none; border: none; cursor: pointer; color: inherit; }
    .mc-btn.active { background: rgba(86,205,250,0.2); color: var(--ice); box-shadow: 0 0 10px rgba(86,205,250,0.4); }

    /* MENU ITEMS */
    .nav-item {
      color: var(--text2); font-size: 0.75rem !important; font-weight: 600;
      padding: 4px 10px; border-radius: 6px;
      transition: all 0.2s var(--ease);
      white-space: nowrap;
      background: none; border: none; cursor: pointer;
    }
    .nav-item:hover { color: #fff; background: rgba(255,255,255,0.06); }
    .nav-item:active { transform: translateY(1px); background: rgba(255,255,255,0.1); }
    .nav-item.active-link { color: var(--ice); background: rgba(86,205,250,0.1); border-bottom: 2px solid var(--ice); border-radius: 0; }
    #prism-strip.classic-strip .nav-item.active-link { color: #000; border-color: #000; background: rgba(0,0,0,0.05); }

    /* ACTION CTAS */
    .call-cta { color: var(--emerald); }
    .cv-cta { color: var(--ice); font-weight: 800; }

    /* STATUS CLUSTER */
    .status-cluster { gap: 16px; }
    .system-status { display: flex; align-items: center; gap: 6px; }
    .status-dot { width: 6px; height: 6px; background: var(--emerald); border-radius: 50%; box-shadow: 0 0 8px var(--emerald); animation: pulse 2s infinite; }
    .status-txt { font-family: var(--font-m); font-size: 0.55rem !important; font-weight: 800; letter-spacing: 0.05em; color: var(--text3); }

    .clock-unit { 
      font-family: var(--font-m); font-size: 0.75rem !important; color: #fff; 
      min-width: 45px; text-align: right; font-weight: 600;
    }

    /* LANG HUB STYLES */
    .lang-hub { position: relative; }
    .lang-toggle { display: flex; align-items: center; gap: 6px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 20px; padding: 2px 10px; cursor: pointer; transition: all 0.2s; color: inherit; }
    .lang-toggle:hover, .lang-toggle.active { background: rgba(86, 205, 250, 0.15); border-color: var(--ice); }
    .globe-ico { font-size: 0.8rem; }
    .curr-lang { font-family: var(--font-m); font-size: 0.65rem !important; font-weight: 800; color: #fff; }

    .lang-dropdown { position: absolute; top: calc(100% + 12px); left: 50%; transform: translateX(-50%); width: 200px; background: rgba(10, 12, 20, 0.95); backdrop-filter: blur(25px); border: 1px solid rgba(255,255,255,0.15); border-radius: 12px; padding: 8px; box-shadow: 0 20px 50px rgba(0,0,0,0.6); display: flex; flex-direction: column; gap: 2px; }
    .dropdown-hd { font-family: var(--font-m); font-size: 0.55rem !important; color: var(--text3); padding: 8px 12px; letter-spacing: 0.1em; }
    .lang-option { display: flex; align-items: center; gap: 10px; padding: 10px 12px; border-radius: 8px; background: none; border: none; cursor: pointer; transition: all 0.2s; text-align: left; color: inherit; }
    .lang-option:hover { background: rgba(255,255,255,0.05); }
    .lang-option.active { background: rgba(86,205,250,0.1); }
    .l-code { font-family: var(--font-m); font-size: 0.65rem !important; font-weight: 800; color: var(--ice); width: 24px; }
    .l-name { font-size: 0.8rem !important; color: var(--text2); flex: 1; }
    .lang-option.active .l-name { color: #fff; }
    .l-check { color: var(--emerald); font-weight: 900; }

    /* NEURAL DECRYPT OVERLAY */
    .neural-decrypt-overlay {
      position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(3, 4, 14, 0.8); backdrop-filter: blur(20px);
      z-index: 9999; display: flex; align-items: center; justify-content: center;
      pointer-events: all;
    }
    .decrypt-content { text-align: center; }
    .decrypt-spinner { 
      width: 40px; height: 40px; border: 2px solid var(--ice); border-top-color: transparent; 
      border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;
      box-shadow: 0 0 15px var(--ice);
    }
    .decrypt-text { font-family: var(--font-m); color: var(--ice); font-size: 0.75rem !important; letter-spacing: 0.2em; font-weight: 800; }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
  `]
})
export class TopBarComponent implements OnInit, OnDestroy {
  windowStore = inject(WindowStore);
  iconService = inject(IconService);
  ts = inject(TranslationService);
  resumeService = inject(ResumeService);
  settings = inject(SettingsService);
  private platformId = inject(PLATFORM_ID);
  
  currentTime = signal('');
  mouseX = signal<number>(-1000);
  isHovering = signal(false);
  showLangMenu = signal(false);
  private clockInterval?: any;

  languages: Lang[] = ['EN', 'HI', 'ZH', 'ES', 'AR', 'FR', 'DE', 'JP', 'PT', 'RU'];
  langNames: Record<string, string> = {
    EN: 'English', 
    HI: 'हिन्दी', 
    ZH: '中文', 
    ES: 'Español', 
    AR: 'العربية', 
    FR: 'Français',
    DE: 'Deutsch',
    JP: '日本語',
    PT: 'Português',
    RU: 'Русский'
  };

  activeSection = signal<string>('home');
  scrollProgress = signal<number>(0);

  ngOnInit() {
    this.updateClock();
    if (isPlatformBrowser(this.platformId)) {
      this.clockInterval = setInterval(() => this.updateClock(), 1000);
      document.addEventListener('click', () => this.showLangMenu.set(false));

      // SCROLL SPY & PROGRESS
      window.addEventListener('scroll', () => {
        if (!this.settings.classicMode()) return;
        
        // Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        this.scrollProgress.set(scrolled);

        // Spy
        const sections = ['home', 'about', 'skills', 'experience', 'ai-lab', 'contact', 'projects'];
        let current = 'home';
        for (const section of sections) {
          const el = document.getElementById(section);
          if (el) {
            const rect = el.getBoundingClientRect();
            if (rect.top <= 150) current = section;
          }
        }
        this.activeSection.set(current);
      }, { passive: true });
    }
  }

  ngOnDestroy() {
    if (this.clockInterval) clearInterval(this.clockInterval);
  }

  toggleLangMenu(e: Event) {
    e.stopPropagation();
    this.showLangMenu.update(v => !v);
  }

  selectLang(l: Lang) {
    this.ts.setLang(l);
    this.showLangMenu.set(false);
  }

  handleNav(id: string, sectionId?: string) {
    if (this.settings.classicMode() && sectionId) {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      this.windowStore.open(id, {});
    }
  }

  onMouseMove(e: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      const strip = document.getElementById('prism-strip');
      if (strip) {
        const rect = strip.getBoundingClientRect();
        this.mouseX.set(e.clientX - rect.left);
        this.isHovering.set(true);
      }
    }
  }

  onMouseLeave() {
    this.isHovering.set(false);
  }

  downloadResume() {
    if (isPlatformBrowser(this.platformId)) {
      this.resumeService.download();
    }
  }

  private updateClock() {
    const d = new Date();
    const lang = this.ts.lang().toLowerCase();
    this.currentTime.set(d.toLocaleTimeString(lang, { hour: '2-digit', minute: '2-digit', hour12: false }));
  }
}
