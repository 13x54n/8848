import {
  Directive,
  ElementRef,
  inject,
  OnInit,
  OnDestroy,
  input,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Directive({
  selector: '[appViewportAnimate]',
  standalone: true,
})
export class ViewportAnimateDirective implements OnInit, OnDestroy {
  private readonly el = inject(ElementRef<HTMLElement>);
  private readonly platformId = inject(PLATFORM_ID);
  private observer: IntersectionObserver | null = null;

  /** Animation variant: fade-up, fade-in, fade-left, fade-right, scale */
  variant = input<'fade-up' | 'fade-in' | 'fade-left' | 'fade-right' | 'scale'>('fade-up');

  /** Delay in ms before animation starts */
  delay = input<number>(0);

  /** Stagger index for child elements (adds delay based on index) */
  stagger = input<number>(0);

  /** Root margin for intersection (e.g. "0px 0px -50px 0px" to trigger earlier) */
  rootMargin = input<string>('0px 0px -40px 0px');

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) {
      this.el.nativeElement.classList.add('animate-in', 'animate-visible');
      return;
    }

    const el = this.el.nativeElement;
    const v = this.variant();
    const d = this.delay();
    const s = this.stagger();
    const margin = this.rootMargin();

    el.classList.add('animate-in', `animate-${v}`);
    if (d > 0) el.style.animationDelay = `${d}ms`;
    if (s > 0) el.style.animationDelay = `${d + s * 80}ms`;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: margin }
    );

    this.observer.observe(el);
  }

  ngOnDestroy(): void {
    this.observer?.disconnect();
  }
}
