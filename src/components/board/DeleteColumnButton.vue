<template>
  <v-btn block text @click="showDialog = true" class="align-left no-padding">
    Delete Column
    <v-dialog v-model="showDialog" persistent max-width="320px">
      <v-card>
        <v-card-title>
          <span class="headline">Delete column</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              Warning: All cards will be removed as well!
            </v-row>
            <v-row>
              <v-col cols="12" sm="12">
                <v-select
                  :items="items"
                  label="Column Name"
                  v-model="selectedColumn"
                  outlined
                ></v-select>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn outlined color="success" @click="removeColumn">
            Delete
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn outlined color="error" @click="closeDialog">
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-btn>
</template>

<script>
export default {
  props: ["lists"],
  data() {
    return {
      showDialog: false,
      selectedColumn: ""
    };
  },
  computed: {
    items() {
      return this.lists.map(i => ({ text: i.name, value: i._id }));
    }
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
      this.selectedColumn = "";
    },
    removeColumn() {
      this.$emit("onDeleteColumn", {
        id: this.selectedColumn
      });
      this.closeDialog();
    }
  }
};
</script>

<style lang="scss" scoped>
.no-padding {
  padding: 0;
}

.align-left {
  ::v-deep span.v-btn__content {
    justify-content: start;
  }
}
</style>