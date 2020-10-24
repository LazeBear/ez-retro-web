<template>
  <div class="card">
    <div class="card__name">{{ board.name }}</div>
    <div class="card__description">{{ board.description }}</div>
    <div class="card__last-open">{{ formatDate(board.createdAt) }}</div>
    <div class="card__delete-btn" @click.stop="onDelete">
      <span class="mdi mdi-delete"></span>
    </div>
  </div>
</template>

<script>
import * as dayjs from "dayjs";
export default {
  props: ["board"],
  methods: {
    formatDate(date) {
      return dayjs(date).format("DD MMM YYYY");
    },
    onDelete() {
      this.$emit("onDelete");
    }
  }
};
</script>

<style lang="scss" scoped>
.card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  padding: 16px;
  position: relative;
  background-color: #007ac0;
  border-radius: 4px;
  color: white;
  margin-right: 16px;
  margin-bottom: 16px;
  width: 240px;
  height: 140px;
  cursor: pointer;

  &__name {
    font-weight: 500;
    font-size: 20px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &__description {
    font-weight: 300;
    font-size: 14px;
    height: 24px;
    margin-bottom: 32px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  &__delete-btn {
    position: absolute;
    top: 8px;
    right: 8px;
    display: none;
  }

  &:hover {
    .card__delete-btn {
      display: block;
    }
  }
}
</style>