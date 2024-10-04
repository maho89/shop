<script setup>
import List from "@/components/List.vue";
import {inject, ref} from "vue";
import {useRoute} from "vue-router";
const db = inject("db");
const route = useRoute();

const data  = {
  fields:  [
    {key:'id',type: 'hidden', hidden: true},
    {key:'photo', type: 'photo', required:true, label:'ფოტო'},
    {key:'name', required:true, label:'დასახელება'},
  ],
  fields1:  [
    {key:'id', type: 'hidden', hidden: true},
    {key:'photo', type: 'photo', tab:'main', label:'ფოტო'},
    {key:'category_id',tab:'main', type: 'select', items:'category',label:'კატეგორია'},
    {key:'selfPrice',  type:'calc', tab:'main', label:'თვითღირებულება', act:(id,model)=>{
      if (id>0){
        db.item.where('product_id').equals(Number(id)).toArray().then(items=>{
          model.value = items.reduce((total, item) => total + item.full_price/item.count, 0);
        })
      }
    } },
    {key:'price',tab:'main', label:'ფასი'},
    {key:'code',tab:'main', label:'კოდი'},
    {key:'name', tab:'main', required:true, label:'დასახელება'},
    {
      key:'items',
      tab:'items',
      type:'list',
      name:'item',
      label: 'ერთეულები',
      parent:"product_id",
      hidden: 'table',
      parentId:'productEdit',
      fields : [
        {key:'id',type: 'hidden',  hidden: true},
        {key:'product_id',  hidden: true},
        {key:'object_id', type:'select', required:true, items:'object', label:'ობიექტი'},
        {key:'name', required:true, label:'დასახელება'},
        {key:'count', required:true, label:'რაოდენობა'},
        {key:'full_price', required:true, label:'ღირებულება'},
        {key:'date', required:true, label:'თარიღი'}
      ]
    },
    {
      key:'rs_id',
      tab:'rsCode',
      type:'list',
      name:'rs_code',
      label: 'რს-კოდები',
      parent:"product_id",
      hidden: 'table',
      parentId:'productEdit',
      fields : [
        {key:'id',type: 'hidden', hidden: true},
        {key:'product_id',  hidden: true},
        {key:'name', required:true, label:'დასახელება'}
      ]
    },
  ],
  tabs1:[
    {label:'ძირითადი',key:'main'},
    {label:'ერთეულები',key:'items'},
    {label:'RS-სახელები',key:'rsCode'},
    {label:'ქვე კოდები',key:'subCode'}
  ],
  products: ref([]),
  items: ref([]),
};
</script>

<template>
  <div style="display: flex; height: calc(100% - 10px); position: relative; gap: 5px;" class="ma-1">
    <v-card style="width: 600px" >
      <List name="category" :fields="data.fields" to="categoryId" add="true" edit="true" label="კატეგორიები" />
    </v-card>
    <v-card style="flex: 1" >
      <List name="product" :key="route.query.categoryId"  add="true" edit="true" label="პროდუქტები" :fields="data.fields1" :tab="data.tabs1" parent="category_id" parentId="categoryId" />
    </v-card>
  </div>
</template>

<style scoped>

</style>
