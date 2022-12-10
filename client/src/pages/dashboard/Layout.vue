<template>
  <div class="dashbord_container" :class="modeClass">
    <sidebar @toggle-active="toggleSidebar"></sidebar>

    <small-sidebar
      :show="showSmallSidebar"
      @closeSmallSidebar="toggleSmallSidebar"
    ></small-sidebar>

    <div class="shopinfo">
      <dashboard-header
        :headerImg="headerSrc"
        :storeName="storeName"
        @toggle-mode="toggleMode"
        @open-small-sidebar="toggleSmallSidebar"
        :show="showSmallSidebar"
        :darkMode="darkMode"
      ></dashboard-header>
    </div>

    <div class="dashbord_view">
      <router-view v-slot="{ Component }">
        <transition>
          <component :is="Component"></component>
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script>
import { ref, onBeforeMount, computed } from "vue";
import io from "socket.io-client";
import {
  DashboardHeader,
  Sidebar,
  SmallSidebar,
} from "../../components/layout/index.js";
import { host } from "../../utils/RouteApi";
import { useStore } from "vuex";
const socket = io.connect(host);
export default {
  components: {
    DashboardHeader,
    Sidebar,
    SmallSidebar,
  },
  setup() {
    document.title = "Order | Dashboard";
    const store = useStore();
    const storeId = JSON.parse(localStorage.getItem("storeUser"))._id;
    const sidebarActive = ref(false);
    const storeName = computed(() => {
      return store.getters["storeUser/storeName"];
    });
    const showSmallSidebar = ref(false);
    const darkMode = ref(false);

    onBeforeMount(() => {
      store.commit("storeUser/setBasicData");
      socket.emit("join_room", storeId);
      socket.on("receive_neworder", (data) => {
        store.commit("order/addNewOrder", data);
      });
    });

    const headerSrc = computed(() => {
      const header = store.getters["storeUser/storeHeaderImg"];
      if (header && typeof header === "string") {
        return `${host}/${header}`;
      } else {
        return "";
      }
    });

    const modeClass = computed(() => {
      let result = "dashbord_container";

      if (darkMode.value) {
        result = `${result} dark`;
      }
      if (sidebarActive.value) {
        result = `${result} active`;
      }
      return result;
    });

    function toggleSidebar(data) {
      sidebarActive.value = data.value;
      if (!sidebarActive.value) {
        sidebarActive.value = "";
      }
    }

    function toggleMode() {
      darkMode.value = !darkMode.value;
    }

    function toggleSmallSidebar(value) {
      showSmallSidebar.value = value;
    }

    return {
      headerSrc,
      storeName,
      toggleSidebar,
      sidebarActive,
      showSmallSidebar,
      toggleSmallSidebar,
      modeClass,
      toggleMode,
      darkMode,
    };
  },
};
</script>

<style scoped>
.dashbord_container {
  max-width: 2000px;
  margin: 0 auto;
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: min-content 1fr;
  grid-template-rows: min-content 1fr;
  gap: 2em;
  padding: 1em 2em 1em 20em;
  transition: all 0.5s;
  position: relative;
  background-color: var(--dash-background);
}
.dashbord_container.active {
  padding-left: 7em;
}

.dashbord_view {
  grid-column: 2/-1;
  grid-row: 2/3;
}

.shopinfo {
  grid-column: 2/3;
  grid-row: 1/2;
  padding: 1em 1.5em;
  gap: 1rem;
  background-color: var(--grey-0);
  border-radius: 1em;
}

.small_sidebar {
  width: 0;
  height: 0;
}

.v-leave-from {
  opacity: 1;
  transform: translateY(0em);
}
.v-leave-active {
  transition: all 0.5s ease;
}
.v-leave-to {
  opacity: 0.2;
  transform: translateY(3em);
}

@media screen and (min-width: 2000px) {
  .dashbord_container {
    padding: 1em 2em 1em 2em;
  }

  .dashbord_container.active {
    padding-left: 0em;
  }

  .sidebar {
    grid-column: 1/2;
    grid-row: 1/3;
  }
}

@media screen and (max-width: 720px) {
  .dashbord_container {
    width: 100%;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr;
    grid-template-rows: 6em 1fr;
    row-gap: 1em;
    padding: 1rem;
    transition: all 0.5s;
    position: relative;
  }

  .dashbord_container.active {
    padding-left: 1em;
  }

  .dashbord_view {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  .shopinfo {
    grid-column: 1/-1;
    grid-row: 1/2;
    padding: 2em 2em;
  }
}
@media screen and (max-width: 500px) {
  .dashbord_container {
    padding: 1em 0.5em;
  }

  .shopinfo {
    padding: 1em 0.5em;
  }
}
</style>
