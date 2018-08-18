export class AudioSourceManager {
  constructor(
    private selectEl: HTMLSelectElement,
    private audioEl: HTMLAudioElement,
  ) {
    this.selectFirstTrack = this.selectFirstTrack.bind(this);
  }

  loadSources(): Promise<any> {
    return fetch('./audio/audio-src.json')
      .then((res: Response) => res.json())
      .then((files: string[]) => {
        console.info(`${files.length} audio file(-s) detected`);
        files.forEach((file: string) => {
          const optionEl = document.createElement('option');
          optionEl.value = './audio/' + file;
          optionEl.innerText = file.replace(/_/g, ' ');
          this.selectEl.appendChild(optionEl);
        });

        // force pause to <option>s appear in the DOM tree
        return new Promise(resolve => setTimeout(resolve, 100));
      });
  }

  selectFirstTrack() {
    const firstTrackOptionEl = <HTMLOptionElement>this.selectEl.children[1];
    if (firstTrackOptionEl) {
      const firstFile = firstTrackOptionEl.value;
      this.selectEl.value = firstFile;
      this.audioEl.src = firstFile;
    } else {
      console.warn('No audio track to select');
    }
  }
}
