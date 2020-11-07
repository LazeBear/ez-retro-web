<template>
  <v-dialog v-model="dialog" persistent max-width="320">
    <template v-slot:activator="{ on, attrs }">
      <span class="mdi mdi-call-merge" v-bind="attrs" v-on="on"></span>
    </template>
    <v-card>
      <v-card-title class="headline">
        Merge cards
      </v-card-title>
      <v-card-text
        ><p>
          You are merging <b>this</b> card <b>to</b> the <b>previous</b> card.
        </p>
        <p>this operation cannot be undone!</p></v-card-text
      >
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn outlined color="error" @click="dialog = false">
          Cancel
        </v-btn>
        <v-btn color="success" outlined @click="onConfirm">
          Yes
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    onConfirm() {
      this.dialog = false;
      this.$emit("onConfirm", true);
    }
  }
};
</script>

<style lang="scss" scoped>
</style>