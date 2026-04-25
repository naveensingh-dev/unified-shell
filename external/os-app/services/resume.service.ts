import { Injectable, computed, inject } from '@angular/core';
import { TranslationService, Lang } from './translation.service';

@Injectable({
  providedIn: 'root'
})
export class ResumeService {
  private ts = inject(TranslationService);

  private readonly resumeMap: Record<Lang, string> = {
    EN: 'Naveen-Singh-Frontend-Architect-Engineering-Lead-EN.pdf',
    HI: 'Architect-Engineering-Lead-HI.pdf',
    ZH: 'Architect-Engineering-Lead-ZH.pdf',
    ES: 'Architect-Engineering-Lead-ES.pdf',
    AR: 'Architect-Engineering-Lead-AR.pdf',
    FR: 'Architect-Engineering-Lead-FR.pdf',
    DE: 'Architect-Engineering-Lead-DE.pdf',
    JP: 'Architect-Engineering-Lead-JA.pdf',
    PT: 'Architect-Engineering-Lead-PT.pdf',
    RU: 'Architect-Engineering-Lead-RU.pdf'
  };

  getResumePath(lang: Lang): string {
    const fileName = this.resumeMap[lang] || this.resumeMap['EN'];
    return `/assets/Resume/${fileName}`;
  }

  currentResumePath = computed(() => {
    return this.getResumePath(this.ts.lang());
  });

  download(lang?: Lang) {
    const selectedLang = lang || this.ts.lang();
    const path = this.getResumePath(selectedLang);
    const link = document.createElement('a');
    link.href = path;
    link.download = path.split('/').pop() || 'Naveen_Singh_Resume.pdf';
    link.click();
  }
}
