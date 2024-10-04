<script setup>

import {inject, ref} from "vue";
const props = defineProps(['table','id']);
const db = inject("db");
let name = ref('');

function getSelName() {
    db[props.table].get(props.id).then(e=>{
      name.value=e.name;
    });
}
getSelName()
</script>

<template>
{{name}}
</template>

<style scoped>

</style>
