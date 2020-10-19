<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-btn text :to="{ name: 'home' }">EZ Retro</v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-toolbar-items v-if="!user">
      <v-btn text :to="{ name: 'Login' }">Login</v-btn>
      <v-btn text :to="{ name: 'SignUp' }">SignUp</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="user">
      <v-btn text @click="logout">LogOut</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default {
  computed: {
    ...mapState("auth", { user: "payload" })
  },
  methods: {
    ...mapActions("auth", { authLogout: "logout" }),
    logout() {
      this.authLogout().then(() => this.$router.push("/login"));
    }
  }
};
</script>

<style lang="scss" scoped>
</style>
