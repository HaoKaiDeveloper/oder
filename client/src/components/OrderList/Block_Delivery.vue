<template>
  <transition>
    <base-card class="delivery_block block" v-if="open">
      <template #title> 寄送方式 </template>
      <template #tabs>全部</template>
      <template #default>
        <div class="info">
          <div class="icon_box">
            <span class="flex-row">
              <font-awesome-icon icon="fa-solid fa-truck-fast" />
            </span>
          </div>

          <div class="text flex-column">
            <div class="inStore">
              <p>店面取貨</p>
              <span>共{{ inStoreNum }}件 / </span>
              <span> {{ inStoreComplete }}件完成</span>
            </div>
            <div class="post">
              <p>郵寄取貨</p>
              <span>共{{ postNum }}件 / </span>
              <span> {{ postComplete }}件完成</span>
            </div>
          </div>
        </div>
      </template>
    </base-card>
  </transition>
</template>

<script>
import { ref, watch, computed } from "vue";
export default {
  props: ["origOrderList", "open"],
  setup(props) {
    const inStoreNum = ref(0);
    const inStoreComplete = ref(0);
    const postNum = ref(0);
    const postComplete = ref(0);

    const list = computed(() => {
      return props.origOrderList;
    });

    function getData(list) {
      console.log(list);
      inStoreNum.value = 0;
      inStoreComplete.value = 0;
      postNum.value = 0;
      postComplete.value = 0;

      if (list.length > 0) {
        list.forEach((o) => {
          if (o.delivery === "inStore") {
            inStoreNum.value++;
            if (o.completed) {
              inStoreComplete.value++;
            }
          } else {
            postNum.value++;
            if (o.completed) {
              postComplete.value++;
            }
          }
        });
      }
    }

    watch(list, () => {
      getData(props.origOrderList);
    });

    return {
      inStoreNum,
      inStoreComplete,
      postNum,
      postComplete,
    };
  },
};
</script>

<style scoped>
.info {
  width: 100%;
  height: 80%;
  margin-top: 1em;
  color: var(--grey-200);
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.icon_box {
  grid-column: 2/3;
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

.text {
  grid-column: 1/2;
  grid-row: 1/-1;
  justify-content: space-evenly;
  gap: 1em;
}

p {
  font-size: var(--font-small);
  letter-spacing: 1px;
  color: var(--grey-100);
}
span {
  font-size: var(--font-medium);
  margin-top: 0.1em;
  width: 100%;
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
