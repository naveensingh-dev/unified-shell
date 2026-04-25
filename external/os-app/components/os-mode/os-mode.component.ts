import { Component, HostListener, inject, signal, computed, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { TopBarComponent } from '../top-bar/top-bar.component';
import { WindowComponent } from '../window/window.component';
import { ContextMenuComponent } from '../context-menu/context-menu.component';
import { SpotlightComponent } from '../spotlight/spotlight.component';
import { DockComponent } from '../dock/dock.component';
import { WindowStore } from '../../store/window.store';
import { SettingsService } from '../../services/settings.service';
import { IconService } from '../../services/icon.service';
import { SpotlightService } from '../../services/spotlight.service';
import { TranslationService } from '../../services/translation.service';
import { TranslateDirective } from '../../core/directives/translate.directive';

@Component({
  selector: 'app-os-mode',
  standalone: true,
  imports: [
    CommonModule, TopBarComponent, WindowComponent, ContextMenuComponent, 
    SpotlightComponent, DockComponent, TranslateDirective
  ],
  template: `
    <div class="desktop-container" (contextmenu)="$event.preventDefault()" (mousemove)="onMouseMove($event)">
      <!-- NEURAL GRID BACKGROUND -->
      <div id="bg-wrap" [class]="'wp-' + settings.wallpaper()" aria-hidden="true">
        @if (settings.wallpaper() === 'dynamic-mesh' && !settings.lowMotion()) {
          <div class="neural-grid" 
               [style.-webkit-mask-position]="windowStore.isMobile() ? mobileTiltPos() : mouseMaskPos()"
               [style.mask-position]="windowStore.isMobile() ? mobileTiltPos() : mouseMaskPos()"></div>
        }
        <div class="bg-ov"></div>
      </div>

      <app-top-bar></app-top-bar>
      <app-context-menu></app-context-menu>
      <app-spotlight></app-spotlight>

      <main id="desk-area" role="main">
        @if (windowStore.isMobile()) {
          @if (!anyWindowOpen()) {
            <div class="mobile-hub fade-in">
              <div class="hub-scanner"></div>
              <header class="mobile-hub-header">
                <div class="m-v-tag">NAV_OS // v26.0</div>
                <h1 class="m-hero-title">NEURAL_COMMAND</h1>
                <p class="m-hero-sub">Angular Architect // GenAI Specialist</p>
              </header>

              <div class="m-search-wrap">
                <input type="text" [appTranslateAttr]="{ placeholder: 'SEARCH_APPS...' }" (input)="onMobileSearch($event)" [value]="mobileSearchTerm()">
              </div>
              
              <div class="mobile-sections">
                <section class="m-section">
                  <h3 class="m-sec-hd">PROFESSIONAL</h3>
                  <div class="mobile-app-grid">
                    @for (app of filteredAppsByGroup('core'); track app.id) {
                      <button class="mobile-app-card" (click)="openApp(app.id)">
                        <div class="m-card-glow"></div>
                        <div class="m-card-ico" [innerHTML]="iconService.get(app.id)"></div>
                        <span class="m-card-label">{{app.label}}</span>
                      </button>
                    }
                  </div>
                </section>

                <section class="m-section">
                  <h3 class="m-sec-hd">TECHNICAL</h3>
                  <div class="mobile-app-grid">
                    @for (app of filteredAppsByGroup('tech'); track app.id) {
                      <button class="mobile-app-card" (click)="openApp(app.id)">
                        <div class="m-card-glow"></div>
                        <div class="m-card-ico" [innerHTML]="iconService.get(app.id)"></div>
                        <span class="m-card-label">{{app.label}}</span>
                      </button>
                    }
                  </div>
                </section>

                <section class="m-section">
                  <h3 class="m-sec-hd">INTERACTIVE</h3>
                  <div class="mobile-app-grid">
                    @for (app of filteredAppsByGroup('connect'); track app.id) {
                      <button class="mobile-app-card" (click)="openApp(app.id)">
                        <div class="m-card-glow"></div>
                        <div class="m-card-ico" [innerHTML]="iconService.get(app.id)"></div>
                        <span class="m-card-label">{{app.label}}</span>
                      </button>
                    }
                  </div>
                </section>
              </div>

              <div class="mobile-quick-stats">
                <div class="m-stat-box">
                  <span class="ms-val">100</span>
                  <span class="ms-lbl">PERF</span>
                </div>
                <div class="m-stat-box">
                  <span class="ms-val">9+</span>
                  <span class="ms-lbl">YEARS</span>
                </div>
                <div class="m-stat-box">
                  <span class="ms-val">50+</span>
                  <span class="ms-lbl">PROJ</span>
                </div>
              </div>
            </div>
          }
        } @else {
          <section id="hero" class="hero-section" [class.dimmed]="anyWindowOpen()" aria-label="Professional Summary Dashboard">
            <div class="hero-content">
              <header class="hero-header-meta">
                <span class="v-tag" appTranslate="desktop.v_tag"></span>
                <span class="v-sep" aria-hidden="true">/</span>
                <span class="v-status" appTranslate="desktop.v_status"></span>
                <span class="v-sep" aria-hidden="true">/</span>
                <span class="v-avail">🟢 <span appTranslate="desktop.avail"></span></span>
              </header>

              <h1 class="hero-title" appTranslate="desktop.hero_title"></h1>
              <p class="hero-description" [appTranslate]="'desktop.hero_desc'" [useHtml]="true"></p>
              
              <nav class="hero-ctas" aria-label="Quick Actions">
                <div class="cta-group">
                  <button class="cta-btn primary" (click)="windowStore.open('sch', {width:600, height:550})" [appTranslateAttr]="{ 'aria-label': 'Schedule a strategy call' }">
                    <span appTranslate="common.schedule_call"></span>
                  </button>
                  <span class="cta-sub" appTranslate="desktop.strategy_arch"></span>
                </div>

                <div class="cta-group">
                  <button class="cta-btn secondary" (click)="windowStore.open('proj', {})" [appTranslateAttr]="{ 'aria-label': 'View projects' }">
                    <span appTranslate="common.view_projects"></span>
                  </button>
                  <span class="cta-sub" appTranslate="desktop.systems_mapped"></span>
                </div>
              </nav>

              <div class="hero-proof-row">
                <div class="metrics-grid" role="group" aria-label="Technical Metrics">
                  <div class="metric-card">
                    <span class="m-val">100</span>
                    <span class="m-lbl">LIGHTHOUSE</span>
                    <span class="m-ctx">Core AI Dashboard</span>
                  </div>
                  <div class="metric-card">
                    <span class="m-val">9+</span>
                    <span class="m-lbl">EXPERIENCE</span>
                    <span class="m-ctx">Lead Architect</span>
                  </div>
                  <div class="metric-card">
                    <span class="m-val">50+</span>
                    <span class="m-lbl">FEATURES</span>
                    <span class="m-ctx">Production Ready</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        }

        <div id="wins" aria-label="Application Windows Manager">
          @for (win of windowStore.allWindows(); track win.id) {
            <app-window [config]="win"></app-window>
          }
        </div>
      </main>

      @if (!windowStore.isMobile()) {
        <app-dock></app-dock>
      }
    </div>
  `,
  styles: [`
    .desktop-container { position: fixed; inset: 0; display: flex; flex-direction: column; background: var(--desk); overflow: hidden; }
    #bg-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; pointer-events: none; transition: background 1s var(--ease); }
    .bg-ov { position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 15% 85%, rgba(86,205,250,.04) 0%, transparent 60%), radial-gradient(ellipse 50% 40% at 88% 12%, rgba(139,147,255,.04) 0%, transparent 60%); }
    #desk-area { flex: 1; position: relative; z-index: 1; overflow: hidden; display: flex; align-items: center; justify-content: center; }
    #wins { position: absolute; inset: 0; pointer-events: none; z-index: 100; }
    #wins > * { pointer-events: auto; }

    .hero-content { max-width: 850px; width: 100%; padding: var(--win-pad); transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1); transform-origin: center center; }
    .hero-content.dimmed { opacity: 0.03; filter: blur(20px) grayscale(100%); transform: scale(0.9); pointer-events: none; }
    .hero-header-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; font-family: var(--font-m); font-size: 0.7rem !important; letter-spacing: 0.15em; color: var(--text3); text-transform: uppercase; }
    .v-tag { color: var(--ice); font-weight: 700; background: var(--ice3); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(86,205,250,0.2); }
    .v-sep { color: rgba(255,255,255,0.1); }
    .v-status { color: var(--text2); font-weight: 600; }
    .v-avail { color: var(--emerald); font-weight: 800; display: flex; align-items: center; gap: 6px; }
    .v-avail::before { content: ''; width: 6px; height: 6px; background: var(--emerald); border-radius: 50%; box-shadow: 0 0 8px var(--emerald); animation: pulse 2s infinite; }
    .hero-title { font-family: var(--font-d); font-size: 3rem !important; font-weight: 900; line-height: 1.1; margin-bottom: 12px; color: #fff; letter-spacing: -0.02em; }
    .hero-description { font-size: 1.1rem !important; color: var(--text2); line-height: 1.6; max-width: 680px; margin-bottom: 2.5rem; }
    .hero-description strong { color: var(--ice); font-weight: 700; }
    .hero-ctas { display: flex; gap: 1.5rem; margin-bottom: 3rem; }
    .cta-group { display: flex; flex-direction: column; gap: 8px; }
    .cta-btn { display: flex; align-items: center; justify-content: center; padding: 14px 28px; border-radius: 10px; font-weight: 800; font-size: 0.85rem !important; transition: all 0.2s; cursor: pointer; border: 1px solid transparent; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
    .cta-btn.primary { background: #fff; color: #000; }
    .cta-btn.primary:hover { background: var(--ice); transform: translateY(-2px); box-shadow: 0 8px 25px rgba(86,205,250,0.4); }
    .cta-btn.secondary { background: rgba(255,255,255,0.05); border-color: rgba(255,255,255,0.1); color: #fff; }
    .cta-btn.secondary:hover { border-color: var(--ice); background: rgba(86, 205, 250, 0.1); transform: translateY(-2px); }
    .cta-sub { font-family: var(--font-m); font-size: 0.6rem !important; color: var(--text3); text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; padding-left: 4px; }
    .hero-proof-row { display: flex; gap: 4rem; border-top: 1px solid rgba(255,255,255,0.05); padding-top: 2.5rem; align-items: flex-start; }
    .metrics-grid { display: flex; gap: 3.5rem; flex-shrink: 0; }
    .metric-card { display: flex; flex-direction: column; }
    .m-val { font-family: var(--font-d); font-size: 1.8rem !important; font-weight: 900; color: #fff; line-height: 1; margin-bottom: 4px; }
    .m-lbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--ice); font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; }
    .m-ctx { font-size: 0.65rem !important; color: var(--text3); margin-top: 2px; }

    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
    
    .mobile-hub { width: 100%; height: 100%; padding: 70px 20px 40px; display: flex; flex-direction: column; gap: 25px; max-width: 500px; position: relative; }
    .hub-scanner { position: absolute; top: 0; left: 0; width: 100%; height: 100px; background: linear-gradient(to bottom, rgba(86,205,250,0.05), transparent); border-bottom: 1px solid rgba(86,205,250,0.1); animation: scannerMove 4s infinite ease-in-out; pointer-events: none; }
    @keyframes scannerMove { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(80vh); } }
    .mobile-hub-header { border-left: 2px solid var(--ice); padding-left: 15px; margin-bottom: 5px; }
    .m-v-tag { font-family: var(--font-m); font-size: 0.55rem; color: var(--ice); letter-spacing: 0.2em; margin-bottom: 4px; }
    .m-hero-title { font-family: var(--font-d); font-size: 1.8rem; font-weight: 900; margin: 0; color: #fff; letter-spacing: -0.03em; }
    .m-hero-sub { font-size: 0.75rem; color: var(--text3); margin: 2px 0 0; font-weight: 600; }
    .mobile-sections { flex: 1; overflow-y: auto; display: flex; flex-direction: column; gap: 20px; padding-bottom: 20px; scrollbar-width: none; }
    .m-sec-hd { font-family: var(--font-m); font-size: 0.55rem; color: var(--ice); letter-spacing: 0.15em; margin: 0; padding-left: 5px; opacity: 0.7; }
    .m-search-wrap input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 12px; padding: 12px 16px; color: #fff; font-family: var(--font-m); font-size: 0.75rem; outline: none; transition: all 0.3s; }
    .mobile-app-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; overflow-y: auto; padding-bottom: 20px; scrollbar-width: none; flex: 1; }
    .mobile-app-card { position: relative; background: transparent; border: none; border-radius: 16px; padding: 10px; display: flex; flex-direction: column; align-items: center; gap: 12px; cursor: pointer; transition: all 0.3s var(--ease); }
    .m-card-ico { width: 64px; height: 64px; color: var(--ice); filter: drop-shadow(0 10px 15px rgba(0,0,0,0.4)); }
    ::ng-deep .m-card-ico svg { width: 100%; height: 100%; }
    .m-card-label { font-size: 0.65rem; font-weight: 800; color: #fff; text-transform: uppercase; letter-spacing: 0.05em; text-align: center; margin-top: -4px; }
    .mobile-quick-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 15px; background: rgba(255,255,255,0.02); border-radius: 16px; border: 1px solid rgba(255,255,255,0.05); }
    .m-stat-box { display: flex; flex-direction: column; align-items: center; }
    .ms-val { font-family: var(--font-d); font-size: 1.1rem; font-weight: 900; color: #fff; }
    .ms-lbl { font-family: var(--font-m); font-size: 0.5rem; color: var(--ice); font-weight: 800; letter-spacing: 0.1em; }
  `]
})
export class OsModeComponent {
  windowStore = inject(WindowStore);
  settings = inject(SettingsService);
  iconService = inject(IconService);
  ts = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);

  anyWindowOpen = computed(() => this.windowStore.allWindows().length > 0);
  mousePos = signal({ x: -1000, y: -1000 });
  mouseMaskPos = computed(() => `${this.mousePos().x - 600}px ${this.mousePos().y - 600}px`);
  
  mobileTilt = signal({ x: 0, y: 0 });
  mobileTiltPos = computed(() => {
    if (typeof window === 'undefined') return '0 0';
    const x = (window.innerWidth / 2) + (this.mobileTilt().x * 10);
    const y = (window.innerHeight / 2) + (this.mobileTilt().y * 10);
    return `${x - 600}px ${y - 600}px`;
  });

  mobileSearchTerm = signal('');
  allApps = [
    { id: 'about', label: 'About', group: 'core' }, { id: 'exp', label: 'Experience', group: 'core' }, { id: 'proj', label: 'Projects', group: 'core' }, { id: 'skills', label: 'Skills', group: 'core' },
    { id: 'sys', label: 'Overview', group: 'tech' }, { id: 'adr', label: 'ADR', group: 'tech' }, { id: 'ai', label: 'AI Lab', group: 'tech' }, { id: 'perf', label: 'Metrics', group: 'tech' }, { id: 'term', label: 'Terminal', group: 'tech' },
    { id: 'sch', label: 'Booking', group: 'connect' }, { id: 'nai', label: 'NaveenAI', group: 'connect' }, { id: 'match', label: 'Match', group: 'connect' }, { id: 'contact', label: 'Contact', group: 'connect' },
  ];

  filteredAppsByGroup(group: string) {
    const term = this.mobileSearchTerm().toLowerCase();
    return this.allApps.filter(a => a.group === group && a.label.toLowerCase().includes(term));
  }

  @HostListener('window:deviceorientation', ['$event'])
  onDeviceOrientation(e: DeviceOrientationEvent) {
    if (this.windowStore.isMobile()) {
      this.mobileTilt.set({ x: e.gamma || 0, y: e.beta || 0 });
    }
  }

  onMouseMove(e: MouseEvent) {
    if (isPlatformBrowser(this.platformId) && !this.windowStore.isMobile()) {
      this.mousePos.set({ x: e.clientX, y: e.clientY });
    }
    
    const interaction = this.windowStore.activeInteraction();
    if (interaction.type === 'drag') {
      const dx = e.clientX - interaction.startX;
      const dy = e.clientY - interaction.startY;
      this.windowStore.updatePosition(interaction.id, interaction.startT + dy, interaction.startL + dx);
    } else if (interaction.type === 'resize' && interaction.resizeDir) {
      const dx = e.clientX - interaction.startX;
      const dy = e.clientY - interaction.startY;
      let newW = interaction.startW, newH = interaction.startH, newT = interaction.startT, newL = interaction.startL;
      
      if (interaction.resizeDir.includes('r')) newW = interaction.startW + dx;
      if (interaction.resizeDir.includes('b')) newH = interaction.startH + dy;
      if (interaction.resizeDir.includes('l')) { newW = interaction.startW - dx; newL = interaction.startL + dx; }
      if (interaction.resizeDir.includes('t')) { newH = interaction.startH - dy; newT = interaction.startT + dy; }
      
      if (newW > 350 && newH > 250) {
        this.windowStore.updateBounds(interaction.id, newT, newL, newW, newH);
      }
    }
  }

  @HostListener('window:mouseup')
  onMouseUp() {
    this.windowStore.stopInteraction();
  }

  onMobileSearch(e: Event) { this.mobileSearchTerm.set((e.target as HTMLInputElement).value); }
  
  openApp(id: string) { 
    this.windowStore.open(id, {}); 
  }
}
