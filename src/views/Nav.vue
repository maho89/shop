
<template>
  <template v-if="$vuetify.display.mobile" >
    <v-navigation-drawer
      v-model="$menuOpen.value"
      temporary>
      <v-list density="compact">
        <v-list-item to="/products" prepend-icon="mdi-home"   title="მთავარი"  link />
        <v-list-item to="/objects" prepend-icon="mdi-home"   title="ობიექტები"  link />
        <v-list-item to="/salary" prepend-icon="mdi-home"   title="სალარო"  link />
      </v-list>
    </v-navigation-drawer>
  </template>
  <template v-else>
    <v-navigation-drawer
      :rail="!$menuOpen.value"
      app>
      <v-list density="compact">
        <v-list-item to="/products" prepend-icon="mdi-home"   title="მთავარი"  link />
        <v-list-item to="/objects" prepend-icon="mdi-home"   title="ობიექტები"  link />
        <v-list-item to="/salary" prepend-icon="mdi-home"   title="სალარო"  link />
      </v-list>
    </v-navigation-drawer>
  </template>

</template>

<style scoped>
/*
 :rail=""
permanent
*/
</style>
<script setup lang="ts">
</script>
