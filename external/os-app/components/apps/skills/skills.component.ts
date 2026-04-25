import { Component, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

@Component({
  selector: 'app-skills',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="skl-wrap">
      <div class="skl-header">
        <h1 [appTranslate]="'skills.title'"></h1>
        <p class="skl-sub" [appTranslate]="'skills.sub'"></p>
      </div>

      <div class="skl-scroll">
        <div class="skl-grid">
          @for (cat of skillCats(); track cat.title) {
            <div class="skl-card">
              <div class="skl-card-hdr">
                <span class="skl-icon">{{cat.icon}}</span>
                <h3 class="skl-cat-title" [appTranslate]="cat.localizedTitle"></h3>
              </div>
              <div class="skl-list">
                @for (s of cat.skills; track s.n) {
                  <div class="skl-item">
                    <div class="skl-n-row">
                      <span class="skl-n">{{s.n}}</span>
                      <span class="skl-v">{{s.v}}%</span>
                    </div>
                    <div class="skl-bar-bg">
                      <div class="skl-bar-fill" [style.width.%]="s.v"></div>
                    </div>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .skl-wrap { 
      flex: 1 1 auto; 
      display: flex; 
      flex-direction: column; 
      height: 100%; 
      width: 100%; 
      background: #03040e; 
      padding: 2rem; 
      overflow-y: auto !important;
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: 80px !important;
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .skl-wrap::-webkit-scrollbar { width: 8px; }
    .skl-wrap::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .skl-wrap::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; box-shadow: 0 0 10px var(--ice); }

    .skl-header { flex-shrink: 0; margin-bottom: 2rem; }
    .skl-sub { color: var(--text3); font-size: 0.95rem !important; }
    
    .skl-scroll { flex: 1; min-height: 0; }
    .skl-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; padding-bottom: 50px; }
    
    .skl-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 1.5rem; transition: all 0.3s; }
    .skl-card:hover { background: rgba(255,255,255,0.04); border-color: rgba(86,205,250,0.2); transform: translateY(-4px); }

    .skl-card-hdr { display: flex; align-items: center; gap: 12px; margin-bottom: 1.5rem; }
    .skl-icon { font-size: 1.2rem; }
    .skl-cat-title { font-family: var(--font-m); font-size: 0.85rem !important; color: var(--ice); text-transform: uppercase; letter-spacing: 0.05em; margin: 0; }

    .skl-list { display: flex; flex-direction: column; gap: 14px; }
    .skl-item { }
    .skl-n-row { display: flex; justify-content: space-between; margin-bottom: 6px; }
    .skl-n { font-weight: 600; font-size: 0.85rem !important; color: var(--text2); }
    .skl-v { font-family: var(--font-m); font-size: 0.75rem !important; color: var(--text3); }

    .skl-bar-bg { height: 4px; background: rgba(255,255,255,0.05); border-radius: 2px; overflow: hidden; }
    .skl-bar-fill { height: 100%; background: linear-gradient(90deg, var(--ice), var(--violet)); border-radius: 2px; }

    @media (max-width: 768px) {
      .skl-grid { grid-template-columns: 1fr; }
      .skl-wrap { padding: 1.5rem; }
    }
  `]
})
export class SkillsComponent {
  private ts = inject(TranslationService);

  skillCats = computed(() => [
    { title: 'Angular & Core Ecosystem', localizedTitle: 'skills.cats.angular', icon: '⚡', skills: [{n:this.ts.translate('skills.items.angular_v2_v19'),v:98}, {n:this.ts.translate('skills.items.signals_reactivity'),v:96}, {n:this.ts.translate('skills.items.zoneless_arch'),v:92}, {n:this.ts.translate('skills.items.rxjs_7'),v:94}, {n:this.ts.translate('skills.items.angular_material_cdk'),v:95}] },
    { title: 'Frontend Architecture', localizedTitle: 'skills.cats.arch', icon: '🏗️', skills: [{n:this.ts.translate('skills.items.micro_frontends'),v:90}, {n:this.ts.translate('skills.items.nx_monorepos'),v:92}, {n:this.ts.translate('skills.items.module_federation'),v:88}, {n:this.ts.translate('skills.items.web_vitals_perf'),v:94}, {n:this.ts.translate('skills.items.ssr_hydration'),v:85}] },
    { title: 'Generative AI & LLM', localizedTitle: 'skills.cats.ai', icon: '🤖', skills: [{n:this.ts.translate('skills.items.rag_architecture'),v:92}, {n:this.ts.translate('skills.items.langchain_faiss'),v:88}, {n:this.ts.translate('skills.items.prompt_engineering'),v:95}, {n:this.ts.translate('skills.items.llm_as_judge'),v:90}, {n:this.ts.translate('skills.items.python_fastapi'),v:82}] },
    { title: 'Engineering Governance', localizedTitle: 'skills.cats.gov', icon: '🛡️', skills: [{n:this.ts.translate('skills.items.adr_rfc_process'),v:90}, {n:this.ts.translate('skills.items.mentorship_at_scale'),v:95}, {n:this.ts.translate('skills.items.cicd_governance'),v:88}, {n:this.ts.translate('skills.items.testing_stack'),v:92}] },
    { title: 'Languages & Tooling', localizedTitle: 'skills.cats.tools', icon: '🛠️', skills: [{n:this.ts.translate('skills.items.typescript_5'),v:96}, {n:this.ts.translate('skills.items.nodejs'),v:90}, {n:this.ts.translate('skills.items.docker_containers'),v:85}, {n:this.ts.translate('skills.items.auth0_jwt'),v:92}] }
  ]);
}
