<template>
  <main>
    <div class="popBackground back"></div>

    <div class="info">
      <h1>{{ info.title }}</h1>
      <component :is="showComponent" />
      <div class="btns" v-if="!runApi">
        <base-button-2 type="button" @click="checkFun">確認</base-button-2>
        <base-button-2 type="button" @click="closePopup">取消</base-button-2>
      </div>
    </div>
  </main>
</template>

<script>
import { ref, computed } from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import Loading from "../UI/Loading.vue";
import SuccessMsg from "../UI/SuccessMsg.vue";
import ErrorMsg from "../UI/ErrorMsg.vue";
import { host } from "../../utils/RouteApi";
import io from "socket.io-client";
const socket = io.connect(host);

export default {
  components: { Loading, SuccessMsg, ErrorMsg },
  props: ["info", "storeId"],
  emits: ["close-popup", "close-form"],
  setup(props, context) {
    const router = useRouter();
    const isLoading = ref(false);
    const success = ref(false);
    const error = ref(false);
    const runApi = ref(false);
    const store = useStore();

    const showComponent = computed(() => {
      if (isLoading.value) {
        return Loading;
      } else if (success.value) {
        return SuccessMsg;
      } else if (error.value) {
        return ErrorMsg;
      }
    });

    function closePopup() {
      context.emit("close-popup", {
        title: "",
        info: "",
        funName: "",
      });
    }

    async function checkFun() {
      const { info, funName } = props.info;

      runApi.value = true;
      isLoading.value = true;
      try {
        if (funName === "soldOut") {
          await store.dispatch("product/soldOutProduct", info);
        } else if (funName === "deleteProduct") {
          await store.dispatch("product/deleteProduct", info);
        } else if (funName === "editProduct") {
          await store.dispatch("product/updataProduct", info);
        } else if (funName === "completOrder") {
          await store.dispatch("order/completeOrder", info);
        } else if (funName === "paidOrder") {
          await store.dispatch("order/paidOrder", info);
        } else if (funName === "deleteOrder") {
          await store.dispatch("order/deleteOrder", info);
        } else if (funName === "addNewOrder") {
          const neworder = await store.dispatch("order/createNewOrder", info);
          socket.emit("join_room", props.storeId);
          socket.emit("send_neworder", neworder);
        } else if (funName === "postingOrder") {
          store.commit("order/reSetFilter");
          await store.dispatch("order/postingOrder");
          await store.dispatch("order/firstGetLise");
        }
        isLoading.value = false;
        success.value = true;
        setTimeout(() => {
          closePopup();
          context.emit("close-form");
          success.value = false;
          runApi.value = false;
          if (funName === "addNewOrder") {
            localStorage.removeItem("cart");
            router.replace(`/shop/${info.storeId}`);
          }
        }, 1500);
      } catch (err) {
        isLoading.value = false;
        error.value = true;
        setTimeout(() => {
          closePopup();
          context.emit("close-form");
          error.value = false;
          runApi.value = false;
        }, 1500);
      }
    }

    return {
      closePopup,
      checkFun,
      isLoading,
      showComponent,
      runApi,
    };
  },
};
</script>

<style scoped>
.back {
  z-index: 5;
}
.info {
  width: 20rem;
  height: 10rem;
  background-color: var(--grey-0);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 6;
  padding: 1rem;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.info .isLoading,
.info .successMsg,
.info .errorMsg {
  margin-top: 10px;
}

h1 {
  font-size: 1.6rem;
  color: var(--grey-200);
}

.btns {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 2rem;
}
</style>
