<template>
  <div class="cart_items" v-if="cart.length > 0">
    <h1>我的購物車</h1>

    <div class="card_container flex-column">
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

        <div class="item_info flex-row">
          <span class="name">{{ cartItem.productName }}</span>
          <span>NT. {{ cartItem.price }}</span>
          <span class="amount"> 數量 {{ cartItem.amount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["cart", "serverUrl"],
};
</script>

<style scoped>
.card_container {
  margin-top: 2em;
}
.item_card {
  width: 100%;
  padding: 1.5em;
  border-bottom: var(--border-1);
  font-size: var(--font-small);
}

.item_img {
  width: 13em;
  height: 8em;
  overflow: hidden;
  background-color: var(--grey-100);
  margin-right: 1.5rem;
  border-radius: 7px;
  justify-content: center;
}
img {
  object-fit: cover;
}
.item_img span {
  font-size: var(--font-medium);
  color: var(--grey-200);
}
.item_info {
  width: 100%;
  flex: 1;
  justify-content: space-between;
  gap: 3em;
  word-break: break-all;
}

.item_info span {
  display: block;
  margin-top: 0.7em;
  word-break: break-all;
}

.item_info .name {
  flex: 1;
  max-width: 50%;
}
@media screen and (max-width: 650px) {
  .item_img {
    width: 7em;
    height: 4em;
  }
}

@media screen and (max-width: 400px) {
  .card_container {
    display: grid;
    grid-template-columns: repeat(auto-fit, 20em);
    justify-content: center;
    gap: 1em;
  }
  .item_card {
    width: 100%;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    padding: 1em;
    border: none;
    background-color: var(--grey-0);
    font-size: 1.2rem;
  }
  .item_info {
    margin-top: 0.7em;
    width: 100%;
    flex: 0;
    flex-direction: row;
    justify-content: space-between;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 0.5em;
    word-break: break-all;
  }
  .item_info .name {
    width: 49%;
  }
  .amount {
    width: 100%;
  }
  .item_img {
    width: 100%;
    height: 10em;
  }
}
</style>
