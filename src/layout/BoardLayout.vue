<template>
  <div>
    <NavBar />
    <div class="content">
      <v-slide-y-transition mode="out-in">
        <slot />
      </v-slide-y-transition>
    </div>
  </div>
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
  padding-top: 65px;
}
</style>
