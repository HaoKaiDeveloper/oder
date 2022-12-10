<template>
  <div class="editForm">
    <transition name="back">
      <div v-if="show" @click="closeEditForm" class="popBackground"></div>
    </transition>

    <transition name="form">
      <base-form v-if="show">
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

        <div class="state">
          <label for="category">狀態 </label>
          <p v-if="productData.soldOut"><span class="soldOut"></span> 停售中</p>
          <p v-else><span></span> 銷售中</p>
        </div>

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

        <div class="btns flex-row">
          <base-button-2
            @click.prevent="
              showPopup(
                { ...productData, imgs: tempProductImgs },
                '確認編輯',
                'editProduct'
              )
            "
          >
            確定編輯
          </base-button-2>
          <base-button-2
            @click.prevent="
              showPopup(productData._id, '確認更改狀態', 'soldOut')
            "
          >
            {{ soldStateBtn }}
          </base-button-2>
          <base-button-2
            @click.prevent="
              showPopup(productData._id, '確認刪除', 'deleteProduct')
            "
          >
            刪除商品
          </base-button-2>
        </div>
      </base-form>
    </transition>
    <check-popup
      v-if="popupInfo.show"
      :info="popupInfo"
      @close-popup="closePopup"
      @close-form="closeEditForm"
    ></check-popup>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, reactive, computed, watch } from "vue";
import { host } from "../../utils/RouteApi";

import BaseForm from "./Base_Form.vue";
import CheckPopup from "./Check_Popup.vue";
import FormInput from "./FormInput.vue";
import imgContainer from "./FormImgs.vue";

export default {
  props: ["show", "data"],
  emits: ["close-edit-form"],
  components: {
    FormInput,
    CheckPopup,
    imgContainer,
    BaseForm,
  },
  setup(props, context) {
    const store = useStore();
    const serverUrl = host;
    const tempProductImgs = ref([]);
    const productData = reactive({
      _id: "",
      productName: "",
      price: "",
      category: "",
      description: "",
      imgs: [],
    });
    const error = ref("");
    const soldStateBtn = computed(() => {
      if (!props.data.soldOut) {
        return "停售";
      } else {
        return "恢復銷售";
      }
    });

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
    function changeData(value) {
      const name = value[1];
      const inputValue = value[0];
      productData[name] = inputValue;
    }

    function closeEditForm() {
      context.emit("close-edit-form", false);
    }

    async function uploadProductImg(e) {
      const imgFile = e.target.files[0];
      const imgs = await store.dispatch("product/updateProductImage", {
        _id: productData._id,
        img: imgFile,
        type: "addNewImg",
      });
      tempProductImgs.value = imgs;
    }

    async function deleteProductImg(url) {
      const imgs = await store.dispatch("product/deleteProductImg", {
        url: url,
        _id: productData._id,
      });
      tempProductImgs.value = imgs;
    }

    watch(props, () => {
      if (props.show) {
        Object.entries(props.data).forEach(([key, value]) => {
          productData[key] = value;
        });
        tempProductImgs.value = props.data.imgs;
      }
    });

    return {
      productData,
      closeEditForm,
      uploadProductImg,
      deleteProductImg,
      tempProductImgs,
      serverUrl,
      soldStateBtn,
      changeData,
      popupInfo,
      showPopup,
      closePopup,
    };
  },
};
</script>

<style scoped>
.state {
  color: var(--grey-200);
}
.state label {
  font-size: var(--font-medium);
  font-weight: 600;
}
.state p {
  margin: 0.5em 0;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: var(--font-small);
  font-weight: 600;
}

.state span {
  display: block;
  width: 0.8em;
  height: 0.8em;
  background-color: var(--primary-3);
  box-shadow: 0 0 3px var(--primary-3);
  border-radius: 50%;
}

.state .soldOut {
  background-color: #ec407a;
  box-shadow: 0 0 3px #ec407a;
}

@keyframes upload {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
.btns {
  margin-top: 3em;
  justify-content: flex-end;
  flex-wrap: wrap;
  gap: 1em;
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
