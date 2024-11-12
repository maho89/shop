<template>
  <v-btn @click="modalState=!modalState" icon="mdi-barcode" variant="plain" />
  <v-dialog v-model="modalState" fullscreen hide-overlay transition="dialog-bottom-transition">
    <v-container fluid>
      <v-btn icon @click="modalClose" position="absolute" class="right-0 top-0 ma-5">
        <v-icon>mdi-close-thick</v-icon>
      </v-btn>
      <v-row justify="center" class="barcode-container">
        <StreamBarcodeReader
          v-model:videoDevices="videoDevices"
          v-model:hasFocusDistance="hasFocusDistance"
          v-model:hasAutofocus="hasAutofocus"
          v-model:hasTorch="hasTorch"
          v-model:hasZoom="hasZoom"
          v-model:cameraDetails="cameraDetails"
          :landscape="landscape"
          :torch="torch"
          :zoom="Number(zoom)"
          :autofocus="autofocus"
          :focus-distance="Number(focusDistance)"
          :device-index="deviceIndex"
          :ms-between-decoding="500"
          @decode="onDecode"
          @loaded="onLoaded"
          @result="onResult"
        />
      </v-row>
      <v-row v-if="loaded" class="controls" justify="space-between">
        <v-btn
          :disabled="videoDevices?.devices?.length < 2"
          icon
          @click="switchInputDevice"
        >
          <v-icon>{{ videoDevices?.devices?.length < 2 ? 'mdi-camera' : 'mdi-camera-switch' }}</v-icon>
        </v-btn>

        <v-btn
          :disabled="!hasAutofocus"
          :color="autofocus && hasFocusDistance ? 'primary' : ''"
          icon
          @click="autofocus = !autofocus"
        >
          <v-icon>{{ autofocus ? 'mdi-focus-auto' : 'mdi-image-filter-center-focus-weak' }}</v-icon>
        </v-btn>

        <v-btn
          :disabled="!isAndroidChrome"
          :color="landscape ? 'primary' : ''"
          icon
          @click="landscape = !landscape"
        >
          <v-icon>{{ landscape ? 'mdi-phone-rotate-portrait' : 'mdi-phone-rotate-landscape' }}</v-icon>
        </v-btn>

        <v-btn
          :disabled="!hasTorch"
          :color="torch ? 'primary' : ''"
          icon
          @click="torch = !torch"
        >
          <v-icon>{{ torch ? 'mdi-lightbulb-on' : 'mdi-lightbulb-outline' }}</v-icon>
        </v-btn>
      </v-row>
      <v-row v-if="!autofocus && hasFocusDistance && loaded" class="focus-container" justify="center">
        <v-col cols="12">
          <v-slider
            v-model="focusDistance"
            :min="hasFocusDistance.min || 0"
            :max="Math.min(hasFocusDistance.max, 1) || 1"
            :step="hasFocusDistance.step || 0.1"
            label="Focus"
          />
        </v-col>
      </v-row>
      <v-row v-if="hasZoom && loaded" class="zoom-container" justify="center">
        <v-col cols="12">
          <v-slider
            v-model="zoom"
            :min="hasZoom.min || 1"
            :max="hasZoom.max || 2"
            :step="hasZoom.step || 0.1"
            label="Zoom"
          />
        </v-col>
      </v-row>
    </v-container>
  </v-dialog>
</template>

<script setup>
import {ref, watch} from 'vue'
import {StreamBarcodeReader} from '@teckel/vue-barcode-reader'

const barcodeScannedAudio = new Audio('./assets/barcode-scanned.mp3')
let model = defineModel();
const modalState = ref(false)
const loaded = ref(false)
const torch = ref(false)
const zoom = ref(1)
const autofocus = ref(true)
const focusDistance = ref(0)
const landscape = ref(false)
const hasTorch = ref(false)
const hasZoom = ref(false)
const hasAutofocus = ref(false)
const hasFocusDistance = ref(false)
const videoDevices = ref({})
const deviceIndex = ref(null)
const debounce = ref(false)
const debounceTimeout = ref(null)
const cameraDetails = ref({})

// Computed
const isAndroidChrome = ref(
  navigator?.userAgentData?.mobile && navigator?.userAgentData?.platform === 'Android' &&
  navigator?.userAgentData?.brands.findIndex(brand => brand.brand === 'Google Chrome' || brand.brand === 'Chromium') !== -1
)

// Watchers
watch(() => autofocus.value, (newValue) => {
  if (!hasAutofocus.value) autofocus.value = false
})

// Methods
const onLoaded = () => {
  loaded.value = true
  console.log('loaded')
}

const onDecode = (decodedText) => {
  barcodeScannedAudio.play()
  console.log('Barcode scanned:', decodedText)
  modalClose()
}

const onResult = (result) => {
  console.log('Raw Result:', result)
  model.value = result;
}

const switchInputDevice = () => {
  const length = videoDevices.value?.devices?.length
  if (deviceIndex.value >= 0 && length > 1) {
    loaded.value = false
    deviceIndex.value = deviceIndex.value + 1 >= length ? 0 : deviceIndex.value + 1
  }
}

const modalClose = () => {
  modalState.value =false;
}
</script>

<style scoped>

</style>
