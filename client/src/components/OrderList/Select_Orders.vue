<template>
  <div class="flex-row">
    <select @change.prevent="numOfOrders">
      <option value="5" selected>5筆</option>
      <option value="10">10筆</option>
      <option value="20">20筆</option>
      <option value="全部">全部</option>
    </select>
    <p>{{ numOfpages }} / {{ activePage }}</p>

    <button type="button" class="setBtn" @click="toggleShowBtn">
      <font-awesome-icon icon="fa-solid fa-gear" />
    </button>
    <transition>
      <div class="export_fun flex-column" v-if="showExoprtBtn">
        <button type="button" @click="ex">資料匯出</button>
        <button
          type="button"
          @click="showPopup({}, '確認過帳', 'postingOrder')"
        >
          今日過帳
        </button>
      </div>
    </transition>

    <check-popup
      v-if="popupInfo.show"
      :info="popupInfo"
      @close-popup="closePopup"
      @close-form="toggleShowBtn"
    >
    </check-popup>
  </div>
</template>

<script>
import { computed, ref } from "vue";
import { useStore } from "vuex";
import { CheckPopup } from "../ProductList/index.js";
import { exportData } from "../../utils/exportExcel.js";
export default {
  props: ["numOfpages", "origOrderList", "statisticData"],
  emits: ["num-of-order"],
  components: { CheckPopup },
  setup(props) {
    const store = useStore();
    const activePage = computed(() => {
      return store.state.order.filter.page;
    });
    async function numOfOrders(e) {
      store.commit("order/setFilter", { limit: e.target.value });
      store.dispatch("order/getOrderList");
    }
    const showExoprtBtn = ref(false);

    function toggleShowBtn() {
      showExoprtBtn.value = !showExoprtBtn.value;
    }

    function ex() {
      exportData(props.origOrderList, props.statisticData);
      toggleShowBtn();
    }

    const popupInfo = ref({
      show: false,
      title: "",
      info: "",
      funName: "",
    });
    function showPopup(info, title, funName) {
      popupInfo.value = {
        show: true,
        title: title,
        info: info,
        funName: funName,
      };
    }
    function closePopup(value) {
      popupInfo.value = {
        show: false,
        ...value,
      };
    }

    return {
      numOfOrders,
      activePage,
      showExoprtBtn,
      toggleShowBtn,
      popupInfo,
      showPopup,
      closePopup,
      ex,
    };
  },
};
</script>

<style scoped>
div {
  width: 100%;
  justify-content: space-between;
  padding: 0 1em 1.5em 1em;
  gap: 1.2em;
}

button {
  font-size: 1.5rem;
  color: var(--grey-100);
  border: none;
  background-color: transparent;
  cursor: pointer;
}
.export_fun {
  width: 10em;
  height: auto;
  padding: 0.5em 0;
  background-color: var(--grey-0);
  position: absolute;
  top: 4.5em;
  right: 4em;
  gap: 0.5em;
  box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.5);
}
.export_fun button {
  font-size: 1.3rem;
  color: var(--grey-200);
  background-color: var(--grey-0);
  letter-spacing: 1px;
  padding: 0.5em;
  border-radius: 0.3em;
}
.export_fun button:hover {
  background-color: var(--primary-4);
  color: #fff;
}
select {
  width: 100%;
  max-width: 10em;
  padding: 0.5em;
  outline: none;
  border: none;
  box-shadow: var(--box-shadow-1);
  border: 0.5em;
  color: var(--grey-200);
  background-color: var(--grey-0);
  letter-spacing: 2px;
}
option {
  font-size: var(--font-small);
}

p {
  flex: 1;
  font-size: var(--font-medium);
  font-weight: 500;
  letter-spacing: 1px;
  color: var(--primary-3);
  white-space: nowrap;
}
.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: translate(1em, -1em) scale(0);
  transform-origin: right;
}
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: translate(0em, 0em) scale(1);
}

@media screen and (max-width: 500px) {
  div {
    padding: 0 0em 1.5em 0em;
  }
  .export_fun {
    top: 3.2em;
    right: 2.5em;
  }
}
</style>
