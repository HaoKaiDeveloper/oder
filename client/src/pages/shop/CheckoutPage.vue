<template>
  <transition>
    <section v-if="isLoading">
      <article>
        <router-link :to="shopLink"> 商店 </router-link>
        <router-link :to="checkoutLink">結帳頁面</router-link>
      </article>

      <main>
        <cart-items :cart="cart" :serverUrl="serverUrl"></cart-items>
        <client-form :total="total" :storeId="storeId"></client-form>
      </main>
    </section>
  </transition>
</template>

<script>
import { useRoute } from "vue-router";
import { ref } from "vue";
import { host } from "../../utils/RouteApi";
import CartItems from "../../components/checkOut/cartItems.vue";
import ClientForm from "../../components/checkOut/clientForm.vue";
export default {
  props: ["storeId"],
  components: {
    CartItems,
    ClientForm,
  },
  setup() {
    document.title = "Checkout";
    const route = useRoute();
    const storeId = route.params.storeId;
    const serverUrl = host;
    const cart = ref([]);
    const total = ref(0);
    const isLoading = ref(false);

    let localCart = localStorage.getItem("cart");
    if (localCart) {
      localCart = JSON.parse(localCart);
      cart.value = localCart;
    }
    setTimeout(() => {
      countTotal(localCart);
    }, 500);

    function countTotal(list) {
      const count = list.reduce((acc, prev) => {
        return (acc += prev.amount * prev.price);
      }, 0);
      total.value = count;
      isLoading.value = true;
    }

    const shopLink = `/shop/${storeId}`;
    const checkoutLink = `/shop/checkout/${storeId}`;

    return {
      storeId,
      serverUrl,
      shopLink,
      checkoutLink,
      cart,
      total,
      storeId,
      isLoading,
    };
  },
};
</script>

<style scoped>
section {
  max-width: 2000px;
  margin: 0 auto;
  width: 100%;
  height: 100%;
  padding: 4em 10em;
  color: var(--grey-200);
}

article {
  grid-column: 2/3;
  grid-row: 1/2;
  font-size: var(--font-small);
}

article a {
  margin-left: 1.5em;
}

.router-link-active {
  font-weight: 600;
  border-bottom: 2px solid var(--primary-2);
}

main {
  grid-column: 2/3;
  grid-row: 2/-1;
  margin-top: 2em;
}

.cart_items {
  width: 100%;
}

.v-enter-active {
  animation: page 0.8s ease;
}

@keyframes page {
  from {
    transform: translateY(5em);
    opacity: 0;
  }
  to {
    transform: translateY(0em);
    opacity: 1;
  }
}
@media screen and (max-width: 650px) {
  section {
    width: 100%;
    height: 100%;
    padding: 4em 3em;
  }
}

@media screen and (max-width: 500px) {
  section {
    width: 100%;
    height: 100%;
    padding: 3em 1em;
  }
}
</style>
