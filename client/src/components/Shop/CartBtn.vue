<template>
  <main :class="cartClass" @click="openCart" class="flex-row">
    <span class="cart_icon" :num="cartItemNum" v-if="!showCart">
      <font-awesome-icon icon="fa-solid fa-cart-shopping" />
    </span>

    <transition>
      <div class="info flex-column" v-if="showCart">
        <div class="cart_title flex-row">
          <p>
            我的購物車 :
            <span>
              <font-awesome-icon icon="fa-solid fa-cart-shopping" />
            </span>
          </p>
          <button @click.stop="closeCart">
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <div v-if="cart.length > 0" class="cart_items">
          <div
            v-for="cartItem in cart"
            :key="cartItem._id"
            class="item_card flex-row"
          >
            <div class="item_img flex-row">
              <img
                v-if="cartItem.imgs.length > 0"
                :src="`${serverUrl}/${cartItem.imgs[0]}`"
                alt="img"
              />
              <span v-else><font-awesome-icon icon="fa-solid fa-image" /></span>
            </div>

            <div class="item_info">
              <p>名稱: {{ cartItem.productName }}</p>
              <p>價格: {{ cartItem.price }}</p>
              <p>數量: {{ cartItem.amount }}</p>
            </div>

            <div class="item_amount flex-row">
              <button @click="changeAmount(cartItem._id, 'plus')">
                <font-awesome-icon icon="fa-solid fa-plus" />
              </button>
              <p v-if="cartItem.amount >= 10">{{ cartItem.amount }}</p>
              <p v-else>0{{ cartItem.amount }}</p>

              <button @click="changeAmount(cartItem._id, 'minus')">
                <font-awesome-icon icon="fa-solid fa-minus" />
              </button>

              <span @click.stop="deleteCartItem(cartItem._id)"> 取消 </span>
            </div>
          </div>
        </div>

        <router-link
          :to="checkoutLink"
          @click="closeCart"
          class="check_out_btn"
        >
          NT. ${{ total }} <span>付款 >></span>
        </router-link>
      </div>
    </transition>
  </main>
</template>

<script>
import { ref, computed } from "vue";
import { host } from "../../utils/RouteApi";

export default {
  props: ["cart", "total", "storeId"],
  emits: ["delete-cart-item", "change-amount"],
  setup(props, context) {
    const showCart = ref(false);
    const serverUrl = host;

    function openCart() {
      if (props.cart.length < 1) {
        return;
      }
      showCart.value = true;
    }

    function closeCart() {
      showCart.value = false;
    }

    const cartClass = computed(() => {
      if (showCart.value) {
        return "cart_nav show";
      } else {
        return "cart_nav";
      }
    });

    const cartItemNum = computed(() => {
      if (props.cart.length > 0) {
        return props.cart.length;
      } else {
        return 0;
      }
    });

    const checkoutLink = computed(() => {
      return `checkout/${props.storeId}`;
    });

    function deleteCartItem(id) {
      context.emit("delete-cart-item", id);
      if (props.cart.length <= 1) {
        showCart.value = false;
      }
    }

    function changeAmount(id, methods) {
      context.emit("change-amount", { id: id, methods: methods });
    }

    return {
      cartClass,
      openCart,
      closeCart,
      showCart,
      deleteCartItem,
      serverUrl,
      changeAmount,
      cartItemNum,
      checkoutLink,
    };
  },
};
</script>

<style scoped>
main {
  width: 8em;
  height: 5em;
  background-color: var(--grey-0);
  border-radius: 0.5em;
  position: fixed;
  bottom: 3em;
  right: 3em;
  z-index: 1;
  justify-content: center;
  cursor: pointer;
  transition: all 0.5s;
}

main.show {
  width: 32em;
  height: 80%;
  cursor: default;
}
.cart_icon {
  font-size: 2.2em;
  color: var(--grey-200);
  position: relative;
  transform: translateY(0.2em);
}
.cart_icon::after {
  content: attr(num);
  width: 1.8em;
  height: 1.8em;
  border-radius: 50%;
  background-color: var(--primary-4);
  position: absolute;
  top: -0.9em;
  left: 1em;
  font-size: 0.6em;
  color: var(--grey-0);
  display: grid;
  place-content: center;
}
.info {
  width: 100%;
  height: 100%;
  justify-content: space-between;
  gap: 1em;
  padding: 0.5em 0.5em 1.5em 0.5em;
}
.cart_title {
  justify-content: space-between;
  font-size: var(--font-medium);
  color: var(--grey-200);
}
.cart_title button {
  font-size: var(--font-medium);
  color: var(--grey-200);
  background-color: transparent;
  border: none;
  cursor: pointer;
}

.cart_items {
  flex: 1;
  width: 100%;
  min-height: 20em;
  overflow: hidden;
  overflow-y: auto;
}
.item_card {
  justify-content: space-between;
  gap: 0.5em;
  margin: 1em 0;
}

.item_img {
  width: 7em;
  height: 5em;
  overflow: hidden;
  border-radius: 0.5em;
  background-color: var(--grey-100);
  justify-content: center;
}
img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item_info {
  flex: 1;
  word-break: break-all;
}

.item_amount {
  flex-wrap: wrap;
  justify-content: flex-end;
  gap: 0.5em;
  font-size: 1.5em;
}

.item_amount span {
  width: 100%;
  text-align: end;
  background-color: transparent;
  cursor: pointer;
  margin-top: 0.4em;
}
.item_amount button {
  background-color: var(--primary-2);
  color: var(--grey-0);
  width: 1.3em;
  height: 1.3em;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  border-radius: 50%;
}
.check_out_btn {
  display: block;
  width: 90%;
  margin: 0 auto;
  font-size: 1.6em;
  text-align: center;
  border: 0.7px solid var(--primary-4);
  color: var(--primary-4);
  border-radius: 1em;
  padding: 0.3em 0;
  transition: all 0.3s;
}
.check_out_btn:hover {
  transform: translateX(1em);
}
.v-enter-from {
  transform: translateX(1em);
  opacity: 0;
}
.v-enter-active {
  transition: all 0.5s 0.5s ease;
}
.v-enter-to {
  transform: translateX(0em);
  opacity: 1;
}
@media screen and (max-width: 400px) {
  main {
    bottom: 0.5em;
    right: 0.5em;
    width: 6em;
    height: 5em;
  }
  main.show {
    width: 100%;
    padding-left: 0.5em;
  }
}
</style>
