import { Injectable } from '@angular/core';

export interface ITrack {
  name: string;
  value: string;
}

@Injectable({
  providedIn: 'root'
})
export class AudioTracksService {
  private audioFolder = '/assets/audio/';
  private url = '/assets/audio/audio-files.json';

  constructor() { }

  fetch(): Promise<Array<ITrack>> {
    return fetch(this.url)
      .then((response) => {
        return response.json();
      })
      .then((response: Array<string>) => {
        return response.map((track) => {
          return {
            name: this.format(track),
            value: `${this.audioFolder}${track}`
          };
        });
      });
  }

  private format(track: string): string {
    return track.replace(/_/g, ' ');
  }
}
