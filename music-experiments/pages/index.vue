<template>
  <div>
    <Player id="1" />
  </div>
</template>

<script setup>
import * as Meyda from 'meyda';

const signals = useState('signals', () => {
  return {
    arrSize: 32,
    powerSpectrum: [],
    spectralRolloff: 0,
    energy: 0,
  }
});

onMounted(() => {
  const audioContext = new AudioContext();
  const htmlAudioElement = document.getElementById("audio");
  const source = audioContext.createMediaElementSource(htmlAudioElement);
  source.connect(audioContext.destination);

  const analyzer = Meyda.createMeydaAnalyzer({
    audioContext: audioContext,
    source: source,
    bufferSize: Math.pow(2, 8),
    featureExtractors: ["powerSpectrum", "energy", "spectralRolloff"],
    callback: (features) => {
      signals.value.spectralRolloff = features.spectralRolloff;
      signals.value.energy = features.energy;
      signals.value.powerSpectrum = features.powerSpectrum.filter((_, i) => i % 4 === 0); 
    },
  });
  analyzer.start();
});

</script>