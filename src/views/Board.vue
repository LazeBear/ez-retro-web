<template>
  <div class="board" v-if="board">
    <div class="board__info">
      <QuickEdit
        :value="board.name"
        @input="onUpdateBoard($event, 'name')"
        v-if="isBoardOwner"
        :classes="{ buttonOk: '', buttonCancel: '', wrapper: 'board__name' }"
      >
        <template v-slot:button-ok>
          <v-btn outlined color="success">
            Update
          </v-btn>
        </template>
        <template v-slot:button-cancel>
          <v-btn outlined color="error">
            Cancel
          </v-btn>
        </template>
      </QuickEdit>
      <div class="board__name" v-else>{{ board.name }}</div>
      <QuickEdit
        v-if="isBoardOwner"
        :value="board.description"
        emptyText="Write a short description here..."
        @input="onUpdateBoard($event, 'description')"
        :classes="{
          buttonOk: '',
          buttonCancel: '',
          wrapper: 'board__description'
        }"
        ><template v-slot:button-ok>
          <v-btn outlined color="success">
            Update
          </v-btn>
        </template>
        <template v-slot:button-cancel>
          <v-btn outlined color="error">
            Cancel
          </v-btn>
        </template></QuickEdit
      >
      <div class="board__description" v-else>{{ board.description }}</div>

      <v-btn
        class="board__setting"
        color="primary"
        fab
        small
        v-if="isBoardOwner"
        @click="showDrawer = !showDrawer"
      >
        <v-icon dark>
          mdi-wrench
        </v-icon>
      </v-btn>
      <v-navigation-drawer v-model="showDrawer" absolute right temporary>
        <div class="drawer">
          <v-switch
            @change="onUpdateBoard($event, 'blurCard')"
            :input-value="board.blurCard"
            label="Blur card content"
          ></v-switch>
          <v-switch
            @change="onUpdateBoard($event, 'allowVote')"
            :input-value="board.allowVote"
            label="Allow vote"
          ></v-switch>
          <div class="drawer__row" v-if="board.allowVote">
            No. of votes:
            <VueNumberInput
              :value="board.maxVote"
              @change="onUpdateBoard($event, 'maxVote')"
              :min="1"
              :max="9"
              controls
            ></VueNumberInput>
          </div>
          <div class="drawer__divider"></div>
          <v-btn block text @click="exportAs('md')">Export as MarkDown</v-btn>
        </div>
      </v-navigation-drawer>
    </div>

    <Container
      orientation="horizontal"
      @drop="onColumnDrop($event)"
      drag-handle-selector=".list__drag-handle"
      :drop-placeholder="upperDropPlaceholderOptions"
      class="board__container"
    >
      <Draggable v-for="list in displayLists" :key="list._id">
        <div class="list">
          <span class="list__drag-handle"
            ><span class="mdi mdi-cursor-move"></span>
          </span>
          <div class="list__header">
            <ColorPicker
              :color="list.color"
              @onSelectColor="changeListColor(list._id, $event)"
            ></ColorPicker>
            {{ list.name }}
          </div>
          <NewCard
            @onSubmit="addCard(list._id, $event)"
            :style="{ backgroundColor: list.color }"
          ></NewCard>
          <Container
            class="list__cards"
            group-name="col"
            @drop="e => onCardDrop(list._id, e)"
            :get-child-payload="getCardPayload(list._id)"
            drag-class="card__ghost"
            drop-class="card__ghost-drop"
            :drop-placeholder="dropPlaceholderOptions"
            non-drag-area-selector=".card__editing"
          >
            <Draggable
              v-for="(card, idx) in getOrderedCardList(list._id)"
              :key="card.id"
            >
              <Card
                :style="{ backgroundColor: list.color }"
                :card="card"
                :blurCard="board.blurCard && card.userId !== user._id"
                :isVoted="card.votes.includes(user._id)"
                :allowVote="board.allowVote"
                :showMergeBtn="idx !== 0"
                @onDelete="deleteCard"
                @onUpdate="updateCard"
                @onVote="voteCard"
                @onMerge="mergeCard(list._id, idx, idx - 1)"
              >
              </Card>
            </Draggable>
          </Container>
        </div>
      </Draggable>
    </Container>
  </div>
</template>

<script>
import { mapState, mapGetters, mapActions } from "vuex";
import { Container, Draggable } from "vue-smooth-dnd";
import VueNumberInput from "@chenfengyuan/vue-number-input";
import json2md from "json2md";
import { saveAs } from "file-saver";
import QuickEdit from "vue-quick-edit";
import NewCard from "../components/board/NewCard";
import Card from "../components/board/Card";
import ColorPicker from "../components/board/ColorPicker";

export default {
  data() {
    return {
      showDrawer: false,
      upperDropPlaceholderOptions: {
        className: "list-drop-preview",
        animationDuration: "150",
        showOnTop: true
      },
      dropPlaceholderOptions: {
        className: "card-drop-preview",
        animationDuration: "150",
        showOnTop: true
      },
      displayLists: [], // to avoid async update flash
      displayCards: []
    };
  },
  async mounted() {
    const { id } = this.$route.params;
    let board;
    try {
      board = await this.fetchBoardById(id);
    } catch (e) {
      console.error(e);
      return this.$router.push("/boards");
    }
    this.fetchLists({ query: { boardId: board._id } });
    this.fetchCards({ query: { boardId: board._id } });
  },
  methods: {
    ...mapActions("boards", { fetchBoardById: "get" }),
    ...mapActions("lists", {
      fetchLists: "find",
      updateListById: "patch"
    }),
    ...mapActions("cards", {
      fetchCards: "find",
      deleteCardById: "remove",
      updateCardById: "patch"
    }),
    exportAs(type) {
      const { name: boardName, description: boardDescription } = this.board;
      if (type === "md") {
        const md = [{ h1: boardName }, { p: boardDescription }];
        this.displayLists.forEach(list => {
          const { _id, name } = list;
          md.push({ h2: name });
          const cards = this.getOrderedCardList(_id);
          const ul = [];
          cards.forEach(card => {
            const { text, votes } = card;
            let li = text;
            if (votes.length) {
              li += `(${votes.length} votes)`;
            }
            ul.push(li);
          });
          md.push({ ul });
        });
        const data = json2md(md);
        const blob = new Blob([data], { type: "text/plain;charset=utf-8" });
        saveAs(blob, `${boardName}.md`);
      }
    },
    async onUpdateBoard(e, property) {
      this.board[property] = e;
      await this.board.save();
    },
    changeListColor(listId, color) {
      this.updateListById([listId, { color }]);
    },
    async addCard(listId, text) {
      const { Card } = this.$FeathersVuex.api;
      await new Card({
        text,
        listId,
        boardId: this.board._id,
        order: this.getListLength(listId)
      }).save();
    },
    updateCard({ cardId, text }) {
      this.updateCardById([cardId, { text }]);
    },
    async voteCard(cardId) {
      const { allowVote, maxVote } = this.board;
      if (!allowVote) {
        return;
      }

      const { _id: userId } = this.user;
      let voteCount = 0;
      this.cards.forEach(i => {
        if (i.votes.includes(userId)) {
          voteCount++;
        }
      });

      const card = this.findCardInStore(cardId);
      const index = card.votes.findIndex(i => i === userId);
      if (index !== -1) {
        card.votes.splice(index, 1);
      } else {
        const leftVote = maxVote - voteCount;
        if (leftVote <= 0) {
          this.$toasted.error("0 vote remaining!");
          return;
        }
        this.$toasted.info(`${leftVote - 1} vote(s) remaining!`);
        card.votes.push(userId);
      }
      await card.save();
    },
    deleteCard(cardId) {
      this.deleteCardById(cardId);
    },
    async mergeCard(listId, sourceCardIndex, targetCardIndex) {
      const list = this.getOrderedCardList(listId);
      const sourceCard = list[sourceCardIndex];
      const targetCard = list[targetCardIndex];
      targetCard.text = `${targetCard.text}
------------
${sourceCard.text}`;
      sourceCard.votes.forEach(i => {
        if (!targetCard.votes.find(j => j === i)) {
          targetCard.votes.push(i);
        }
      });
      this.removeCard(sourceCard._id);
      await targetCard.save();
      await sourceCard.remove();
    },
    onColumnDrop(dropResult) {
      const { removedIndex, addedIndex } = dropResult;
      if (removedIndex !== null && addedIndex !== null) {
        const array = [...this.lists];
        const [list] = array.splice(removedIndex, 1);
        array.splice(addedIndex, 0, list);
        for (let index = 0; index < array.length; index++) {
          const { _id, order } = array[index];
          if (order !== index) {
            this.updateListById([_id, { order: index }]);
          }
        }
        this.displayLists = array;
      }
    },
    onCardDrop(listId, dropResult) {
      let dropWithinList = false;
      const { removedIndex, addedIndex, payload } = dropResult;
      if (removedIndex !== null || addedIndex !== null) {
        if (removedIndex !== null && addedIndex !== null) {
          dropWithinList = true;
        }
        const { _id, order } = payload;
        const array = this.getOrderedCardList(listId).map(i => ({
          id: i._id,
          order: i.order
        }));
        if (removedIndex !== null) {
          array.splice(removedIndex, 1);
        }
        if (addedIndex !== null) {
          array.splice(addedIndex, 0, { id: _id, order });
        }
        for (let index = 0; index < array.length; index++) {
          const { id, order } = array[index];
          if (order !== index && dropWithinList) {
            this.updateCardById([id, { order: index }]);
          } else {
            this.updateCardById([id, { order: index, listId }]);
          }
          this.updateDisplayCardsOrder(listId, id, index);
        }
      }
    },
    getCardPayload(listId) {
      return index => {
        return this.getOrderedCardList(listId)[index];
      };
    },
    getListLength(listId) {
      return this.cards.filter(i => i.listId === listId).length;
    },
    getOrderedCardList(listId) {
      // check array
      return this.displayCards
        .filter(i => i.listId === listId)
        .sort((a, b) => (a.order < b.order ? -1 : 1));
    },
    updateDisplayCardsOrder(listId, cardId, order) {
      const card = this.displayCards.find(i => i._id === cardId);
      card.listId = listId;
      card.order = order;
    },
    // locally
    removeCard(cardId) {
      const index = this.displayCards.findIndex(i => i._id === cardId);
      if (index !== -1) {
        this.displayCards.splice(index, 1);
      }
    }
  },
  watch: {
    lists: {
      immediate: true,
      deep: true,
      handler(value) {
        this.displayLists = value || [];
      }
    },
    cards: {
      immediate: true,
      deep: true,
      handler(value) {
        this.displayCards = value || [];
      }
    }
  },
  computed: {
    ...mapState("auth", ["user"]),
    ...mapState("boards", {
      loadingBoard: "isGetPending",
      boardsError: "errorOnGet"
    }),
    ...mapState("lists", {
      loadingLists: "isFindPending",
      creatingList: "isCreatePending",
      listsError: "errorOnfind"
    }),
    ...mapState("cards", {
      cardsError: "errorOnfind"
    }),
    ...mapGetters("boards", { findBoardInStore: "get" }),
    ...mapGetters("lists", { findListsInStore: "find" }),
    ...mapGetters("cards", {
      findCardsInStore: "find",
      findCardInStore: "get"
    }),
    isBoardOwner() {
      return this.board.ownerId === this.user._id;
    },
    board() {
      const board = this.findBoardInStore(this.$route.params.id);
      return board;
    },
    lists() {
      return this.findListsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data.sort((a, b) => (a.order < b.order ? -1 : 1));
    },
    cards() {
      return this.findCardsInStore({
        query: {
          boardId: this.$route.params.id
        }
      }).data;
    }
  },
  components: {
    Container,
    Draggable,
    NewCard,
    Card,
    ColorPicker,
    QuickEdit,
    VueNumberInput
  }
};
</script>

<style lang="scss" scoped>
::v-deep .board {
  &__name {
    .vue-quick-edit__link {
      color: black;
      font-weight: 600;
      font-size: 24px;
      border: none;

      &:hover {
        border-bottom: 1px dashed #007ac0;
      }
    }
  }

  &__description {
    input {
      width: 400px;
    }
    .vue-quick-edit__link {
      color: black;
      border: none;

      &:hover {
        border-bottom: 1px dashed #007ac0;
      }
    }
  }
}

.drawer {
  margin: 8px;

  &__row {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__divider {
    height: 48px;
  }
}
.board {
  min-height: calc(100vh - 100px);

  &__info {
    margin: 8px;
    display: flex;
    align-items: baseline;
  }
  &__name {
    font-weight: 600;
    font-size: 24px;
    margin-right: 8px;
  }
  &__setting {
    margin-left: auto;
  }

  &__container {
    display: flex !important;

    & > div.smooth-dnd-draggable-wrapper {
      flex: 1;
      min-width: 200px;
      padding: 4px;
      display: flex;
      height: auto;
    }
  }
}

.list {
  display: flex;
  flex-direction: column;
  position: relative;
  width: 100%;

  &__header {
    font-size: 20px;
    font-weight: 600;
    margin: 0 4px;
    padding-right: 4px;
    display: flex;
    align-items: center;

    & > div {
      margin-right: 8px;
    }
  }

  &__drag-handle {
    cursor: move;
    padding: 5px;
    position: absolute;
    top: 0;
    right: 0;
    visibility: hidden;
  }

  &:hover {
    .list__drag-handle {
      visibility: visible;
    }
  }

  &__cards {
    flex: 1;
  }
}

.card__ghost {
  transition: transform 0.18s ease;
  transform: rotateZ(5deg);
}

.card__ghost-drop {
  transition: transform 0.18s ease-in-out;
  transform: rotateZ(0deg);
}
</style>