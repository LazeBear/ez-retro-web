<template>
  <v-app>
    <component :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </v-app>
</template>

<script>
export default {
  name: "App",

  components: {},

  data: () => ({
    //
  })
};
</script>

<style lang="scss">
.card-drop-preview {
  border: 1px dashed #007ac0;
  margin: 5px;
}

.list-drop-preview {
  border: 1px dashed #007ac0;
  margin: 5px 45px 5px 5px;
}
</style>
