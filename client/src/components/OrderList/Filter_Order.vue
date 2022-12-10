<template>
  <base-card class="filter_container">
    <template #default>
      <div class="filter_container flex-column">
        <div class="filter_search flex-row">
          <input
            type="text"
            placeholder="搜尋姓名、電話"
            v-model="filter.search"
          />
          <span @click.prevent="submitFilter"
            ><font-awesome-icon icon="fa-solid fa-magnifying-glass"
          /></span>
        </div>

        <div class="filters flex-row">
          <div class="filter_btns flex-row">
            <base-button
              @click="setCompleted('all')"
              :data="filter.completed"
              target="all"
            >
              全部
            </base-button>
            <base-button
              @click="setCompleted(true)"
              :data="filter.completed"
              :target="true"
            >
              已完成
            </base-button>
            <base-button
              @click="setCompleted(false)"
              :data="filter.completed"
              :target="false"
            >
              未完成
            </base-button>
          </div>

          <div class="filter_radio flex-row">
            <label for="paid" class="radio flex-row"
              >已付款
              <input
                type="radio"
                name="paid"
                id="paid"
                :value="true"
                v-model="filter.paid"
                class="radio_input"
              />
              <span class="radio_radio"></span>
            </label>

            <label for="unpaid" class="radio flex-row"
              >未付款
              <input
                type="radio"
                name="unpaid"
                id="unpaid"
                :value="false"
                v-model="filter.paid"
                class="radio_input"
              />
              <span class="radio_radio"></span>
            </label>
          </div>

          <div class="filter_checkbox">
            <div>
              <label for="delivery-self">自行領取</label>
              <input
                type="checkbox"
                name="delivery"
                value="inStore"
                id="delivery-self"
                v-model="filter.delivery"
              />
            </div>
          </div>

          <base-button @click="resetFilter"> 清除篩選 </base-button>
        </div>
      </div>
    </template>
  </base-card>
</template>

<script>
import { reactive, watch } from "vue";
import { useStore } from "vuex";
import BaseCard from "../UI/BaseCard.vue";
import BaseButton from "../UI/BaseButton.vue";
export default {
  components: { BaseCard, BaseButton },
  emits: ["reset-filter"],
  setup(props, context) {
    const store = useStore();
    const filter = reactive({
      search: "",
      completed: "all",
      paid: null,
      delivery: [],
    });

    function setCompleted(value) {
      filter.completed = value;
    }
    function resetFilter() {
      filter.search = "";
      filter.completed = "all";
      filter.paid = null;
      filter.delivery = [];
      context.emit["reset-filter"];
    }

    watch(filter, function () {
      store.commit("order/setFilter", filter);
      store.dispatch("order/getOrderList");
    });

    return {
      filter,
      resetFilter,
      setCompleted,
    };
  },
};
</script>

<style scoped>
.filter_container {
  gap: 1em;
  color: var(--grey-200);
}
.filter_search {
  width: 100%;
}

.filter_search input {
  width: 100%;
  max-width: 40em;
  font-size: var(--font-medium);
  padding: 0.6em 0.6em;
  background-color: var(--grey-50);
  border-radius: 2em;
  border: none;
  outline: none;
}

.filters {
  padding: 0 0.7em;
  flex-wrap: wrap;
  gap: 1em;
}

.filter_btns {
  flex: 1;
  gap: 1.5em;
}

.filter_checkbox div {
  display: flex;
  min-width: 7em;
  position: relative;
}

.radio {
  justify-content: flex-start;
  cursor: pointer;
}
.radio_input {
  display: none;
}

.radio_radio {
  width: 1em;
  height: 1em;
  border: 2px solid var(--primary-4);
  border-radius: 50%;
  padding: 2px;
  margin-left: 0.3em;
}
.radio_radio::after {
  content: "";
  width: 100%;
  height: 100%;
  border-radius: 50%;
  display: block;
  background-color: var(--primary-4);
  transform: scale(0);
  transition: all 0.2s;
}

.radio_input:checked + .radio_radio::after {
  transform: scale(1);
}

label {
  font-size: var(--font-small);
  margin-right: 0.5em;
}

span {
  font-size: var(--font-medium);
  margin-left: 0.7em;
  cursor: pointer;
}

@media screen and (max-width: 850px) {
  .filters {
    display: flex;
    flex-wrap: wrap;
    gap: 2em;
  }
}
</style>
