<template>
  <section class="grid-center">
    <transition>
      <form v-if="isLoading" class="flex-column">
        <div class="header_container" @click="clickUplodImg">
          <div class="header flex-row">
            <img v-if="storeInfo.headerImg" :src="headerSrc" alt="header" />
            <span class="headerIcon" v-else>
              <font-awesome-icon icon="fa-solid fa-user" />
            </span>
          </div>
          <input type="file" ref="imgInput" @change="uploadImg" />

          <span class="cameraIcon" v-if="isEditing"
            ><font-awesome-icon icon="fa-solid fa-camera"
          /></span>
        </div>

        <main>
          <label for="storeName">店家名稱:</label>
          <input
            type="text"
            id="storeName"
            v-model="storeInfo.storeName"
            :disabled="!isEditing"
          />
        </main>

        <main>
          <label for="phoneNumber">連絡電話:</label>
          <input
            type="text"
            id="phoneNumber"
            v-model="storeInfo.phoneNumber"
            :disabled="!isEditing"
          />
        </main>

        <main>
          <label for="email">Email:</label>
          <input
            type="text"
            id="email"
            v-model="storeInfo.email"
            :disabled="!isEditing"
          />
        </main>

        <main>
          <label for="address">商家地址:</label>
          <input
            type="text"
            id="address"
            v-model="storeInfo.address"
            :disabled="!isEditing"
          />
        </main>

        <base-button-2 type="button" @click="submitData">{{
          editBtnText
        }}</base-button-2>

        <div>
          <p>我的商店:</p>
          <a :href="myShopUrl" target="_blank">{{ myShopUrl }}</a>
        </div>
      </form>
    </transition>
  </section>
</template>

<script>
import { host } from "../../utils/RouteApi";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { FormInput } from "../../components/ProductList/index.js";

export default {
  components: { FormInput },
  setup() {
    const store = useStore();
    const storeInfo = ref({});
    const storeId = store.getters["storeUser/storeId"];
    const isEditing = ref(false);
    const imgInput = ref(null);
    const isLoading = ref(false);

    getData();
    async function getData() {
      const [user, _] = await Promise.all([
        store.dispatch("storeUser/getStoreData", storeId),
        store.dispatch("order/firstGetLise"),
      ]);
      storeInfo.value = user;
      isLoading.value = true;
    }

    const editBtnText = computed(() => {
      if (!isEditing.value) {
        return "編輯";
      } else {
        return "確定更改";
      }
    });

    const myShopUrl = computed(() => {
      return ` http://localhost:8080/shop/${storeId}`;
    });

    const headerSrc = computed(() => {
      if (
        storeInfo.value.headerImg &&
        typeof storeInfo.value.headerImg === "string"
      ) {
        return `${host}/${storeInfo.value.headerImg}`;
      } else {
        return "";
      }
    });

    function clickUplodImg() {
      if (!isEditing.value) return;
      imgInput.value.click();
    }

    async function uploadImg(e) {
      const file = e.target.files[0];
      await store.dispatch("storeUser/uploadHeaderImg", file);
      storeInfo.value = JSON.parse(localStorage.getItem("storeUser"));
    }

    async function submitData() {
      if (!isEditing.value) {
        return (isEditing.value = true);
      } else {
        isEditing.value = false;
        const { newStore } = await store.dispatch(
          "storeUser/updateStoreInfo",
          storeInfo.value
        );
        storeInfo.value = newStore;
      }
    }

    return {
      storeInfo,
      isEditing,
      submitData,
      editBtnText,
      clickUplodImg,
      uploadImg,
      imgInput,
      headerSrc,
      myShopUrl,
      storeId,
      isLoading,
    };
  },
};
</script>

<style scoped>
section {
  width: 100%;
  height: 100%;
  padding: 1rem;
  overflow: hidden;
}

form {
  align-items: center;
  width: 100%;
  max-width: 50em;
  min-width: 20em;
  padding: 3em 5em;
  background-color: var(--grey-0);
  border-radius: 2em;
  box-shadow: var(--box-shadow-1);
  word-break: break-all;
  transition: all 0.3s;
}

a {
  color: var(--primary-2);
  border-bottom: 1px solid var(--primary-2);
}

.header_container {
  width: 10em;
  height: 10em;
  position: relative;
  margin-bottom: 3em;
  cursor: pointer;
}
.header {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: var(--grey-50);
  justify-content: center;
  overflow: hidden;
}
.headerIcon {
  font-size: 3em;
  color: var(--grey-100);
}

.cameraIcon {
  font-size: 2em;
  color: var(--grey-100);
  position: absolute;
  bottom: 0em;
  right: 0em;
  z-index: 2;
}

img {
  object-fit: cover;
}

input[type="file"] {
  display: none;
}

main {
  width: 100%;
  margin-bottom: 1.2em;
}

main label {
  display: block;
  margin-bottom: 0.7em;
  font-size: 1.4rem;
  letter-spacing: 0.1em;
  color: var(--grey-100);
}
main input {
  width: 100%;
  padding: 0.6em 1.2em;
  font-size: 1.4rem;
  letter-spacing: 0.2em;
  border: none;
  border-radius: 2em;
  background-color: var(--primary-1);
  outline: none;
}

.v-enter-from {
  transform: translateY(5em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s ease;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 500px) {
  form {
    padding: 3em 1em;
  }
  .header_container {
    width: 7em;
    height: 7em;
    position: relative;
    margin-bottom: 3em;
    cursor: pointer;
  }
  main input {
    padding: 0.7em 1em;
  }
}
</style>
