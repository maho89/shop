<script setup>
import { ref } from "vue";
let photo = defineModel();
let upload_input = ref(null);

function upload() {
  upload_input.value.click();
}

function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      photo.value = reader.result;
    };
    reader.readAsDataURL(file);
  }
}
</script>

<template>
  <v-btn @click="upload" variant="plain" icon>
    <v-avatar class="img" v-if="photo" :image="photo"  />
    <v-icon v-else>mdi-image-plus-outline</v-icon>
  </v-btn>
  <input class="upload_input" type="file" ref="upload_input" @change="handleFileChange" />
</template>

<style scoped>
.upload_input {
  display: none;
}

</style>
