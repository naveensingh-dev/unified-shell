import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SettingsService, OSTheme, Wallpaper } from '../../../services/settings.service';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="settings-container">
      <div class="settings-header">
        <div class="slbl">⚙️ System Configuration</div>
        <h1 class="settings-title">Preferences</h1>
        <div class="settings-desc">Personalize your high-fidelity NaveenOS experience.</div>
      </div>

      <div class="settings-body">
        <!-- TYPOGRAPHY -->
        <div class="settings-section">
          <div class="section-hdr">Typography & Scaling</div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Interface Font Size (Pixel Perfect)</div>
              <div class="setting-hint">Granular control over the system scale (10px - 24px).</div>
            </div>
            <div class="px-control">
              <input type="range" min="10" max="24" [ngModel]="settings.fontSize()" 
                     (ngModelChange)="settings.updateFontSize($event)" class="range-slider">
              <div class="px-badge">{{settings.fontSize()}}px</div>
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Performance Mode</div>
              <div class="setting-hint">Reduces motion and transparency for maximum speed.</div>
            </div>
            <button class="toggle-btn" [class.on]="settings.lowMotion()" (click)="settings.toggleLowMotion()">
              {{settings.lowMotion() ? 'Speed Optimized' : 'Fidelity Optimized'}}
            </button>
          </div>
        </div>

        <!-- APPEARANCE -->
        <div class="settings-section">
          <div class="section-hdr">Design System & Themes</div>
          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Color Profile</div>
              <div class="setting-hint">Switch between high-definition system themes.</div>
            </div>
            <div class="theme-grid">
              @for (t of themes; track t.id) {
                <div class="theme-card" [class.active]="settings.theme() === t.id" (click)="settings.updateTheme(t.id)">
                  <div class="theme-preview" [style.background]="t.color"></div>
                  <div class="theme-name">{{t.label}}</div>
                </div>
              }
            </div>
          </div>

          <div class="setting-item">
            <div class="setting-info">
              <div class="setting-label">Wallpaper Engine</div>
              <div class="setting-hint">Choose your high-definition desktop background.</div>
            </div>
            <div class="wallpaper-grid">
              @for (w of wallpapers; track w.id) {
                <button class="wp-btn" [class.active]="settings.wallpaper() === w.id" (click)="settings.updateWallpaper(w.id)">
                  {{w.label}}
                </button>
              }
            </div>
          </div>
        </div>

        <div class="settings-footer">
          NaveenOS HD Engine v4.0 · Real-time Signal Sync
        </div>
      </div>
    </div>
  `,
  styles: [`
    .settings-container { display: flex; flex-direction: column; height: 100%; background: #03040e; font-family: var(--font-b); }
    .settings-header { padding: var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .slbl { font-family: var(--font-m); font-size: .62rem !important; color: var(--amber); letter-spacing: .2em; text-transform: uppercase; margin-bottom: 8px; }
    .settings-title { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .settings-desc { font-size: .9rem !important; color: var(--text2); }

    .settings-body { padding: var(--win-pad) !important; overflow-y: auto; flex: 1; }
    .settings-section { margin-bottom: 2rem; }
    .section-hdr { font-family: var(--font-m); font-size: .65rem !important; color: var(--text3); font-weight: 700; text-transform: uppercase; margin-bottom: 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 8px; letter-spacing: .05em; }
    
    .setting-item { display: flex; flex-direction: column; margin-bottom: 1.5rem; gap: 12px; }
    .setting-label { font-size: 0.95rem !important; font-weight: 700; color: #fff; }
    .setting-hint { font-size: .8rem !important; color: var(--text3); margin-top: 2px; }
    
    .px-control { display: flex; align-items: center; gap: 1rem; background: rgba(255,255,255,0.02); padding: 12px 16px; border-radius: 8px; border: 1px solid rgba(255,255,255,0.05); }
    .range-slider { flex: 1; accent-color: var(--ice); height: 4px; cursor: pointer; }
    .px-badge { font-family: var(--font-m); font-size: .85rem !important; font-weight: 700; color: var(--ice); min-width: 40px; text-align: right; }

    .theme-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .theme-card { 
      cursor: pointer; border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 8px; 
      background: rgba(255,255,255,0.02); transition: all 0.2s; text-align: center;
    }
    .theme-card:hover { border-color: rgba(255,255,255,0.1); transform: translateY(-2px); }
    .theme-card.active { border-color: var(--ice); background: rgba(86,205,250,0.05); }
    .theme-preview { height: 30px; border-radius: 4px; margin-bottom: 6px; border: 1px solid rgba(255,255,255,0.1); }
    .theme-name { font-size: .65rem !important; font-weight: 800; color: var(--text2); text-transform: uppercase; letter-spacing: .02em; }

    .wallpaper-grid { display: flex; flex-wrap: wrap; gap: 8px; }
    .wp-btn { 
      padding: 8px 16px; border-radius: 6px; font-size: .8rem !important; font-weight: 700; 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--text2);
      transition: all 0.2s;
    }
    .wp-btn:hover { border-color: rgba(255,255,255,0.1); }
    .wp-btn.active { border-color: var(--amber); color: var(--amber); background: rgba(245,166,35,0.05); }

    .toggle-btn { 
      padding: 10px 20px; border-radius: 8px; font-size: .85rem !important; font-weight: 800; 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); color: var(--text2); align-self: flex-start;
      transition: all 0.2s;
    }
    .toggle-btn.on { border-color: var(--emerald); color: var(--emerald); background: rgba(54,217,151,0.05); }

    .settings-footer { margin-top: 2rem; text-align: center; font-family: var(--font-m); font-size: .65rem !important; color: var(--text3); opacity: .6; }
  `]
})
export class SettingsComponent {
  settings = inject(SettingsService);

  themes: { id: OSTheme, label: string, color: string }[] = [
    { id: 'classic-dark', label: 'Classic', color: '#03040e' },
    { id: 'neon-pulse', label: 'Neon HD', color: '#0a001a' },
    { id: 'minimal-light', label: 'Minimal', color: '#f8f9fc' },
    { id: 'high-contrast', label: 'Cyberdeck', color: '#000000' }
  ];

  wallpapers: { id: Wallpaper, label: string }[] = [
    { id: 'dynamic-mesh', label: '✨ Mesh' },
    { id: 'aurora-gradient', label: '🌈 Aurora' },
    { id: 'solid-slate', label: '🌑 Slate' },
    { id: 'cyber-grid', label: '🕸 Grid' }
  ];
}
