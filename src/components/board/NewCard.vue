<template>
  <div class="card">
    <div v-if="!showInput" class="card__button" @click="showInput = true">
      <span class="mdi mdi-plus-thick"></span>
    </div>

    <template v-else>
      <textarea
        class="card__input"
        @input="autoResizeMixin"
        v-model="text"
      ></textarea>
      <div class="card__footer">
        <v-btn depressed color="success" @click="onCreate">
          Create
        </v-btn>

        <v-btn outlined color="error" @click="onCancel">
          Cancel
        </v-btn>
      </div>
    </template>
  </div>
</template>

<script>
import autoResizeMixin from "../../mixins/autoResize";
export default {
  mixins: [autoResizeMixin],
  data() {
    return {
      text: "",
      showInput: false
    };
  },
  methods: {
    onCreate() {
      this.$emit("onSubmit", this.text);
      this.text = "";
    },
    onCancel() {
      this.text = "";
      this.showInput = false;
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 5px;
  background-color: white;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 10px;
  position: relative;

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
}
</style>