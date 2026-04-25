import { Component, HostListener, OnInit, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { WindowStore } from '../../store/window.store';
import { SettingsService } from '../../services/settings.service';
import { SpotlightService } from '../../services/spotlight.service';
import { BentoModeComponent } from '../bento-mode/bento-mode.component';
import { OsModeComponent } from '../os-mode/os-mode.component';

@Component({
  selector: 'app-desktop',
  standalone: true,
  imports: [CommonModule, BentoModeComponent, OsModeComponent],
  template: `
    @if (settings.classicMode()) {
      <app-bento-mode></app-bento-mode>
    } @else {
      <app-os-mode></app-os-mode>
    }
  `,
  styles: [``]
})
export class DesktopComponent implements OnInit {
  windowStore = inject(WindowStore);
  settings = inject(SettingsService);
  spotlightService = inject(SpotlightService);
  private platformId = inject(PLATFORM_ID);

  @HostListener('window:keydown', ['$event'])
  onGlobalKeyDown(e: KeyboardEvent) {
    if (e.key === 'F3') { e.preventDefault(); this.windowStore.toggleMissionControl(); }
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') { e.preventDefault(); this.spotlightService.toggle(); }
    if ((e.metaKey || e.ctrlKey) && e.altKey && e.key === 'w') { e.preventDefault(); this.windowStore.closeAll(); }
  }

  ngOnInit() {
    this.checkMobile();
  }

  @HostListener('window:resize')
  checkMobile() {
    if (isPlatformBrowser(this.platformId)) {
      const mobile = window.innerWidth <= 768;
      this.windowStore.setMobile(mobile);
    }
  }
}
