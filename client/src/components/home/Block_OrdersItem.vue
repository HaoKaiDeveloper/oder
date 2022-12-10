<template>
  <aside>
    <p>{{ title }}</p>
    <div class="bar_box">
      <span class="bar" :style="{ width: `${barWidth}%` }"></span>
    </div>
    <p class="num">{{ itemNum }}</p>
  </aside>
</template>

<script>
export default {
  props: ["title", "barWidth", "itemNum"],
};
</script>

<style scoped>
.bar_box {
  flex: 1;
  width: 100%;
  height: 1em;
  position: relative;
  background-color: var(--primary-1);
  border-radius: 1em;
  overflow: hidden;
}
.bar_box span {
  width: 0;
  height: 1em;
  position: absolute;
  transition: all 0.5s;
  transform-origin: left;
}

.bar {
  height: 1.3em;
  background-color: var(--primary-4);
}

.num {
  width: 3.5em;
  text-align: left;
  word-break: break-all;
}
</style>
