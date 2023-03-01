<template>
  <div class="container" :style="{ 'color': props.theme == 'dark' ? '#000' : '#fff' }">
    <div class="subtitle">
      <div class="">
        <span class="font-thin">Music by </span> 
        <a href="https://nicolasjaar.net/" target="_blank">Nicolas Jaar</a>
      </div>
      <div class="text-xs">
        {{ props.song }}
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  song: {
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

.text-xs {
  font-size: 0.8rem;
}

.container {
  display:flex;
  justify-content: left;
  align-items: flex-end;
  width: 100vw;
  height: 100vh;
  background-color: transparent;
  position: absolute;
  z-index: 1;
  color: $black;
}
.subtitle {
  padding: 20px;
  font-family: $font;
  font-weight: 400;
}

.font-thin {
  font-weight: 300;
}


</style>