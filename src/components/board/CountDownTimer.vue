<template>
  <div v-if="time" class="countdown">
    <span class="mdi mdi-clock-outline"> </span>
    <span>{{ text }}</span>
  </div>
</template>

<script>
export default {
  props: ["time"],
  data() {
    return {
      text: "00:00",
      timeout: null,
    };
  },
  methods: {
    fixPlace(number) {
      if (("" + number).length < 2) {
        return "0" + number;
      }
      return number;
    },
    updateCountDownText() {
      const remaining = Math.floor((this.time - Date.now()) / 1000);
      if (remaining < 0) {
        clearTimeout(this.timeout);
        return;
      }
      const min = Math.floor(remaining / 60);
      const sec = remaining - min * 60;
      this.text = `${this.fixPlace(min)}:${this.fixPlace(sec)}`;

      this.timeout = setTimeout(() => this.updateCountDownText(), 1000);
    },
  },
  watch: {
    time: {
      immediate: true,
      handler() {
        if (this.timeout) clearTimeout(this.timeout);
        this.updateCountDownText();
      },
    },
  },
  destroyed() {
    if (this.timeout) clearTimeout(this.timeout);
  },
};
</script>

<style lang="scss" scoped>
.countdown {
  margin: 0 16px;
}
.mdi {
  margin-right: 8px;
}
</style>