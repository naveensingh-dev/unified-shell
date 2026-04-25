import { Component, ElementRef, OnInit, ViewChild, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WindowStore } from '../../../store/window.store';
import { SettingsService } from '../../../services/settings.service';
import { TranslateDirective } from '../../../core/directives/translate.directive';
import { TranslationService } from '../../../services/translation.service';

interface TerminalLine {
  cls: string;
  text: string;
}

@Component({
  selector: 'app-terminal',
  standalone: true,
  imports: [CommonModule, TranslateDirective],
  template: `
    <div class="term-w">
      <div class="t-out" #scrollMe role="log" aria-live="polite">
        <div class="tl3 s" [appTranslate]="'terminal.welcome_1'"></div>
        <div class="tl3 d" [appTranslate]="'terminal.welcome_2'"></div>
        <div class="tl3 d" [appTranslate]="'terminal.welcome_3'"></div>
        @for (line of lines(); track $index) {
          <div class="tl3" [ngClass]="line.cls">{{line.text}}</div>
        }
      </div>
      <div class="t-ir">
        <span class="t-pr">naveen&#64;os:~$</span>
        <input class="t-in" #termInput type="text" (keydown.enter)="onEnter($event)" autofocus spellcheck="false" autocomplete="off">
      </div>
    </div>
  `,
  styles: [`
    :host { display: block; height: 100%; width: 100%; overflow: hidden; }
    .term-w { 
      background: #000; 
      padding: 1.5rem; 
      font-family: var(--font-m); 
      height: 100%; 
      display: flex; 
      flex-direction: column; 
      color: #fff !important;
      position: relative;
    }
    .t-out { 
      flex: 1; 
      overflow-y: auto !important; 
      margin-bottom: 1rem;
      min-height: 0;
      scrollbar-width: thin;
      scrollbar-color: var(--ice) transparent;
    }
    .t-out::-webkit-scrollbar { width: 8px; }
    .t-out::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
    .t-out::-webkit-scrollbar-thumb { background: var(--ice); border-radius: 4px; box-shadow: 0 0 10px var(--ice); }
    
    .tl3 { margin-bottom: 4px; min-height: 1.2em; white-space: pre-wrap; font-size: 0.85rem !important; line-height: 1.5; }
    .s { color: var(--emerald) !important; }
    .d { color: var(--text3) !important; }
    .p { color: var(--ice) !important; font-weight: bold; }
    .e { color: var(--rose) !important; }
    
    .t-ir { display: flex; gap: 8px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 12px; flex-shrink: 0; }
    .t-pr { color: var(--ice); font-weight: bold; font-size: 0.85rem !important; }
    .t-in { flex: 1; background: none; border: none; color: #fff; outline: none; font-family: var(--font-m); font-size: 0.85rem !important; }
  `]
})
export class TerminalComponent implements OnInit {
  @ViewChild('scrollMe') private scrollMe!: ElementRef;
  @ViewChild('termInput') private termInput!: ElementRef;
  windowStore = inject(WindowStore);
  settings = inject(SettingsService);
  ts = inject(TranslationService);
  lines = signal<TerminalLine[]>([]);

  private readonly startTime = Date.now();
  private isBusy = signal(false);

  helpLines = computed(() => [
    {cls: 's', text: this.ts.translate('terminal.help_title')},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_whoami').padEnd(12)} - ${this.ts.translate('terminal.help_desc_whoami')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_ls').padEnd(12)} - ${this.ts.translate('terminal.help_desc_ls')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_neofetch').padEnd(12)} - ${this.ts.translate('terminal.help_desc_neofetch')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_system').padEnd(12)} - ${this.ts.translate('terminal.help_desc_system')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_metrics').padEnd(12)} - ${this.ts.translate('terminal.help_desc_metrics')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_cert').padEnd(12)} - ${this.ts.translate('terminal.help_desc_cert')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_leadership').padEnd(12)} - ${this.ts.translate('terminal.help_desc_leadership')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_sys-check').padEnd(12)} - ${this.ts.translate('terminal.help_desc_sys-check')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_clear').padEnd(12)} - ${this.ts.translate('terminal.help_desc_clear')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_open').padEnd(12)} - ${this.ts.translate('terminal.help_desc_open')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_uptime').padEnd(12)} - ${this.ts.translate('terminal.help_desc_uptime')}`},
    {cls: 'd', text: `  ${this.ts.translate('terminal.help_cmd_exit').padEnd(12)} - ${this.ts.translate('terminal.help_desc_exit')}`}
  ]);

  neofetchLines = computed(() => [
    {cls: 'p', text: this.ts.translate('terminal.neofetch_os')},
    {cls: 'p', text: this.ts.translate('terminal.neofetch_kernel')},
    {cls: 'p', text: this.ts.translate('terminal.neofetch_uptime')},
    {cls: 'p', text: this.ts.translate('terminal.neofetch_shell')},
    {cls: 'p', text: this.ts.translate('terminal.neofetch_cpu')}
  ]);

  ngOnInit() {
    effect(() => {
      this.ts.lang();
      if (this.lines().length === 0 || (this.lines().length === 1 && this.lines()[0].cls === 'd')) {
        this.lines.set([{cls: 'd', text: this.ts.translate('terminal.help_msg')}]);
      }
    });
  }

  async onEnter(event: any) {
    const cmdInput = event.target.value.trim();
    if (!cmdInput || this.isBusy()) return;
    const cmd = cmdInput.toLowerCase();
    this.lines.update(l => [...l, {cls: 'p', text: `naveen@os:~$ ${cmdInput}`}]);
    
    event.target.value = '';

    if (cmd === 'help') {
      this.addLines(this.helpLines());
    } else if (cmd === 'whoami') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.whoami_output')}]);
    } else if (cmd === 'neofetch') {
      this.addLines(this.neofetchLines());
    } else if (cmd === 'ls') {
      this.addLines([{cls: 'd', text: this.ts.translate('terminal.ls_output')}]);
    } else if (cmd === 'system') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.system_output')}]);
    } else if (cmd === 'metrics') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.metrics_output')}]);
    } else if (cmd === 'cert') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.cert_output')}]);
    } else if (cmd === 'leadership') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.leadership_output')}]);
    } else if (cmd === 'sys-check') {
      await this.runSysCheck();
    } else if (cmd === 'clear') {
      this.lines.set([]);
    } else if (cmd.startsWith('open ')) {
      const app = cmdInput.split(' ')[1];
      this.windowStore.open(app, {title: `${app}.app`});
      this.addLines([{cls: 's', text: this.ts.translate('terminal.initializing_app').replace('{{app}}', app)}]);
    } else if (cmd === 'exit') {
      this.windowStore.close('term');
    } else if (cmd === 'uptime') {
      this.addLines([{cls: 's', text: this.ts.translate('terminal.uptime_output').replace('{{m}}', this.getUptime().m.toString()).replace('{{s}}', this.getUptime().s.toString())}]);
    } else {
      const notFound = this.ts.translate('terminal.not_found').replace('{{cmd}}', cmdInput);
      this.addLines([{cls: 'e', text: notFound}]);
    }
    
    this.scrollToBottom();
  }

  private async runSysCheck() {
    this.isBusy.set(true);
    const steps = [
      { key: 'terminal.sys_check_start', cls: 'p', delay: 400 },
      { key: 'terminal.sys_check_z', cls: 's', delay: 600 },
      { key: 'terminal.sys_check_s', cls: 's', delay: 500 },
      { key: 'terminal.sys_check_r', cls: 's', delay: 800 },
      { key: 'terminal.sys_check_l', cls: 's', delay: 400 },
      { key: 'terminal.sys_check_done', cls: 'p', delay: 200 }
    ];

    for (const step of steps) {
      await this.delay(step.delay);
      this.addLines([{ cls: step.cls, text: this.ts.translate(step.key) }]);
      this.scrollToBottom();
    }
    this.isBusy.set(false);
  }

  private addLines(nl: TerminalLine[]) {
    this.lines.update(l => [...l, ...nl]);
  }

  private delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  private getUptime(): {m: number, s: number} {
    const diff = Math.floor((Date.now() - this.startTime) / 1000);
    const m = Math.floor(diff / 60);
    const s = diff % 60;
    return { m, s };
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.scrollMe) {
        this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
      }
    }, 10);
  }
}
