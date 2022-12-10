<template>
  <swiper
    :modules="modules"
    :space-between="10"
    :navigation="{ nextEl: '.nextArrow', prevEl: '.prevArrow' }"
    :pagination="{ clickable: true }"
    :autoplay="{
      delay: 4000,
      disableOnInteraction: false,
      pauseOnMounseEnter: true,
    }"
    v-if="imgs.length > 0"
    class="img_box"
  >
    <div class="swiper-navigation" :class="{ smallBtn: small }">
      <div class="prevArrow">
        <font-awesome-icon icon="fa-solid fa-angle-left" />
      </div>
      <div class="nextArrow">
        <font-awesome-icon icon="fa-solid fa-angle-right" />
      </div>
    </div>
    <swiper-slide v-for="img in imgs" :key="img">
      <img :src="`${host}/${img}`" alt="productimg" />
    </swiper-slide>
  </swiper>

  <div v-else class="img_box"></div>
</template>

<script>
import { Navigation, Pagination } from "swiper";
import { Swiper, SwiperSlide } from "swiper/vue";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";
import { host } from "../../utils/RouteApi.js";

export default {
  props: ["imgs", "small"],
  components: {
    Swiper,
    SwiperSlide,
  },
  setup() {
    return {
      host,
      modules: [Navigation, Pagination],
    };
  },
};
</script>

<style scoped>
.img_box {
  width: 100%;
  height: 100%;
  background-color: var(--grey-50);
}
img {
  width: 100%;
  object-fit: cover;
}
.swiper-navigation {
  width: 95%;
  position: absolute;
  left: 50%;
  top: 50%;
  z-index: 2;
  transform: translate(-50%, -50%);
  display: flex;
  justify-content: space-between;
}
.swiper-navigation div {
  font-size: 3em;
  padding: 0.1em;
  border-radius: 0.2em;
  color: #fff;
  cursor: pointer;
}
.smallBtn {
  font-size: 0.7em;
}
@media screen and (max-width: 400px) {
  .swiper-navigation {
    display: none;
  }
}
</style>
