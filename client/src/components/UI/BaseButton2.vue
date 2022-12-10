<template>
  <button>
    <slot></slot>
  </button>
</template>

<script>
export default {};
</script>

<style scoped>
button {
  padding: 5px 8px;
  border-radius: 6px;
  border: none;
  letter-spacing: 1px;
  cursor: pointer;
  color: var(--grey-200);
}
button:hover,
button:active {
  background-color: var(--primary-4);
  color: var(--grey-50);
}
</style>
