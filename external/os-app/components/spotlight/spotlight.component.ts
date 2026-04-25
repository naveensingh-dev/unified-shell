import { Component, inject, HostListener, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SpotlightService, SearchResult } from '../../services/spotlight.service';

@Component({
  selector: 'app-spotlight',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (spotlight.isVisible()) {
      <div class="cmd-overlay" (click)="spotlight.close()">
        <div class="cmd-center" (click)="$event.stopPropagation()">
          
          <div class="cmd-input-row">
            <span class="cmd-ico">🔍</span>
            <input #spInput
                   [ngModel]="spotlight.query()" 
                   (ngModelChange)="spotlight.query.set($event)"
                   (keydown)="handleKey($event)"
                   placeholder="Search projects, skills, timeline, commands…" 
                   class="cmd-in"
                   autocomplete="off"
                   spellcheck="false">
            <span class="cmd-kbd">ESC</span>
          </div>
          
          <div class="cmd-results">
            @for (res of spotlight.results(); track res.id; let i = $index) {
              <div class="cmd-item" 
                   [class.active]="selectedIndex === i"
                   (click)="res.action()"
                   (mouseenter)="selectedIndex = i">
                <div class="item-ico">{{res.ico}}</div>
                <div class="item-info">
                  <div class="item-title">{{res.title}}</div>
                  <div class="item-sub">{{res.sub}}</div>
                </div>
              </div>
            }
            
            @if (spotlight.results().length === 0) {
              <div class="cmd-empty">
                <div>No matching commands found.</div>
              </div>
            }
          </div>

          <div class="cmd-footer">
            <span class="f-tip">↑↓ navigate</span>
            <span class="f-tip">↵ open</span>
            <span class="f-tip">ESC close</span>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .cmd-overlay {
      position: fixed; inset: 0; z-index: 10000; 
      background: rgba(0,0,0,.6); backdrop-filter: blur(8px);
      display: flex; align-items: flex-start; justify-content: center; padding-top: 14vh;
    }
    
    .cmd-center {
      width: min(580px, 92vw); 
      background: rgba(5,6,16,.97); 
      border: 1px solid rgba(255,255,255,0.1); 
      border-radius: 14px; overflow: hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,.8), 0 0 0 1px rgba(86,205,250,.08);
    }

    .cmd-input-row { 
      display: flex; align-items: center; gap: 10px; padding: .75rem 1rem; 
      border-bottom: 1px solid rgba(255,255,255,0.05); 
    }
    .cmd-ico { font-size: 0.9rem; color: var(--text3); }
    .cmd-in { 
      flex: 1; background: none; border: none; outline: none; 
      color: #fff; font-size: 0.82rem !important; font-family: var(--font-b);
      caret-color: var(--ice);
    }
    .cmd-kbd { font-family: var(--font-m); font-size: .55rem !important; color: var(--text3); background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); padding: 1px 6px; border-radius: 3px; }

    .cmd-results { max-height: 340px; overflow-y: auto; padding: .35rem 0; }
    .cmd-item { 
      display: flex; align-items: center; gap: 12px; padding: 10px 1rem; 
      cursor: pointer; transition: background 0.1s;
    }
    .cmd-item.active { background: rgba(86,205,250,0.08); }
    
    .item-ico { width: 32px; height: 32px; border-radius: 6px; background: rgba(255,255,255,0.03); display: flex; align-items: center; justify-content: center; font-size: 1rem; }
    .cmd-item.active .item-ico { background: var(--ice); color: #000; }
    
    .item-info { flex: 1; }
    .item-title { font-size: 0.8rem !important; font-weight: 700; color: #fff; margin-bottom: 2px; }
    .item-sub { font-size: 0.65rem !important; color: var(--text3); font-family: var(--font-m); }

    .cmd-empty { padding: 2rem; text-align: center; color: var(--text3); font-size: 0.75rem !important; }
    
    .cmd-footer { 
      padding: .45rem 1rem; background: rgba(0,0,0,0.2); border-top: 1px solid rgba(255,255,255,0.05); 
      display: flex; gap: 1rem; 
    }
    .f-tip { font-size: 0.56rem !important; font-family: var(--font-m); color: var(--text3); text-transform: uppercase; }

    @media (max-width: 768px) {
      .cmd-overlay { padding-top: 5vh; }
      .cmd-center { width: 95vw; }
      .cmd-footer { display: none; }
    }
  `]
})
export class SpotlightComponent implements AfterViewChecked {
  @ViewChild('spInput') private inputRef!: ElementRef<HTMLInputElement>;
  spotlight = inject(SpotlightService);
  selectedIndex = 0;
  private focusSet = false;

  ngAfterViewChecked() {
    if (this.spotlight.isVisible() && !this.focusSet && this.inputRef) {
      setTimeout(() => this.inputRef.nativeElement.focus(), 50);
      this.focusSet = true;
    } else if (!this.spotlight.isVisible()) {
      this.focusSet = false;
    }
  }

  @HostListener('window:keydown', ['$event'])
  handleGlobalKey(event: KeyboardEvent) {
    if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
      event.preventDefault();
      this.spotlight.toggle();
      this.selectedIndex = 0;
    }
    if (event.key === 'Escape' && this.spotlight.isVisible()) {
      this.spotlight.close();
    }
  }

  handleKey(event: KeyboardEvent) {
    const results = this.spotlight.results();
    if (event.key === 'ArrowDown') {
      this.selectedIndex = (this.selectedIndex + 1) % results.length;
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      this.selectedIndex = (this.selectedIndex - 1 + results.length) % results.length;
      event.preventDefault();
    } else if (event.key === 'Enter') {
      if (results[this.selectedIndex]) {
        results[this.selectedIndex].action();
      }
    }
  }
}
