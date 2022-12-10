<template>
  <base-card class="filter">
    <template #default>
      <div class="filter_container flex-row">
        <div class="filter_search flex-row">
          <input type="text" v-model="filter.search" placeholder="商品名稱" />
          <span><font-awesome-icon icon="fa-solid fa-magnifying-glass" /></span>
        </div>

        <div v-if="categories.length > 0" class="filter_select">
          <select v-model="filter.category">
            <option v-for="cate in categories" :key="cate" :value="cate">
              {{ cate }}
            </option>
          </select>
        </div>
      </div>
    </template>
  </base-card>
</template>

<script>
import { reactive, watch } from "vue";
import { useStore } from "vuex";
export default {
  props: ["categories", "storeId"],
  setup(props) {
    const store = useStore();
    const filter = reactive({
      search: "",
      category: "全部",
    });

    watch(filter, function () {
      store.commit("product/setFilter", filter);
      store.dispatch("product/getProductList", props.storeId);
    });

    return {
      filter,
    };
  },
};
</script>

<style scoped>
.filter_container {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 1em;
}

.filter_search {
  width: 100%;
}

.filter_search input {
  width: 100%;
  max-width: 30em;
  font-size: var(--font-medium);
  padding: 0.6em 0.6em;
  background-color: var(--grey-50);
  border-radius: 2em;
}

input,
select {
  border: none;
  outline: none;
}

input::placeholder {
  color: var(--grey-200);
}
span {
  font-size: var(--font-medium);
  margin-left: 0.7em;
  cursor: pointer;
  color: var(--grey-200);
}

select,
option {
  width: 100%;
  min-width: 10em;
  padding: 0.3em 1em;
  font-size: var(--font-medium);
  color: var(--grey-200);
}

select {
  background-color: var(--grey-50);
  border-radius: 0.5em;
}
option {
  text-align: left;
  margin-bottom: 0.5em;
}

@media screen and (max-width: 400px) {
  .filter_container {
    flex-direction: column;
    align-items: flex-start;
    gap: 1em;
  }
  .filter_search {
    max-width: 100%;
    justify-content: space-between;
  }

  .filter_search input {
    width: 90%;
  }
  .filter_select {
    max-width: 100%;
  }
}
</style>
