<template>
  <div @click="playPause" :class="props.theme == 'dark' ? 'btn-dark' : 'btn-light'">
    {{ btn }}
  </div>
</template>

<script setup>

const props = defineProps({
  theme: {
    type: String,
    required: true
  }
});

const btn = ref('pause');

function playPause() {
  const audio = document.querySelector('#audio');
  if (audio.paused) {
    audio.play();
    btn.value = 'pause';
  } else {
    audio.pause();
    btn.value = 'play';
  }
}

</script>
