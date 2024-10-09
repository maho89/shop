<script setup>

import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import {ref} from "vue";
let model = defineModel();
let dlg = ref(false)
let load = ref('');
let data = ref({});
const barcodeScannedAudio = new Audio('./assets/barcode-scanned.mp3')
const onDecode = (result) => {
  model = result;
  barcodeScannedAudio.play();
}

const onLoaded = () => {
  load.value='loaded'
}
const onResult = (result) => {
  model = result;
  load.value='onResult';
}
</script>

<template>
<v-btn/>
  <v-btn @click="dlg=!dlg" icon="mdi-barcode" variant="plain" position="absolute"/>
  <v-dialog v-model="dlg">
   <span>
    --{{load}}--
  </span>
  <span>
   -- {{model}}--
  </span>
  <StreamBarcodeReader
    @result="onResult"
    @decode="onDecode"
    @loaded="onLoaded"
    v-model:videoDevices="data.videoDevices"
    v-model:hasFocusDistance="data.hasFocusDistance"
    v-model:hasAutofocus="data.hasAutofocus"
    v-model:hasTorch="data.hasTorch"
    v-model:hasZoom="data.hasZoom"
    v-model:cameraDetails="data.cameraDetails"
    :landscape="data.landscape"
    :torch="data.torch"
    :zoom="Number(data.zoom)"
    :autofocus="data.autofocus"
    :focus-distance="Number(data.focusDistance)"
    :device-index="data.deviceIndex"
    :ms-between-decoding="500"
  />
    <span>
    --{{data}}--
  </span>
  </v-dialog>
</template>
