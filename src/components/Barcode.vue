<script setup>

import { StreamBarcodeReader } from '@teckel/vue-barcode-reader'
import {ref} from "vue";
let model = defineModel();
let dlg = ref(false)
let load = ref(false);
let data = ref({});
const barcodeScannedAudio = new Audio('./assets/barcode-scanned.mp3')
const onDecode = (result) => {
  barcodeScannedAudio.play()
  model = result
}

const onLoaded = () => {
  load.value='loaded'
}
const onResult = () => {
  load.value='onResult'
}
</script>

<template>
<v-btn/>
  <v-btn @click="dlg=!dlg">სკანერი</v-btn>
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
