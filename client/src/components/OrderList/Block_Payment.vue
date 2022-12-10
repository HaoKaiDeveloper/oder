<template>
  <transition>
    <base-card class="payment_block block" v-if="open">
      <template #title>付款狀態</template>
      <template #tabs>全部</template>

      <template #default>
        <div class="info">
          <div class="order_value flex-column">
            <div class="income flex-column">
              <p>實際收入:</p>
              <span>{{ income }}</span>
            </div>
            <p>
              現金: <span>{{ cash }}</span>
            </p>
            <p>
              信用卡: <span>{{ credit }}</span>
            </p>
          </div>

          <div class="icon_box">
            <span class="flex-row"
              ><font-awesome-icon icon="fa-solid fa-wallet"
            /></span>
          </div>

          <div class="payment">
            <p>
              訂單價值: <span>{{ totalValue }}</span>
            </p>

            <p>
              付款單數: <span>{{ paidNum }}</span>
            </p>
          </div>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
import { numAnimation } from "../../utils/animatFunction";

export default {
  props: ["origOrderList", "open"],
  setup(props) {
    const totalValue = ref(0);
    const income = ref(0);
    const paidNum = ref(0);

    const cash = ref(0);
    const credit = ref(0);

    const list = computed(() => {
      return props.origOrderList;
    });

    function getDate(list) {
      let sum = 0;
      let orderTotal = 0;
      let cashSum = 0;
      let creditSum = 0;
      let paidSum = 0;
      list.forEach((o) => {
        orderTotal += Number(o.total);
        if (o.paid) {
          sum += Number(o.total);
          paidSum++;
          if (o.payment === "cash") {
            cashSum += Number(o.total);
          } else {
            creditSum += Number(o.total);
          }
        }
      });
      let range = Math.ceil(sum / 10);
      numAnimation(sum, income, range);
      totalValue.value = orderTotal;
      cash.value = cashSum;
      credit.value = creditSum;
      paidNum.value = paidSum;
    }

    watch(list, () => {
      getDate(props.origOrderList);
    });

    return {
      totalValue,
      income,
      paidNum,
      cash,
      credit,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
  height: 80%;
  display: grid;
  grid-template-columns: minmax(1fr, max-content) 1fr;
  grid-template-rows: min-content 1fr;
  margin-top: 1em;
  color: var(--grey-200);
}
.order_value {
  grid-column: 1/2;
  grid-row: 1/-1;
  height: 100%;

  justify-content: space-between;
  word-break: break-all;
}
.icon_box {
  grid-column: 2/3;
  grid-row: 1/2;
  justify-self: end;
}
.icon_box span {
  width: 2.2em;
  height: 2.2em;
  background-color: var(--primary-1);
  color: var(--primary-4);
  justify-content: center;
  border-radius: 0.4em;
  font-size: 2.2rem;
}
.payment {
  grid-column: 2/3;
  grid-row: 2/-1;
  align-self: end;
  justify-self: end;
}

p {
  font-size: var(--font-small);
  letter-spacing: 1px;
  margin-bottom: 0.3em;
  color: var(--grey-100);
}
span {
  font-size: var(--font-medium);
  margin-left: 0.1em;
  letter-spacing: 1px;
  color: var(--grey-200);
}
.income {
  flex: 1;
  justify-content: space-between;
}

.income span {
  flex: 1;
  line-height: 1.5em;
  font-weight: 500;
  font-size: var(--font-xlarge);
}

.v-enter-from {
  transform: translateY(-4em);
  opacity: 0;
}
.v-enter-active {
  transition: all 1.5s ease-out;
}
.v-enter-to {
  transform: translateY(0em);
  opacity: 1;
}
@media screen and (max-width: 1000px) {
  .v-enter-from {
    transform: translateX(-4em);
    opacity: 0;
  }
  .v-enter-active {
    transition: all 1.5s ease-out;
  }
  .v-enter-to {
    transform: translateX(0em);
    opacity: 1;
  }
}
</style>
