<template>
  <section class="flex-row">
    <div class="header flex-row">
      <img :src="headerImg" alt="img" v-if="headerImg" />
      <div v-else>
        <span>
          <font-awesome-icon icon="fa-solid fa-user" />
        </span>
      </div>
    </div>

    <p class="name">{{ storeName }}</p>
    <DateComponent />

    <button type="button" @click="toggleMode" class="mode_btn">
      <font-awesome-icon
        icon="fa-regular fa-moon"
        v-if="darkMode"
        class="dark"
      />
      <font-awesome-icon
        icon="fa-solid fa-circle-half-stroke"
        v-else
        class="light"
      />
    </button>

    <span class="bell" @click="togglePrompt" :class="{ active: newMsg }">
      <font-awesome-icon icon="fa-regular fa-bell" class="icon" />
    </span>

    <span class="toggle" :class="{ active: show }"
      ><font-awesome-icon
        icon="fa-solid fa-align-right"
        @click="openSmallSidebar"
    /></span>
    <prompt :show="showPrompt" :list="newList"></prompt>
  </section>
</template>

<script>
import { ref, computed, watch } from "vue";
import { useStore } from "vuex";
import DateComponent from "./Date.vue";
import Prompt from "./prompt.vue";
export default {
  props: ["headerImg", "storeName", "show", "darkMode"],
  components: {
    DateComponent,
    Prompt,
  },
  emits: ["open-small-sidebar", "toggle-mode"],
  setup(props, context) {
    const store = useStore();
    const origOrderList = computed(() => {
      return store.getters["order/origOrderList"];
    });
    const newList = ref([]);
    const localPrompt = localStorage.getItem("promptMsg");
    const prompt = ref({
      orderNum: 0,
      newNum: 0,
    });
    const newMsg = ref(false);
    const showPrompt = ref(false);

    if (localPrompt) {
      prompt.value = JSON.parse(localPrompt);
    } else {
      localStorage.setItem("promptMsg", JSON.stringify(prompt.value));
    }

    function openSmallSidebar() {
      context.emit("open-small-sidebar", true);
    }
    function toggleMode() {
      context.emit("toggle-mode");
    }

    function togglePrompt() {
      showPrompt.value = !showPrompt.value;
      if (!showPrompt.value) {
        newList.value.forEach((o) => {
          o.newMsg = false;
        });
        newMsg.value = false;
      }
    }
    function setNewOrder(list) {
      const oldNum = JSON.parse(localStorage.getItem("promptMsg")).orderNum;
      const orderNum = list.length;
      const newNum = orderNum - Number(oldNum);
      const oneDay = 1000 * 60 * 60 * 24;
      const now = new Date().getTime();
      if (newNum < 0) return;
      if (newNum > 0 || orderNum > 0) {
        list.forEach((o) => {
          const createTime = new Date(o.createdAt);
          const getTime = createTime.getTime();
          if (now - getTime < oneDay) {
            let hours = createTime.getHours();
            let minute = createTime.getMinutes();
            if (hours < 10) {
              hours = `0${hours}`;
            }
            if (minute < 10) {
              minute = `0${minute}`;
            }
            o.time = `${hours} : ${minute}`;
          } else {
            o.time = "幾天前";
          }
          o.timpstamp = createTime;
        });
        const sortList = list.sort((a, b) => {
          return b.timpstamp - a.timpstamp;
        });
        prompt.value = { orderNum: orderNum };
        localStorage.setItem("promptMsg", JSON.stringify(prompt.value));
        if (newNum > 0) {
          sortList.slice(0, 10).forEach((o, index) => {
            if (index < newNum) {
              o.newMsg = true;
            }
          });
          newMsg.value = true;
        }

        newList.value = sortList;
      }
    }

    watch(origOrderList, () => {
      setNewOrder(origOrderList.value);
    });

    return {
      openSmallSidebar,
      origOrderList,
      newList,
      togglePrompt,
      showPrompt,
      prompt,
      newMsg,
      toggleMode,
    };
  },
};
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 1.5em;
  position: relative;
}
.name {
  flex: 1;
  letter-spacing: 1.5px;
  font-size: var(--font-large);
  color: var(--grey-200);
  font-weight: 600;
  word-break: break-all;
}

.header {
  width: 5em;
  height: 5em;
  background-color: var(--grey-50);
  border-radius: 1.2em;
  overflow: hidden;
  justify-content: center;
}

.header span {
  color: var(--grey-100);
  font-size: 1.8rem;
}

img {
  object-fit: cover;
}

.bell {
  font-size: 2.2em;
  color: var(--grey-100);
  border: none;
  border-radius: 0.2em;
  padding: 0.1em 0.2em;
  cursor: pointer;
  position: relative;
  transition: all 0.5s;
}
.bell.active {
  background-color: var(--primary-4);
  color: var(--grey-0);
}
.bell.active .icon {
  animation: bell 0.5s ease infinite;
}

.mode_btn {
  background-color: transparent;
  font-size: 1.8rem;
  border: none;
  cursor: pointer;
}

.light {
  color: #ffc107;
}
.dark {
  color: #c5cae9;
}
@keyframes bell {
  0% {
    transform: rotate(10deg);
  }
  50% {
    transform: rotate(-10deg);
  }
  100% {
    transform: rotate(10deg);
  }
}

.toggle {
  font-size: 2em;
  color: var(--grey-100);
  display: none;
}
.toggle.active {
  color: var(--primary-3);
}
@media screen and (max-width: 720px) {
  .header {
    width: 4em;
    height: 4em;
    border-radius: 0.7em;
  }
  .name {
    font-size: var(--font-medium);
  }

  .bell {
    font-size: 1.8em;
  }
  .toggle {
    display: block;
  }
}
@media screen and (max-width: 350px) {
  section {
    gap: 1em;
    padding: 0 0;
  }
  .header {
    width: 3.5em;
    height: 3.5em;
    border-radius: 0.7em;
  }
}
</style>
