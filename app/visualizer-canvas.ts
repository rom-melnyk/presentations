export class VisualizerCanvas {
  public width: number;
  public height: number;
  public ctx: CanvasRenderingContext2D;

  constructor(
    private canvas: HTMLCanvasElement
  ) {
    this.width = canvas.offsetWidth;
    this.height = canvas.offsetHeight;
    canvas.width = this.width;
    canvas.height = this.height;
    this.ctx = <CanvasRenderingContext2D>canvas.getContext('2d');
  }
}
