<template>
  <div class="color-picker">
    <div
      class="color-picker__selected"
      :style="{ backgroundColor: color }"
    ></div>
    <div class="color-picker__option-wrapper">
      <div
        class="color-picker__option"
        :class="{ 'color-picker__option--selected': color === c }"
        v-for="c in colors"
        :key="c"
        :style="{ backgroundColor: c }"
        @click="selectColor(c)"
      ></div>
    </div>
  </div>
</template>

<script>
import COLORS from "../../constants/colors";
export default {
  props: ["color"],
  data() {
    return {
      colors: Object.values(COLORS)
    };
  },
  methods: {
    selectColor(color) {
      this.$emit("onSelectColor", color);
    }
  }
};
</script>

<style lang="scss" scoped>
.color-picker {
  display: inline-block;
  position: relative;

  &__selected,
  &__option {
    width: 24px;
    height: 24px;
    border-radius: 50%;
  }

  &__option-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    width: 144px;
    background: rgba(255, 255, 255);
    z-index: 99;
    padding: 8px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.24), 0 1px 1px rgba(0, 0, 0, 0.48);
  }

  &__option {
    display: inline-block;
    margin: 4px;
    cursor: pointer;
    border: 3px solid rgb(255, 255, 255);
    transition: border 0.3s;
    &:hover,
    &--selected {
      border: 0;
    }
  }

  &:hover {
    .color-picker__option-wrapper {
      display: block;
    }
  }
}
</style>