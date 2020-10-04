<template>
  <v-container fill-height>
    <NavBar />
    <v-main>
      <slot />
    </v-main>
  </v-container>
</template>

<script>
import NavBar from "./components/NavBar";
export default {
  components: {
    NavBar
  }
};
</script>

<style lang="scss" scoped>
.content {
  min-height: calc(100vh - 40px);
  display: flex;
  & > div {
    flex: 1;
  }
}
</style>
