<template>
  <div>
    <div>
      <audio id="audio" controls loop>
        <source src="sound/1.mp3" type="audio/mpeg">
      </audio>
    </div>
    <div id="overlay">
      <div @click="enter" class="enter-btn">
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
  background-color: $secondary;
  z-index: 20;
}

.enter-btn {
  @include btn;
  @include center;
}

</style>



