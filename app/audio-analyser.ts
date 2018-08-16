export class AudioAnalyser {
  private readonly ctx: AudioContext;
  private readonly analyser: AnalyserNode;

  constructor(
    private audioEl: HTMLAudioElement
  ) {
    this.ctx = new AudioContext();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -100;
    this.analyser.maxDecibels = -30;
    this.analyser.smoothingTimeConstant = .4;
    this.analyser.fftSize = 128;

    const source = this.ctx.createMediaElementSource(this.audioEl);
    source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  getAnalyser() {
    return this.analyser;
  }
}
