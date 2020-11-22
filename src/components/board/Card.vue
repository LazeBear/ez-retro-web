<template>
  <div class="card">
    <div class="card__display" v-if="!isEditing">
      <div class="card__merge-btn" v-if="showMergeBtn">
        <MergeButton @onConfirm="onMerge"></MergeButton>
      </div>
      <div class="card__delete-btn">
        <DeleteButton @onConfirm="onDelete"></DeleteButton>
      </div>
      <div class="card__text" :class="{ 'card__text--blur': blurCard }">
        {{ displayText }}
      </div>
      <div class="card__author">
        <span class="mdi mdi-account-circle"></span>
        {{ card.user.displayName || card.user.email }}
      </div>
      <div class="card__footer">
        <div class="card__edit-btn" @click="onEdit">
          <span class="mdi mdi-pencil"></span>
        </div>

        <div class="card__vote" v-if="allowVote">
          <div class="card__vote-btn">
            <span
              class="mdi"
              :class="isVoted ? 'mdi-thumb-up' : 'mdi-thumb-up-outline'"
              @click="onVote"
            >
              {{ card.votes.length }}</span
            >
          </div>
        </div>
      </div>
    </div>
    <div class="card__editing" v-else>
      <TextArea class="card__input" v-model="text" ref="textarea"></TextArea>
      <div class="card__footer">
        <v-btn outlined color="success" @click="onUpdate">
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
function randomLetters(length) {
  let rdmString = "";
  for (
    ;
    rdmString.length < length;
    rdmString += Math.random()
      .toString(36)
      .substr(2)
  );
  return rdmString.substr(0, length);
}
import TextArea from "./TextArea";
import DeleteButton from "./DeleteButton";
import MergeButton from "./MergeButton";
export default {
  props: ["card", "isVoted", "blurCard", "allowVote", "showMergeBtn"],
  data() {
    return {
      text: "",
      isEditing: false
    };
  },
  computed: {
    displayText() {
      return this.blurCard
        ? randomLetters(this.card.text.length)
        : this.card.text;
    }
  },
  methods: {
    onUpdate() {
      this.$emit("onUpdate", { cardId: this.card._id, text: this.text });
      this.text = "";
      this.isEditing = false;
    },
    onMerge() {
      this.$emit("onMerge");
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
      this.$nextTick(() => {
        this.$refs.textarea.$el.focus();
      });
    },
    onVote() {
      this.$emit("onVote", this.card._id);
    }
  },
  components: { TextArea, DeleteButton, MergeButton }
};
</script>

<style lang="scss" scoped>
.card {
  margin: 4px;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 8px;
  position: relative;
  color: white;

  &__delete-btn {
    position: absolute;
    right: 4px;
    top: 24px;
    cursor: pointer;
    visibility: hidden;
  }

  &__merge-btn {
    position: absolute;
    top: 0px;
    right: 2px;
    width: 20px;
    font-size: 20px;
    height: 24px;
    visibility: hidden;
    cursor: pointer;
  }

  &__edit-btn {
    cursor: pointer;
    visibility: hidden;
  }

  &:hover {
    .card__merge-btn,
    .card__delete-btn,
    .card__edit-btn {
      visibility: visible;
    }
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
    margin-right: 12px;

    &--blur {
      color: transparent;
      text-shadow: 0 0 5px rgba(255, 255, 255, 0.5);
    }
  }

  &__author {
    span {
      font-size: 18px;
    }
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
    flex-wrap: wrap;

    .card {
      &__vote {
        align-self: flex-end;
        cursor: pointer;
      }
    }
  }
}
</style>