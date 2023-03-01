<template>
  <div>
    <Player id="2" />
  </div>
</template>

<script setup>
import * as Meyda from 'meyda';

const signals = useState('signals', () => {
  return {
    arrSize: 32,
    powerSpectrum: []
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
    featureExtractors: ["powerSpectrum"],
    callback: (features) => {
      signals.value.powerSpectrum = features.powerSpectrum.filter((_, i) => i % 4 === 0); 
    },
  });
  analyzer.start();
});

</script>