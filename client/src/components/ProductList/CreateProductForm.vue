<template>
  <div class="createForm">
    <transition name="back">
      <div v-if="show" @click="closeForm" class="popBackground"></div>
    </transition>

    <transition name="form">
      <base-form v-if="show" @submit.prevent="submitData">
        <h1>{{ title }}</h1>

        <form-input
          forValue="productName"
          name="名稱"
          type="text"
          :inputValue="productData.productName"
          @value-change="changeData"
        >
        </form-input>

        <form-input
          forValue="price"
          name="售價"
          type="number"
          :inputValue="productData.price"
          @value-change="changeData"
        >
        </form-input>

        <form-input
          forValue="category"
          name="類別"
          type="text"
          :inputValue="productData.category"
          @value-change="changeData"
        >
        </form-input>

        <form-input
          forValue="description"
          name="介紹"
          :textarea="true"
          :inputValue="productData.description"
          @value-change="changeData"
        >
        </form-input>

        <img-container
          :serverUrl="serverUrl"
          :tempProductImgs="tempProductImgs"
          @delete-img="deleteProductImg"
          @upload="uploadProductImg"
        ></img-container>

        <div class="btns flex-row" :class="{ loading: isLoading }">
          <loading v-if="isLoading"></loading>
          <base-button-2 type="submit" v-else>確認上傳</base-button-2>
        </div>
      </base-form>
    </transition>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed } from "vue";
import { host } from "../../utils/RouteApi";
import FormInput from "./FormInput.vue";
import imgContainer from "./FormImgs.vue";
import BaseForm from "./Base_Form.vue";
import Loading from "../UI/Loading.vue";

export default {
  props: ["show", "title"],
  emits: ["close-form"],
  components: { FormInput, imgContainer, BaseForm, Loading },
  setup(props, context) {
    const store = useStore();
    const serverUrl = host;
    const tempProductImgs = computed(() => {
      return store.getters["product/uploadProductImg"];
    });
    const isLoading = ref(false);
    const productData = reactive({
      productName: "",
      price: "",
      category: "",
      description: "",
    });
    const error = ref("");

    function changeData(value) {
      const name = value[1];
      const inputValue = value[0];
      productData[name] = inputValue;
    }

    function closeForm() {
      context.emit("close-form", false);
    }

    async function uploadProductImg(e) {
      const imgFile = e.target.files[0];
      await store.dispatch("product/uploadImg", imgFile);
    }

    async function deleteProductImg(url) {
      await store.dispatch("product/deleteImg", url);
    }

    async function submitData() {
      if (!productData.productName || !productData.price) return;
      isLoading.value = true;
      try {
        await store.dispatch("product/createProduct", productData);
        productData.productName = "";
        productData.price = "";
        productData.category = "";
        productData.description = "";
      } catch (err) {
        error.value = err.message || "錯誤!請稍後再試";
        if (error.value) {
          setTimeout(() => {
            error.value = "";
          }, 3000);
        }
      }
      isLoading.value = false;
    }

    return {
      productData,
      closeForm,
      submitData,
      uploadProductImg,
      deleteProductImg,
      tempProductImgs,
      serverUrl,
      changeData,
      isLoading,
    };
  },
};
</script>

<style scoped>
.btns {
  margin-top: 3em;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1em;
}

h1 {
  margin-bottom: 1em;
  color: var(--grey-200);
}
.btns.loading {
  justify-content: center;
}

.back-enter-active {
  animation: back 0.5s ease-out;
}
.back-leave-active {
  animation: back 0.2s ease-out reverse;
}
.form-enter-active {
  animation: modal 0.5s ease-out;
}
.form-leave-active {
  animation: modal 0.2s ease-out reverse;
}
@keyframes modal {
  from {
    opacity: 0.2;
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
</style>
