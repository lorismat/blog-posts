<template>

  <div>

    <div v-if="id == '1' ">
      <Info theme="dark" song="America! I'm For The Birds"/>
      <EnterOverlay theme="dark" file="sound/america.mp3" />
      <Canvas1 />
      <PlayerBtn theme="dark" />
    </div>
    <div v-else>
      <Info theme="light" song="Fight"/>
      <EnterOverlay theme="light" file="sound/fight-short.mp3" />
      <Canvas2 />
      <PlayerBtn theme="light" />
    </div>

  </div>

</template>

<script setup>

const props = defineProps({
  id: {
    type: String,
    required: true
  }
});

</script>