<template>
  <v-app>
    <FeedbackButton />
    <component :is="this.$route.meta.layout || 'div'">
      <router-view />
    </component>
  </v-app>
</template>

<script>
import FeedbackButton from "./components/FeedbackButton";
export default {
  name: "App",

  components: { FeedbackButton },

  data: () => ({
    //
  }),
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
