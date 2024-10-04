<script setup>
import List from "@/components/List.vue";
import {ref} from "vue";
const data  = {
  fields:  [
    {key:'id',type: 'hidden', hidden: true},
    {key:'photo', type: 'photo', required:true, label:'ფოტო'},
    {key:'name', required:true, label:'დასახელება'}
  ],
  items: ref([]),
};
</script>
<template>
  <List
    :fields="data.fields"
    name="object"
    edit="true"
    add="true"
    label="ობიექტები"
  />
</template>
