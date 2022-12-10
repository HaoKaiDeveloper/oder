<template>
  <transition>
    <section class="prompt scroll-box" v-if="show">
      <div v-for="o in list" :key="o._id" class="flex-row">
        <p class="name">{{ o.clientName }}</p>
        <p class="price">NT. {{ o.total }}</p>
        <p class="time">{{ o.time }}</p>
        <p v-if="o.newMsg" class="new">new</p>
        <div v-else class="new payment">
          <p v-if="o.payment === 'cash'">現金</p>
          <p v-else>信用卡</p>
        </div>
      </div>
    </section>
  </transition>
</template>

<script>
export default {
  props: ["show", "list"],
};
</script>

<style scoped>
.prompt {
  width: 22em;
  height: auto;
  min-height: 10em;
  max-height: 35em;
  z-index: 2;
  background-color: var(--grey-0);
  padding: 0.25em 0;
  position: absolute;
  top: 5em;
  right: 1em;
  border-radius: 0.7em;
  overflow: auto;
  box-shadow: 3px 3px 5px rgba(0, 0, 0, 0.3);
}
div {
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5em;
  padding: 0.7em;
  background-color: var(--grey-0);
  margin-bottom: 0.5em;
  color: var(--grey-100);
  position: relative;
}
.name {
  width: 100%;
  color: var(--grey-200);
  font-weight: 600;
}
.price,
.name {
  letter-spacing: 1px;
}
.new {
  position: absolute;
  top: 0.5em;
  right: 0.3em;
  padding: 0.2em 0.5em;
  border-radius: 0.4em;
  letter-spacing: 0.5px;
  color: var(--primary-3);
  font-weight: 600;
  transform: rotate(-5deg);
}
.payment {
  color: var(--grey-10 0);
  transform: rotate(0deg);
  letter-spacing: 1px;
  font-size: 1rem;
  background-color: transparent;
}

.v-enter-from {
  opacity: 0.2;
  transform: translateY(2em);
}
.v-enter-active,
.v-leave-active {
  transition: all 0.3s;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
  transform: translateY(0em);
}

.v-leave-to {
  opacity: 0.2;
  transform: translateY(-2em);
}

@media screen and (max-width: 720px) {
  .prompt {
    top: 3em;
    right: 2em;
  }
}
@media screen and (max-width: 500px) {
  .prompt {
    top: 4em;
    right: 1em;
  }
}
</style>
