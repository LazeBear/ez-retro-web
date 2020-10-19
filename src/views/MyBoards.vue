<template>
  <v-container fluid>
    <v-row>
      <v-btn elevation="2" color="primary" @click="createBoard"
        >New Board</v-btn
      >
    </v-row>
    <v-row>
      <v-col v-for="board in boards" :key="board._id">
        <v-card @click="$router.push(`/boards/${board._id}`)">{{
          board.name
        }}</v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  mounted() {
    this.fetchBoards();
  },
  methods: {
    ...mapActions("boards", { fetchBoards: "find" }),
    async createBoard() {
      const { Board, List } = this.$FeathersVuex.api;
      const board = await new Board().save();
      await new List({
        boardId: board._id,
        name: "Went well",
        order: 1
      }).save();
      await new List({
        boardId: board._id,
        name: "To improve",
        order: 2
      }).save();
      await new List({ boardId: board._id, name: "Actions", order: 3 }).save();
      this.$router.push(`/boards/${board._id}`);
    }
  },
  computed: {
    ...mapState("auth", { user: "payload" }),
    ...mapState("boards", {
      loading: "isFindPending",
      creating: "isCreatePending"
    }),
    ...mapGetters("boards", { findBoardsInStore: "find" }),
    boards() {
      return this.findBoardsInStore().data;
    }
  }
};
</script>

<style lang="scss" scoped>
</style>