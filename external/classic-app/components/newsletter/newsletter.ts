import { Component } from '@angular/core';

@Component({
  selector: 'app-newsletter',
  imports: [],
  templateUrl: './newsletter.html',
  styleUrl: './newsletter.css',
})
export class Newsletter {
  onSubmit(event: Event) {
    event.preventDefault();
    const btn = (event.target as HTMLFormElement).querySelector('.nl-btn') as HTMLButtonElement;
    if (btn) {
      btn.textContent = '✓ Subscribed!';
      btn.disabled = true;
      btn.style.background = 'linear-gradient(135deg, var(--em), var(--em2))';
    }
  }
}
