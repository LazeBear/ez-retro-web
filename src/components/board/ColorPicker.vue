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
export default {
  props: ["color"],
  data() {
    return {
      colors: [
        "#68829E",
        "#89DA59",
        "#FF420E",
        "#2C7873",
        "#375E97",
        "#F18D9E",
        "#324851"
      ]
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
    width: 16px;
    height: 16px;
    border-radius: 50%;
  }

  &__option-wrapper {
    position: absolute;
    top: 100%;
    left: 0;
    display: none;
    width: 120px;
    background: white;
    z-index: 99;
    padding: 8px;
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
  }

  &__option {
    display: inline-block;
    margin: 4px;
    cursor: pointer;

    &:hover,
    &--selected {
      border: 1px solid black;
    }
  }

  &:hover {
    .color-picker__option-wrapper {
      display: block;
    }
  }
}
</style>