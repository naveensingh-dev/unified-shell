import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowStore } from '../../../store/window.store';
import { TranslateDirective } from '../../../core/directives/translate.directive';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="con-container">
      <div class="con-hero">
        <h1 class="con-h1" [appTranslate]="'contact.h1'" [useHtml]="true"></h1>
        <div class="con-sub" [appTranslate]="'contact.sub'" [useHtml]="true"></div>
      </div>
      
      <div class="avail-grid">
        <div class="av-c">
          <div class="av-d"></div>
          <div>
            <div class="av-t">Senior Angular Architecture</div>
            <div class="av-s">v6→v21 migrations, Signals/zone-less, Module Federation, Nx monorepos</div>
          </div>
        </div>
        <div class="av-c">
          <div class="av-d"></div>
          <div>
            <div class="av-t">GenAI Engineering</div>
            <div class="av-s">Production RAG pipelines, hallucination guardrails, FAISS IVF-PQ indexing</div>
          </div>
        </div>
      </div>

      <div class="con-ctas">
        <!-- SCHEDULE CALL -->
        <button class="cta" style="--cta-c:var(--emerald)" (click)="windowStore.open('sch', {title:'availability-scheduler.exe', width:600, height:550})">
          <div class="cta-ic">📅</div>
          <div class="cta-text-wrap">
            <div class="cta-lbl" [appTranslate]="'contact.cta_sch'"></div>
            <div class="cta-ds" [appTranslate]="'contact.cta_sch_sub'"></div>
          </div>
        </button>

        <a href="mailto:n_aveen&#64;outlook.com" class="cta" style="--cta-c:var(--ice)">
          <div class="cta-ic">✉</div>
          <div class="cta-text-wrap">
            <div class="cta-lbl">n_aveen&#64;outlook.com</div>
            <div class="cta-ds" [appTranslate]="'contact.cta_email_sub'"></div>
          </div>
        </a>

        <a href="https://linkedin.com/in/macbook02082025-creator" target="_blank" class="cta" style="--cta-c:var(--violet)">
          <div class="cta-ic">💼</div>
          <div class="cta-text-wrap">
            <div class="cta-lbl" [appTranslate]="'contact.cta_li'"></div>
            <div class="cta-ds" [appTranslate]="'contact.cta_li_sub'"></div>
          </div>
        </a>
      </div>

      <div class="con-info">
        <a>✉ n_aveen&#64;outlook.com</a>
        <a>📱 +91 80774 86316</a>
        <a>📍 Rishikesh, India</a>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .con-container { 
      flex: 1 1 auto; 
      display: flex; 
      flex-direction: column; 
      background: #03040e; 
      font-family: var(--font-b); 
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: 80px !important;
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .con-container::-webkit-scrollbar { width: 8px; }
    .con-container::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .con-container::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; box-shadow: 0 0 10px var(--ice); }

    .con-hero { padding: var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .con-h1 { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 900; line-height: 1.2; margin-bottom: 8px; color: #fff; }
    ::ng-deep .con-h1 em { color: var(--ice); font-style: normal; }
    .con-sub { font-size: 0.95rem !important; color: var(--text2); line-height: 1.6; }
    
    .avail-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .av-c { display: flex; align-items: flex-start; gap: 12px; padding: 12px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; }
    .av-d { width: 8px; height: 8px; border-radius: 50%; background: var(--emerald); flex-shrink: 0; margin-top: 4px; box-shadow: 0 0 8px var(--emerald); }
    .av-t { font-size: 0.85rem !important; font-weight: 700; margin-bottom: 2px; color: #fff; }
    .av-s { font-size: 0.75rem !important; color: var(--text2); line-height: 1.5; }
    
    .con-ctas { padding: var(--win-pad) !important; display: flex; flex-direction: column; gap: 12px; }
    .cta {
      display: flex; align-items: center; gap: 12px; padding: 16px;
      border-radius: 10px; cursor: pointer; transition: all 0.2s;
      border: 1px solid rgba(255,255,255,0.05); background: rgba(255,255,255,0.02); text-decoration: none; color: inherit;
      text-align: left; width: 100%;
    }
    .cta:hover { border-color: var(--cta-c); transform: translateX(5px); background: rgba(255,255,255,0.04); }
    .cta:hover .cta-lbl { color: var(--cta-c); }
    .cta-ic { font-size: 1.25rem; flex-shrink: 0; }
    .cta-text-wrap { display: flex; flex-direction: column; }
    .cta-lbl { font-size: 0.95rem !important; font-weight: 700; transition: color .2s; color: #fff; }
    .cta-ds { font-size: 0.75rem !important; color: var(--text3); margin-top: 2px; }
    
    .con-info { padding: 12px var(--win-pad) !important; display: flex; flex-wrap: wrap; gap: 8px; border-top: 1px solid rgba(255,255,255,0.05); }
    .con-info a { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text2); padding: 2px 8px; border-radius: 4px; border: 1px solid rgba(255,255,255,0.1); }

    @media (max-width: 768px) {
      .avail-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class ContactComponent {
  windowStore = inject(WindowStore);
}
