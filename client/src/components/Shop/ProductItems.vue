<template>
  <section v-if="productList.length > 0">
    <div
      v-for="product in productList"
      :key="product._id"
      class="item flex-column"
      :class="{ soleOut: product.soleOut }"
    >
      <div class="imgs">
        <SwiperImgs :imgs="product.imgs" />
      </div>

      <div class="base_info">
        <p class="productName">
          <span>{{ product.productName }}</span>
        </p>
        <p class="price">
          NT. <span>{{ product.price }}</span>
        </p>
      </div>

      <div class="btns">
        <base-button v-if="product.soldOut">完售</base-button>
        <base-button type="button" @click="addTocard(product._id)" v-else>
          加入購物車
        </base-button>

        <span @click="showProductInfo(product._id)">詳細資訊</span>
      </div>
    </div>
  </section>
</template>

<script>
import { host } from "../../utils/RouteApi";
import SwiperImgs from "../UI/SwiperImgs.vue";

export default {
  props: ["productList"],
  emits: ["add_to_cart", "show-product-info"],
  components: {
    SwiperImgs,
  },
  setup(props, context) {
    const serverUrl = host;

    function addTocard(productId) {
      const check = props.productList.find((p) => p._id === productId);
      if (!check) {
        return;
      }
      context.emit("add_to_cart", productId);
    }

    function showProductInfo(id) {
      context.emit("show-product-info", id);
    }

    return {
      serverUrl,
      addTocard,
      showProductInfo,
    };
  },
};
</script>

<style scoped>
section {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fit, 28em);
  justify-content: center;
  gap: 2em;
}
.item {
  width: 28em;
  height: 35em;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: var(--box-shadow-1);
  align-items: center;
  gap: 0.7em;
}
.imgs {
  width: 100%;
  height: 80%;
  max-height: 27.3em;
  background-color: var(--grey-50);
}

.base_info,
.btns {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1em;
}
.btns span {
  cursor: pointer;
}
.base_info p {
  font-size: var(--font-medium);
  color: var(--grey-200);
  letter-spacing: 1px;
  font-weight: 500;
}
.productName {
  flex: 1;
  white-space: nowrap;
  overflow: hidden;
}
.productName span {
  font-size: var(--font-large);
}
.soleOut {
  opacity: 0.4;
}

@media screen and (max-width: 400px) {
  section {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.1em;
  }
  .item {
    flex-direction: row;
    width: 100%;
    height: auto;
    border-radius: 0;
    padding: 0.7em 0.5em;
    gap: 0;
  }
  .imgs,
  .img_box {
    width: 90px;
    height: 60px;
  }

  .base_info,
  .btns {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.7em;
  }
  .base_info {
    max-width: 40%;
    overflow: hidden;
  }

  .productName span,
  .base_info p {
    font-size: var(--font-small);
  }

  .btns {
    align-items: flex-end;
  }
  .btns button {
    order: 1;
  }
  .btns span {
    transform: translateX(-0.5em);
  }
}
</style>
