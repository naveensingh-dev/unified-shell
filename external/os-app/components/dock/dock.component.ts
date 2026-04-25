import { Component, inject, signal, ElementRef, ViewChild, PLATFORM_ID, computed, AfterViewInit, HostListener } from '@angular/core';
import { CommonModule, isPlatformBrowser, NgTemplateOutlet } from '@angular/common';
import { WindowStore } from '../../store/window.store';
import { IconService } from '../../services/icon.service';
import { TranslateDirective } from '../../core/directives/translate.directive';
import { ResumeService } from '../../services/resume.service';
import { TranslationService } from '../../services/translation.service';

interface DockItem {
  id: string;
  label: string;
  localizedLabel?: string;
  color: string;
  action?: () => void;
}

interface ItemState {
  size: number;
  transform: string;
  zIndex: number;
}

@Component({
  selector: 'app-dock',
  standalone: true,
  imports: [CommonModule, TranslateDirective, NgTemplateOutlet],
  template: `
    <nav id="dock-system" role="navigation" aria-label="Hyper-3D Bionic Dock">
      <div class="dock-perspective-box" #dockShelf (mousemove)="onMouseMove($event)" (mouseleave)="onMouseLeave()">
        
        <!-- THE CRYSTAL FLOOR (Background layer at Z:0) -->
        <div class="dock-floor">
          <div class="floor-glow" [style.left.px]="mouseX()" [style.background]="activeGlow()"></div>
        </div>

        <div id="dock-track">
          @for (item of coreItems; track item.id) {
            <ng-container *ngTemplateOutlet="dockItemTpl; context: { $implicit: item }"></ng-container>
          }
          <div class="dk-divider small" aria-hidden="true"></div>

          @for (item of techItems; track item.id) {
            <ng-container *ngTemplateOutlet="dockItemTpl; context: { $implicit: item }"></ng-container>
          }
          <div class="dk-divider small" aria-hidden="true"></div>

          @for (item of connectItems; track item.id) {
            <ng-container *ngTemplateOutlet="dockItemTpl; context: { $implicit: item }"></ng-container>
          }

          <div class="dk-divider" aria-hidden="true"></div>

          <div class="dk-slot" [style.width.px]="itemStates()['desktop']?.size || BASE_SIZE">
            <button class="dk-item" (click)="windowStore.minimizeAll()" aria-label="Hide All Windows"
                 [style.transform]="itemStates()['desktop']?.transform || 'none'"
                 [style.z-index]="itemStates()['desktop']?.zIndex || 1">
              <div class="dk-unit" style="--glow: var(--text3)">
                <div class="dk-icon-plate"><span class="dk-ico" [innerHTML]="iconService.get('desktop')"></span></div>
                <div class="dk-shadow"></div>
                <div class="dk-reflection" [innerHTML]="iconService.get('desktop')"></div>
              </div>
              <div class="dk-tooltip" appTranslate="common.hide_windows"></div>
            </button>
          </div>
        </div>

        <ng-template #dockItemTpl let-item>
            <div class="dk-slot" [style.width.px]="itemStates()[item.id]?.size || BASE_SIZE">
              <button class="dk-item" 
                   [class.open]="windowStore.isWindowOpen()(item.id)"
                   [class.animate-jump]="jumpingIcon() === item.id"
                   (click)="launchItem(item)"
                   [attr.aria-label]="'Launch ' + item.label"
                   [style.transform]="itemStates()[item.id]?.transform || 'none'"
                   [style.z-index]="itemStates()[item.id]?.zIndex || 1">
                
                <!-- 3D FLOATING ICON UNIT -->
                <div class="dk-unit" [style.--glow]="item.color">
                  <div class="dk-icon-plate">
                    <span class="dk-ico" [innerHTML]="iconService.get(item.id)" [attr.aria-label]="item.label + ' icon'"></span>
                  </div>
                  
                  <!-- 3D Depth Shadow -->
                  <div class="dk-shadow"></div>
                  
                  <!-- Real-time Reflection -->
                  <div class="dk-reflection" [innerHTML]="iconService.get(item.id)"></div>
                </div>

                @if (windowStore.isWindowOpen()(item.id)) {
                  <div class="dk-indicator" [class.active]="windowStore.focusedId() === item.id"></div>
                }

                <div class="dk-tooltip" [appTranslate]="item.localizedLabel || ''">{{ item.localizedLabel ? '' : item.label }}</div>
              </button>
            </div>
        </ng-template>
      </div>
    </nav>
  `,
  styles: [`
    #dock-system {
      position: fixed; bottom: 0; left: 0; right: 0;
      display: flex; justify-content: center; z-index: 2000;
      pointer-events: none; padding-bottom: 20px;
    }

    .dock-perspective-box {
      position: relative; display: flex; align-items: flex-end;
      padding: 0 20px; height: 120px; /* Safe area for 3D lifting */
      perspective: 1200px; pointer-events: auto;
    }

    /* THE CRYSTAL FLOOR Layer (Stays grounded) */
    .dock-floor {
      position: absolute; bottom: 0; left: 0; right: 0;
      height: 76px; background: rgba(10, 12, 20, 0.5);
      backdrop-filter: blur(40px) saturate(200%);
      -webkit-backdrop-filter: blur(40px) saturate(200%);
      border: 1px solid rgba(255, 255, 255, 0.15);
      border-radius: 28px; z-index: 0;
      box-shadow: 0 30px 60px rgba(0,0,0,0.7), inset 0 1px 1px rgba(255,255,255,0.2);
      transform: rotateX(15deg); /* Tilted perspective */
      overflow: hidden;
    }

    .floor-glow {
      position: absolute; top: 0; bottom: 0; width: 200px;
      pointer-events: none; transform: translateX(-50%);
      transition: left 0.15s ease-out, background 0.3s;
      opacity: 0.2; z-index: 1;
    }

    #dock-track {
      display: flex; align-items: flex-end; gap: 10px; 
      position: relative; z-index: 2; transform-style: preserve-3d;
      padding-bottom: 14px;
    }

    .dk-slot {
      display: flex; justify-content: center; align-items: flex-end;
      height: 60px; transition: width 0.2s cubic-bezier(0.2, 0, 0, 1);
    }

    .dk-item {
      position: relative; background: transparent; border: none; padding: 0;
      width: 56px; height: 56px; transform-origin: bottom center;
      will-change: transform, width; transform-style: preserve-3d;
      cursor: pointer; outline: none;
    }

    /* 3D UNIT SYSTEM */
    .dk-unit {
      width: 100%; height: 100%; transform-style: preserve-3d;
      transition: transform 0.2s var(--ease);
    }

    .dk-icon-plate {
      width: 100%; height: 100%;
      background: transparent;
      border: none;
      border-radius: 14px; display: flex; align-items: center; justify-content: center;
      transform: translateZ(40px); /* Primary lift off the floor */
      transition: all 0.3s cubic-bezier(0.2, 0, 0, 1);
      position: relative;
    }

    .dk-icon-plate::after {
      content: ''; position: absolute; inset: 10%;
      background: radial-gradient(circle at center, var(--glow) 0%, transparent 70%);
      opacity: 0; transition: opacity 0.3s;
      filter: blur(15px);
    }
    
    .dk-item:hover .dk-icon-plate {
      transform: translateZ(80px) scale(1.2);
    }
    .dk-item:hover .dk-icon-plate::after { opacity: 0.6; }

    .dk-ico { 
      display: flex; align-items: center; justify-content: center;
      width: 100%; height: 100%; color: #fff !important;
      transform: translateZ(30px);
      filter: drop-shadow(0 15px 20px rgba(0,0,0,0.6));
      z-index: 2;
      transition: all 0.3s var(--ease);
    }
    ::ng-deep .dk-ico svg { width: 90%; height: 90%; display: block; filter: saturate(1.2) contrast(1.1); }

    .dk-shadow {
      position: absolute; inset: 10%; background: black;
      filter: blur(15px); opacity: 0.4;
      transform: translateZ(-10px) translateY(5px) rotateX(90deg);
    }

    .dk-reflection {
      position: absolute; top: 110%; left: 0; right: 0;
      display: flex; justify-content: center; align-items: center;
      width: 24px; height: 24px; margin: 0 auto; color: var(--text);
      opacity: 0.1; transform: scaleY(-0.8) rotateX(25deg);
      filter: blur(8px) saturate(200%); pointer-events: none;
    }
    ::ng-deep .dk-reflection svg { width: 100%; height: 100%; }

    .dk-tooltip {
      position: absolute; bottom: calc(100% + 45px); left: 50%; 
      transform: translateX(-50%) translateY(10px) translateZ(150px) rotateX(-15deg);
      background: rgba(10, 12, 18, 0.98); backdrop-filter: blur(25px);
      border: 1px solid rgba(255, 255, 255, 0.2); color: #fff;
      padding: 8px 16px; border-radius: 12px;
      font-family: var(--font-m); font-size: 0.7rem !important; font-weight: 800; 
      white-space: nowrap; opacity: 0; visibility: hidden; 
      transition: all 0.25s var(--spring);
      box-shadow: 0 30px 60px rgba(0,0,0,0.9);
    }
    .dk-item:hover .dk-tooltip { opacity: 1; visibility: visible; transform: translateX(-50%) translateY(0) translateZ(150px) rotateX(-15deg); }

    .dk-indicator {
      position: absolute; bottom: -12px; width: 5px; height: 5px;
      background: rgba(255,255,255,0.5); border-radius: 50%;
      transition: all 0.4s var(--ease); transform: translateZ(5px);
    }
    .dk-indicator.active {
      background: #fff; box-shadow: 0 0 15px #fff; width: 22px; height: 3px; border-radius: 4px; bottom: -10px;
    }

    .dk-divider { width: 1px; height: 40px; background: rgba(255,255,255,0.2); margin: 0 10px; align-self: center; transform: translateZ(10px); }
    .dk-divider.small { height: 24px; opacity: 0.5; margin: 0 6px; }

    @keyframes icon-jump {
      0%, 100% { transform: translateY(0) rotateY(0deg) scale(1); }
      50% { transform: translateY(-65px) scale(1.1, 1.4) rotateY(25deg); }
    }
    .animate-jump { animation: icon-jump 0.6s var(--spring); }

    @media (max-width: 768px) {
      .dock-floor { height: 64px; }
      .dk-slot { width: 48px !important; }
      .dk-item { width: 46px !important; height: 46px !important; transform: none !important; }
      .dk-icon-plate { transform: none; border-radius: 12px; }
      .dk-ico { transform: none; }
      .dk-tooltip, .dk-reflection, .dk-shadow, .floor-glow { display: none; }
    }
  `]
})
export class DockComponent implements AfterViewInit {
  windowStore = inject(WindowStore);
  iconService = inject(IconService);
  resumeService = inject(ResumeService);
  ts = inject(TranslationService);
  private platformId = inject(PLATFORM_ID);

  mouseX = signal<number>(-1000);
  activeGlow = signal<string>('radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)');
  jumpingIcon = signal<string | null>(null);
  
  readonly BASE_SIZE = 56;
  readonly MAX_SIZE = 96;
  readonly RANGE = 240;

  dockItems = [
    // CORE
    { id: 'about', label: 'About Me', localizedLabel: 'dock.about', color: 'var(--amber)', group: 'core' },
    { id: 'exp', label: 'Experience', localizedLabel: 'dock.exp', color: 'var(--emerald)', group: 'core' },
    { id: 'proj', label: 'Projects', localizedLabel: 'dock.proj', color: 'var(--ice)', group: 'core' },
    { id: 'skills', label: 'Skills', localizedLabel: 'dock.skills', color: 'var(--rose)', group: 'core' },
    { id: 'tl', label: 'Milestones', localizedLabel: 'dock.tl', color: 'var(--amber)', group: 'core' },
    { id: 'why', label: 'Why Me?', localizedLabel: 'dock.why', color: 'var(--ice)', group: 'core' },
    
    // TECH
    { id: 'ai', label: 'AI Research', localizedLabel: 'dock.ai', color: 'var(--violet)', group: 'tech' },
    { id: 'perf', label: 'Performance', localizedLabel: 'dock.perf', color: 'var(--emerald)', group: 'tech' },
    { id: 'sys', label: 'System Overview', localizedLabel: 'dock.sys', color: 'var(--ice)', group: 'tech' },
    { id: 'term', label: 'Terminal', localizedLabel: 'dock.term', color: 'var(--text3)', group: 'tech' },

    // CONNECT
    { id: 'sch', label: 'Book Call', localizedLabel: 'dock.sch', color: 'var(--emerald)', group: 'connect' },
    { id: 'resume', label: 'Download CV', localizedLabel: 'dock.resume', color: 'var(--ice)', group: 'connect', action: () => this.resumeService.download() },
    { id: 'nai', label: 'NaveenAI', localizedLabel: 'dock.nai', color: 'var(--violet)', group: 'connect' },
    { id: 'contact', label: 'Contact', localizedLabel: 'dock.contact', color: 'var(--emerald)', group: 'connect' },
  ];

  get coreItems() { return this.dockItems.filter(i => i.group === 'core'); }
  get techItems() { return this.dockItems.filter(i => i.group === 'tech'); }
  get connectItems() { return this.dockItems.filter(i => i.group === 'connect'); }

  @ViewChild('dockShelf') dockShelf!: ElementRef<HTMLElement>;
  
  private cachedCenters = new Map<string, number>();
  private throttleTimeout: any;

  itemStates = computed(() => {
    const mx = this.mouseX();
    const states: Record<string, ItemState> = {};
    const idleState = { size: this.BASE_SIZE, transform: 'none', zIndex: 1 };

    const items = [...this.dockItems.map(i => i.id), 'desktop'];
    
    if (!isPlatformBrowser(this.platformId) || mx === -1000 || (typeof window !== 'undefined' && window.innerWidth <= 768)) {
      items.forEach(id => states[id] = idleState);
      return states;
    }

    items.forEach(id => {
      const centerX = this.cachedCenters.get(id);
      if (centerX === undefined) {
        states[id] = idleState;
        return;
      }

      const distance = Math.abs(mx - centerX);
      if (distance < this.RANGE) {
        const scaleFactor = Math.pow(Math.cos((distance / this.RANGE) * (Math.PI / 2)), 2.5);
        const stretch = 1 + (scaleFactor * 0.2); 
        const squash = 1 - (scaleFactor * 0.05);
        const size = this.BASE_SIZE + (this.MAX_SIZE - this.BASE_SIZE) * scaleFactor;
        const zIndex = Math.round(scaleFactor * 100);
        const tiltY = ((mx - centerX) / this.RANGE) * 50; 
        const lift = - (size - this.BASE_SIZE) * 1.4;
        
        states[id] = {
          size,
          zIndex,
          transform: `translateY(${lift}px) rotateY(${tiltY}deg) rotateX(15deg) scale(${squash}, ${stretch})`
        };
      } else {
        states[id] = idleState;
      }
    });

    return states;
  });

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.cacheItemPositions(), 100);
    }
  }

  @HostListener('window:resize')
  onResize() {
    if (isPlatformBrowser(this.platformId)) {
      this.cacheItemPositions();
    }
  }

  private cacheItemPositions() {
    const shelf = this.dockShelf?.nativeElement;
    if (!shelf) return;
    
    const elements = Array.from(shelf.querySelectorAll('.dk-slot')) as HTMLElement[];
    const shelfRect = shelf.getBoundingClientRect();

    const items = [...this.dockItems.map(i => i.id), 'desktop'];
    
    items.forEach((id, index) => {
      const el = elements[index];
      if (el) {
        const rect = el.getBoundingClientRect();
        const centerX = (rect.left - shelfRect.left) + (rect.width / 2);
        this.cachedCenters.set(id, centerX);
      }
    });
  }

  onMouseMove(e: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      if (!this.throttleTimeout) {
        this.throttleTimeout = requestAnimationFrame(() => {
          const shelf = this.dockShelf?.nativeElement;
          if (shelf) {
            const rect = shelf.getBoundingClientRect();
            const x = e.clientX - rect.left;
            this.mouseX.set(x);
            
            const idx = Math.floor((x / rect.width) * this.dockItems.length);
            const item = this.dockItems[idx];
            if (item) {
              this.activeGlow.set(`radial-gradient(circle at center, ${item.color} 0%, transparent 70%)`);
            }
          }
          this.throttleTimeout = null;
        });
      }
    }
  }

  onMouseLeave() {
    this.mouseX.set(-1000);
  }

  launchItem(item: DockItem) {
    this.jumpingIcon.set(item.id);
    if (item.action) {
      item.action();
    } else {
      this.windowStore.open(item.id, {});
    }
    setTimeout(() => this.jumpingIcon.set(null), 600);
  }
}
