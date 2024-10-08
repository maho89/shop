<script setup>
import {useRoute, useRouter} from "vue-router";
import Sel from "@/components/Sel.vue";
const db = inject("db");
const route = useRoute();
const router = useRouter();
import {inject, ref, watch} from 'vue';
import ImgField from "@/components/imgField.vue";
import Cell from "@/components/Cell.vue";
import Barcode from "@/components/Barcode.vue";
const props = defineProps(['fields','items','name','add','edit','to','parent','parentId','tab','label','itemClick']);
let itemClick = props.itemClick;
if (!itemClick){
  itemClick = ()=>{};
}
let pagination = {
  page: ref(1),
  pageSize: ref(14),
  totalPage: ref(0),
  totalCount: ref(0),  // Total number of filtered items
};
function init_data() {
    let table = db[props.name];
    let its = [];
    isLoading.value = true;
    if (props.parent && props.parentId) {
      table = table.where(props.parent).equals(Number(route.query[props.parentId]));
    }
    if (search.text.value.length > 0) {
      const searchTerm = search.text.value.toLowerCase();
      table =  table.filter(item => item.name.toLowerCase().includes(searchTerm));
    }
    table.count().then(count=>{
      pagination.totalCount.value = count;
      pagination.totalPage.value = Math.ceil(count / pagination.pageSize.value);
    });
    table = table.offset((pagination.page.value - 1) * pagination.pageSize.value);
    if (sort.key.value !== undefined) {
      if (sort.desc.value) {
        table.reverse()
      }
      table.sortBy(sort.key.value).then(its=>{
        items.value = its;
        isLoading.value = false;
      })
    }else {
      table.toArray().then(its=>{
        items.value = its;
        isLoading.value = false;
      }).catch(e=>{
        isLoading.value = false;
      })
    }

}

const search = {
  text:ref('')
}
const sort = {
  key:ref(undefined),
  desc:ref(false),
  init : (key,desc=false)=>{
    sort.key.value=key;
    sort.desc.value=desc;
  }
}
const items = props.items || ref([]);
let mode = ref('table');
const isLoading = ref(false);
let edit = {
  dlg : ref(false),
  init : ()=>{
    edit.data.value = {};
    init_parent();
    let eName = `${props.name}Edit`;
    if (route.query[eName]!=undefined){
      edit.dlg.value = true;
      if (route.query[eName]>0){
        db[props.name].get(route.query[eName]*1).then((object) => {
          edit.data.value = object
        });
      }
    }else {
      edit.dlg.value = false;
    }
  },
  data : ref({}),
  save :()=>{
    let table = db[props.name];
    if (table){
      let data = {};
      props.fields.forEach(field=>{
        data[field.key] =  edit.data.value[field.key];
      })
      if (edit.data.value.id>0){
        table.update(edit.data.value.id*1, data).then(()=>{
          router.push({query:getQuery({[`${props.name}Edit`]:undefined})})
          init();
        })
      }
      else {
        table.add(data)
          .then(() => {
            router.push({query:getQuery({[`${props.name}Edit`]:undefined})})
            init();
          })
          .catch((error) => {
            console.error('Failed to insert object:', error);
          });
      }
    }

  }
};
let tab ={
  items : [{key:'tab_0',label:props.label}],
  selected :ref('tab_0')
};
if (props.tab){
  tab.items = props.tab;
  tab.selected = ref(props.tab[0].key)
}
function init_parent(){
  if (props.parentId){
    edit.data.value[props.parent] = route.query[props.parentId] * 1;
  }
}
function init(){
  if (props.name){
    if (db[props.name] ){
      init_data();
    }
    if (route.query[`${props.name}Edit`]!=undefined){
      edit.init();
    }else {
      edit.dlg.value = false;
    }
  }
};
function getQuery(qv={}){
  return {...route.query,...qv}
}
watch(route, () => {
  edit.init();
});
watch(search.text, () => {
  init_data();
});
watch(pagination.page, () => {
  init_data();
});
watch(sort.key, () => {
  init_data();
})
watch(sort.desc, () => {
  init_data();
})
init();
init_parent();
</script>
<template>
  <div class="d-flex flex-column h-100">
    <v-toolbar density="compact" :title="props.label">
      <v-spacer></v-spacer>
      <!--v-text-field v-model="search.text.value"   append-inner-icon="mdi-magnify" density="compact" label="ძებნა"  variant="solo"  hide-details  single-line></v-text-field-->
      <Barcode v-model="search.text.value" />
      <v-btn v-if="mode=='list'" icon="mdi-table" @click="mode='table'" variant="plain"></v-btn>
      <v-btn v-else icon="mdi-format-list-bulleted" @click="mode='list'" variant="plain"></v-btn>
      <v-btn v-if="props.add" icon="mdi-playlist-plus" :to="{query:getQuery({[`${props.name}Edit`]: 0 })}" variant="plain"></v-btn>
    </v-toolbar>
    <div class="flex-1-1-100" v-if="!isLoading" :key="isLoading">
      <template v-if="mode === 'table'">
        <v-table >
          <thead>
            <tr>
              <template  v-for="(field, i) in fields" :key="i"  >
                <th v-if="!field.hidden">
                  <v-list-item @click="sort.init(field.key,!sort.desc.value)">
                    {{field.label}}
                    <template v-slot:append v-if="sort.key.value==field.key">
                      <v-icon v-if="sort.desc.value">mdi-sort-ascending</v-icon>
                      <v-icon v-else>mdi-sort-descending</v-icon>
                    </template>
                  </v-list-item>
                </th>
              </template>
              <th v-if="props.edit" style="width: 70px">#</th>
            </tr>
          </thead>
          <tbody>
            <template  v-for="(item,i) in items" :key="i"  >
              <tr :class="route.query[props.to] == item.id?'active':''" @click="itemClick(item)">
                <template  v-for="(field, i) in fields" :key="i"  >
                  <td v-if="field.hidden!==true && field.hidden!=='table'" >
                    <template v-if="props.to">
                      <RouterLink  :to="{query:getQuery({[props.to]: item.id })}" variant="flat" style="background: none">
                        <cell :field="field" :val="item[field.key]" :id="item.id" />
                      </RouterLink>
                    </template>
                    <template v-else>
                      <cell :field="field" :val="item[field.key]" :id="item.id" />
                    </template>
                  </td>
                </template>
                <td v-if="props.edit">
                  <v-btn icon="mdi-playlist-edit" :to="{query:getQuery({[`${props.name}Edit`]: item.id })}" variant="plain"/>
                </td>
              </tr>
            </template>
          </tbody>
        </v-table>
      </template>
      <template v-if="mode === 'list'">
        <div class="list">
          <v-card  v-for="(item, i) in items" :key="i" variant="tonal" elevation="12">
            <template  v-for="(field, i) in fields" :key="i" >
              <template  v-if="!field.hidden">
                <v-img  v-if="field.type=='photo'"
                        class="align-end text-white"
                        height="200"
                        :src="item[field.key]"
                        cover
                />
                <v-list-item v-else-if="item[field.key]">

                  <template v-if="field.key!='name'" v-slot:prepend >
                      {{field.label}}
                    </template>
                  <template v-if="field.key!='name'" v-slot:append>
                    <span style="    white-space: nowrap;">
                       {{item[field.key]}}
                    </span>

                    </template>

                  <div v-if="field.key=='name'" class="text-center">
                    {{item[field.key]}}
                  </div>


                </v-list-item>
              </template>
            </template>
          </v-card>
        </div>

      </template>
    </div>
    <template v-else>
      იტვირთება..
    </template>
    <v-footer style="height: 60px">
      <v-spacer></v-spacer>
      <v-spacer></v-spacer>
      <v-pagination v-model="pagination.page.value" :length="pagination.totalPage.value"     />
    </v-footer>
  </div>

  <v-dialog width="800" :key="edit.dlg"  v-model="edit.dlg.value">
    <v-card>
      <v-tabs  v-model="tab.selected.value" >
        <v-tab v-for="t in tab.items" :value="t.key">{{t.label}}</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab.selected.value">
        <v-tabs-window-item v-for="t in tab.items" :value="t.key">
          <v-list>
            <template  v-for="(field, i) in fields" :key="i"  >
              <v-list-item v-if="field && field.hidden!==true && edit.data.value &&  (t.key =='tab_0' || field.tab == t.key)">
                <Sel v-if="field.type=='select'" v-model="edit.data.value[field.key]" :name="field.items" :label="field.label"/>
                <List v-else-if="field.type=='list'"
                      edit="true"
                      add="true"
                      :name="field.name"
                      :label="field.label"
                      :items="field.items"
                      :fields="field.fields"
                      :parent="field.parent"
                      :parentId="field.parentId"
                />
                <ImgField v-else-if="field.type=='photo'" v-model="edit.data.value[field.key]"/>
                <div v-else-if="field.type=='calc'">
                  <v-text-field  :label="field.label" model-value=" " disabled>
                    <template v-slot:default>
                      <cell :field="field" :id="edit.data.value.id*1" :key="edit.data.value.id" />
                    </template>
                  </v-text-field>

                </div>
                <v-text-field v-else v-model="edit.data.value[field.key]" :label="field.label"/>

              </v-list-item>
            </template>
          </v-list>
        </v-tabs-window-item>
      </v-tabs-window>
      <template v-slot:actions>
        <v-btn @click="edit.save()">შენახვა</v-btn>
        <v-btn :to="{query:getQuery({[`${props.name}Edit`]:undefined})}">დახურვა</v-btn>
      </template>
    </v-card>
  </v-dialog>



</template>
<style scoped>
.list{
  margin: 5px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1em;
}
td {
  position: relative;
}
td a{
  position: absolute;
  background: none;
  inset: 0;
  margin-left: 6px;
  z-index: 5;
  text-decoration: none;
  color: initial;
  display: flex;
  align-items: center;
  transition: 0.4s;
}
tbody tr.active, tbody tr:hover {
  cursor: pointer;
  background: rgba(128, 128, 128, 0.18);
  transition: 0.4s;
}
</style>
