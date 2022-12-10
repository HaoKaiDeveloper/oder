<template>
  <main class="filters">
    <div class="background" @click="closeOption"></div>

    <div class="info">
      <label @click="toggleShow" class="flex-row"
        >類別
        <span :class="{ show: showOption }"
          ><font-awesome-icon icon="fa-solid fa-chevron-up"
        /></span>
      </label>

      <aside v-if="showOption">
        <p
          v-for="cate in categories"
          :key="cate"
          :class="{ active: activeOption === cate }"
          @click="selectOption(cate)"
        >
          {{ cate }}
        </p>
      </aside>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
export default {
  props: ["categories"],
  emits: ["select-option"],
  setup(props, context) {
    const showOption = ref(false);
    const activeOption = ref("全部");

    function closeOption() {
      showOption.value = false;
    }

    function toggleShow() {
      showOption.value = !showOption.value;
    }
    function selectOption(value) {
      activeOption.value = value;
      context.emit("select-option", value);
      showOption.value = false;
    }

    return {
      showOption,
      toggleShow,
      activeOption,
      selectOption,
      closeOption,
    };
  },
};
</script>

<style scoped>
.filters {
  width: 100%;
  display: flex;
  justify-content: center;
  position: relative;
}
.background {
  width: 100%;
  height: 10em;
  position: absolute;
  top: -100%;
  left: 0;
}
.info {
  background-color: var(--grey-0);
  position: relative;
  min-width: 15em;
}
aside {
  position: absolute;
  top: 3em;
  left: 0;
  z-index: 2;
  background-color: var(--grey-0);
  min-width: 15em;
}
aside p:hover {
  background-color: var(--primary-1);
}

label {
  justify-content: space-between;
  padding: 0.3em 1em;
  font-size: var(--font-medium);
  cursor: pointer;
}

label span.show {
  transform: rotate(180deg);
}

p {
  font-size: var(--font-medium);
  letter-spacing: 2px;
  cursor: pointer;
  padding: 0.5em 1em;
}

p.active {
  background-color: var(--primary-1);
}
</style>
