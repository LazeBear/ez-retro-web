<template>
  <v-btn color="primary" class="feedback-btn" :to="'/boards/' + link">
    Feedback
  </v-btn>
</template>

<script>
export default {
  computed: {
    link() {
      if (window.location.hostname === "localhost") {
        return "5fce0ab9a2a3db2589b918a1";
      }
      return "5fce094d1bd5fc002d8e4d99";
    },
  },
};
</script>

<style lang="scss" scoped>
.feedback-btn {
  position: fixed;
  right: -40px;
  bottom: 80px;
  transform: rotate(-90deg);
}
</style>