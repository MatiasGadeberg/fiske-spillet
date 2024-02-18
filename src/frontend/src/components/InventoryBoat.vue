<template>
    <img
      :src="getImageUrl().toString()"
      alt="Product Image"
      class="card-image object-fill w-28 h-20 rounded mx-3 hover:scale-110 hover:outline"
    />
</template>

<script setup lang="ts">

const props = defineProps({
  name: {
    type: String,
    required: true
  }
})

function getImageUrl() {
  return new URL(`../assets/boatImages/${props.name}.svg`, import.meta.url)
}
</script>
