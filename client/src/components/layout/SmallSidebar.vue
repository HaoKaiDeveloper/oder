<template>
  <div class="small_sidebar sidebar">
    <transition name="back">
      <div class="background" @click="closeSmallSidebar" v-if="show"></div>
    </transition>

    <transition name="nav">
      <main class="fixed-center flex-column" v-if="show">
        <div class="logo">
          <img src="../../assets/logo192.png" alt="logo" />
        </div>
        <ul>
          <li
            v-for="link in routerData"
            :key="link.text"
            @click="closeSmallSidebar"
          >
            <router-link :to="link.to">
              <span><font-awesome-icon :icon="link.icon" /></span>
              <p>{{ link.text }}</p>
            </router-link>
          </li>
        </ul>

        <div class="funBtn" @click="logout">
          <span
            ><font-awesome-icon icon="fa-solid fa-right-from-bracket" />
          </span>
          <p>登出</p>
        </div>
      </main>
    </transition>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { useRouter } from "vue-router";

export default {
  props: ["show"],
  emits: ["close-small-sidebar"],
  setup(props, context) {
    const store = useStore();
    const router = useRouter();

    function closeSmallSidebar() {
      context.emit("close-small-sidebar", false);
    }
    const routerData = [
      {
        icon: "fa-solid fa-house",
        text: "首頁",
        to: "home",
      },
      {
        icon: "fa-solid fa-rectangle-list",
        text: "所有訂單",
        to: "orderList",
      },
      {
        icon: "fa-solid fa-boxes-stacked",
        text: "所有商品",
        to: "productList",
      },
      {
        icon: "fa-solid fa-shop",
        text: "店家資訊",
        to: "myStore",
      },
    ];

    function logout() {
      store.commit("storeUser/logout");
      router.replace({ path: "/auth" });
    }

    return {
      closeSmallSidebar,
      routerData,
      logout,
    };
  },
};
</script>

<style scoped>
.background {
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #2d2d2d;
  opacity: 0.4;
  z-index: 9;
}
main {
  width: 95%;
  max-width: 30em;
  min-width: 23em;
  height: 80vh;
  min-height: 40em;
  background-color: var(--grey-0);
  z-index: 9;
  border-radius: 1em;
  align-items: center;
  justify-content: space-between;
  padding: 2em;
}

.logo {
  width: 4em;
  height: 4em;
  margin-bottom: 2em;
}
img {
  object-fit: cover;
}

ul {
  flex: 1;
}

ul,
.funBtn {
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
  margin-bottom: 1em;
}

.back-enter-active {
  animation: back 0.5s ease-out;
}
.back-leave-active {
  animation: back 0.5s ease-out reverse;
}
.nav-enter-active {
  animation: modal 0.5s ease-out;
}
.nav-leave-active {
  animation: modal 0.2s ease-out reverse;
}
@keyframes modal {
  from {
    opacity: 0;
    top: 55%;
  }
  to {
    opacity: 1;
    top: 50%;
  }
}
@keyframes back {
  from {
    opacity: 0;
  }
  to {
    opacity: 0.4;
  }
}
@media screen and (min-width: 1500px) {
  main {
    max-width: 50em;
  }
}
</style>
