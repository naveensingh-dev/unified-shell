import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

interface DebateMessage {
  role: string;
  text: string;
  color: string;
}

interface Scenario {
  id: string;
  label: string;
  desc: string;
  debate: DebateMessage[];
}

@Component({
  selector: 'app-ai-lab',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="ai-container">
      <header class="ai-header">
        <h1 class="ai-title" [appTranslate]="'ai_lab.title'"></h1>
        <p class="ai-sub" [appTranslate]="'ai_lab.sub'"></p>
      </header>

      <div class="inner-nav">
        <div class="slbl" [appTranslate]="'ai_lab.nav_label'"></div>
        <div class="ai-tabs">
          <div class="ai-tab" [class.act]="view() === 'playbook'" (click)="view.set('playbook')" [appTranslate]="'ai_lab.tabs.playbook'"></div>
          <div class="ai-tab" [class.act]="view() === 'hallucination'" (click)="view.set('hallucination')" [appTranslate]="'ai_lab.tabs.hallucination'"></div>
          <div class="ai-tab" [class.act]="view() === 'war_room'" (click)="view.set('war_room')" [appTranslate]="'ai_lab.tabs.war_room'"></div>
          <div class="ai-tab" [class.act]="view() === 'sandbox'" (click)="view.set('sandbox')" [appTranslate]="'ai_lab.tabs.sandbox'"></div>
        </div>
      </div>

      <div class="ai-content">
        @if (view() === 'playbook') {
          <div class="playbook-view fade-in">
            <h2 class="artifact-h" [appTranslate]="'ai_lab.playbook_title'"></h2>
            <div class="playbook-grid">
              <div class="pb-card">
                <h3 [appTranslate]="'ai_lab.p1_title'"></h3>
                <p [appTranslate]="'ai_lab.p1_desc'"></p>
              </div>
              <div class="pb-card">
                <h3 [appTranslate]="'ai_lab.p2_title'"></h3>
                <p [appTranslate]="'ai_lab.p2_desc'"></p>
              </div>
              <div class="pb-card">
                <h3 [appTranslate]="'ai_lab.p3_title'"></h3>
                <p [appTranslate]="'ai_lab.p3_desc'"></p>
              </div>
              <div class="pb-card">
                <h3 [appTranslate]="'ai_lab.p4_title'"></h3>
                <p [appTranslate]="'ai_lab.p4_desc'"></p>
              </div>
            </div>
          </div>
        }

        @if (view() === 'hallucination') {
          <div class="hallucination-view fade-in">
            <div class="slbl" [appTranslate]="'ai_lab.h_slbl'"></div>
            <div class="cmp-grid">
              <div class="ai-pan">
                <div class="ai-pan-hd" [appTranslate]="'ai_lab.h_baseline'"></div>
                <div class="ai-txt">
                  <span [appTranslate]="'ai_lab.h_q'"></span><br><br>
                  <span [appTranslate]="'ai_lab.h_a_base'" [useHtml]="true"></span><br><br>
                  <span class="risk" [appTranslate]="'ai_lab.h_risk'"></span>
                </div>
              </div>
              <div class="ai-pan">
                <div class="ai-pan-hd" [appTranslate]="'ai_lab.h_mycroft'"></div>
                <div class="ai-txt">
                  <span [appTranslate]="'ai_lab.h_q'"></span><br><br>
                  <span [appTranslate]="'ai_lab.h_a_mycroft'" [useHtml]="true"></span><br><br>
                  <span class="trust" [appTranslate]="'ai_lab.h_trust'"></span>
                </div>
              </div>
            </div>
          </div>
        }

        @if (view() === 'war_room') {
          <div class="war-room-view fade-in">
            <div class="wr-header">
              <h2 class="artifact-h" [appTranslate]="'ai_lab.war_room_title'"></h2>
              <p class="wr-sub" [appTranslate]="'ai_lab.war_room_sub'"></p>
            </div>

            <div class="wr-scenarios">
              <div class="slbl" [appTranslate]="'ai_lab.war_room_scenario_label'"></div>
              <div class="scenario-list">
                @for (s of scenarios(); track s.id) {
                  <button class="sc-btn" 
                          [class.act]="selectedScenarioId() === s.id" 
                          (click)="selectScenario(s.id)">
                    <span class="sc-label">{{s.label}}</span>
                    <span class="sc-desc">{{s.desc}}</span>
                  </button>
                }
              </div>
            </div>

            <div class="wr-arena">
              <div class="arena-hd">
                <div class="status-pulse"></div>
                <span>ACTIVE_DEBATE_STREAM</span>
              </div>
              <div class="arena-msgs">
                @for (msg of activeDebate(); track $index) {
                  <div class="arena-msg fade-up" [style.--accent]="msg.color">
                    <div class="msg-role" [style.color]="msg.color">{{msg.role}}</div>
                    <div class="msg-body">{{msg.text}}</div>
                  </div>
                }
                @if (isSimulating()) {
                   <div class="msg-loading">
                     <span class="dot"></span><span class="dot"></span><span class="dot"></span>
                   </div>
                }
              </div>
            </div>
          </div>
        }

        @if (view() === 'sandbox') {
          <div class="sandbox-grid fade-in">
            <div class="pb-card">
              <div class="exp-title" [appTranslate]="'ai_lab.s1_title'"></div>
              <div class="exp-desc" [appTranslate]="'ai_lab.s1_desc'"></div>
            </div>
            <div class="pb-card">
              <div class="exp-title" [appTranslate]="'ai_lab.s2_title'"></div>
              <div class="exp-desc" [appTranslate]="'ai_lab.s2_desc'"></div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .ai-container { 
      flex: 1 1 auto; 
      padding: var(--win-pad) !important; 
      overflow-y: auto !important; 
      background: #03040e; 
      font-family: var(--font-b); 
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
      padding-bottom: 80px !important;
    }

    .ai-header { margin-bottom: 2rem; }
    .ai-title { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 900; color: #fff; margin-bottom: 4px; }
    .ai-sub { font-size: 0.9rem !important; color: var(--text2); }

    .inner-nav { margin-bottom: 1.5rem; border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 1rem; }
    .slbl { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px; }
    
    .ai-tabs { display: flex; gap: 1.5rem; flex-wrap: nowrap; overflow-x: auto; scrollbar-width: none; }
    .ai-tabs::-webkit-scrollbar { display: none; }
    .ai-tab { font-family: var(--font-m); font-size: 0.75rem !important; font-weight: 700; color: var(--text3); cursor: pointer; transition: all 0.2s; border-bottom: 2px solid transparent; padding-bottom: 8px; white-space: nowrap; }
    .ai-tab.act { color: var(--violet); border-bottom-color: var(--violet); }

    .artifact-h { font-family: var(--font-d); font-size: 1.25rem !important; font-weight: 800; color: #fff; margin-bottom: 0.5rem; }
    .playbook-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; margin-top: 1.5rem; }
    .pb-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; }
    .pb-card h3 { font-family: var(--font-m); font-size: 0.8rem !important; color: var(--violet); margin-bottom: 8px; font-weight: 700; }
    .pb-card p { font-size: 0.85rem !important; color: var(--text2); line-height: 1.6; }

    .cmp-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .ai-pan { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 16px; }
    .ai-pan-hd { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--text3); margin-bottom: 12px; }
    .ai-txt { font-family: var(--font-m); font-size: 0.75rem !important; line-height: 1.7; color: var(--text2); }
    ::ng-deep .hlc { color: var(--rose); text-decoration: underline wavy; }
    ::ng-deep .ctd { color: var(--ice); font-weight: 700; }
    ::ng-deep .grd { color: var(--emerald); font-weight: 700; }
    .risk { color: var(--rose); font-size: 0.65rem !important; display: block; margin-top: 12px; font-weight: 700; }
    .trust { color: var(--emerald); font-size: 0.65rem !important; display: block; margin-top: 12px; font-weight: 700; }

    /* War Room Styles */
    .wr-header { margin-bottom: 2rem; }
    .wr-sub { font-size: 0.9rem !important; color: var(--text3); }
    .scenario-list { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 2rem; }
    .sc-btn { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); 
      border-radius: 12px; padding: 16px; text-align: left; cursor: pointer; transition: all 0.2s;
    }
    .sc-btn:hover { background: rgba(255,255,255,0.05); }
    .sc-btn.act { border-color: var(--violet); background: rgba(139,147,255,0.08); }
    .sc-label { display: block; font-family: var(--font-d); font-size: 0.95rem !important; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .sc-desc { display: block; font-size: 0.75rem !important; color: var(--text3); line-height: 1.4; }

    .wr-arena { 
      background: #000; border: 1px solid rgba(255,255,255,0.1); border-radius: 16px;
      overflow: hidden; display: flex; flex-direction: column; min-height: 300px;
    }
    .arena-hd { 
      background: rgba(255,255,255,0.05); padding: 10px 16px; display: flex; align-items: center; gap: 10px;
      font-family: var(--font-m); font-size: 0.6rem !important; color: var(--text3); letter-spacing: 0.1em;
    }
    .status-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--emerald); animation: pulse-g 2s infinite; }
    @keyframes pulse-g { 0% { opacity: 1; box-shadow: 0 0 0 0 rgba(54,217,151,0.4); } 70% { opacity: 0.5; box-shadow: 0 0 0 6px rgba(54,217,151,0); } 100% { opacity: 1; } }
    
    .arena-msgs { padding: 20px; display: flex; flex-direction: column; gap: 16px; flex: 1; }
    .arena-msg { border-left: 2px solid var(--accent); padding: 4px 16px; background: linear-gradient(90deg, rgba(255,255,255,0.03), transparent); }
    .msg-role { font-family: var(--font-m); font-size: 0.65rem !important; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
    .msg-body { font-size: 0.9rem !important; color: var(--text2); line-height: 1.6; }

    .msg-loading { display: flex; gap: 4px; padding-left: 16px; }
    .dot { width: 4px; height: 4px; border-radius: 50%; background: var(--violet); animation: dot-bounce 1.4s infinite ease-in-out both; }
    .dot:nth-child(1) { animation-delay: -0.32s; }
    .dot:nth-child(2) { animation-delay: -0.16s; }
    @keyframes dot-bounce { 0%, 80%, 100% { transform: scale(0); } 40% { transform: scale(1); } }

    .sandbox-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
    .exp-title { font-family: var(--font-d); font-size: 1rem !important; font-weight: 800; color: #fff; margin-bottom: 4px; }
    .exp-desc { font-size: 0.85rem !important; color: var(--text2); line-height: 1.5; }

    @media (max-width: 900px) {
      .playbook-grid, .cmp-grid, .sandbox-grid, .scenario-list { grid-template-columns: 1fr; }
    }

    .fade-in { animation: fadeIn 0.4s ease forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .fade-up { animation: fadeUp 0.5s var(--spring) forwards; }
    @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class AiLabComponent {
  private ts = inject(TranslationService);
  view = signal<'playbook' | 'hallucination' | 'sandbox' | 'war_room'>('playbook');
  
  selectedScenarioId = signal<string | null>(null);
  activeDebate = signal<DebateMessage[]>([]);
  isSimulating = signal(false);

  scenarios = computed<Scenario[]>(() => {
    const raw = this.ts.translate('ai_lab.scenarios');
    return Array.isArray(raw) ? raw : [];
  });

  async selectScenario(id: string) {
    if (this.isSimulating()) return;
    this.selectedScenarioId.set(id);
    this.activeDebate.set([]);
    this.isSimulating.set(true);

    const scenario = this.scenarios().find(s => s.id === id);
    if (!scenario) return;

    for (const msg of scenario.debate) {
      await this.delay(1200 + Math.random() * 800);
      this.activeDebate.update(d => [...d, msg]);
    }
    this.isSimulating.set(false);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
