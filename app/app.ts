import { fromEvent, of, interval } from 'rxjs';
import {
  map, mapTo,
  tap,
  filter,
  combineLatest, merge,
  pairwise,
} from 'rxjs/operators';

import { AudioAnalyser } from './audio-analyser';
import { VisualizerCanvas } from './visualizer-canvas';


function runDemo() {
  const audioEl = <HTMLAudioElement>document.querySelector('audio');
  const canvasEl = <HTMLCanvasElement>document.querySelector('canvas');

  const analyser = new AudioAnalyser(audioEl);
  const visualizer = new VisualizerCanvas(canvasEl);

  fetch('./audio/audio-src.json')
    .then((res: Response) => res.json())
    .then((files: string[]) => {
      audioEl.src = './audio/' + files[0];
      console.info(`Track ${files[0]} selected`);
    });

  // ========= track Shift keypress =========
  // Stream delivers boolean showing if Shift is pressed
  // --- "up" means always "false" ---
  const keyUp$ = fromEvent(window, 'keyup')
    .pipe(
      mapTo(false)
    );
  // --- "down" event might deliver "true" or "false" depending on key pressed ---
  const keyDown$ = fromEvent(window, 'keydown')
    .pipe(
      map((e: Event) => (<KeyboardEvent>e).shiftKey)
    );
  // --- initial state (otherwise .combineLatest() will wait till Shift is pressed ---
  const kbd$ = of(false)
    .pipe(
      merge(keyUp$, keyDown$)
    );

  // --- make logs more sophisticated: prevent "released" message at startup ---
  kbd$.pipe(
    pairwise()
  ).subscribe(([prev, current]) => {
    if (current) {
      console.info('---> Shift is pressed');
    } else if (prev) {
      console.info('<--- Shift was released');
    }
  });

  // ========= fading timer =========
  let previousFft: number[];
  const timer$ = interval(80).pipe(
    map(() => ({ '@': Date.now() })),
  );

  // ========= poll the analyser =========
  const analyser$ = interval(80)
    .pipe(
      map(() => {
        const fftData = analyser.getFft();
        return { '@': Date.now(), fftData };
      }),
      // --- filter only "strong" signal ---
      filter(({ fftData }) => {
        const average = fftData.reduce((acc, x) => acc + x, 0) / fftData.length;
        return average > 32;
      }),
      // --- if (strong) { use_strong(); } else { fade_previous_and_use_it(); } ---
      combineLatest(timer$),
      map(([analyserData, timer]): number[] => {
        if (timer['@'] > analyserData['@']) {
          return previousFft.map(x => x * .925);
        } else {
          return analyserData.fftData;
        }
      }),
      tap((data) => { previousFft = data; }), // store "previous"
      combineLatest(kbd$) // combine with "is_shift_pressed?" stream
    );

  // --- subscription uses both: stream and keyboard data ---
  analyser$.subscribe(([fftData, colorize]: [number[], boolean]) => {
    visualizer.drawBars(fftData, colorize);
  });
}


window.addEventListener('load', runDemo);
