<template>
  <main>
    <transition name="back">
      <div class="popBackground back" @click="closeInfo" v-if="show"></div>
    </transition>
    <transition name="info">
      <article class="fixed-center" v-if="show">
        <div class="imgs">
          <SwiperImgs :imgs="info.imgs" />
        </div>

        <div class="info">
          <p class="name">{{ info.productName }}</p>
          <p class="price">NT. {{ info.price }}</p>
          <p class="category">{{ info.category }}</p>
          <p class="description scroll-box">
            商品內容: <span>{{ info.description }}</span>
          </p>
        </div>

        <div class="btns">
          <base-button v-if="info.soldOut" font_m="medium">完售</base-button>
          <base-button font_m="medium" @click="addTocard(info._id)" v-else
            >加入購物車</base-button
          >
        </div>
      </article>
    </transition>
  </main>
</template>

<script>
import SwiperImgs from "../UI/SwiperImgs.vue";

export default {
  props: ["info", "show"],
  emits: ["close-info", "add_to_cart"],
  components: {
    SwiperImgs,
  },
  setup(props, context) {
    function closeInfo() {
      context.emit("close-info", false);
    }
    function addTocard(productId) {
      context.emit("add_to_cart", productId);
    }

    return {
      closeInfo,
      addTocard,
    };
  },
};
</script>

<style scoped>
main {
  position: relative;
}
article {
  width: 40em;
  height: 55em;
  background-color: var(--grey-0);
  color: var(--grey-200);
  z-index: 10;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 1.5em;
  border-radius: 1em;
  overflow: hidden;
}

.imgs {
  width: 100%;
  height: 60%;
  max-height: 40em;
  overflow: hidden;
  background-color: var(--grey-100);
}

.info {
  flex: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: repeat(2, min-content) 1fr;
  padding: 0.5em 0.7em;
  overflow: auto;
  row-gap: 0.3em;
}
.name {
  grid-column: 1/2;
  grid-row: 1/2;
  font-size: var(--font-xlarge);
  font-weight: 500;
}
.price {
  grid-column: 2/3;
  grid-row: 1/3;
  font-size: var(--font-xlarge);
  justify-self: end;
  font-weight: 500;
}
.category {
  grid-column: 1/3;
  grid-row: 2/3;
  font-size: var(--font-medium);
  color: var(--grey-100);
  margin-bottom: 0.5em;
}
.description {
  grid-column: 1/-1;
  grid-row: 3/-1;
  font-size: var(--font-medium);
  color: var(--grey-200);
  letter-spacing: 2px;
  line-height: 1.3;
  font-size: var(--font-small);
}
.description span {
  display: block;
  margin-top: 0.2em;
}
.btns {
  width: 100%;
  padding: 0 0.7em;
  text-align: end;
  font-size: var(--font-medium);
}
.back-enter-active {
  animation: back 0.5s ease-out;
}
.back-leave-active {
  animation: back 0.2s ease-out reverse;
}
.info-enter-active {
  animation: modal 0.5s ease-out;
}
.info-leave-active {
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

@media screen and (max-width: 450px) {
  article {
    width: 95%;
    height: 70%;
    min-height: 45em;
  }
  .imgs {
    width: 100%;
    height: 55%;
    max-height: 40em;
    overflow: hidden;
    background-color: var(--grey-100);
  }
  .name,
  .price {
    font-size: var(--font-large);
  }
}
</style>
