<script setup>

</script>
<template>
  <div style="max-width: 800px" class="mx-auto h-100" :key="data.loaded.value">
    <div v-if="!data.loaded">loading...</div>
    <div v-else class="h-100 d-flex flex-column" :key="data.key"  >
      <v-toolbar flat >
        <v-btn :to="{ name: 'pool',params:{id:route.params.id}}" icon="mdi-home" />
        <v-toolbar-title style="min-width: 600px">
          <v-btn   v-if="data.shop.value && data.shop.value.id" link :to="{ name: 'pool',query:{}}">
            {{data.shop.value.name}}
          </v-btn>
          <template v-if="data.category.value && data.category.value.id">
            <v-icon icon="mdi-chevron-right"></v-icon>
            <v-btn  link :to="{ name: 'pool',query:{shop_id:route.query.shop_id, pool_id:route.query.pool_id}}">
               {{data.category.value.name}}
            </v-btn>
          </template>
        </v-toolbar-title>
        <!--div>{{user.user}}</div-->
        <v-btn @click="toggleTheme()" :key="theme.global.name" :icon="theme.global.name.value!='dark'?'mdi-white-balance-sunny':'mdi-moon-waning-crescent'"/>
        <v-btn icon="mdi-logout" @click="logOut"></v-btn>
      </v-toolbar>
      <div  v-if="!data.shop.value"  class="flex-1-1-100">
        <List
          search="true"
          value="id"
          name='shop_id'
          field="name"
          append="done"
          :save=full_save
          :items="data.shops"
        >
        </List>
      </div>
      <div  v-else-if="!data.pool.value"  class="flex-1-1-100">
        <List
          class="flex-1-1-100"
          value="id"
          name='pool_id'
          field="name"
          append="done"
          :items="data.shop.value.pools"
        />
      </div>
      <div  v-else-if="!data.category.value"  class="flex-1-1-100">
        <List class="flex-1-1-100"
              value="id"
              name='category_id'
              field="name"
              append="done"
              :items="data.pool.value.categories"
        />
      </div>
      <div  v-else-if="!data.item.value"  class="flex-1-1-100">
        <List class="flex-1-1-100"
              value="id"
              name='item_id'
              field="name"
              append="done"
              :items="data.category.value.items"
        />
      </div>
      <v-card v-else class="pa-5">
        <v-card-title style="white-space: normal;">
          {{data.item.value.name}}
        </v-card-title>
        <v-card-subtitle>
          {{data.item.value.description}}
        </v-card-subtitle>
        <v-card-text>
          <div v-for="(item,i) in data.item.value.questions" :key="i" class="text-center mt-5">
            <template v-if="item.answer">
              {{ item.title }}
                <template v-if="item.type=='რადიო'"  >
                <v-btn-toggle class="w-100 d-flex"  color="#739976" variant="elevated"  v-model="item.answer" disabled>
                  <v-btn v-for="(v,k) in item.items"  :value="v.text" class="flex-1-1-100" >  {{ v.text }} </v-btn>
                </v-btn-toggle>
                </template>
                <template v-if="item.type=='ტექსტური'">
                  <v-textarea  v-model="item.answer"
                               disabled
                               :placeholder="item.text"
                               bg-color="#73997650"
                               no-resize
                               variant="solo">
                  </v-textarea>
                </template>
            </template>
            <template v-else>
              {{ item.text }}
                <v-btn-toggle class="w-100 d-flex" divided color="#739976" variant="outlined"
                              v-model="answers[data.shop.value.id][data.pool.value.id][data.category.value.id][data.item.value.id][i]">
                  <v-btn
                    v-for="(v,k) in item.items"
                    :key="k"
                    :value="k"
                    class="flex-1-1-100" >
                    {{ v.text }}
                  </v-btn>
                </v-btn-toggle>
                <template v-if="item.type=='ტექსტური'">
                  <v-textarea  v-model="answers[data.shop.value.id][data.pool.value.id][data.category.value.id][data.item.value.id][i]"
                               :placeholder="item.text"
                               bg-color="#73997650"
                               no-resize
                               variant="solo">
                  </v-textarea>
                </template>
            </template>
          </div>
        </v-card-text>
        <v-card-actions v-if="data.navs">
          <v-btn-group class="d-flex w-100" :key="data.navs.value.key"   variant="outlined" divided>
            <v-btn :disabled="!data.navs.value.prev" :to="data.navs.value.prev" class="flex-1-1-100" color="surface-light" variant="elevated" prepend-icon="mdi-arrow-left">წინა</v-btn>
            <v-btn v-if="data.navs.value.next" :to="data.navs.value.next" class="flex-1-1-100" color="surface-light" variant="elevated" append-icon="mdi-arrow-right">შემდეგი</v-btn>
            <v-btn v-else to="/" class="flex-1-1-100" color="surface-light" variant="elevated" append-icon="mdi-home">მთავარი</v-btn>
          </v-btn-group>
        </v-card-actions>
      </v-card>
    </div>
  </div>
  <v-dialog v-model="dialog.show" width="auto" >
    <v-card
      max-width="400"
      append-icon="mdi-alert"
      color="warning"
      :text="dialog.text"
      :title="dialog.title"
    >
      <template v-slot:actions>
        <a href="">
          <v-btn
            class="ms-auto"
            text="გადატვირთვა"
            @click="location.reload()"
          ></v-btn>
        </a>
      </template>
    </v-card>
  </v-dialog>
</template>
<style>

</style>
