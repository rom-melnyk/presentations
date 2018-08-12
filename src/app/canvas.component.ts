import { Component, OnInit, Input, ElementRef } from '@angular/core';

const DEFAULT_COLOR = 'hsl(180, 20%, 70%)';

@Component({
  selector: 'app-canvas',
  template: `
    <canvas></canvas>
  `,
  styles: [
    `:host {
      display: block;
      background-color: #37a;
    }`,
    `canvas {
      width: 100%;
      height: 100%;
    }`
  ]
})
export class CanvasComponent implements OnInit {
  @Input() colorize = false;
  @Input() fftData: Uint8Array = new Uint8Array();

  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private gapFactor = .1;
  private barConfig: { n: number, width: number, gap: number } = {
    n: 0,
    width: 0,
    gap: 0,
  };

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

  drawBars() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    this.recalculateBarConfig();
    const { n, width, gap } = this.barConfig;

    for (let i = 0; i < n; i++) {
      const height = this.fftData[ i ] / 256 * ( this.height - 2 * gap );
      this.ctx.fillStyle = this.colorize ? this.getHsl(i) : DEFAULT_COLOR;
      this.ctx.fillRect(
        gap + (width + gap) * i,
        (this.height - height) / 2,
        width,
        height,
      );
    }
  }

  getHsl(pos: number): string {
    return`hsl(${ Math.floor(360 * pos / this.fftData.length) }, 50%, 50%)`;
  }

  recalculateBarConfig(): void {
    const n = this.fftData.length;

    if (n !== this.barConfig.n) {
      // n * barWidth + (n + 1) * barWidth * gapFactor = width;
      // barWidth = width / (n + (n + 1) * gapFactor);
      const width = this.width / (n + (n + 1) * this.gapFactor);
      const gap = width * this.gapFactor;

      this.barConfig = { n, width, gap };
    }
  }
}
