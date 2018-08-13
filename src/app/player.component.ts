import { Component, OnInit, ElementRef, Output, EventEmitter } from '@angular/core';
import { ITrack, AudioTracksService } from './services/audio-tracks.service';
import { AudioAnalyserService } from './services/audio-analyser.service';

@Component({
  selector: 'app-player',
  template: `
    <select name="track-select" (change)="onTrackSelect($event)">
      <option *ngFor="let track of tracks" value="{{track.value}}">{{track.name}}</option>
    </select>
    <audio src="{{selectedTrack}}" controls></audio>
  `,
  styles: [
    `:host > * {
      width: 100%;
      margin-bottom: .5rem;
    }`,
    `select, option {
      padding: .5rem;
      font-size: 1rem;
    }`,
  ]
})
export class PlayerComponent implements OnInit {
  public tracks: Array<ITrack> = [];
  public selectedTrack = '';
  @Output() public height = new EventEmitter<number>();
  @Output() public analyserNode = new EventEmitter<AnalyserNode>();

  constructor(
    private audioTracks: AudioTracksService,
    private audioAnalyser: AudioAnalyserService,
    private el: ElementRef,
  ) { }

  ngOnInit() {
    const selectEl = this.el.nativeElement.querySelector('select');
    const audioEl = this.el.nativeElement.querySelector('audio');
    const analyserNode = this.audioAnalyser.fromAudioElement(audioEl);

    this.height.emit(this.el.nativeElement.offsetHeight);
    this.analyserNode.emit(analyserNode);

    this.tracks.push({
      name: 'Please select a track',
      value: ''
    });

    this.audioTracks.fetch()
      .then((tracks) => {
        this.tracks.push(...tracks);
        // force pause for DOM <select> become new options
        return new Promise((resolve) => setTimeout(resolve, 100));
      })
      .then(() => {
        // Emulating first track got selected
        const firstTrack = this.tracks[1].value;
        selectEl.value = firstTrack;
        this.selectedTrack = firstTrack;
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onTrackSelect(e: Event) {
    this.selectedTrack = (<HTMLSelectElement>e.target).value;
  }
}
