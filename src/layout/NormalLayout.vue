<template>
  <v-container>
    <NavBar />
    <v-main>
      <v-slide-y-transition mode="out-in">
        <slot />
      </v-slide-y-transition>
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
</style>
