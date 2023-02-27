# Music Experiments

**Nuxt application**  
`npm install` to download the dependencies  
`npm run dev` to start the development server.  

# Steps

- Create a simple `audio` player and hide it
- When the audio is played, get the data with `Meyda` // [Documentation](https://meyda.js.org/guides/online-web-audio)
- Following the doc, create an `new AudioContext()` + try it out with the core code
- Send the data to your Canvas
- Try one simple feature // RMS among [the list of audio features](https://meyda.js.org/audio-features)
  example: size of the cube based on `RMS`

  ```
  cube.scale.x = signals.value * 10 ; //signals.rms * 100;
  cube.scale.y = signals.value * 10 ; //signals.rms * 100;
  cube.scale.z = signals.value * 10 ; //signals.rms * 100;
  ```

  problem: the value can change leading to epileptic effect. beware of the visual you offer. root mean square of the waveform. 

- building an object to store the values you are interested in (rms, zcr, )
- remark: values have to be clamp (min/max to avoid extreme variations)
- 
- Try with an array: power spectrum. Here the idea is to select some frequencies in the 512 array
- investigate [windowing](https://meyda.js.org/audio-features)


# Inspirations, 3 articles

- blog from mattdesl [with frequency analysis](https://mattdesl.svbtle.com/audiograph)
- this process [shared for audio viz](https://lusion.co/work/kaos-logo-generator)
- meyda too [here](https://www.visualcinnamon.com/2020/06/sony-music-data-art/#final-result-animated-poster)
