import { Injectable, signal, computed, inject } from '@angular/core';
import { WindowStore } from '../store/window.store';
import { ResumeService } from './resume.service';
import { TranslationService } from './translation.service';

export interface SearchResult {
  id: string;
  type: 'app' | 'action' | 'project' | 'skill';
  ico: string;
  title: string;
  sub: string;
  action: () => void;
}

@Injectable({
  providedIn: 'root'
})
export class SpotlightService {
  private windowStore = inject(WindowStore);
  private resumeService = inject(ResumeService);
  private ts = inject(TranslationService);
  
  isVisible = signal(false);
  query = signal('');

  private index = computed(() => [
    { id: 'sys', type: 'app', ico: '🖥', title: this.ts.translate('dock.sys'), sub: 'Identity · Architecture · Key metrics', action: () => this.open('sys', {title: this.ts.translate('dock.sys'), width:700, height:540}) },
    { id: 'proj', type: 'app', ico: '📁', title: this.ts.translate('dock.proj'), sub: 'Enterprise portfolio · Tech stacks', action: () => this.open('proj', {title: this.ts.translate('dock.proj'), width:760, height:530}) },
    { id: 'ai', type: 'app', ico: '🤖', title: this.ts.translate('dock.ai'), sub: 'RAG pipeline · Hallucination mitigation', action: () => this.open('ai', {title: this.ts.translate('dock.ai'), width:730, height:560}) },
    { id: 'term', type: 'app', ico: '⌨', title: this.ts.translate('dock.term'), sub: 'Interactive CLI · System commands', action: () => this.open('term', {title: this.ts.translate('dock.term'), width:800, height:500}) },
    { id: 'sch', type: 'app', ico: '📅', title: this.ts.translate('dock.sch'), sub: 'Book a strategy session', action: () => this.open('sch', {title: this.ts.translate('dock.sch'), width:600, height:550}) },
    { id: 'resume', type: 'action', ico: '📄', title: this.ts.translate('dock.resume'), sub: 'Naveen_Singh_Resume.pdf', action: () => { this.resumeService.download(); this.close(); } },
    { id: 'settings', type: 'app', ico: '⚙️', title: this.ts.translate('topbar.settings'), sub: 'Themes · Fonts · Personalization', action: () => this.open('sets', {title: this.ts.translate('topbar.settings')}) },
  ]);

  results = computed(() => {
    const q = this.query().toLowerCase().trim();
    const data = this.index();
    if (!q) return data.slice(0, 5); // Show suggestions
    return data.filter(item => 
      item.title.toLowerCase().includes(q) || 
      item.sub.toLowerCase().includes(q)
    );
  });

  private open(id: string, config: any) {
    this.windowStore.open(id, config);
    this.close();
  }

  toggle() { this.isVisible.update(v => !v); if (!this.isVisible()) this.query.set(''); }
  close() { this.isVisible.set(false); this.query.set(''); }
}
