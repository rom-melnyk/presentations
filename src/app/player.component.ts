import { Component, OnInit } from '@angular/core';
import { ITrack, AudioTracksService } from './services/audio-tracks.service';

@Component({
  selector: 'app-player',
  template: `
    <select name="track-select" (change)="onTrackSelect($event)">
      <option *ngFor="let track of tracks" value="track.value">{{track.name}}</option>
    </select>
    <audio src="track"></audio>
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
  public track = '';

  constructor(
    private audioTracks: AudioTracksService,
  ) { }

  ngOnInit() {
    this.tracks.push({
      name: 'Please select a track',
      value: ''
    });

    this.audioTracks.fetch()
      .then((tracks) => {
        this.tracks.push(...tracks);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  onTrackSelect(e: Event) {
    this.track = (<HTMLSelectElement>e.target).value;
  }
}
