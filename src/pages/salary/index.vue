<script setup>
import List from "@/components/List.vue";
import { VNumberInput } from 'vuetify/labs/VNumberInput'
import {inject, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import Sel from "@/components/Sel.vue";
const route = useRoute();
const db = inject("db");
const data  = {
  fields:  [
    {key:'id',type: 'hidden', hidden: true},
    {key:'photo', type: 'photo', required:true, label:'ფოტო'},
    {key:'name', required:true, label:'დასახელება'},
    {key: 'count', label: 'რაოდენობა', type: 'calc',act:(id,model)=>{
        if (id>0){
            db.item.where('product_id').equals(Number(id))
          //db.item.where('object_id').equals(Number(salary.object.value))
            .and(item => item.object_id == salary.object.value)

            .toArray().then(items=>{
            model.value = items.reduce((total, item) => total + item.count*1, 0);
          })
        }
    }}
  ],

  items: ref([]),
};
let salary = {
  save:()=>{
    let table = db.salary;
    let data = {
      salary:salary.sum(),
      date:new Date(),
      items:salary.items.value.map(e=>{
        return {
          product_id  :e.product_id,
          price  :e.price,
          name  :e.name,
          count:e.count
        }
      }),
    };
    if (table){
      if (data.id>0){
        table.update(data.id*1, data).then(()=>{
          init()
        })
      }
      else {
        table.add(data)
          .then(() => {
            init()
          })
          .catch(() => {});
      }
    }
  },
  open:(item)=>{
      salary.items.value = item.items;
  },
  add:(item)=>{
    let it = salary.items.value.find(d=>d.product_id==item.id);
    if (it){
      it.count = it.count+1;
    }else {
      db.product.get(item.id).then((data)=>{
        salary.items.value.push({
          product_id  :data.id,
          price  :data.price,
          name  :data.name,
          photo :data.photo,
          count:1
        });
      });

    }
  },
  items: ref([]),
  tab:ref('new'),
  fields: [
      {key:'date', label:'დრო', type:'dateTime'},
      {key:'salary', label:'თანხა'},
  ],
  object:ref(null),
  sum:()=>{
    if(salary.items.value.length==0) return 0;
    let sum = 0;
    salary.items.value.forEach(e=>{
      sum+=e.price*e.count;
    });
    return sum.toFixed(2);

  }
};
function getQuery(qv={}){
  return {...route.query,...qv}
}
function init(){
  if (route.query.salaryId){
    db.salary.get(route.query.salaryId*1).then((data)=>{
      salary.open(data)
    });
  }
}
init();
watch(() => route.query.salaryId, () => {
  init();
}, { immediate: true })
</script>
<template>
  <div style="display: flex; height: calc(100% - 10px); position: relative; gap: 5px;" class="ma-1">
    <v-card style="display: grid;width: 600px;align-content: space-between;" >
      <v-card>
          <v-toolbar density="compact">
            <Sel label="ობიექტი" name="object" class="ma-2" v-model="salary.object.value" hide-details variant="outlined" density="compact"/>
            <v-spacer></v-spacer>
            <v-btn icon>
              <v-icon>mdi-dots-vertical</v-icon>
            </v-btn>
          </v-toolbar>
          <v-list density="compact">
            <v-list-item v-for="item in salary.items.value">
              <template v-slot:prepend>
                <v-avatar :key="item.key" :image="item.photo" icon="mdi-image"></v-avatar>
              </template>
              {{item.name}}
              <template v-slot:append>
                <v-number-input
                  variant="outlined"
                  controlVariant="split"
                  v-model="item.count"
                />
              </template>
            </v-list-item>
            <v-list-item>
              <template v-slot:append>
                თანხა სულ: {{salary.sum()}}
              </template>
            </v-list-item>
          </v-list>
          <v-card-actions>
            <v-btn @click="salary.save()">შენახვა</v-btn>
          </v-card-actions>
        </v-card>
      <v-card>
        <List
          :fields="salary.fields"
          name="salary"
          to="salaryId"
          label=""
        />
      </v-card>
    </v-card>
    <v-card style="flex: 1">
    <List
      :key="salary.object.value"
      :fields="data.fields"
      name="product"
      :itemClick="salary.add"
      label="ობიექტები"
    />
    </v-card>
  </div>

</template>
