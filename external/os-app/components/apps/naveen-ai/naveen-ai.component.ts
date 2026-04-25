import { Component, signal, ElementRef, ViewChild, AfterViewChecked, inject, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NaveenAiEngineService } from '../../../services/naveen-ai-engine.service';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';
import { QuantumLoaderComponent } from '../../shared/quantum-loader.component';

interface Message {
  role: 'u' | 'a';
  text: string;
  isStreaming?: boolean;
  processLog?: string[];
  sources?: { name: string; page: number; url: string }[];
}

@Component({
  selector: 'app-naveen-ai',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateDirective, QuantumLoaderComponent],
  template: `
    <div class="nai-container" role="region" aria-label="AI Assistant Chat">
      <div class="nai-hd">
        <div class="nai-orb" aria-hidden="true"><div class="nai-orb-i">✦</div></div>
        <div>
          <div class="nai-nm" [appTranslate]="'naveen_ai.engine_name'"></div>
          <div class="nai-st">● <span [appTranslate]="'naveen_ai.status'"></span></div>
        </div>
      </div>
      
      <div class="nai-msgs" #scrollMe role="log" aria-live="polite">
        @for (msg of messages(); track $index) {
          <div class="msg-wrapper" [class.user]="msg.role === 'u'">
            @if (msg.role === 'a' && msg.processLog && msg.processLog.length > 0) {
              <div class="rag-log-box" aria-label="AI Processing Trace">
                <div class="rag-log-title" [appTranslate]="'naveen_ai.trace_title'"></div>
                @for (log of msg.processLog; track $index) {
                  <div class="rag-log-item">{{log}}</div>
                }
              </div>
            }

            <div class="nm" [class]="msg.role" [attr.aria-label]="msg.role === 'u' ? 'You said' : 'Assistant said'">
              @if (msg.isStreaming) {
                <div class="ai-thinking-state">
                  <app-quantum-loader label="SYNTHESIZING_RESPONSE"></app-quantum-loader>
                </div>
              } @else {
                <div [innerHTML]="msg.text"></div>
                
                @if (msg.sources && msg.sources.length > 0) {
                  <div class="sources-box">
                    <span class="src-lbl" [appTranslate]="'naveen_ai.sources'"></span>:
                    @for (src of msg.sources; track src.name) {
                      <a [href]="src.url" target="_blank" class="src-badge" [attr.aria-label]="'Source: ' + src.name + ' page ' + src.page">
                         {{src.name}} (p.{{src.page}})
                      </a>
                    }
                  </div>
                }
              }
            </div>
          </div>
        }
      </div>

      <div class="nai-footer">
        <div class="nai-chips" aria-label="Suggested questions">
          @for (chip of chips(); track chip.q) {
            <button class="ncp" (click)="userInput.set(chip.q); send()" [attr.aria-label]="'Ask about ' + chip.label">
              {{chip.label}}
            </button>
          }
        </div>

        <div class="nai-ir">
          <input class="nai-inp" 
                 [ngModel]="userInput()" 
                 (ngModelChange)="userInput.set($event)"
                 (keydown.enter)="send()"
                 [disabled]="isProcessing()"
                 aria-label="Type your message to the AI"
                 [appTranslateAttr]="{ placeholder: 'naveen_ai.placeholder' }">
          <button class="nai-snd" [disabled]="isProcessing()" (click)="send()" aria-label="Send message">↑</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    :host { display: flex; flex-direction: column; height: 100%; width: 100%; overflow: hidden; flex: 1; min-height: 0; }
    .nai-container { display:flex; flex-direction:column; height:100%; width: 100%; background: #03040e; overflow: hidden; flex: 1; min-height: 0; }
    .nai-hd { display: flex; align-items: center; gap: 12px; padding: 1rem 1.5rem !important; border-bottom: 1px solid rgba(255,255,255,0.05); flex-shrink: 0; }
    .nai-orb { width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0; background: conic-gradient(from 0deg, var(--ice), var(--violet), var(--ice)); display: flex; align-items: center; justify-content: center; animation: orb-p 3s ease infinite; }
    .nai-orb-i { width: 26px; height: 26px; border-radius: 50%; background: #03040e; display: flex; align-items: center; justify-content: center; font-size: .8rem; }
    @keyframes orb-p { 0%,100%{box-shadow:0 0 10px rgba(86,205,250,.35)} 50%{box-shadow:0 0 20px rgba(86,205,250,.65)} }
    .nai-nm { font-family: var(--font-d); font-size: 1rem !important; font-weight: 800; color: #fff; }
    .nai-st { font-family: var(--font-m); font-size: .62rem !important; color: var(--ice); text-transform: uppercase; }
    .nai-msgs { flex: 1; overflow-y: auto; padding: 1.5rem !important; display: flex; flex-direction: column; gap: 1rem; min-height: 0; scrollbar-width: thin; scrollbar-color: var(--ice) transparent; padding-bottom: 100px !important; }
    .msg-wrapper { display: flex; flex-direction: column; align-items: flex-start; max-width: 88%; flex-shrink: 0; }
    .msg-wrapper.user { align-self: flex-end; align-items: flex-end; }
    .rag-log-box { font-family: var(--font-m); font-size: 0.75rem !important; color: #CBD5E1; background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 8px 10px; margin-bottom: 8px; width: 100%; }
    .nm { font-size: 0.9rem !important; line-height: 1.6; padding: 10px 14px; border-radius: 12px; min-width: 60px; }
    .nm.u { background: rgba(139,147,255,0.15); border: 1px solid rgba(139,147,255,0.25); border-bottom-right-radius: 2px; color: #fff; }
    .nm.a { background: rgba(86,205,250,0.08); border: 1px solid rgba(86,205,250,0.15); border-top-left-radius: 2px; color: var(--text2); }
    .ai-thinking-state { width: 200px; height: 100px; overflow: hidden; border-radius: 8px; }
    .sources-box { margin-top: 12px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; flex-wrap: wrap; gap: 6px; align-items: center; }
    .src-badge { font-family: var(--font-m); font-size: 0.65rem !important; color: var(--ice); background: var(--ice3); border: 1px solid rgba(86,205,250,0.2); padding: 2px 8px; border-radius: 4px; text-decoration: none; }
    .nai-footer { flex-shrink: 0; background: rgba(3, 4, 14, 0.98); backdrop-filter: blur(20px); border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; z-index: 10; padding-bottom: 20px; }
    .nai-chips { display: flex; flex-wrap: wrap; gap: 8px; padding: 0 1.5rem 12px !important; }
    .ncp { font-family: var(--font-m); font-size: 0.75rem !important; padding: 6px 12px; border-radius: 20px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); color: var(--text2); }
    .nai-ir { display: flex; gap: 8px; padding: 0 1.5rem 1.5rem !important; align-items: center; }
    .nai-inp { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 8px; padding: 10px 14px; color: #fff; font-size: 0.9rem !important; outline: none; }
    .nai-snd { background: linear-gradient(135deg, var(--violet), var(--ice)); border: none; border-radius: 8px; width: 38px; height: 38px; display: flex; align-items: center; justify-content: center; color: #fff; }

    @media (max-width: 768px) {
      .nai-hd { padding: 0.75rem 1rem !important; }
      .nai-nm { font-size: 0.9rem !important; }
      .nai-msgs { padding: 1rem !important; padding-bottom: 80px !important; }
      .msg-wrapper { max-width: 92%; }
      .nm { font-size: 0.85rem !important; padding: 8px 12px; }
      .nai-chips { flex-wrap: nowrap; overflow-x: auto; padding: 0 1rem 8px !important; scrollbar-width: none; }
      .nai-chips::-webkit-scrollbar { display: none; }
      .nai-ir { padding: 0 1rem 1rem !important; }
      .ai-thinking-state { width: 100%; height: 80px; }
    }
  `]
})
export class NaveenAiComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  private aiEngine = inject(NaveenAiEngineService);
  private ts = inject(TranslationService);

  userInput = signal('');
  isProcessing = signal(false);
  messages = signal<Message[]>([]);

  chips = computed(() => {
    const rawChips = this.ts.translate('naveen_ai.chips');
    return Array.isArray(rawChips) ? rawChips : [];
  });

  constructor() {
    effect(() => {
      const lang = this.ts.lang();
      this.messages.set([
        { role: 'a', text: this.ts.translate('naveen_ai.initial_msg') }
      ]);
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async send() {
    const q = this.userInput().trim();
    if (!q || this.isProcessing()) return;

    this.messages.update(m => [...m, { role: 'u', text: q }]);
    this.userInput.set('');
    this.isProcessing.set(true);

    this.messages.update(m => [...m, { role: 'a', text: '', isStreaming: true, processLog: [], sources: [] }]);

    const { processLog, answer, sources } = await this.aiEngine.queryEngine(q);

    for (let i = 0; i < processLog.length; i++) {
      this.messages.update(m => {
        const newMsgs = [...m];
        newMsgs[newMsgs.length - 1].processLog = processLog.slice(0, i + 1);
        return newMsgs;
      });
      await this.delay(200);
      this.scrollToBottom();
    }

    this.messages.update(m => {
      const newMsgs = [...m];
      newMsgs[newMsgs.length - 1].isStreaming = false;
      newMsgs[newMsgs.length - 1].text = answer;
      newMsgs[newMsgs.length - 1].sources = sources;
      return newMsgs;
    });

    this.isProcessing.set(false);
    this.scrollToBottom();
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }
}
