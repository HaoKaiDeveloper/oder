<template>
  <transition>
    <base-card class="product_list" table="table" v-if="open">
      <template #title>商品概況</template>
      <template #tabs>
        <base-button @click="setFilter('all')" :data="filter" target="all"
          >全部</base-button
        >
        <base-button @click="setFilter(true)" :data="filter" :target="true"
          >停售中</base-button
        >
        <base-button @click="setFilter(false)" :data="filter" :target="false"
          >銷售中</base-button
        >
      </template>

      <template #default>
        <div class="p_title">
          <div class="img_box"></div>
          <span class="name">名稱</span>
          <span>單價</span>
          <span>狀態</span>
        </div>

        <div
          v-if="productList.length > 0"
          class="product_container scroll-box flex-column"
        >
          <div class="product" v-for="p in showProduct" :key="p._id">
            <div class="img_box">
              <img
                :src="`${serverUrl}/${p.imgs[0]}`"
                alt="img"
                v-if="p.imgs.length > 0"
              />
              <div v-else class="img_box"></div>
            </div>
            <p class="name">{{ p.productName }}</p>
            <p>{{ p.price }}</p>
            <p v-if="p.soldOut"><span class="soldOut"></span> 停售中</p>
            <p v-else><span></span> 銷售中</p>
          </div>
        </div>
        <span v-else>無相關產品</span>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch } from "vue";
import { host } from "../../utils/RouteApi";
export default {
  props: ["productList", "open"],
  setup(props) {
    const serverUrl = host;
    const filter = ref("all");
    const showProduct = ref(props.productList);

    function setFilter(value) {
      filter.value = value;
    }

    function gerProduct(filterValue) {
      let tempArr;
      if (filterValue === true || filterValue === false) {
        tempArr = props.productList.filter((p) => p.soldOut === filterValue);
      } else {
        tempArr = props.productList;
      }

      showProduct.value = tempArr;
    }

    watch([filter, props], () => {
      gerProduct(filter.value);
    });
    return {
      serverUrl,
      setFilter,
      filter,
      gerProduct,
      showProduct,
    };
  },
};
</script>

<style scoped>
.product_container {
  max-height: 25em;
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
.name {
  flex: 1;
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

.img_box {
  width: 90px;
  height: 60px;
  background-color: var(--grey-100);
}
img {
  object-fit: cover;
}

.v-enter-from {
  transform: translateY(3em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s 1s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}

@media screen and (max-width: 500px) {
  main {
    overflow-x: scroll;
  }
  .product_container,
  .p_title {
    width: 400px;
  }
}
</style>
