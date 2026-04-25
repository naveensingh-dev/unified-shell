import { Component, signal, inject, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NaveenAiEngineService } from '../../services/naveen-ai-engine.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (isVisible()) {
      <div class="ai-assistant-wrap fade-in">
        <header class="ai-header">
          <div class="ai-brand">
            <span class="ai-ico">🤖</span>
            <span>NAVEEN_AI_ASSISTANT</span>
          </div>
          <button class="close-btn" (click)="toggle()">×</button>
        </header>
        
        <div class="ai-chat-area" #scrollMe>
          @for (msg of messages(); track $index) {
            <div class="msg-bubble" [class.user]="msg.role === 'user'">
              {{ msg.text }}
            </div>
          }
          @if (isTyping()) {
            <div class="msg-bubble ai typing">...</div>
          }
        </div>

        <footer class="ai-footer">
          <input type="text" [(ngModel)]="userInput" (keyup.enter)="send()" placeholder="Ask about Naveen...">
          <button (click)="send()" [disabled]="!userInput().trim()">➤</button>
        </footer>
      </div>
    }

    <button class="ai-trigger" (click)="toggle()" [class.active]="isVisible()">
      <span class="ai-ico">🤖</span>
    </button>
  `,
  styles: [`
    .ai-trigger {
      position: fixed; bottom: 100px; right: 30px; z-index: 5000;
      width: 60px; height: 60px; border-radius: 50%;
      background: var(--ice); border: none; cursor: pointer;
      box-shadow: 0 10px 30px rgba(86,205,250,0.4);
      display: flex; align-items: center; justify-content: center;
      transition: all 0.3s var(--spring);
    }
    .ai-trigger:hover { transform: scale(1.1) rotate(5deg); }
    .ai-trigger.active { background: #fff; transform: scale(0.9); }
    .ai-ico { font-size: 1.5rem; }

    .ai-assistant-wrap {
      position: fixed; bottom: 180px; right: 30px; z-index: 5001;
      width: 350px; height: 450px; background: rgba(10, 12, 20, 0.95);
      backdrop-filter: blur(30px); border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 20px; display: flex; flex-direction: column;
      box-shadow: 0 30px 60px rgba(0,0,0,0.8); overflow: hidden;
    }
    .ai-header { padding: 15px; background: rgba(255,255,255,0.03); border-bottom: 1px solid rgba(255,255,255,0.05); display: flex; justify-content: space-between; align-items: center; }
    .ai-brand { font-family: var(--font-m); font-size: 0.6rem; color: var(--ice); letter-spacing: 0.15em; display: flex; align-items: center; gap: 8px; }
    .close-btn { background: none; border: none; color: #fff; font-size: 1.2rem; cursor: pointer; opacity: 0.5; }
    .close-btn:hover { opacity: 1; }

    .ai-chat-area { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; scrollbar-width: none; }
    .ai-chat-area::-webkit-scrollbar { display: none; }
    .msg-bubble { padding: 10px 14px; border-radius: 14px; font-size: 0.85rem; line-height: 1.4; max-width: 85%; }
    .msg-bubble.user { background: var(--ice); color: #000; align-self: flex-end; border-bottom-right-radius: 2px; }
    .msg-bubble:not(.user) { background: rgba(255,255,255,0.05); color: #fff; align-self: flex-start; border-bottom-left-radius: 2px; border: 1px solid rgba(255,255,255,0.05); }
    .msg-bubble.typing { opacity: 0.5; }

    .ai-footer { padding: 15px; border-top: 1px solid rgba(255,255,255,0.05); display: flex; gap: 10px; }
    .ai-footer input { flex: 1; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 0.85rem; outline: none; }
    .ai-footer button { background: var(--ice); border: none; width: 40px; border-radius: 10px; cursor: pointer; color: #000; font-size: 1rem; }
    .ai-footer button:disabled { opacity: 0.3; cursor: not-allowed; }
  `]
})
export class AiAssistantComponent implements AfterViewChecked {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;
  aiEngine = inject(NaveenAiEngineService);
  
  isVisible = signal(false);
  userInput = signal('');
  isTyping = signal(false);
  messages = signal<{role: 'user' | 'ai', text: string}[]>([
    { role: 'ai', text: 'Hello! I am NaveenAI. How can I help you explore Naveen\'s portfolio today?' }
  ]);

  ngAfterViewChecked() {        
    this.scrollToBottom();        
  } 

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch(err) { }                 
  }

  toggle() {
    this.isVisible.update(v => !v);
  }

  async send() {
    const text = this.userInput().trim();
    if (!text) return;

    this.messages.update(prev => [...prev, { role: 'user', text }]);
    this.userInput.set('');
    this.isTyping.set(true);

    try {
      const result = await this.aiEngine.queryEngine(text);
      this.messages.update(prev => [...prev, { role: 'ai', text: result.answer }]);
    } catch (e) {
      this.messages.update(prev => [...prev, { role: 'ai', text: 'I encountered an error. Please try again.' }]);
    } finally {
      this.isTyping.set(false);
    }
  }
}
