<script setup>
import {ref} from "vue";
let items = defineModel();
items.value = new Set(items.value);
let upload_input = ref(null);
let item = ref('');
function handleFileChange(event) {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      item.value = reader.result;
      items.value.add(item.value)
    };
    reader.readAsDataURL(file);
  }
}
function addItem() {
  upload_input.value.click();
}
function removeItem(item) {
  items.value.delete(item);
}
</script>

<template>
  <input class="upload_input" type="file" ref="upload_input" @change="handleFileChange" />

  <v-card  class="list-box" variant="outlined"  width="400">
    <v-item-group  :lines="false" density="compact"  >
      <v-container>
        <div style="display: flex;">
          <div>

          </div>
          <div style="overflow-x: auto; width: 550px; height: 200px; white-space: nowrap;">
            <v-card class="thumb">
              <v-btn  stacked variant="plain" @click="addItem()">
                <v-icon class="icon-thumb">mdi-image-plus-outline</v-icon>
              </v-btn>
            </v-card>
            <v-card   v-for="item in items"  :key="item" class="thumb">
              <v-card >
                <v-img  :src="item" aspect-ratio="1/1" cover />
                <div style="position: absolute; right: 0; top: 0; bottom: 0;">
                  <v-btn
                    variant="text"
                    @click="removeItem(item)"
                    density="compact"
                    icon="mdi-delete"
                  />
                </div>
              </v-card>


            </v-card>
          </div>
        </div>
      </v-container>

    </v-item-group>

  </v-card>

</template>

<style >
.upload_input {
  display: none;
}
.list-box .v-item-group{
  height: 230px;
  overflow: hidden;
}
.icon-thumb{
  font-size: 50px;
}
.list-box .v-item-group .thumb{
  width: 152px;
  margin: 2px;
  display: inline-block;
}
.list-box .v-item-group .thumb .v-img{
  height: 150px;
  width: 150px;
}
</style>
