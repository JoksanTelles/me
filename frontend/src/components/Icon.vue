<template>
  <span class="material-symbols-outlined select-none" :style="`font-size: ${size}px; font-weight: ${weight};`">
    {{ name }}
  </span>
</template>

<script setup>
defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [Number, String],
    default: 20
  },
  weight: {
    type: [Number, String],
    default: 400
  }
});
</script>
