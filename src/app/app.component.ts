import { Component, OnInit, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <app-player (height)="setCanvasHeight($event)"></app-player>
    <app-canvas [style.height]="canvasHeight"></app-canvas>
  `,
  styles: [
    `:host {
      position: absolute;
      top: 1rem;
      right: 1rem;
      bottom: 1rem;
      left: 1rem;
    }`
  ]
})
export class AppComponent implements OnInit {
  public canvasHeight: string;

  constructor(
    private el: ElementRef,
  ) {}

  ngOnInit() {}

  setCanvasHeight(playerHeight: number) {
    const paddingCompensation = 8;
    const canvasHeight = this.el.nativeElement.offsetHeight - playerHeight - paddingCompensation;
    this.canvasHeight = `${canvasHeight}px`;
  }
}
