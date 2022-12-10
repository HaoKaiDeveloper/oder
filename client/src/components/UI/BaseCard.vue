<template>
  <main>
    <div class="header flex-row" :class="table">
      <p class="title">
        <slot name="title"></slot>
      </p>
      <div class="tabs flex-row">
        <slot name="tabs"></slot>
      </div>
    </div>
    <slot></slot>
  </main>
</template>

<script>
export default {
  props: ["table"],
};
</script>

<style scoped>
main {
  width: 100%;
  height: 100%;
  background-color: var(--grey-0);
  padding: 1.5em;
}
.header {
  width: 100%;
  justify-content: space-between;
  font-size: var(--font-small);
  color: var(--grey-100);
}
.title {
  font-size: var(--font-medium);
  font-weight: 600;
  letter-spacing: 1px;
  white-space: nowrap;
  color: var(--grey-200);
}
.tabs {
  justify-content: flex-end;
  gap: 0.7em;
}

@media screen and (max-width: 500px) {
  main {
    padding: 1.2em 1em;
  }
  .header.table {
    width: 400px;
  }
  .tabs {
    justify-content: flex-end;
    gap: 0.4em;
  }
}
</style>
