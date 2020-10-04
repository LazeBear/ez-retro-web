<template>
  <v-app>
    <component :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import HelloWorld from "./components/HelloWorld";

export default {
  name: "App",

  components: {
    HelloWorld
  },

  data: () => ({
    //
  })
};
</script>
