<template>
  <form class="fixed-center scroll-box">
    <slot></slot>
  </form>
</template>

<script>
export default {};
</script>

<style scoped>
form {
  width: 90%;
  max-width: 40em;
  height: 90%;
  max-height: 50em;
  background-color: var(--grey-0);
  z-index: 3;
  overflow-y: scroll;
  padding: 2em;
  border-radius: 1.2rem;
}
@media screen and (max-width: 400px) {
  form {
    width: 95%;
    padding: 2em 1.2em;
  }
}
</style>
