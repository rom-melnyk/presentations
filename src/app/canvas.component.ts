import { Component, Input, OnChanges, OnInit, ElementRef } from '@angular/core';

const DEFAULT_COLOR = 'hsl(180, 20%, 70%)';

@Component({
  selector: 'app-canvas',
  template: `<canvas></canvas>`,
  styles: [
    `:host {
      display: block;
      border: 1px solid ${DEFAULT_COLOR};
    }`,
    `canvas {
      width: 100%;
      height: 100%;
    }`
  ]
})
export class CanvasComponent implements OnInit, OnChanges {
  @Input() fftData: Uint8Array = new Uint8Array();
  @Input() colorize = false;

  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private gapFactor = .1;

  constructor(
    private el: ElementRef,
  ) {}

  ngOnInit() {
    const canvasEl = this.el.nativeElement.querySelector('canvas');
    const { offsetWidth, offsetHeight } = this.el.nativeElement;
    this.width = offsetWidth;
    this.height = offsetHeight;

    this.ctx = canvasEl.getContext('2d');
    canvasEl.width = offsetWidth;
    canvasEl.height = offsetHeight;
  }

  ngOnChanges() {
    if (!this.ctx) {
      return;
    }

    this.ctx.clearRect(0, 0, this.width, this.height);

    const n = this.fftData.length;
    // n * barWidth + (n + 1) * barWidth * gapFactor = width;
    // barWidth = width / (n + (n + 1) * gapFactor);
    const width = this.width / (n + (n + 1) * this.gapFactor);
    const gap = width * this.gapFactor;

    for (let i = 0; i < n; i++) {
      const fftValue = this.fftData[ i ] - 128;
      const height = fftValue / 128 * ( this.height - 2 * gap );
      this.ctx.fillStyle = this.colorize
        ? `hsl(${ Math.floor(360 * i / this.fftData.length) }, 50%, 50%)`
        : DEFAULT_COLOR;
      this.ctx.fillRect(
        gap + (width + gap) * i,
        (this.height - height) / 2,
        width,
        height,
      );
    }
  }
}
