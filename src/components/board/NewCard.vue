<template>
  <div class="card">
    <div v-if="!showInput" class="card__button" @click="showInput = true">
      <span class="mdi mdi-plus-thick"></span>
    </div>

    <div class="card__editing" v-else>
      <TextArea class="card__input" v-model="text"></TextArea>
      <div class="card__footer">
        <v-btn outlined color="success" @click="onCreate">
          Create
        </v-btn>

        <v-btn outlined color="error" @click="onCancel">
          Cancel
        </v-btn>
      </div>
    </div>
  </div>
</template>

<script>
import TextArea from "./TextArea";
export default {
  data() {
    return {
      text: "",
      showInput: false
    };
  },
  methods: {
    onCreate() {
      this.$emit("onSubmit", this.text);
      this.showInput = false;
      this.text = "";
    },
    onCancel() {
      this.text = "";
      this.showInput = false;
    }
  },
  components: { TextArea }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 5px;
  background-color: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 10px;
  position: relative;
  color: white;

  &__button {
    text-align: center;
    cursor: pointer;
  }

  &__input {
    overflow: hidden;
    overflow-wrap: break-word;
    resize: none;
    width: 100%;
    padding: 8px;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
  }

  &__editing {
    padding: 4px;
    background: white;
  }
}
</style>