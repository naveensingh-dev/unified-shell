import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateDirective } from '../../../core/directives/translate.directive';

@Component({
  selector: 'app-why-me',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="pitch-container">
      <header class="pitch-header">
        <h1 class="pitch-title" appTranslate="why_me.title"></h1>
        <p class="pitch-sub" appTranslate="why_me.sub"></p>
      </header>

      <div class="reasons-grid">
        <!-- 01: AI + FRONTEND SYNERGY -->
        <div class="reason-card">
          <div class="reason-top">
            <div class="reason-ico i-sys">🤖</div>
            <div class="reason-num">01</div>
          </div>
          <h2 class="reason-title" appTranslate="why_me.r1_title"></h2>
          <p class="reason-pitch" appTranslate="why_me.r1_pitch"></p>
          
          <ul class="reason-bullets">
            <li [appTranslate]="'why_me.r1_b1'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r1_b2'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r1_b3'" [useHtml]="true"></li>
          </ul>
        </div>

        <!-- 02: ENGINEERING LEADERSHIP -->
        <div class="reason-card featured">
          <div class="most-requested" appTranslate="why_me.featured_badge"></div>
          <div class="reason-top">
            <div class="reason-ico i-proj">⚡</div>
            <div class="reason-num">02</div>
          </div>
          <h2 class="reason-title" appTranslate="why_me.r2_title"></h2>
          <p class="reason-pitch" appTranslate="why_me.r2_pitch"></p>
          
          <ul class="reason-bullets">
            <li [appTranslate]="'why_me.r2_b1'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r2_b2'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r2_b3'" [useHtml]="true"></li>
          </ul>
        </div>

        <!-- 03: PRODUCT THINKING -->
        <div class="reason-card">
          <div class="reason-top">
            <div class="reason-ico i-ai">🎯</div>
            <div class="reason-num">03</div>
          </div>
          <h2 class="reason-title" appTranslate="why_me.r3_title"></h2>
          <p class="reason-pitch" appTranslate="why_me.r3_pitch"></p>
          
          <ul class="reason-bullets">
            <li [appTranslate]="'why_me.r3_b1'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r3_b2'" [useHtml]="true"></li>
            <li [appTranslate]="'why_me.r3_b3'" [useHtml]="true"></li>
          </ul>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; min-height: 0; flex: 1; }
    .pitch-container { 
      flex: 1 1 auto; 
      padding: var(--win-pad) !important; 
      overflow-y: auto !important; 
      -webkit-overflow-scrolling: touch;
      overscroll-behavior-y: contain;
      padding-bottom: 80px !important;
      background: #03040e; 
      font-family: var(--font-b); 
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .pitch-container::-webkit-scrollbar { width: 8px; }
    .pitch-container::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .pitch-container::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; box-shadow: 0 0 10px var(--ice); }

    .pitch-header { text-align: center; margin-bottom: 3rem; }
    .pitch-title { font-family: var(--font-d); font-size: var(--win-hd) !important; font-weight: 900; color: #fff; margin-bottom: 4px; }
    .pitch-sub { font-size: 0.95rem !important; color: var(--ice); font-weight: 600; }

    .reasons-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .reason-card { 
      background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; padding: 20px; 
      display: flex; flex-direction: column; position: relative; transition: border-color 0.3s;
    }
    .reason-card:hover { border-color: var(--ice); }
    .reason-card.featured { border-color: rgba(245,166,35,0.3); background: linear-gradient(180deg, rgba(255,255,255,0.02) 0%, rgba(245,166,35,0.02) 100%); }
    
    .most-requested { 
      position: absolute; top: -10px; right: 16px; background: var(--amber); color: #000; 
      font-family: var(--font-m); font-size: .55rem !important; font-weight: 800; padding: 2px 8px; border-radius: 4px; 
    }

    .reason-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 1.5rem; }
    .reason-ico { width: 40px; height: 40px; border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 1.25rem; background: rgba(255,255,255,0.03); }
    .reason-num { font-family: var(--font-m); font-size: 1.2rem !important; font-weight: 800; color: var(--text3); opacity: .2; }
    
    .reason-title { font-family: var(--font-d); font-size: 1.1rem !important; font-weight: 800; margin-bottom: 8px; color: #fff; }
    .reason-pitch { font-size: 0.85rem !important; color: var(--text2); line-height: 1.6; margin-bottom: 1.5rem; }
    
    .reason-bullets { list-style: none; padding: 0; display: flex; flex-direction: column; gap: 10px; }
    .reason-bullets li { display: flex; align-items: flex-start; gap: 8px; font-size: 0.85rem !important; line-height: 1.5; color: var(--text2); }
    .reason-bullets li::before { content: '✓'; color: var(--emerald); font-weight: 900; }
    .reason-bullets li strong { color: #fff; font-weight: 700; }

    @media (max-width: 1100px) {
      .reasons-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class WhyMeComponent {}
