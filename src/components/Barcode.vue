<script setup>

import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import {ref} from "vue";
let model = defineModel();
let dlg = ref(false)
const onDecode = (result) => {
  model = result
}

const onLoaded = () => {

}
</script>

<template>
<v-btn/>
  <v-btn @click="dlg=!dlg">სკანერი</v-btn>
  <v-dialog v-model="dlg">

  <StreamBarcodeReader @decode="onDecode" @loaded="onLoaded" />
  </v-dialog>
</template>
