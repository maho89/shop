<script setup>


import {useDate} from "vuetify";
import {inject, ref} from "vue";
const props = defineProps(['field','val','id']);
const date = useDate();
let text = ref('');
if (props.field.type=='calc'){
  props.field.act(props.id, text);
}
else if (props.field.type=='select'){
  const db = inject("db");
  db[props.field.items].get(props.val*1).then(e=>{
    text.value=e.name;
  });
}else {
  text.value = props.val;
}
</script>
<template>
  <template v-if="field.type=='photo'">
    <v-avatar :key="field.key" :image="val" icon="mdi-image"></v-avatar>
  </template>
  <template v-else-if="field.type=='dateTime'">
    {{date.format(val, 'keyboardDateTime')}}
  </template>
  <template v-else>{{text}}</template>
</template>

<style scoped>

</style>
