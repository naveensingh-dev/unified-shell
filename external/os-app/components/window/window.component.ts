import { Component, Input, inject, HostListener, OnInit, Type, signal, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowConfig } from '../../store/window.store';
import { WindowStore } from '../../store/window.store';
import { IconService } from '../../services/icon.service';
import { APP_REGISTRY } from '../app.registry';
import { QuantumLoaderComponent } from '../shared/quantum-loader.component';
import { TranslateDirective } from '../../core/directives/translate.directive';

@Component({
  selector: 'app-window',
  standalone: true,
  imports: [CommonModule, QuantumLoaderComponent, TranslateDirective],
  template: `
    <div class="win win-advanced" 
         [class.focused]="config.focused"
         [class.maximized]="config.maximized || windowStore.isMobile()"
         [class.minimized]="config.minimized"
         [class.mission-mode]="windowStore.missionControl()"
         [class.mobile-win]="windowStore.isMobile()"
         [class.is-dragging]="windowStore.activeInteraction().id === config.id && windowStore.activeInteraction().type === 'drag'"
         [class.is-resizing]="windowStore.activeInteraction().id === config.id && windowStore.activeInteraction().type === 'resize'"
         [style.z-index]="windowStore.missionControl() ? 2500 : config.zIndex"
         [style.width.px]="config.maximized || windowStore.missionControl() || windowStore.isMobile() ? null : config.width"
         [style.height.px]="config.maximized || windowStore.missionControl() || windowStore.isMobile() ? null : config.height"
         [style.top.px]="config.maximized || windowStore.missionControl() || windowStore.isMobile() ? 0 : config.top"
         [style.left.px]="config.maximized || windowStore.missionControl() || windowStore.isMobile() ? 0 : config.left"
         (mousedown)="onWindowInteraction()"
         role="dialog"
         [attr.aria-label]="config.title"
         aria-modal="false"
         tabindex="-1"
         #windowRef>
      
      <div class="win-sheen"></div>

      <div class="win-h" (mousedown)="onHeaderMouseDown($event)">
        <div class="win-ctrls">
          @if (windowStore.isMobile()) {
            <button class="m-back-btn" (click)="windowStore.minimizeAll()" [appTranslateAttr]="{ 'aria-label': 'Back to Hub' }">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M15 18l-6-6 6-6"/></svg>
              <span>HUB</span>
            </button>
          } @else {
            <button class="win-btn close" (click)="windowStore.close(config.id)" [appTranslateAttr]="{ 'aria-label': 'Close window' }">
              <svg viewBox="0 0 10 10"><path d="M1 1l8 8M9 1L1 9" stroke="currentColor" stroke-width="1.2"/></svg>
            </button>
            <button class="win-btn min" (click)="windowStore.toggleMinimize(config.id)" [appTranslateAttr]="{ 'aria-label': 'Minimize window' }">
              <svg viewBox="0 0 10 10"><path d="M1 5h8" stroke="currentColor" stroke-width="1.2"/></svg>
            </button>
            <button class="win-btn max" (click)="windowStore.toggleMaximize(config.id)" [appTranslateAttr]="{ 'aria-label': 'Toggle maximize' }">
              <svg viewBox="0 0 10 10"><rect x="1.5" y="1.5" width="7" height="7" fill="none" stroke="currentColor" stroke-width="1.2"/></svg>
            </button>
          }
        </div>
        <div class="win-t" [class.m-t]="windowStore.isMobile()">
          <span class="win-ico" [innerHTML]="iconService.get(config.id)"></span>
          <span class="win-lbl">{{config.title}}</span>
        </div>
        <div class="win-r" [class.m-r]="windowStore.isMobile()">
          @if (windowStore.isMobile()) {
            <button class="m-close-ico" (click)="windowStore.close(config.id)">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
            </button>
          }
        </div>
      </div>

      <div class="win-b">
        @if (!appComponent()) {
          <app-quantum-loader [label]="'INITIALIZING_' + config.title.toUpperCase().replace(' ', '_')"></app-quantum-loader>
        } @else {
          @defer (on timer(200ms)) {
            <ng-container *ngComponentOutlet="appComponent();"></ng-container>
          } @placeholder {
             <div class="win-skeleton">
                <div class="skele-bar"></div>
                <div class="skele-grid">
                  <div class="skele-box"></div>
                  <div class="skele-box"></div>
                </div>
             </div>
          }
        }
      </div>

      @if (!config.maximized && !windowStore.missionControl() && !windowStore.isMobile()) {
        <div class="r-e r-t" (mousedown)="onResizeStart($event, 't')"></div>
        <div class="r-e r-r" (mousedown)="onResizeStart($event, 'r')"></div>
        <div class="r-e r-b" (mousedown)="onResizeStart($event, 'b')"></div>
        <div class="r-e r-l" (mousedown)="onResizeStart($event, 'l')"></div>
        <div class="r-c r-tl" (mousedown)="onResizeStart($event, 'tl')"></div>
        <div class="r-c r-tr" (mousedown)="onResizeStart($event, 'tr')"></div>
        <div class="r-c r-bl" (mousedown)="onResizeStart($event, 'bl')"></div>
        <div class="r-c r-br" (mousedown)="onResizeStart($event, 'br')"></div>
      }
    </div>
  `,
  styles: [`
    .win {
      position: absolute; display: flex; flex-direction: column;
      background: rgba(10, 15, 25, 0.45);
      backdrop-filter: blur(50px) saturate(200%);
      -webkit-backdrop-filter: blur(50px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      box-shadow: 
        0 40px 80px -20px rgba(0, 0, 0, 0.8),
        inset 0 1px 1px rgba(255, 255, 255, 0.2);
      overflow: hidden;
      transition: opacity 0.4s var(--ease), width 0.4s var(--spring), height 0.4s var(--spring), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
      will-change: transform, width, height, opacity;
      transform-origin: center center;
      min-width: 320px; min-height: 200px;
      outline: none;
      top: 0; left: 0;
    }
    .win::before {
      content: ''; position: absolute; inset: -2px; z-index: -1;
      background: linear-gradient(135deg, rgba(0,242,255,0.4), rgba(139,147,255,0.1), rgba(255,107,122,0.4));
      background-size: 200% 200%;
      animation: aura-flow 8s ease infinite;
      border-radius: 22px; filter: blur(15px); opacity: 0;
      transition: opacity 0.5s var(--ease); pointer-events: none;
    }
    .win-sheen {
      position: absolute; inset: 0; z-index: 100; pointer-events: none;
      background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 30%);
      border-radius: inherit;
    }
    .win.focused { 
      border-color: rgba(255, 255, 255, 0.25);
      box-shadow: 
        0 50px 100px -15px rgba(0, 0, 0, 1),
        0 0 40px rgba(0, 242, 255, 0.15),
        inset 0 1px 1px rgba(255, 255, 255, 0.3);
    }
    .win.focused::before { opacity: 1; }
    
    .win.maximized, .win.mobile-win { border-radius: 0; border: none; }
    .win.maximized::before, .win.mobile-win::before, .win.maximized .win-sheen, .win.mobile-win .win-sheen { display: none; }
    
    .win.maximized { 
      inset: 0 !important; width: 100vw !important; height: calc(100vh - 32px) !important; 
      border-radius: 0; margin-top: 32px; border: none; 
    }
    .win.mobile-win {
      inset: 0 !important;
      width: 100vw !important;
      border-radius: 0 !important;
      margin-top: 32px !important;
      height: calc(100dvh - 32px) !important; 
      transform: none !important;
    }
    .m-back-btn {
      display: flex; align-items: center; gap: 4px; background: none; border: none;
      color: var(--ice); font-family: var(--font-m); font-size: 0.6rem; font-weight: 900;
      cursor: pointer; padding: 0;
    }
    .m-back-btn svg { width: 16px; height: 16px; }
    .m-close-ico {
      background: rgba(255, 95, 87, 0.2); border: 1px solid rgba(255, 95, 87, 0.5); 
      color: #ff5f57; padding: 6px; cursor: pointer; border-radius: 8px;
      display: flex; align-items: center; justify-content: center;
      box-shadow: 0 0 15px rgba(255, 95, 87, 0.2);
      transition: all 0.2s;
    }
    .m-close-ico:active {
      background: #ff5f57; color: #fff; transform: scale(0.9);
    }
    .m-close-ico svg { width: 18px; height: 18px; }
    .win-t.m-t { margin-right: 0; }
    .win-r.m-r { flex-shrink: 0; margin-left: 10px; }
    .win.minimized { 
      opacity: 0; pointer-events: none; 
      transform: scale(0.1) translateY(500px) !important; 
    }

    .win.is-dragging, .win.is-resizing { transition: none !important; }
    
    .win.mission-mode {
      position: relative !important;
      width: 350px !important;
      height: 280px !important;
      transform: scale(1) !important;
      margin: 10px; cursor: pointer;
      transition: all 0.4s var(--spring) !important;
      box-shadow: 0 15px 35px rgba(0,0,0,0.6) !important;
    }
    .win-h {
      height: 44px; background: rgba(0,0,0,0.2);
      display: flex; align-items: center; padding: 0 16px;
      cursor: grab; flex-shrink: 0; 
      border-bottom: 1px solid rgba(255,255,255,0.05);
      gap: 12px; position: relative; z-index: 101;
    }
    .win-h:active { cursor: grabbing; }
    .win-ctrls { display: flex; gap: 8px; flex-shrink: 0; align-items: center; }
    .win-btn { 
      width: 12px; height: 12px; border-radius: 50%; border: none; cursor: pointer; 
      display: flex; align-items: center; justify-content: center;
      color: transparent; transition: all 0.2s;
      padding: 0;
    }
    .win-btn svg { width: 6px; height: 6px; }
    .win-h:hover .win-btn { color: rgba(0,0,0,0.5); }
    .win-btn.close { background: #ff5f57; }
    .win-btn.min { background: #febc2e; }
    .win-btn.max { background: #28c840; }
    .win-t {
      flex: 1; display: flex; align-items: center; justify-content: center; gap: 8px;
      pointer-events: none; margin-right: 60px;
    }
    .win-ico { display: flex; align-items: center; justify-content: center; width: 14px; height: 14px; color: var(--text3); }
    ::ng-deep .win-ico svg { width: 100%; height: 100%; }
    .win-lbl { font-family: var(--font-m); font-size: 0.68rem !important; color: var(--text2); letter-spacing: 0.02em; text-transform: lowercase; }
    
    .win-skeleton { padding: 40px; display: flex; flex-direction: column; gap: 20px; }
    .skele-bar { height: 30px; width: 60%; background: rgba(255,255,255,0.05); border-radius: 8px; animation: pulse 2s infinite; }
    .skele-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
    .skele-box { height: 150px; background: rgba(255,255,255,0.03); border-radius: 12px; animation: pulse 2s infinite; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }

    .win-b { 
      flex: 1 1 auto; position: relative; 
      background: #000;
      display: flex; flex-direction: column;
      overflow: hidden; 
      padding: 0 !important; 
      min-height: 0;
    }
    .r-e { position: absolute; z-index: 10; }
    .r-c { position: absolute; width: 16px; height: 16px; z-index: 11; }
    .r-t { top: 0; left: 16px; right: 16px; height: 6px; cursor: ns-resize; }
    .r-r { top: 16px; bottom: 16px; right: 0; width: 6px; cursor: ew-resize; }
    .r-b { bottom: 0; left: 16px; right: 16px; height: 6px; cursor: ns-resize; }
    .r-l { top: 16px; bottom: 16px; left: 0; width: 6px; cursor: ew-resize; }
    .r-tl { top: 0; left: 0; cursor: nwse-resize; }
    .r-tr { top: 0; right: 0; cursor: nesw-resize; }
    .r-bl { bottom: 0; left: 0; cursor: nesw-resize; }
    .r-br { bottom: 0; right: 0; cursor: nwse-resize; }
  `]
})
export class WindowComponent implements OnInit {
  @Input({ required: true }) config!: WindowConfig;
  windowStore = inject(WindowStore);
  iconService = inject(IconService);

  appComponent = signal<Type<any> | null>(null);

  @ViewChild('windowRef') windowRef!: ElementRef<HTMLElement>;

  async ngOnInit() {
    const loader = APP_REGISTRY[this.config.id];
    if (loader) {
      const component = await loader();
      this.appComponent.set(component);
    }
  }

  onWindowInteraction() {
    if (this.windowStore.missionControl()) {
      this.windowStore.focus(this.config.id);
      this.windowStore.toggleMissionControl();
    } else {
      this.windowStore.focus(this.config.id);
    }
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(e: KeyboardEvent) {
    if (!this.config.focused) return;

    if (e.key === 'Tab') {
      this.trapFocus(e);
    }
    if (e.key === 'Escape') {
      this.windowStore.close(this.config.id);
    }
  }

  private trapFocus(e: KeyboardEvent) {
    if (!this.windowRef) return;
    const el = this.windowRef.nativeElement;
    const focusableElements = el.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;

    const first = focusableElements[0] as HTMLElement;
    const last = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === first) {
        last.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  onHeaderMouseDown(e: MouseEvent) {
    if (this.config.maximized || this.windowStore.missionControl() || this.windowStore.isMobile()) return;
    this.windowStore.startDrag(this.config.id, e.clientX, e.clientY, this.config.top, this.config.left);
    e.preventDefault();
  }

  onResizeStart(e: MouseEvent, dir: string) {
    if (this.windowStore.missionControl() || this.windowStore.isMobile()) return;
    this.windowStore.startResize(this.config.id, dir, e.clientX, e.clientY, this.config.width, this.config.height, this.config.top, this.config.left);
    e.preventDefault();
    e.stopPropagation();
  }
}
