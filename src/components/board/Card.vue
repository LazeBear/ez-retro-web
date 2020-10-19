<template>
  <div class="card">
    <div class="card__delete-btn" @click="onDelete">
      <span class="mdi mdi-delete-outline"></span>
    </div>
    <div class="card__display" v-if="!isEditing">
      <div class="card__text">{{ card.text }}</div>
      <div class="card__footer">
        <div class="card__edit-btn" @click="onEdit">
          <span class="mdi mdi-pencil"></span>
        </div>
      </div>
    </div>
    <div class="card__editing" v-else>
      <textarea
        class="card__input"
        @input="autoResizeMixin"
        v-model="text"
      ></textarea>
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
import autoResizeMixin from "../../mixins/autoResize";
export default {
  mixins: [autoResizeMixin],
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
    visibility: hidden;
  }

  &:hover {
    .card__delete-btn,
    .card__edit-btn {
      visibility: visible;
    }
  }

  &__display,
  &__editing {
    padding-right: 12px;
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
  }

  &__footer {
    display: flex;
    justify-content: space-between;
  }
}
</style>