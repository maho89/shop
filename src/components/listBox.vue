<script setup>
import {ref} from "vue";
let items = defineModel();
items.value = new Set(items.value);

let item = ref('');
function addItem() {
  if (item.value.length <= 1) return;
  items.value.add(item.value);
  item.value = '';
}
function removeItem(item) {
  items.value.delete(item);
}
</script>

<template>
  <v-card  class="list-box" variant="outlined" >
    <form @submit.prevent="addItem()">
    <v-text-field variant="solo" label="თვისებები"   density="compact" hide-details v-model="item">
      <template  v-slot:append>
        <v-btn variant="plain" :disabled="item.length<2" @click="addItem()" icon="mdi-plus"/>
      </template>
    </v-text-field>
    </form>
    <v-divider/>
    <v-list  :lines="false" density="compact"  >
      <v-list-item link   v-for="item in items">
        {{ item }}
        <template v-slot:append>
          <v-btn variant="plain" @click="removeItem(item)" density="compact"  icon="mdi-delete"/>
        </template>
      </v-list-item>
    </v-list>

  </v-card>

</template>

<style >
.list-box{

}
.list-box .v-list{
  height: 200px;
  overflow: auto;
}
</style>
