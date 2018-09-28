export class AudioAnalyser {
  private readonly ctx: AudioContext;
  private readonly analyser: AnalyserNode;

  constructor(
    private audioEl: HTMLAudioElement
  ) {
    this.ctx = new AudioContext();

    this.analyser = this.ctx.createAnalyser();
    this.analyser.minDecibels = -70;
    this.analyser.maxDecibels = -20;
    this.analyser.smoothingTimeConstant = .5;
    this.analyser.fftSize = 128;

    // uncomment for debug purposes
    // (<any>window).ANALYSER = this.analyser;

    const source = this.ctx.createMediaElementSource(this.audioEl);
    source.connect(this.analyser);
    this.analyser.connect(this.ctx.destination);
  }

  getFft(): number[] {
    const fftData = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(fftData);
    return [...fftData]; // convert Uint8Array --> number[]
  }
}
