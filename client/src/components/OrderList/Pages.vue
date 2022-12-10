<template>
  <main class="pages flex-row">
    <div
      v-for="page in pages"
      :key="page"
      @click="setPage(page)"
      class="grid-center"
      :class="{ active: activePage === page }"
    >
      {{ page }}
    </div>
  </main>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";
export default {
  props: ["numOfpages", "reset"],
  emits: ["set-active-page"],
  setup(props) {
    const store = useStore();
    const activePage = computed(() => {
      return store.getters["order/filterPage"];
    });
    const pages = computed(() => {
      return Array.from({ length: props.numOfpages }, (_, index) => {
        return index + 1;
      });
    });

    function setPage(page) {
      if (activePage.value === page) return;
      store.commit("order/setPage", page);
      store.dispatch("order/getOrderList");
    }

    return {
      setPage,
      activePage,
      pages,
    };
  },
};
</script>

<style scoped>
main {
  width: 100%;
  justify-content: center;
  gap: 1.5em;
  margin-top: 2em;
}

div {
  width: 1.5em;
  height: 1.5em;
  border-radius: 0.3em;
  background-color: var(--grey-50);
  color: var(--grey-200);
  font-weight: 500;
  font-size: var(--font-medium);
  cursor: pointer;
}

.active,
div:hover,
div:active {
  background-color: var(--primary-4);
  color: var(--grey-0);
}
</style>
