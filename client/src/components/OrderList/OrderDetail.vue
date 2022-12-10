<template>
  <section class="detail">
    <transition name="back">
      <div class="popBackground" v-if="show" @click="closeInfo"></div>
    </transition>

    <transition name="info">
      <div v-if="show" class="info flex-column scroll-box fixed-center">
        <h1>訂單資訊</h1>
        <div class="basic_info">
          <p>
            姓名: <span>{{ orderInfo.clientName }}</span>
          </p>
          <p>
            電話: <span>{{ orderInfo.clientPhone }}</span>
          </p>
          <p>
            Email: <span>{{ orderInfo.clientEmail }}</span>
          </p>
          <p>
            寄送方式: <span>{{ deliveryInfo }}</span>
          </p>
          <p v-if="orderInfo.delivery === 'post'">
            寄送地址: <span>{{ orderInfo.clientAddress }}</span>
          </p>
          <p>
            付款方式: <span>{{ payment }}</span>
          </p>
          <p v-if="orderInfo.payment === 'credit'">
            信用卡號: <span>{{ orderInfo.creditNum }} </span>
          </p>
          <p class="paid flex-row">
            付款情況:
            <span class="paidstate">{{ paidInfo }}</span>
            <span class="paidTime">{{ paidTime }}</span>
          </p>
          <p>
            金額: <span>{{ orderInfo.total }}</span>
          </p>
          <p>
            完成狀態: <span v-if="orderInfo.completed">已完成</span>
            <span v-else>未完成</span>
          </p>
        </div>

        <div class="product_title flex-row">
          <p class="box"></p>
          <p class="name">名稱</p>
          <p>單價</p>
          <p>數量</p>
        </div>

        <div class="product_container" v-if="orderInfo.productList.length > 0">
          <div
            class="product flex-row"
            v-for="p in orderInfo.productList"
            :key="p._id"
          >
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
            <p>{{ p.amount }}</p>
          </div>
        </div>

        <div class="btns flex-row">
          <base-button-2
            v-if="!orderInfo.completed"
            type="button"
            @click="showPopup(orderInfo._id, '確認完成', 'completOrder')"
          >
            已完成
          </base-button-2>
          <base-button-2
            v-if="!orderInfo.paid"
            type="button"
            @click="showPopup(orderInfo._id, '確認付款', 'paidOrder')"
          >
            已付款
          </base-button-2>
          <base-button-2
            type="button"
            v-if="!orderInfo.paid"
            @click="showPopup(orderInfo._id, '刪除訂單', 'deleteOrder')"
          >
            取消訂單
          </base-button-2>
          <base-button-2
            type="button"
            v-else
            @click="showPopup(orderInfo._id, '刪除訂單', 'deleteOrder')"
          >
            退款
          </base-button-2>
        </div>
      </div>
    </transition>

    <check-popup
      v-if="popupInfo.show"
      :info="popupInfo"
      @close-popup="closePopup"
      @close-form="closeInfo"
    ></check-popup>
  </section>
</template>

<script>
import { computed, ref } from "vue";
import { host } from "../../utils/RouteApi";
import CheckPopup from "../ProductList/Check_Popup.vue";
import BaseButton2 from "../UI/BaseButton2.vue";
export default {
  props: ["orderInfo", "show"],
  emits: ["close-info"],
  components: { CheckPopup, BaseButton2 },
  setup(props, context) {
    const serverUrl = host;
    const isLoading = ref(false);

    function closeInfo() {
      context.emit("close-info", [false, {}]);
    }
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

    const paidInfo = computed(() => {
      if (props.orderInfo.paid === true) {
        return `已付款`;
      } else {
        return "未付款";
      }
    });
    const paidTime = computed(() => {
      if (props.orderInfo.paid === true) {
        const time = new Date(props.orderInfo.paidTime);

        let m = addZero(time.getMonth() + 1);
        let day = addZero(time.getDate());
        let h = addZero(time.getHours());
        let s = addZero(time.getMinutes());
        function addZero(t) {
          let newT = t;
          if (t < 10) {
            newT = `0${t}`;
          }
          return newT;
        }
        return `${m}/${day} ${h}:${s}`;
      } else {
        return "";
      }
    });

    const deliveryInfo = computed(() => {
      if (props.orderInfo.delivery === "inStore") {
        return "店面取貨";
      } else {
        return "郵寄取貨";
      }
    });

    const payment = computed(() => {
      if (props.orderInfo.payment === "cash") {
        return "現金";
      } else {
        return "信用卡";
      }
    });

    return {
      closeInfo,
      paidInfo,
      deliveryInfo,
      payment,
      serverUrl,
      isLoading,
      popupInfo,
      showPopup,
      closePopup,
      paidTime,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
  max-width: 35em;
  height: 90%;
  max-height: 43em;
  border-radius: 1.2em;
  padding: 2em;
  background-color: var(--grey-0);
  color: var(--grey-200);
  overflow: auto;
  justify-content: space-between;
  z-index: 4;
}

h1 {
  font-size: var(--font-medium);
  margin-bottom: 0.7em;
}

.basic_info {
  font-size: var(--font-small);
  letter-spacing: 1px;
}
.basic_info p {
  width: 100%;
  word-break: break-all;
  padding: 0.6em 0;
  border-bottom: var(--border-2);
  font-weight: 600;
}
.basic_info span {
  font-weight: 400;
  margin-left: 0.5em;
}

.product_title {
  margin-top: 0.8em;
  font-weight: 600;
}

.product_title,
.product {
  justify-content: space-between;
  gap: 1rem;
}
.product_title p,
.product p {
  width: 5em;
  font-size: var(--font-small);
  word-break: break-all;
}
.product {
  padding: 0.7em 0;
}
.product_title .box {
  width: 6em;
}
.name {
  flex: 1;
}
.paid {
  justify-content: space-between;
  gap: 0.5em;
}
.paidstate {
  flex: 1;
  white-space: nowrap;
}
.paidTime {
  font-size: 0.5rem;
  color: var(--grey-100);
  word-break: break-all;
}

.img_box {
  width: 6em;
  height: 4em;
  background-color: var(--grey-100);
}
img {
  object-fit: cover;
}

.btns {
  align-self: flex-end;
  margin-top: 3em;

  flex-wrap: wrap;
  gap: 1em;
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

@media screen and (max-width: 500px) {
  .info {
    padding: 1.5em;
  }
  .btns {
    margin-top: 2em;
  }
}
@media screen and (max-width: 350px) {
  .img_box,
  .box {
    display: none;
  }
  .btns {
    align-self: center;
  }
}
</style>
