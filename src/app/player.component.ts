import { Component, OnInit } from '@angular/core';

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
  public tracks: Array<{ name: string, value: string }> = [];
  public track = '';

  constructor() { }

  ngOnInit() {
    this.tracks.push({
      name: 'Please select a track',
      value: ''
    });

  }

  onTrackSelect(e: Event) {
    this.track = (<HTMLSelectElement>e.target).value;
  }
}
