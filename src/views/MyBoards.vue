<template>
  <div class="dashboard">
    <h3>Public boards</h3>
    <div class="public-boards">
      <Card
        v-for="board in boards"
        :key="board._id"
        @click.native="$router.push(`/boards/${board._id}`)"
        @onDelete="deleteBoard(board._id)"
        :board="board"
      ></Card>
      <div class="new-board-btn" @click="newCardDialog = true">
        New Card
        <v-dialog v-model="newCardDialog" persistent max-width="320px">
          <v-card>
            <v-card-title>
              <span class="headline">Create new board</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="12">
                    <v-text-field
                      label="Board name"
                      v-model="newBoardName"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-btn outlined color="success" @click="createBoard">
                Create
              </v-btn>
              <v-spacer></v-spacer>
              <v-btn outlined color="error" @click="closeDialog">
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import Card from "../components/boards/Card";
import COLORS from "../constants/colors";
export default {
  data() {
    return {
      newCardDialog: false,
      newBoardName: ""
    };
  },
  mounted() {
    this.fetchBoards();
  },
  methods: {
    ...mapActions("boards", { fetchBoards: "find", deleteBoardById: "remove" }),
    closeDialog() {
      this.newBoardName = "";
      this.newCardDialog = false;
    },
    deleteBoard(id) {
      this.deleteBoardById(id);
    },
    async createBoard() {
      this.newCardDialog = false;
      const { Board, List } = this.$FeathersVuex.api;
      const board = await new Board({ name: this.newBoardName }).save();
      await new List({
        boardId: board._id,
        name: "Went well",
        order: 1,
        color: COLORS.BLACK_2
      }).save();
      await new List({
        boardId: board._id,
        name: "To improve",
        order: 2,
        color: COLORS.BLUE_3
      }).save();
      await new List({
        boardId: board._id,
        name: "Actions",
        order: 3,
        color: COLORS.RED_2
      }).save();
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
      return this.findBoardsInStore({
        query: { ownerId: this.user.user._id }
      }).data.sort((a, b) => {
        return new Date(a.createdAt).getTime() < new Date(b.createdAt).getTime()
          ? 1
          : -1;
      });
    }
  },
  components: { Card }
};
</script>

<style lang="scss" scoped>
.dashboard {
  padding: 32px;
}
h3 {
  margin-bottom: 8px;
}
.public-boards {
  display: flex;
  flex-wrap: wrap;

  .new-board-btn {
    box-shadow: 0 1px 1px rgba(0, 0, 0, 0.12), 0 1px 1px rgba(0, 0, 0, 0.24);
    padding: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 600;
    font-size: 20px;
    position: relative;
    background-color: #007ac0c7;
    border-radius: 4px;
    color: white;
    margin-right: 16px;
    margin-bottom: 16px;
    width: 240px;
    height: 140px;
    cursor: pointer;
    transition: background-color 0.3s;

    &:hover {
      background-color: #007ac0;
    }
  }
}
</style>