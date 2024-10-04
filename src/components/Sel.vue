<script setup>
import {inject, ref} from "vue";
const props = defineProps(['items','name','label']);
let val = defineModel()
const db = inject("db");
let items = ref([]);
let loaded = ref(false);
db[props.name].toArray().then((data) => {
  items.value = data.map(item=>{ return {title:item.name,value:item.id}});
  loaded.value=true;
})
</script>

<template>
<v-select v-if="loaded" v-model="val" :items="items" :label="props.label"/>
</template>

<style scoped>

</style>
