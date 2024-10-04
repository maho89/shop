import App from './App.vue'
import {createApp, ref} from 'vue'
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {createVuetify, useTheme} from 'vuetify';
import Http from "@/Http";
import user from "@/User";
import {createRouter, createWebHistory} from "vue-router";
import product from '@/pages/product/index.vue';
import salary from '@/pages/salary/index.vue';
import object from '@/pages/object/index.vue';
import Dexie from "dexie";
const vuetify = createVuetify({ theme: {  defaultTheme: 'dark' }});
const routes = [
  {path: '/',  name:'home', redirect: '/products'},
  {path: '/objects', name:'object', component: object},
  {path: '/products', name:'product', component: product},
  {path: '/salary', name:'salary', component: salary}
];
const router = createRouter({ history: createWebHistory(),routes});
const db = new Dexie('shop');
db.version(4).stores( {
  rs_code: '++id',
  object: '++id,name',
  category: '++id,name',
  product: '++id,category_id,name',
  salary: '++id,product_id',
  item: '++id,product_id,object_id',
});
const app = createApp(App);
app.provide('db', db);
app.use(vuetify);
app.use(Http);
app.use(user);
app.use(router);
app.config.globalProperties.toggleTheme = () => {
  if(vuetify.theme.global.name.value=="dark"){
    vuetify.theme.global.name.value = "light";
  }else{
    vuetify.theme.global.name.value = "dark";
  }
}
app.config.globalProperties.$menuOpen = ref(false);
app.mount('#app')
