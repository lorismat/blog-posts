# Music Experiments

[Live Experiment 1](http://meyda-shaders-viz.surge.sh/)  
[Live Experiment 2](http://meyda-shaders-viz.surge.sh/2)  

I describe the process of creating music experiments in [a blog article](https://www.lorismat.com/blog/path-reveal-on-a-map) with sound analysis using `Meyda.js` and `Three.js`.

# Spec

This repository is hosting a **Nuxt application**.  

`npm install` to download the dependencies.   
`npm run dev` to start the development server.  

## TLDR

- `components/EnterOverlay.vue` fetches the song
- `pages/index.vue` and `pages/2.vue` initialize the music analyser
- `components/Canvas1.vue` and `components/Canvas2.vue` uses the signals from the analyser for visualization

The process and code are described in my blog article.

# Music

Two songs are played, from [Nicolas Jaar](https://nicolasjaar.net/). It is mentioned that "All non-commercial use is permitted".  

- _America! I'm for the birds_, from _Sirens_ (experiment 1)
- _Fight_, from _Nymphs_ (experiment 2)