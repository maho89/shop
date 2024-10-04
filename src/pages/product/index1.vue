<script setup>
import {inject, ref, watch} from "vue";
import List from "@/components/List.vue";
import {useRoute} from "vue-router";
import ListBox from "@/components/listBox.vue";
import ImgBox from "@/components/imgBox.vue";
import axios from "axios";
const $http = inject('$http');
class Image {};
const route = useRoute();
let items = ref([]);
let cats = ref([]);
let loading =ref(true);
const load = ()=>{
  loading.value = true;
  let data = {
    "controller" : "Pos",
    "class" : "posController",
    "method" : "getProductList",
    "data":{
      "code":"22",
      "objectId":"29",
      "clientId":""

    }
  };
  $http.post('/REST/',data).then(data=>{
    items.value = data.data;
    loading.value = false;
  });
};
const init = ()=>{
  if (route.query.edit){
    init_edit();
  }else {
    edit.value=false;
  }
}
let edit = ref(false);
const fields = {
  id        : {type:'hidden', label:'იდ', hidden:true},
  name      : {type:String,required:true,label:'დასახელება'},
  category  : {type:'list',required:true,label:'კატეგორია', items:cats, child:'properties'},
  image     : {type:Image,required:true,label:'სურათი'},
  items     : {type:'table',
    search : ref(''),
    fields:[
      {key:'name',title:'დასხელება'},
      {key:'object',title:'ობიექტი'},
      {key:'count',title:'რაოდენობა'},
      {key:'barcode',title:'შტრიხკოდი'},
      {key:'selfPrice',title:'თვითღირებულება'},
      {key:'supplier',title:'მომწოდებელი'},
      {key:'date',title:'მიღების დრო'},

    ],
    items : [
      {name:'მალბორო',object:'მაღაზია 1',count:'10',barcode:'56561266',selfPrice:50,date:'2024-05-22 14:30:27','supplier':'მომწოდებელი1'},
      {name:'მალბორო',object:'მაღაზია 2',count:'10',barcode:'93569266',selfPrice:30,date:'2024-05-21 13:30:27','supplier':'მომწოდებელი2'}
    ]
  },
};
function get_child(arr=[],value,key='title'){
  return arr.find(e=>e[key]==value)
}
function init_edit(){
  let it = items.value.find(e=>e.id == route.query.edit);
  if (it!=undefined){
    edit.value = it;
  }else {
    edit.value = {};
  }
}
function save(){
  let data = {...edit.value}
  data.properties= [...data.properties];
  data.image= [...data.image];
  $http.post('products',data).then(()=>{
    //load();
  })
}
load();
watch(route, () => {
  init();
})
</script>
<template  >
  <template v-if="!loading">
    <v-toolbar density="compact" title="პროდუქტები">
      <v-spacer></v-spacer>
      <v-text-field   append-inner-icon="mdi-magnify" density="compact" label="ძებნა"  variant="solo"  hide-details  single-line></v-text-field>
    </v-toolbar>
    {{items}}
    <List :fields="items" :items="items"  />
  </template>
  <template v-else>
    ველოდები..
  </template>


</template>
