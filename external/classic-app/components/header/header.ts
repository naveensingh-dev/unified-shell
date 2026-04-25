import { Component, HostListener, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header implements AfterViewInit {
  isMenuOpen = false;
  isScrolled = false;
  activeSection = 'hero';

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.initScrollSpy();
    }
  }

  private initScrollSpy() {
    const sections = ['hero', 'why-hire', 'about', 'skills', 'experience', 'projects', 'case-studies', 'ai', 'contact'];
    const onScroll = () => {
      let current = 'hero';
      const scrollY = window.pageYOffset;
      if ((window.innerHeight + scrollY) >= document.body.offsetHeight - 20) {
        current = 'contact';
      } else {
        for (const id of sections) {
          const el = document.getElementById(id);
          if (el && scrollY >= this.getOffsetTop(el) - 200) current = id;
        }
      }
      this.activeSection = current;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  private getOffsetTop(el: HTMLElement): number {
    let top = 0; while (el) { top += el.offsetTop; el = el.offsetParent as HTMLElement; } return top;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = this.isMenuOpen ? 'hidden' : '';
    }
  }

  closeMenu() {
    this.isMenuOpen = false;
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }

  openScheduler() {
    if (isPlatformBrowser(this.platformId)) {
      (window as any).openCalendlyModal?.();
    }
  }

  openResume(event: Event) {
    event.preventDefault();
    if (isPlatformBrowser(this.platformId)) {
      (window as any).openResumeViewer?.();
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (isPlatformBrowser(this.platformId)) {
      this.isScrolled = window.scrollY > 40;
    }
  }
}
