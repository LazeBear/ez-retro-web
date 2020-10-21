<template>
  <textarea @input="onInputChange" :value="value"></textarea>
</template>

<script>
import autoResizeMixin from "../../mixins/autoResize";
export default {
  props: ["value"],
  mixins: [autoResizeMixin],
  methods: {
    onInputChange(e) {
      this.autoResizeMixin(e);
      this.$emit("input", e.target.value);
    }
  }
};
</script>

<style lang="scss" scoped>
textarea:focus {
  outline: 1px solid #007ac044;
}
</style>