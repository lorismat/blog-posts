<template>
  <div @click="playPause" class="btn">
    {{ btn }}
  </div>
</template>

<script setup>
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

<style lang="scss" scoped>

.btn {
  @include btn;
  margin: 20px;
}

</style>