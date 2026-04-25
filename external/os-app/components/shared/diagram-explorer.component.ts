import { Component, Input, Output, EventEmitter, inject, PLATFORM_ID, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { MermaidComponent } from './mermaid.component';
import 'pinch-zoom-element';

@Component({
  selector: 'app-diagram-explorer',
  standalone: true,
  imports: [CommonModule, MermaidComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: `
    <div class="explorer-overlay fade-in" (click)="close.emit()">
      <div class="explorer-content" (click)="$event.stopPropagation()">
        
        <!-- HUD HEADER -->
        <header class="explorer-hud-top">
          <div class="hud-left">
            <div class="hud-glitch-title">NEURAL_BLUEPRINT_EXPLORER</div>
            <div class="hud-sub">PROJECT::{{ projectId | uppercase }}</div>
          </div>
          <div class="hud-right">
            <button class="hud-btn close" (click)="close.emit()">
              <span class="btn-text">EXIT_SCAN</span>
              <span class="btn-icon">×</span>
            </button>
          </div>
        </header>

        <!-- MAIN VIEWPORT -->
        <div class="explorer-viewport">
          <pinch-zoom class="pinch-viewport" [properties]="{ minScale: 0.1, maxScale: 10 }">
            <div class="diagram-wrapper">
              <app-mermaid [diagram]="diagram" [fullscreen]="true"></app-mermaid>
            </div>
          </pinch-zoom>

          <!-- INTERACTION HINT -->
          <div class="interaction-hint">
             <span class="hint-key">DRAG</span> TO PAN // <span class="hint-key">PINCH / SCROLL</span> TO ZOOM
          </div>
        </div>

        <!-- HUD FOOTER -->
        <footer class="explorer-hud-bottom">
          <div class="hud-stat">
            <span class="stat-lbl">RESOLUTION::</span>
            <span class="stat-val">VECTOR_OPTIC_100%</span>
          </div>
          <div class="hud-stat">
            <span class="stat-lbl">FOCUS::</span>
            <span class="stat-val">DEEP_ARCH_SCAN</span>
          </div>
          <div class="hud-stat mobile-hide">
            <span class="stat-lbl">STATUS::</span>
            <span class="stat-val">ENHANCED_VISIBILITY_ACTIVE</span>
          </div>
        </footer>

        <!-- CORNER DECORATIONS -->
        <div class="corner-dec tl"></div>
        <div class="corner-dec tr"></div>
        <div class="corner-dec bl"></div>
        <div class="corner-dec br"></div>
      </div>
    </div>
  `,
  styles: [`
    .explorer-overlay {
      position: fixed; inset: 0; background: rgba(2, 4, 10, 0.98);
      z-index: 5000; display: flex; align-items: center; justify-content: center;
      backdrop-filter: blur(20px) saturate(150%);
      padding: 20px;
    }
    .explorer-content {
      position: relative; width: 100%; height: 100%;
      background: #000; border: 1px solid rgba(0, 242, 255, 0.2);
      display: flex; flex-direction: column; overflow: hidden;
      box-shadow: 0 0 100px rgba(0, 242, 255, 0.1);
    }

    .explorer-hud-top {
      padding: 20px 30px; border-bottom: 1px solid rgba(0, 242, 255, 0.1);
      display: flex; justify-content: space-between; align-items: center;
      background: linear-gradient(to bottom, rgba(0, 242, 255, 0.05), transparent);
    }
    .hud-glitch-title { font-family: var(--font-d); font-size: 1.2rem; font-weight: 900; color: #00f2ff; letter-spacing: 2px; }
    .hud-sub { font-family: var(--font-m); font-size: 0.65rem; color: var(--text3); margin-top: 4px; }
    
    .hud-btn.close {
      background: rgba(255, 107, 122, 0.1); border: 1px solid rgba(255, 107, 122, 0.3);
      padding: 8px 16px; color: var(--rose); font-family: var(--font-m);
      display: flex; align-items: center; gap: 10px; cursor: pointer;
      transition: all 0.2s;
    }
    .hud-btn.close:hover { background: var(--rose); color: #000; }
    .btn-text { font-size: 0.7rem; font-weight: 800; }
    .btn-icon { font-size: 1.2rem; line-height: 1; }

    .explorer-viewport {
      flex: 1; position: relative; overflow: hidden;
      cursor: grab; background-image: radial-gradient(rgba(0, 242, 255, 0.03) 1px, transparent 1px);
      background-size: 30px 30px;
    }
    .explorer-viewport:active { cursor: grabbing; }

    .pinch-viewport { width: 100%; height: 100%; }
    .diagram-wrapper { padding: 50px; min-width: 100%; display: flex; justify-content: center; }

    .interaction-hint {
      position: absolute; bottom: 30px; left: 50%; transform: translateX(-50%);
      background: rgba(0, 242, 255, 0.1); border: 1px solid rgba(0, 242, 255, 0.2);
      padding: 10px 20px; border-radius: 30px; color: #fff;
      font-size: 0.6rem; font-family: var(--font-m); letter-spacing: 1px;
      backdrop-filter: blur(10px); pointer-events: none;
    }
    .hint-key { color: #00f2ff; font-weight: 900; }

    .explorer-hud-bottom {
      padding: 15px 30px; border-top: 1px solid rgba(0, 242, 255, 0.1);
      display: flex; gap: 40px; background: rgba(0, 242, 255, 0.02);
    }
    .hud-stat { display: flex; align-items: center; gap: 8px; }
    .stat-lbl { font-size: 0.6rem; color: var(--text3); }
    .stat-val { font-size: 0.6rem; color: #00f2ff; font-weight: 800; }

    .corner-dec { position: absolute; width: 15px; height: 15px; border: 2px solid #00f2ff; pointer-events: none; }
    .corner-dec.tl { top: -1px; left: -1px; border-right: none; border-bottom: none; }
    .corner-dec.tr { top: -1px; right: -1px; border-left: none; border-bottom: none; }
    .corner-dec.bl { bottom: -1px; left: -1px; border-right: none; border-top: none; }
    .corner-dec.br { bottom: -1px; right: -1px; border-left: none; border-top: none; }

    @media (max-width: 768px) {
      .explorer-overlay { padding: 0; }
      .mobile-hide { display: none; }
      .explorer-hud-bottom { gap: 20px; padding: 15px 20px; }
      .hud-glitch-title { font-size: 0.9rem; }
    }

    .fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(1.05); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class DiagramExplorerComponent {
  @Input({ required: true }) diagram: string = '';
  @Input({ required: true }) projectId: string = '';
  @Output() close = new EventEmitter<void>();

  constructor() {}
}
