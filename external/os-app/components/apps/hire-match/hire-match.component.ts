import { Component, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

interface Requirement {
  id: string;
  labelKey: string;
  weight: number;
  match: boolean;
  tag: string;
}

@Component({
  selector: 'app-hire-match',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateDirective],
  template: `
    <div class="hire-container">
      <div class="hire-header">
        <div class="slbl" [appTranslate]="'hire_match.tool_label'"></div>
        <h1 class="hire-title" [appTranslate]="'hire_match.title'"></h1>
        <div class="hire-desc" [appTranslate]="'hire_match.desc'"></div>
      </div>
      
      <div class="hire-body">
        <div class="hire-meter" [style.--meter-c]="verdict().color">
          <div class="hire-pct">{{matchPercentage()}}%</div>
          <div class="hire-verdict">{{verdict().text}}</div>
          <div class="hire-bar-wrap">
            <div class="hire-bar" [style.width.%]="matchPercentage()" [style.background]="verdict().gradient"></div>
          </div>
        </div>

        <div class="best-fit-section">
          <div class="slbl" [appTranslate]="'hire_match.fit_for'"></div>
          <div class="role-pills">
            @for (role of roles(); track role) {
              <div class="role-pill">{{role}}</div>
            }
          </div>
        </div>

        <div class="slbl" [appTranslate]="'hire_match.requirement_label'"></div>
        
        <div class="hr-list">
          @for (r of requirements(); track r.id) {
            <label class="hr-item" [class.matched]="r.match">
              <input type="checkbox" [(ngModel)]="r.match" class="hr-check">
              <div class="hr-info">
                <div class="hr-label">{{ ts.translate(r.labelKey) }}</div>
                <div class="hr-sub">
                  {{ ts.translate('hire_match.weight_pts').replace('{{w}}', r.weight.toString()) }} · Naveen: 
                  <span class="match-text" [appTranslate]="'hire_match.full_match'"></span>
                </div>
              </div>
              <span class="tg" [class]="r.tag">{{r.weight}}pt</span>
            </label>
          }
        </div>

        <div class="hire-footer">
          💡 <strong [appTranslate]="'hire_match.roi_label'"></strong> <span [appTranslate]="'hire_match.roi_value'"></span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .hire-container { display: flex; flex-direction: column; height: 100%; background: #03040e; font-family: var(--font-b); }
    .hire-header { padding: var(--win-pad) !important; border-bottom: 1px solid rgba(255,255,255,0.05); }
    .slbl { font-family: var(--font-m); font-size: .62rem !important; color: var(--amber); letter-spacing: .2em; text-transform: uppercase; margin-bottom: 8px; }
    .hire-title { font-family: var(--font-d); font-size: 1.25rem !important; font-weight: 800; margin-bottom: 4px; color: #fff; }
    .hire-desc { font-size: .9rem !important; color: var(--text2); }
    
    .hire-body { padding: var(--win-pad) !important; overflow-y: auto; display: flex; flex-direction: column; gap: 12px; }
    
    .hire-meter { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 10px; padding: 20px; text-align: center; }
    .hire-pct { font-family: var(--font-d); font-size: 2.5rem !important; font-weight: 800; color: var(--meter-c); line-height: 1; }
    .hire-verdict { font-family: var(--font-m); font-size: .65rem !important; color: var(--meter-c); margin-top: 8px; }
    
    .hire-bar-wrap { margin-top: 12px; height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
    .hire-bar { height: 100%; border-radius: 2px; transition: width .5s var(--ease); }
    
    .role-pills { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 4px; }
    .role-pill { font-size: .75rem !important; font-weight: 600; color: #fff; background: rgba(255,255,255,.05); border: 1px solid rgba(255,255,255,0.1); padding: 4px 10px; border-radius: 6px; }

    .hr-list { display: flex; flex-direction: column; gap: 6px; }
    .hr-item { display: flex; align-items: center; gap: 12px; padding: 10px 14px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; cursor: pointer; transition: all 0.2s; }
    .hr-item:hover { border-color: rgba(255,255,255,0.1); }
    .hr-item.matched { border-color: rgba(54,217,151,.2); }
    
    .hr-check { accent-color: var(--emerald); width: 14px; height: 14px; flex-shrink: 0; }
    .hr-info { flex: 1; }
    .hr-label { font-size: .9rem !important; color: var(--text); }
    .hr-sub { font-family: var(--font-m); font-size: .55rem !important; color: var(--text3); margin-top: 2px; }
    .match-text { color: var(--emerald); }
    
    .tg { display: inline-block; font-family: var(--font-m); font-size: 0.6rem !important; padding: 2px 6px; border-radius: 4px; }
    .tg-i { background: var(--ice3); color: var(--ice); border: 1px solid rgba(86,205,250,.2); }
    .tg-v { background: rgba(139,147,255,0.1); color: var(--violet); border: 1px solid rgba(139,147,255,.2); }
    .tg-e { background: rgba(54,217,151,0.1); color: var(--emerald); border: 1px solid rgba(54,217,151,.2); }
    .tg-a { background: rgba(245,166,35,0.1); color: var(--amber); border: 1px solid rgba(245,166,35,.2); }
    .tg-r { background: rgba(255,107,122,0.1); color: var(--rose); border: 1px solid rgba(255,107,122,.2); }

    .hire-footer { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 8px; padding: 12px; font-size: .85rem !important; color: var(--text2); line-height: 1.5; margin-top: 8px; }
  `]
})
export class HireMatchComponent {
  ts = inject(TranslationService);

  requirements = signal<Requirement[]>([
    {id:'h1',  labelKey:'hire_match.req_h1',       weight:18, match:true,  tag:'tg-i'},
    {id:'h2',  labelKey:'hire_match.req_h2',       weight:14, match:true,  tag:'tg-i'},
    {id:'h3',  labelKey:'hire_match.req_h3',       weight:12, match:true,  tag:'tg-i'},
    {id:'h4',  labelKey:'hire_match.req_h4',       weight:14, match:true,  tag:'tg-v'},
    {id:'h5',  labelKey:'hire_match.req_h5',       weight:10, match:true,  tag:'tg-e'},
    {id:'h6',  labelKey:'hire_match.req_h6',       weight:8,  match:true,  tag:'tg-i'},
    {id:'h7',  labelKey:'hire_match.req_h7',       weight:8,  match:true,  tag:'tg-a'},
    {id:'h8',  labelKey:'hire_match.req_h8',       weight:8,  match:true,  tag:'tg-e'},
    {id:'h9',  labelKey:'hire_match.req_h9',       weight:4,  match:true,  tag:'tg-r'},
    {id:'h10', labelKey:'hire_match.req_h10',      weight:4,  match:true,  tag:'tg-e'},
  ]);

  roles = computed(() => {
    return this.ts.translate('hire_match.roles') as unknown as string[];
  });

  matchPercentage = computed(() => {
    const total = this.requirements().reduce((s, r) => s + r.weight, 0);
    const matched = this.requirements()
      .filter(r => r.match)
      .reduce((s, r) => s + r.weight, 0);
    return Math.round((matched / total) * 100);
  });

  verdict = computed(() => {
    const pct = this.matchPercentage();
    if (pct === 100) return { 
      text: this.ts.translate('hire_match.verdict_exceptional'), 
      color: 'var(--emerald)', 
      gradient: 'linear-gradient(90deg,var(--emerald),var(--ice))' 
    };
    if (pct >= 80) return { 
      text: this.ts.translate('hire_match.verdict_strong'), 
      color: 'var(--ice)', 
      gradient: 'linear-gradient(90deg,var(--ice),var(--violet))' 
    };
    if (pct >= 60) return { 
      text: this.ts.translate('hire_match.verdict_good'), 
      color: 'var(--amber)', 
      gradient: 'var(--amber)' 
    };
    return { 
      text: this.ts.translate('hire_match.verdict_partial'), 
      color: 'var(--text2)', 
      gradient: 'var(--b2)' 
    };
  });
}
