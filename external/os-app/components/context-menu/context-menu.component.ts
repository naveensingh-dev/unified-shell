import { Component, inject, signal, HostListener, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WindowStore } from '../../store/window.store';
import { SettingsService } from '../../services/settings.service';
import { IconService } from '../../services/icon.service';

@Component({
  selector: 'app-context-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (visible()) {
      <div class="ctx-menu" 
           [style.top.px]="y()" 
           [style.left.px]="x()"
           (click)="$event.stopPropagation()">
        <div class="ctx-section">
          <button class="ctx-item" (click)="onMission()">
            <span class="ctx-ico" [innerHTML]="iconService.get('sys')"></span>
            Mission Control
            <span class="ctx-kb">F3</span>
          </button>
          <button class="ctx-item" (click)="onCloseAll()">
            <span class="ctx-ico" [innerHTML]="iconService.get('term')"></span>
            Close All Windows
            <span class="ctx-kb">⌥⌘W</span>
          </button>
        </div>
        <div class="ctx-div"></div>
        <div class="ctx-section">
          <button class="ctx-item" (click)="onWallpaper()">
            Next Wallpaper
            <span class="ctx-kb">⌘N</span>
          </button>
          <button class="ctx-item" (click)="onLowMotion()">
            {{ settings.lowMotion() ? 'Enable Motion' : 'Reduce Motion' }}
          </button>
        </div>
      </div>
    }
  `,
  styles: [`
    .ctx-menu {
      position: fixed; z-index: 10000;
      width: 220px; background: rgba(10, 12, 18, 0.85);
      backdrop-filter: blur(25px); -webkit-backdrop-filter: blur(25px);
      border: 1px solid rgba(255,255,255,0.15); border-radius: 12px;
      box-shadow: 0 20px 40px rgba(0,0,0,0.5);
      padding: 6px; animation: ctx-pop 0.15s cubic-bezier(0, 0, 0.2, 1);
      transform-origin: top left;
    }
    @keyframes ctx-pop {
      from { opacity: 0; transform: scale(0.95) translateY(-5px); }
      to { opacity: 1; transform: scale(1) translateY(0); }
    }
    .ctx-section { display: flex; flex-direction: column; gap: 2px; }
    .ctx-item {
      display: flex; align-items: center; gap: 10px;
      padding: 8px 10px; border-radius: 6px;
      color: #fff; font-size: 0.8rem !important;
      cursor: pointer; transition: background 0.1s;
      width: 100%; text-align: left;
    }
    .ctx-item:hover { background: var(--ice); color: #000; }
    .ctx-item:hover .ctx-kb { color: rgba(0,0,0,0.5); }
    .ctx-ico { width: 14px; height: 14px; opacity: 0.8; }
    ::ng-deep .ctx-ico svg { width: 100%; height: 100%; }
    .ctx-kb { margin-left: auto; font-size: 0.65rem !important; opacity: 0.4; font-family: var(--font-m); }
    .ctx-div { height: 1px; background: rgba(255,255,255,0.1); margin: 6px 4px; }
  `]
})
export class ContextMenuComponent {
  windowStore = inject(WindowStore);
  settings = inject(SettingsService);
  iconService = inject(IconService);
  private platformId = inject(PLATFORM_ID);

  visible = signal(false);
  x = signal(0);
  y = signal(0);

  @HostListener('window:contextmenu', ['$event'])
  onContextMenu(e: MouseEvent) {
    if (isPlatformBrowser(this.platformId)) {
      e.preventDefault();
      this.x.set(e.clientX);
      this.y.set(e.clientY);
      this.visible.set(true);
    }
  }

  @HostListener('window:click')
  close() {
    this.visible.set(false);
  }

  onMission() {
    this.windowStore.toggleMissionControl();
    this.close();
  }

  onCloseAll() {
    this.windowStore.closeAll();
    this.close();
  }

  onWallpaper() {
    const wps: any[] = ['dynamic-mesh', 'aurora-gradient', 'solid-slate', 'cyber-grid'];
    const current = this.settings.wallpaper();
    const next = wps[(wps.indexOf(current) + 1) % wps.length];
    this.settings.updateWallpaper(next);
    this.close();
  }

  onLowMotion() {
    this.settings.toggleLowMotion();
    this.close();
  }
}
