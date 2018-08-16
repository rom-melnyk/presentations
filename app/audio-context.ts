import { ErrorCodes } from './error-constants';


let context: AudioContext;
let analyser: AnalyserNode;


function isCompatible(): boolean {
  createAudioContext();
  return !!context;
  // { code: ErrorCodes.NOT_SUPPORTED, debug: e })
}


function createAudioContext(): void {
  if (context) {
    return;
  }

  const AudioContext = (<any>window).AudioContext || (<any>window).webkitAudioContext;
  try {
    context = new AudioContext();
  } catch (e) {}
}


function attachAnalyzerToAudioElement(element: HTMLAudioElement, { fftSize = 128 } = {}) {
  if (analyser) {
    return;
  }

  analyser = context.createAnalyser();
  analyser.minDecibels = -100;
  analyser.maxDecibels = -30;
  analyser.smoothingTimeConstant = .4;
  analyser.fftSize = fftSize;

  const source = context.createMediaElementSource(element);
  source.connect(analyser);
  analyser.connect(context.destination);
}


function getContext(): AudioContext { return context; }

function getAnalyser(): AnalyserNode { return analyser; }


export {
  isCompatible,
  createAudioContext,
  attachAnalyzerToAudioElement,
  getContext,
  getAnalyser
};
