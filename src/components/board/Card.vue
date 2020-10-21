<template>
  <div class="card">
    <div class="card__display" v-if="!isEditing">
      <div class="card__delete-btn" @click="onDelete">
        <span class="mdi mdi-delete-outline"></span>
      </div>
      <div class="card__text">{{ card.text }}</div>
      <div class="card__footer">
        <div class="card__edit-btn" @click="onEdit">
          <span class="mdi mdi-pencil"></span>
        </div>
      </div>
    </div>
    <div class="card__editing" v-else>
      <TextArea class="card__input" v-model="text"></TextArea>
      <div class="card__footer">
        <v-btn depressed color="success" @click="onUpdate">
          Update
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
  props: ["card"],
  data() {
    return {
      text: "",
      isEditing: false
    };
  },
  methods: {
    onUpdate() {
      this.$emit("onUpdate", { cardId: this.card._id, text: this.text });
      this.text = "";
      this.isEditing = false;
    },
    onCancel() {
      this.isEditing = false;
      this.text = "";
    },
    onDelete() {
      this.$emit("onDelete", this.card._id);
    },
    onEdit() {
      this.isEditing = true;
      this.text = this.card.text;
    }
  },
  components: { TextArea }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 5px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 10px;
  position: relative;
  color: white;

  &__delete-btn {
    position: absolute;
    right: 4px;
    top: 4px;
    cursor: pointer;
    color: red;
    visibility: hidden;
  }

  &__edit-btn {
    cursor: pointer;
    visibility: visible;
  }

  &:hover {
    .card__delete-btn,
    .card__edit-btn {
      visibility: visible;
    }
  }

  &__display {
    margin-right: 12px;
  }

  &__editing {
    background-color: white;
    padding: 2px;
  }

  &__text {
    word-break: break-word;
    white-space: pre-line;
    min-height: 24px;
    font-size: 16px;
  }

  &__input {
    overflow: hidden;
    overflow-wrap: break-word;
    resize: none;
    width: 100%;
    padding: 8px;
    background-color: white;
  }

  &__footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>