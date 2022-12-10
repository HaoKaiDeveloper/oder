<template>
  <div class="sidebar flex-column" :class="addActive">
    <div class="logo">
      <img src="../../assets/logo192.png" alt="logo" />
    </div>

    <div class="toggle_btn" :class="addActive" @click="toggleActive">
      <span><font-awesome-icon icon="fa-solid fa-align-right" /></span>
    </div>

    <ul>
      <li>
        <router-link to="home">
          <span><font-awesome-icon icon="fa-solid fa-house" /></span>
          <p>首頁</p>
        </router-link>
      </li>
      <li>
        <router-link to="orderList">
          <span><font-awesome-icon icon="fa-solid fa-rectangle-list" /></span>
          <p>所有訂單</p>
        </router-link>
      </li>
      <li>
        <router-link to="productList">
          <span><font-awesome-icon icon="fa-solid fa-boxes-stacked" /></span>
          <p>所有商品</p>
        </router-link>
      </li>
      <li>
        <router-link to="myStore">
          <span><font-awesome-icon icon="fa-solid fa-shop" /></span>
          <p>店家資訊</p>
        </router-link>
      </li>
    </ul>

    <div class="funBtn" @click="logout">
      <span><font-awesome-icon icon="fa-solid fa-right-from-bracket" /> </span>
      <p>登出</p>
    </div>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
export default {
  emits: ["toggle-active"],
  setup(props, context) {
    const store = useStore();
    const router = useRouter();
    const active = ref(false);

    const addActive = computed(function () {
      if (active.value) {
        return "active";
      }
    });
    function toggleActive() {
      active.value = !active.value;
      context.emit("toggle-active", addActive);
    }

    function logout() {
      store.commit("storeUser/logout");
      router.replace({ path: "/auth" });
    }

    return {
      addActive,
      toggleActive,
      logout,
    };
  },
};
</script>

<style scoped>
.sidebar {
  border-radius: 1.5em;
  width: 20em;
  height: 100%;
  min-height: 50em;
  background-color: var(--grey-0);
  padding: 1em 1.5em;
  align-items: flex-start;
  position: fixed;
  top: 0;
  left: 0;
  transition: all 0.5s;
  box-shadow: var(--box-shadow-1);
}

@media screen and (min-width: 2000px) {
  .sidebar {
    position: relative;
  }
}

@media screen and (max-width: 720px) {
  .sidebar {
    display: none;
  }
}

.toggle_btn {
  position: absolute;
  top: 1em;
  right: 1em;
  transform: rotate(180deg);
  cursor: pointer;
}
.toggle_btn span {
  font-size: var(--font-xlarge);
  color: var(--primary-1);
}

.toggle_btn span:hover {
  color: var(--primary-3);
}

.toggle_btn.active {
  transform: rotate(0deg);
}

.logo {
  width: 4.5em;
  height: 4.5em;
  margin: 4em 0 3em 0;
  align-self: center;
}

ul {
  flex: 1;
  width: 100%;
}

ul a,
.funBtn {
  width: 100%;
  padding: 0.7em 1.2em;
  font-size: 1.5rem;
  letter-spacing: 0.2em;
  background-color: var(--grey-50);
  margin-bottom: 1em;
  border-radius: 0.7em;
  color: var(--grey-200);
  display: flex;
  align-items: center;
  cursor: pointer;
}

a p,
.funBtn p {
  display: block;
  overflow: hidden;
  white-space: nowrap;
  width: 100%;
}

a span,
.funBtn span {
  margin-right: 0.8em;
  font-size: 1.6rem;
  display: flex;
  align-items: center;
  color: var(--grey-200);
}

.router-link-active {
  color: var(--grey-200);
}

.router-link-active span {
  color: var(--primary-3);
}
.funBtn {
  width: 100%;
}

.toggle {
  width: 2.5rem;
  height: 3px;
  background-color: var(--primary-4);
  transition: all 0.5s;
}

.sidebar.active {
  width: 7em;
}

.sidebar.active a,
.sidebar.active .funBtn {
  justify-content: center;
}

.sidebar.active a span,
.sidebar.active .funBtn span {
  margin-right: 0;
}

.sidebar.active a p,
.sidebar.active .funBtn p {
  width: 0;
}
</style>
