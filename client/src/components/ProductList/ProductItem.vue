<template>
  <base-card class="product_list">
    <template #title>所有商品</template>
    <template #default>
      <div class="info">
        <div class="p_title">
          <div class="img_box"></div>
          <span class="name">名稱</span>
          <span>單價</span>
          <span>分類</span>
          <span>狀態</span>
          <span>管理</span>
        </div>

        <div
          v-if="productList.length > 0"
          class="product_container scroll-box flex-column"
        >
          <div class="product" v-for="p in productList" :key="p._id">
            <div class="imgs">
              <SwiperImgs :imgs="p.imgs" :small="true" />
            </div>

            <p class="name">
              {{ p.productName }}
            </p>
            <p class="price">
              {{ p.price }}
            </p>
            <p class="category">
              {{ p.category }}
            </p>

            <p v-if="p.soldOut" class="state">
              <span class="soldOut"></span> 停售中
            </p>
            <p v-else class="state"><span></span> 銷售中</p>
            <p class="detaile_btn" @click="toggleEditForm(p._id)">詳細資訊</p>
          </div>
        </div>
        <span v-else>無相關產品</span>
      </div>
    </template>
  </base-card>
</template>

<script>
import { useStore } from "vuex";
import SwiperImgs from "../UI/SwiperImgs.vue";
import Layout from "../../pages/dashboard/Layout.vue";
export default {
  props: ["productList", "isLoading"],
  emits: ["toggle-edit-form"],
  components: {
    SwiperImgs,
    Layout,
  },
  setup(props, context) {
    const store = useStore();

    function toggleEditForm(id) {
      context.emit("toggle-edit-form", id);
    }

    async function soldOut(id) {
      await store.dispatch("product/soldOutProduct", id);
    }

    async function deleteProduct(id) {
      await store.dispatch("product/deleteProduct", id);
    }

    return {
      toggleEditForm,
      soldOut,
      deleteProduct,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
}

.isLoading {
  margin: 0 auto;
}

.product_container {
  min-height: 25em;
  max-height: 60em;
  gap: 1em;
}

.p_title {
  width: 100%;
  border-bottom: var(--border-1);
  font-size: var(--font-medium);
  color: var(--grey-200);
  font-weight: 600;
  padding-bottom: 0.5em;
  margin: 2em 0 1em 0;
}

.p_title span {
  width: 60px;
  word-break: break-all;
}

.p_title .img_box {
  background-color: transparent;
  height: 2px;
}

.product,
.p_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

p {
  color: var(--grey-200);
  width: 60px;
  word-break: break-all;
  font-size: var(--font-small);
  display: flex;
  align-items: center;
  gap: 0.5em;
}
.name,
span.name {
  width: 200px;
}
.product span {
  display: block;
  width: 0.8em;
  height: 0.8em;
  background-color: var(--primary-3);
  box-shadow: 0 0 3px var(--primary-3);
  border-radius: 50%;
}

.product .soldOut {
  background-color: #ec407a;
  box-shadow: 0 0 3px #ec407a;
}
.imgs {
  width: 120px;
  height: 70px;
  border-radius: 0.5em;
}

.detaile_btn {
  cursor: pointer;
}

@media screen and (max-width: 1100px) {
  .p_title .box {
    min-width: 120px;
  }
}
@media screen and (max-width: 600px) {
  .product_list {
    overflow-x: auto;
  }
  .info {
    min-width: 52em;
  }

  .product_container,
  .p_title {
    width: 650px;
  }
}
</style>
