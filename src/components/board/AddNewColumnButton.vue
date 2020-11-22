<template>
  <v-btn block text @click="showDialog = true" class="align-left no-padding">
    Add New Column
    <v-dialog v-model="showDialog" persistent max-width="320px">
      <v-card>
        <v-card-title>
          <span class="headline">Add new column</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="12">
                <v-text-field
                  label="Column name"
                  v-model="newColumnName"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-btn outlined color="success" @click="addColumn">
            Add
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
import { getRandomColor } from "../../constants/colors";

export default {
  data() {
    return {
      showDialog: false,
      newColumnName: ""
    };
  },
  methods: {
    closeDialog() {
      this.showDialog = false;
      this.newColumnName = "";
    },
    addColumn() {
      const color = getRandomColor();
      this.$emit("onAddColumn", {
        name: this.newColumnName,
        color
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