import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AudioAnalyserService {
  private audioContext: AudioContext;
  private audioAnalyserNode: AnalyserNode;

  constructor() {
    this.audioContext = new AudioContext();
  }

  fromAudioElement(audioElement: HTMLAudioElement): AnalyserNode {
    const audioSourceNode = this.audioContext.createMediaElementSource(audioElement);
    this.audioAnalyserNode = this.audioContext.createAnalyser();
    audioSourceNode.connect(this.audioAnalyserNode);
    this.audioAnalyserNode.connect(this.audioContext.destination);

    this.audioAnalyserNode.fftSize = 128; // power of 2
    this.audioAnalyserNode.smoothingTimeConstant = .95;
    return this.audioAnalyserNode;
  }

  getAnalyser(): AnalyserNode {
    return this.audioAnalyserNode;
  }
}
