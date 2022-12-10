<template>
  <div class="productList_page">
    <transition name="left">
      <produect-filter
        :categories="categories"
        :storeId="storeId"
        v-if="isLoading"
      ></produect-filter>
    </transition>

    <transition name="right">
      <create-btn @openForm="toggleCreating" v-if="isLoading"></create-btn>
    </transition>

    <transition name="left">
      <product-item
        :productList="productList"
        @toggle-edit-form="toggleEditForm"
        v-if="isLoading"
      ></product-item>
    </transition>

    <analyze-cagtegory
      :origOrderList="origOrderList"
      :open="isLoading"
    ></analyze-cagtegory>

    <analyze-product
      :origOrderList="origOrderList"
      :open="isLoading"
    ></analyze-product>

    <!-- 新增 -->
    <create-product-form
      :show="creating"
      @close-form="toggleCreating"
      title="新增商品"
    ></create-product-form>

    <!-- 編輯 -->
    <edit-product-form
      :show="editing"
      :data="editProductData"
      @close-edit-form="closEeditForm"
    >
    </edit-product-form>
  </div>
</template>

<script>
import { useStore } from "vuex";
import { ref, computed } from "vue";
import {
  AnalyzeCagtegory,
  AnalyzeProduct,
  CreateBtn,
  CreateProductForm,
  EditProductForm,
  ProductItem,
  ProduectFilter,
} from "../../components/ProductList/index.js";

export default {
  components: {
    AnalyzeCagtegory,
    AnalyzeProduct,
    CreateBtn,
    CreateProductForm,
    EditProductForm,
    ProductItem,
    ProduectFilter,
  },
  setup() {
    const store = useStore();
    const storeId = store.getters["storeUser/storeId"];
    const creating = ref(false);
    const isLoading = ref(false);
    const productList = computed(() => {
      return store.getters["product/productList"];
    });
    const categories = computed(() => {
      return store.getters["product/categories"];
    });
    const origOrderList = computed(() => {
      return store.getters["order/origOrderList"];
    });
    const editProductData = ref(null);
    const editing = ref(false);
    getList(storeId);

    async function getList(storeId) {
      await Promise.all([
        store.dispatch("order/firstGetLise"),
        store.dispatch("product/firstGetList", storeId),
      ]);
      isLoading.value = true;
    }

    function toggleEditForm(id) {
      editing.value = !editing.value;
      if (editing.value) {
        editProductData.value = productList.value.find((p) => p._id === id);
      }
    }

    function closEeditForm() {
      editing.value = false;
      editProductData.value = null;
    }

    function toggleCreating(value) {
      creating.value = value;
    }
    return {
      storeId,
      toggleCreating,
      creating,
      productList,
      categories,
      editing,
      closEeditForm,
      toggleEditForm,
      editProductData,
      origOrderList,
      isLoading,
    };
  },
};
</script>

<style scoped>
.productList_page {
  width: 100%;
  height: 100%;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: min-content min-content 1fr;
  gap: 2rem;
  position: relative;
  overflow: hidden;
}

.filter {
  grid-column: 1/4;
  grid-row: 1/2;
}

.create_btn {
  grid-column: 4/-1;
  grid-row: 1/2;
  justify-self: center;
  align-self: center;
}

.product_list {
  grid-column: 1/4;
  grid-row: 2/-1;
}

.chart_1 {
  grid-column: 4/-1;
  grid-row: 2/3;
  max-width: 25vw;
  max-height: 20em;
  background-color: var(--primary-3);
}

.chart_2 {
  grid-column: 4/-1;
  grid-row: 3/-1;
  max-width: 25vw;
}

.left-enter-from {
  transform: translateY(-5em);
  opacity: 0;
}
.left-enter-active {
  transition: all 0.5s ease-out;
}
.left-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

.right-enter-from {
  transform: translateY(5em);
  opacity: 0;
}
.right-enter-active {
  transition: all 0.5s ease-out;
}
.right-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 1100px) {
  .productList_page {
    grid-template-columns: repeat(4, 1fr);
    grid-template-rows: repeat(3, min-content) 1fr;
    gap: 1.5em;
  }

  .chart_1 {
    grid-column: 1/-1;
    grid-row: 1/2;
    max-width: 100vw;
  }

  .filter {
    grid-column: 1/4;
    grid-row: 2/3;
  }

  .create_btn {
    grid-column: 4/-1;
    grid-row: 2/3;
  }

  .product_list {
    grid-column: 1/-1;
    grid-row: 3/4;
  }
  .chart_2 {
    grid-column: 1/-1;
    grid-row: 4/5;
    max-width: 100vw;
  }
}
@media screen and (max-width: 600px) {
  .productList_page {
    grid-template-rows: repeat(auto-fit, min-content);
    gap: 1em;
  }
  .filter {
    grid-column: 1/-1;
    grid-row: 2/3;
  }

  .create_btn {
    grid-column: 4/-1;
    grid-row: 3/4;
    min-width: 11em;
  }
  .product_list {
    grid-column: 1/-1;
    grid-row: 4/5;
  }
  .chart_2 {
    grid-column: 1/-1;
    grid-row: 5/6;
  }
}
@media screen and (max-width: 400px) {
  .create_btn {
    grid-column: 1/2;
    transform: translateX(2em);
  }
}
</style>
