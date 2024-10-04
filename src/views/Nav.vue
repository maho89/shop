<script setup>
import {inject} from "vue";

//let pages   = inject("pages");
</script>

<template>
  <v-navigation-drawer :rail="!$menuOpen.value">
    <v-list density="compact">
      <v-list-item to="/products" prepend-icon="mdi-home"   title="მთავარი"  link />
      <v-list-item to="/objects" prepend-icon="mdi-home"   title="ობიექტები"  link />
      <v-list-item to="/salary" prepend-icon="mdi-home"   title="სალარო"  link />
      <!--template v-for="page in pages">
        <v-list-group   :value="page.key" v-if="page.child && page.child.length">
          <template v-slot:activator="{ props }">
            <v-list-item :to="'/'+page.key"  :prepend-icon="page.icon"  :title="page.name" :key="page.key" v-bind="props" />
          </template>
          <v-list-item  v-for="page in page.child" :to="'/'+page.key"  :prepend-icon="page.icon"  :title="page.name" :key="page.key" />
        </v-list-group>
        <v-list-item v-else :to="'/'+page.key"  :prepend-icon="page.icon"  :title="page.name" :key="page.key"  />
      </template-->
      <!--v-list-item to="/logout" prepend-icon="mdi-logout"  title="გასვლა"  link /-->
    </v-list>
  </v-navigation-drawer>
</template>

<style scoped>

</style>
