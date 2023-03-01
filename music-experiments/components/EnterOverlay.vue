<template>
  <div>
    <div>
      <audio id="audio" controls loop>
        <source :src="file" type="audio/mpeg">
      </audio>
    </div>
    <div id="overlay" :style="{ 'background-color': props.theme == 'dark' ? `#fff` : '#000' }">
      <div @click="enter" :class="props.theme == 'dark' ? 'btn-dark enter-btn' : 'btn-light enter-btn'">
        Enter
      </div>
    </div>
  </div>
</template>

<script setup>

function enter() {
  document.querySelector('#audio').play();
  document.querySelector('#overlay').style.display = 'none';
}

const props = defineProps({
  file: {
    type: String,
    required: true
  },
  theme: {
    type: String,
    required: true
  }
});

</script>

<style lang="scss" scoped>

audio {
  display: none;
}

#overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 20;
}

.enter-btn {
  @include center;
}

</style>



