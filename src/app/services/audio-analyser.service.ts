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

    this.audioAnalyserNode.fftSize = 512; // power of 2
    return this.audioAnalyserNode;
  }

  getAnalyser(): AnalyserNode {
    return this.audioAnalyserNode;
  }
}
