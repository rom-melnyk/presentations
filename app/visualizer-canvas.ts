export class VisualizerCanvas {
  private readonly width: number;
  private readonly height: number;
  private readonly ctx: CanvasRenderingContext2D;

  private readonly gapFactor = .1;
  private readonly defaultColor = 'hsl(210, 10%, 80%)';

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  }

  public drawBars(fftData: Array<number>, colorize = false) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const n = fftData.length;
    // n * barWidth + (n + 1) * barWidth * gapFactor = width;
    // barWidth = width / (n + (n + 1) * gapFactor);
    const barWidth = this.width / (n + (n + 1) * this.gapFactor);
    const gapWidth = barWidth * this.gapFactor;

    for (let i = 0; i < n; i++) {
      const fractionValue = fftData[i] / 256;
      const barHeight = fractionValue * ( this.height - 2 * gapWidth );
      this.ctx.fillStyle = colorize
        ? `hsl(${ Math.floor(360 * i / n) }, 50%, 50%)`
        : this.defaultColor;
      this.ctx.fillRect(
        gapWidth + (barWidth + gapWidth) * i,
        (this.height - barHeight) / 2,
        barWidth,
        barHeight
      );
    }
  }

}
