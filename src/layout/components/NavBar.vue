<template>
  <v-app-bar app color="primary" dark>
    <div class="d-flex align-center">
      <v-btn text :to="{ name: 'home' }">EZ Retro</v-btn>
    </div>

    <v-spacer></v-spacer>

    <v-toolbar-items v-if="!user">
      <v-btn text :to="{ name: 'login' }">Login</v-btn>
      <v-btn text :to="{ name: 'SignUp' }">SignUp</v-btn>
    </v-toolbar-items>
    <v-toolbar-items v-if="user">
      <v-btn text @click="logout">LogOut</v-btn>
    </v-toolbar-items>
  </v-app-bar>
</template>

<script>
export default {
  data() {
    return {
      user: false
    };
  }
};
</script>

<style lang="scss" scoped>
.navbar {
  background-color: #007ac0;

  &__brand {
    color: white;
    font-size: 24px;
    font-weight: 700;
    line-height: 40px;
    cursor: pointer;
  }
}
</style>
