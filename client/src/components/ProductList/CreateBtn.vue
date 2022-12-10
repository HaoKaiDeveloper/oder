<template>
  <div class="create_btn">
    <button @click="openForm">
      <span>
        <font-awesome-icon icon="fa-solid fa-plus" />
      </span>
      新增商品
    </button>
  </div>
</template>

<script>
export default {
  emits: ["openForm"],
  setup(props, context) {
    function openForm() {
      context.emit("openForm", true);
    }

    return {
      openForm,
    };
  },
};
</script>

<style scoped>
.create_btn {
  width: 100%;
}
button {
  width: 100%;
  padding: 8px;
  border: none;
  background-color: var(--primary-4);
  border-radius: 1em;
  color: #fff;
  font-size: var(--font-medium);
  letter-spacing: 1px;
  cursor: pointer;
}

@media screen and (max-width: 800px) {
  button {
    padding: 6px;
    font-size: var(--font-small);
  }
}
</style>
