import { Component } from '@angular/core';

@Component({
  selector: 'app-advancing-cards',
  standalone: true,
  template: `
    <section class="advancing-section wrap r">
      <div class="advancing-header">
        <h3 class="advancing-title">Currently Advancing</h3>
        <p class="advancing-subtitle">Deepening expertise in the next generation of frontend and AI architecture.</p>
      </div>
      <div class="advancing-grid">
        <div class="advancing-card advancing-ngrx">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">⚡</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">NgRx Signal Store</h4>
            <p class="advancing-card-desc">Mastering fine-grained reactivity and functional state management for high-performance enterprise applications.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">Signals</span>
              <span class="advancing-tag">State</span>
            </div>
          </div>
        </div>
        <div class="advancing-card advancing-nx">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">🏗️</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">Nx Monorepos</h4>
            <p class="advancing-card-desc">Architecting scalable multi-package systems with advanced caching and dependency graph management.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">Scalability</span>
              <span class="advancing-tag">Build</span>
            </div>
          </div>
        </div>
        <div class="advancing-card advancing-analog">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">🔥</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">Analog.js</h4>
            <p class="advancing-card-desc">Building full-stack Angular applications with Vite, SSR, and file-based routing for modern web experiences.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">Fullstack</span>
              <span class="advancing-tag">Vite</span>
            </div>
          </div>
        </div>
        <div class="advancing-card advancing-cdk">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">🛡️</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">Angular CDK</h4>
            <p class="advancing-card-desc">Developing accessible, high-quality component libraries using the Angular Component Dev Kit primitives.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">A11y</span>
              <span class="advancing-tag">UI Kit</span>
            </div>
          </div>
        </div>
        <div class="advancing-card advancing-rag">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">🤖</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">Advanced RAG</h4>
            <p class="advancing-card-desc">Optimizing retrieval-augmented generation with vector databases, hybrid search, and hallucination mitigation.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">AI</span>
              <span class="advancing-tag">LLM</span>
            </div>
          </div>
        </div>
        <div class="advancing-card advancing-llm">
          <div class="advancing-card-shine"></div>
          <div class="advancing-card-icon">🧠</div>
          <div class="advancing-card-content">
            <h4 class="advancing-card-title">LLM Fine-tuning</h4>
            <p class="advancing-card-desc">Specializing in domain adaptation and model evaluation for specific enterprise use cases and performance.</p>
            <div class="advancing-tags">
              <span class="advancing-tag">Training</span>
              <span class="advancing-tag">Eval</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  `,
  styles: [`
    .advancing-section{margin-top:80px;padding-top:60px;border-top:1px solid var(--border)}
    .advancing-header{margin-bottom:48px}
    .advancing-title{
      font-family:var(--hero);font-size:clamp(24px,3vw,36px);
      color:var(--txt1);margin-bottom:8px;letter-spacing:.02em;
    }
    .advancing-subtitle{
      font-size:var(--sm);color:var(--txt3);
    }
    .advancing-grid{
      display:grid;grid-template-columns:repeat(auto-fit,minmax(320px,1fr));
      gap:24px;margin-bottom:40px;
    }
    .advancing-card{
      position:relative;padding:28px 24px;border-radius:16px;
      border:1px solid var(--border);background:linear-gradient(135deg,rgba(124,58,237,.03),rgba(8,145,178,.02));
      overflow:hidden;cursor:pointer;
      transition:all .3s var(--ease);
    }
    .advancing-card:hover{
      transform:translateY(-8px);
      border-color:var(--border2);
      background:linear-gradient(135deg,rgba(124,58,237,.06),rgba(8,145,178,.05));
      box-shadow:0 20px 50px rgba(0,0,0,.3);
    }
    .advancing-card-shine{
      position:absolute;inset:0;
      background:linear-gradient(135deg,transparent 0%,rgba(255,255,255,.1) 50%,transparent 100%);
      opacity:0;transition:opacity .4s;pointer-events:none;
    }
    .advancing-card:hover .advancing-card-shine{opacity:1}
    .advancing-card-icon{
      font-size:32px;margin-bottom:12px;
    }
    .advancing-card-title{
      font-size:18px;font-weight:700;color:var(--txt1);margin-bottom:8px;
    }
    .advancing-card-desc{
      font-size:var(--sm);color:var(--txt3);line-height:1.65;margin-bottom:16px;
    }
    .advancing-tags{
      display:flex;flex-wrap:wrap;gap:6px;
    }
    .advancing-tag{
      font-family:var(--mono);font-size:10px;padding:4px 10px;
      border-radius:6px;background:var(--raised);border:1px solid var(--border2);
      color:var(--txt3);letter-spacing:.04em;
    }
    .advancing-ngrx:hover{border-color:rgba(124,58,237,.3);box-shadow:0 0 30px rgba(124,58,237,.15)}
    .advancing-nx:hover{border-color:rgba(8,145,178,.3);box-shadow:0 0 30px rgba(8,145,178,.15)}
    .advancing-analog:hover{border-color:rgba(217,119,6,.3);box-shadow:0 0 30px rgba(217,119,6,.15)}
    .advancing-cdk:hover{border-color:rgba(5,150,105,.3);box-shadow:0 0 30px rgba(5,150,105,.15)}
    .advancing-rag:hover{border-color:rgba(6,182,212,.3);box-shadow:0 0 30px rgba(6,182,212,.15)}
    .advancing-llm:hover{border-color:rgba(236,72,153,.3);box-shadow:0 0 30px rgba(236,72,153,.15)}
  `]
})
export class AdvancingCards {}
