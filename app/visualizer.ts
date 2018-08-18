const DEFAULT_COLOR = 'hsl(210, 10%, 80%)';


export class Visualizer {
  private width: number;
  private height: number;
  private ctx: CanvasRenderingContext2D;
  private gapFactor = .1;

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  }

  /**
   * @param {Array<0..255>} data
   * @param {boolean} colorize
   */
  drawBars(data: Array<number>, colorize: boolean = false) {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const n = data.length;
    // n * barWidth + (n + 1) * barWidth * gapFactor = width;
    // barWidth = width / (n + (n + 1) * gapFactor);
    const barWidth = this.width / (n + (n + 1) * this.gapFactor);
    const gapWidth = barWidth * this.gapFactor;

    for (let i = 0; i < n; i++) {
      const fractionValue = data[i] / 256;
      const barHeight = fractionValue * ( this.height - 2 * gapWidth );
      this.ctx.fillStyle = colorize
        ? `hsl(${ Math.floor(360 * i / n) }, 50%, 50%)`
        : DEFAULT_COLOR;
      this.ctx.fillRect(
        gapWidth + (barWidth + gapWidth) * i,
        (this.height - barHeight) / 2,
        barWidth,
        barHeight
      );
    }
  }

  /**
   * @param {Array<-128..128>} data
   * @param {boolean} colorize
   */
  drawWaveform(data: Array<number>, colorize: boolean = false) {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.ctx.beginPath();

    const n = data.length;
    // 0.5 * stepWidth + (n - 1) * stepWidth + 0.5 * stepWidth = width;
    // stepWidth = width / n;
    const stepWidth = this.width / n;

    const dataCoords = <Array<{ x: number, y: number }>>data.map((value, i) => {
      const x = stepWidth / 2 + i * stepWidth;
      const fractionValue = value / 128;
      const barHeight = fractionValue * ( this.height - stepWidth ) / 2;
      const y = this.height / 2 - barHeight;
      return { x, y };
    });

    dataCoords.forEach(({ x, y }, i) => {
      if (i === 0) {
        this.ctx.moveTo(0, this.height / 2);
        this.ctx.bezierCurveTo(
          0, this.height / 2,
          x - stepWidth / 2, y,
          x, y
        );
        return;
      }

      const cp1x = dataCoords[i - 1].x + stepWidth / 2;
      const cp1y = dataCoords[i - 1].y;

      if (i === n - 1) {
        this.ctx.bezierCurveTo(
          cp1x, cp1y,
          this.width, this.height / 2,
          this.width, this.height / 2
        );
        return;
      }

      this.ctx.bezierCurveTo(
        cp1x, cp1y,
        x - stepWidth / 2, y,
        x, y
      );
    });

    this.ctx.strokeStyle = DEFAULT_COLOR;
    this.ctx.lineWidth = 5;
    this.ctx.stroke();
  }
}
