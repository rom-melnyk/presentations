export class AudioAnalyser {
  private readonly ctx: AudioContext;
  private readonly analyser: AnalyserNode;

  constructor(
    private audioEl: HTMLAudioElement
  ) {
    this.ctx = new AudioContext();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -90;
    this.analyser.maxDecibels = -20;
    this.analyser.smoothingTimeConstant = .5;
    this.analyser.fftSize = 128;

    // (<any>window).ANALYSER = this.analyser;

    const source = this.ctx.createMediaElementSource(this.audioEl);
    source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  getAnalyser() {
    return this.analyser;
  }
}
