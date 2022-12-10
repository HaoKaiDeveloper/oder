<template>
  <div class="isLoading"></div>
</template>

<script>
export default {};
</script>

<style>
.isLoading {
  width: 40px;
  height: 40px;
  border: 1.5px solid var(--primary-4);
  border-left: 1.5px solid var(--grey-100);
  box-shadow: 0 0 2px var(--primary-4);
  border-radius: 50%;
  animation: loading 0.4s ease-in infinite;
}

@keyframes loading {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
