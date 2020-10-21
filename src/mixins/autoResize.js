export default {
  methods: {
    autoResizeMixin(event) {
      event.target.style.height = 'auto';
      event.target.style.height = `${event.target.scrollHeight}px`;
    }
  },
  mounted() {
    this.$nextTick(() => {
      // console.log(());
      this.$el.style.height = `${this.$el.scrollHeight}px`;
      // this.$el.setAttribute('style', 'height', `${this.$el.scrollHeight}px`);
    });
  }
};
