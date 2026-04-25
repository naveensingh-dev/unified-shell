import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DesktopComponent } from './components/desktop/desktop.component';
import { SpotlightComponent } from './components/spotlight/spotlight.component';
import { OnboardingComponent } from './components/shared/onboarding.component';
import { AiAssistantComponent } from './components/shared/ai-assistant.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, DesktopComponent, SpotlightComponent, OnboardingComponent, AiAssistantComponent],
  template: `
    <app-desktop></app-desktop>
    @defer (on idle) {
      <app-spotlight></app-spotlight>
    }
    <app-onboarding></app-onboarding>
    <app-ai-assistant></app-ai-assistant>
  `,
  styles: [`
    :host { display: block; }
  `]
})
export class AppComponent {}
