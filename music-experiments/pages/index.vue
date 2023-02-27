<template>
  <div>
    <TheHome />
  </div>
</template>

<script setup>
import * as Meyda from 'meyda';

// create a state to hold the signals
const signals = useState('signals', () => {
  return {
    rms: 0,
    zcr: 0,
    powerSpectrum: []
  }
});

onMounted(() => {
  const audioContext = new AudioContext();

  // Select the Audio Element from the DOM
  const htmlAudioElement = document.getElementById("audio");
  // Create an "Audio Node" from the Audio Element
  const source = audioContext.createMediaElementSource(htmlAudioElement);
  // Connect the Audio Node to your speakers. Now that the audio lives in the
  // Audio Context, you have to explicitly connect it to the speakers in order to
  // hear it
  source.connect(audioContext.destination);

  if (typeof Meyda === "undefined") {
    console.log("Meyda could not be found! Have you included it?");
  } else {
    const analyzer = Meyda.createMeydaAnalyzer({
      audioContext: audioContext,
      source: source,
      bufferSize: 512,
      featureExtractors: ["rms", "zcr", "powerSpectrum"],
      callback: (features) => {
        signals.value.rms = features.rms;
        signals.value.zcr = features.zcr;
        // signals.value.powerSpectrum = features.powerSpectrum;
        signals.value.powerSpectrum = Meyda.windowing(features.powerSpectrum, "sine");
        // signals.value.zcr = Meyda.windowing(features.zcr, "hamming");

        console.log(Meyda.windowing(features.powerSpectrum, "hanning"));
      },
    });
    analyzer.start();
  }



});




</script>