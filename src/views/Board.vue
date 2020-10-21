<template>
  <div class="board">
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
          >
            <Draggable
              v-for="card in getOrderedCardList(list._id)"
              :key="card.id"
            >
              <Card
                :style="{ backgroundColor: list.color }"
                :card="card"
                :isVoted="card.votes.includes(user._id)"
                @onDelete="deleteCard"
                @onUpdate="updateCard"
                @onVote="voteCard"
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
import NewCard from "../components/board/NewCard";
import Card from "../components/board/Card";
import ColorPicker from "../components/board/ColorPicker";

export default {
  data() {
    return {
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
    const board = await this.fetchBoardById(id);
    if (!board) {
      return this.$router.push("/boards");
    }
    this.fetchLists({ query: { boardId: board._id } });
    this.fetchCards({ query: { boardId: board._id } });
  },
  methods: {
    ...mapActions("boards", { fetchBoardById: "get" }),
    ...mapActions("lists", { fetchLists: "find", updateListById: "patch" }),
    ...mapActions("cards", {
      fetchCards: "find",
      deleteCardById: "remove",
      updateCardById: "patch"
    }),
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
      const card = this.findCardInStore(cardId);
      const { _id: userId } = this.user;
      const index = card.votes.findIndex(i => i === userId);
      if (index !== -1) {
        card.votes.splice(index, 1);
      } else {
        card.votes.push(userId);
      }
      await card.save();
    },
    async deleteCard(cardId) {
      this.deleteCardById(cardId);
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
    }
  },
  watch: {
    lists(value) {
      this.displayLists = value;
    },
    cards(value) {
      this.displayCards = value;
    }
  },
  computed: {
    ...mapState("board", ["droppingList", "draggingCard"]),
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
    board() {
      return this.findBoardInStore(this.$route.params.id);
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
  components: { Container, Draggable, NewCard, Card, ColorPicker }
};
</script>

<style lang="scss" scoped>
.board {
  min-height: calc(100vh - 100px);

  &__container {
    display: flex;

    & > div.smooth-dnd-draggable-wrapper {
      flex: 1;
      min-width: 200px;
      margin: 5px;
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
    margin: 0 5px;
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