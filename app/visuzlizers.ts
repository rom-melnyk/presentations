import { VisualizerCanvas } from './visualizer-canvas';


export interface IVisualizer {
  fetchFftData: (analyser: AnalyserNode) => Array<number>;
  filter: (fftData: Array<number>) => boolean;
  draw: (fftData: Array<number>, colorize?: boolean) => void;
}

const DEFAULT_COLOR = 'hsl(210, 10%, 80%)';


export class BarsVisualizer implements IVisualizer {
  private canvas: VisualizerCanvas;
  private gapFactor = .1;

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = new VisualizerCanvas(canvasEl);
  }

  fetchFftData(analyser: AnalyserNode): Array<number> {
    const fftData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fftData);
    return [...fftData].slice(0, fftData.length / 2); // the tail is usually zeroes
  }

  filter(fftData: Array<number>): boolean {
    const average = fftData.reduce((acc, x) => acc + x, 0) / fftData.length;
    return average > 128;
  }

  /**
   * @param {Array<0..255>} fftData
   * @param {boolean} colorize
   */
  draw(fftData: Array<number>, colorize = false) {
    const { width, height, ctx } = this.canvas;
    ctx.clearRect(0, 0, width, height);

    const n = fftData.length;
    // n * barWidth + (n + 1) * barWidth * gapFactor = width;
    // barWidth = width / (n + (n + 1) * gapFactor);
    const barWidth = width / (n + (n + 1) * this.gapFactor);
    const gapWidth = barWidth * this.gapFactor;

    for (let i = 0; i < n; i++) {
      const fractionValue = fftData[i] / 256;
      const barHeight = fractionValue * ( height - 2 * gapWidth );
      ctx.fillStyle = colorize
        ? `hsl(${ Math.floor(360 * i / n) }, 50%, 50%)`
        : DEFAULT_COLOR;
      ctx.fillRect(
        gapWidth + (barWidth + gapWidth) * i,
        (height - barHeight) / 2,
        barWidth,
        barHeight
      );
    }
  }
};


export class WaveformVisualizer implements IVisualizer {
  private canvas: VisualizerCanvas;

  constructor(canvasEl: HTMLCanvasElement) {
    this.canvas = new VisualizerCanvas(canvasEl);
  }

  fetchFftData(analyser: AnalyserNode): Array<number> {
    const fftData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(fftData);
    return [...fftData].map(x => x - 128);
  }

  filter(fftData: Array<number>): boolean {
    const average = fftData.reduce((acc, x) => acc + Math.abs(x), 0) / fftData.length;
    return average > 24;
  }

  /**
   * @param {Array<-128..128>} fftData
   * @param {boolean} colorize
   */
  draw(fftData: Array<number>, colorize: boolean = false) {
    const { width, height, ctx } = this.canvas;
    ctx.clearRect(0, 0, width, height);
    ctx.beginPath();

    const n = fftData.length;
    // 0.5 * stepWidth + (n - 1) * stepWidth + 0.5 * stepWidth = width;
    // stepWidth = width / n;
    const stepWidth = width / n;

    const dataCoords = <Array<{ x: number, y: number }>>fftData.map((value, i) => {
      const x = stepWidth / 2 + i * stepWidth;
      const fractionValue = value / 128;
      const barHeight = fractionValue * ( height - stepWidth ) / 2;
      const y = height / 2 - barHeight;
      return { x, y };
    });

    ctx.moveTo(dataCoords[0].x, dataCoords[0].y);
    for (let i = 1; i < n; i++) {
      const { x, y } = dataCoords[i];

      const cp1x = dataCoords[i - 1].x + stepWidth / 2;
      const cp1y = dataCoords[i - 1].y;
      const cp2x = x - stepWidth / 2;
      const cp2y = y;

      ctx.bezierCurveTo(
        cp1x, cp1y,
        cp2x, cp2y,
        x, y
      );
    }

    if (colorize) {
      const average = fftData.reduce((acc, x) => acc + x, 0) / fftData.length;
      ctx.strokeStyle = `hsl(${ Math.floor(180 + average / 128 * 180) }, 50%, 50%)`;
    } else {
      ctx.strokeStyle = DEFAULT_COLOR;
    }
    ctx.lineWidth = 5;
    ctx.stroke();
  }
}
