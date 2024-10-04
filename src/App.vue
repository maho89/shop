<template>
  <v-app>
    <v-main>
      <Dashboard  v-if="$user.value"/>
      <Login v-else />
    </v-main>
  </v-app>
</template>
<script setup>
import Login from "@/views/Login.vue";
import Dashboard from "@/views/dashboard.vue";
</script>
