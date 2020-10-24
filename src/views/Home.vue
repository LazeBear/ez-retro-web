<template>
  <div class="home">
    <div class="img-wrapper"><img src="apple-touch-icon.png" alt="icon" /></div>

    <h1>Welcome to EZ Retro Board, let's Login!</h1>
    <v-btn color="primary" :to="{ name: 'Login' }">Login</v-btn>
  </div>
</template>

<script>
// @ is an alias to /src

export default {
  name: "Home"
};
</script>

<style lang="scss" scoped>
.home {
  height: calc(100vh - 100px);
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;

  h1 {
    color: #007ac0;
  }

  .img-wrapper {
    width: 96px;
    height: 96px;
    margin-bottom: 24px;

    img {
      width: 100%;
      height: 100%;
    }
  }
}
</style>
