import { Directive, ElementRef, Input, inject, effect } from '@angular/core';
import { TranslationService } from '../../services/translation.service';

@Directive({
  selector: '[appTranslate],[appTranslateAttr]',
  standalone: true
})
export class TranslateDirective {
  private el = inject(ElementRef);
  private ts = inject(TranslationService);
  
  @Input('appTranslate') key: string = '';
  @Input() useHtml: boolean = false;
  @Input() stripHtml: boolean = false;
  @Input() appTranslateAttr: Record<string, string> = {};

  constructor() {
    effect(() => {
      // Trigger effect on language or translation changes
      this.ts.lang();
      this.ts.getTranslations();
      
      if (this.key) {
        let translated = this.ts.translate(this.key);
        if (this.stripHtml) {
          translated = translated.replace(/<[^>]*>/g, '');
        }

        if (this.useHtml) {
          this.el.nativeElement.innerHTML = translated;
        } else {
          this.el.nativeElement.textContent = translated;
        }
      }

      Object.entries(this.appTranslateAttr).forEach(([attr, key]) => {
        const translated = this.ts.translate(key);
        this.el.nativeElement.setAttribute(attr, translated);
      });
    });
  }
}
