import { fromEvent, of, interval } from 'rxjs';
import {
  map, mapTo,
  tap,
  filter,
  combineLatest, merge
} from 'rxjs/operators';

import { AudioAnalyser } from './audio-analyser';
import { Visualizer } from './visualizer';


function runDemo() {
  const trackPickerEl = <HTMLSelectElement>document.querySelector('select');
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const analyser = (new AudioAnalyser(audioEl)).getAnalyser();
  const visualizer = new Visualizer(canvasEl);

  // -------- prepare audio files --------
  fetch('./audio/audio-src.json')
    .then((res: Response) => res.json())
    .then((files: string[]) => {
      console.info(`${files.length} audio file(-s) detected`);
      files.forEach((file: string) => {
        const optionEl = document.createElement('option');
        optionEl.value = './audio/' + file;
        optionEl.innerText = file.replace(/_/g, ' ');
        trackPickerEl.appendChild(optionEl);
      });

      // force pause to <option>s appear in the DOM tree
      return new Promise((resolve) => setTimeout(() => resolve(), 100));
    })
    .then(() => {
      // select 1st element
      const firstFile = (<HTMLOptionElement>trackPickerEl.children[1]).value;
      trackPickerEl.value = firstFile;
      audioEl.src = firstFile;
    })
    .catch(console.error);

  // -------- track change --------
  fromEvent(trackPickerEl, 'change')
    .pipe(
      map((event: Event) => (<HTMLSelectElement>event.target).value),
    )
    .subscribe((url: string) => {
      if (url) {
        console.info(`Audio track selected: "${url}"`);
      } else {
        console.warn('No audio track selected');
      }
      audioEl.src = url;
    });

  // -------- keypress analyzer --------
  const keyUp$ = fromEvent(window, 'keyup')
    .pipe(
      mapTo(false)
    );
  const keyDown$ = fromEvent(window, 'keydown')
    .pipe(
      map((e: Event) => (<KeyboardEvent>e).shiftKey)
    );
  const kbd$ = of(false) // initial value
    .pipe(
      merge(keyUp$, keyDown$)
    );

    kbd$.subscribe((v: boolean) => {
      if (v) {
        console.info('---> Shift is pressed');
      } else {
        console.log('<--- Shift was released');
      }
    });

  // -------- poll the analyser --------
  let localFftData: Uint8Array;
  const timer$ = interval(40).pipe(
    map(() => { return { '@': Date.now() }; }),
  );
  const analyser$ = interval(40)
    .pipe(
      map(() => {
        const fftData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(fftData); // for bars
        return {
          '@': Date.now(),
          fftData
        };
      }),
      filter(({ fftData }) => {
        const average = fftData.reduce((acc, x) => acc + x, 0) / fftData.length;
        return average > 142;
      }),
      combineLatest(timer$),
      map(([analyser, timer]): Uint8Array => {
        if (timer['@'] > analyser['@']) {
          return localFftData.map(x => (x - 128) * .95 + 128);
        } else {
          return analyser.fftData;
        }
      }),
      tap((data) => { localFftData = data; })
    );

  analyser$.subscribe((fftData: Uint8Array) => {
    visualizer.drawBars(fftData);
  });
}


window.addEventListener('load', runDemo);
