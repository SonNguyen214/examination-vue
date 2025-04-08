<script setup>
defineProps({
  isLoadingFullScreen: Boolean,
});
</script>

<template>
  <div
    class="loading-component"
    :class="{ '!h-dvh !w-dvw': isLoadingFullScreen }"
  >
    <ProgressSpinner
      strokeWidth="4px"
      fill="transparent"
      animationDuration="1s"
    />
  </div>
</template>
