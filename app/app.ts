import { fromEvent, of, interval } from 'rxjs';
import {
  map, mapTo,
  tap,
  filter,
  combineLatest, merge,
  pairwise,
} from 'rxjs/operators';

import { AudioSourceManager } from './audio-source-manager';
import { AudioAnalyser } from './audio-analyser';
import { Visualizer } from './visualizer';


function runDemo() {
  const trackPickerEl = <HTMLSelectElement>document.querySelector('select');
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const audioSourceManager = new AudioSourceManager(trackPickerEl, audioEl);
  audioSourceManager.loadSources()
    .then(audioSourceManager.selectFirstTrack)
    .catch(console.error);

  const analyser = (new AudioAnalyser(audioEl)).getAnalyser();
  const visualizer = new Visualizer(canvasEl);

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

    kbd$.pipe(
      pairwise()
    ).subscribe(([prev, current]) => {
      if (current) {
        console.info('---> Shift is pressed');
      } else if (prev) {
        console.log('<--- Shift was released');
      }
    });

  // -------- poll the analyser --------
  let fftCache: Array<number>;
  const timer$ = interval(40).pipe(
    map(() => { return { '@': Date.now() }; }),
  );
  const analyser$ = interval(80)
    .pipe(
      map(() => {
        const fftData = new Uint8Array(analyser.frequencyBinCount);
        analyser.getByteTimeDomainData(fftData); // for bars
        return {
          '@': Date.now(),
          fftData: [...fftData].map(x => x - 128)
        };
      }),
      filter(({ fftData }) => {
        const average = fftData.reduce((acc, x) => acc + Math.abs(x), 0) / fftData.length;
        return average > 16;
      }),
      combineLatest(timer$),
      map(([analyser, timer]): Array<number> => {
        if (timer['@'] > analyser['@']) {
          return fftCache.map(x => x * .975);
        } else {
          return analyser.fftData;
        }
      }),
      tap((data) => { fftCache = data; }),
      combineLatest(kbd$)
    );

  analyser$.subscribe(([fftData, colorize]: [Array<number>, boolean]) => {
    visualizer.drawBars(fftData, colorize);
  });
}


window.addEventListener('load', runDemo);
