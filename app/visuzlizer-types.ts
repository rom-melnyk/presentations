interface IVisualizerType {
  getFftData: (analyser: AnalyserNode) => Array<number>;
  filter: (fftData: Array<number>) => boolean;
}


export const BarsVisualizerType: IVisualizerType = {
  getFftData(analyser: AnalyserNode): Array<number> {
    const fftData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteFrequencyData(fftData);
    return [...fftData].slice(0, fftData.length / 2); // the tail is usually zeroes
  },

  filter(fftData: Array<number>): boolean {
    const average = fftData.reduce((acc, x) => acc + x, 0) / fftData.length;
    return average > 128;
  },
};


export const WaveformVisualizerType: IVisualizerType = {
  getFftData(analyser: AnalyserNode): Array<number> {
    const fftData = new Uint8Array(analyser.frequencyBinCount);
    analyser.getByteTimeDomainData(fftData);
    return [...fftData].map(x => x - 128);
  },

  filter(fftData: Array<number>): boolean {
    const average = fftData.reduce((acc, x) => acc + Math.abs(x), 0) / fftData.length;
    return average > 24;
  },
};
