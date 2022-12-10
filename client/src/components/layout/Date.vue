<template>
  <main class="date">
    <p>
      <span> <font-awesome-icon icon="fa-regular fa-calendar" /></span
      >{{ nowDate }}
    </p>
  </main>
</template>

<script>
import { ref, onMounted } from "vue";
export default {
  setup() {
    const nowDate = ref("");
    function addZero(d) {
      if (d < 10) {
        return "0" + d;
      } else {
        return d;
      }
    }

    function getData() {
      const now = new Date();
      const year = now.getFullYear();
      const month = now.getMonth() + 1;
      const date = addZero(now.getDate());

      nowDate.value = `${year}-${month}-${date}`;
    }

    onMounted(() => {
      setInterval(() => {
        getData();
      }, 1000);
    });

    return {
      nowDate,
    };
  },
};
</script>

<style scoped>
main {
  display: flex;
  align-items: center;
  gap: 2em;
}
p {
  font-size: var(--font-small);
  font-weight: 400;
  color: var(--grey-100);
  letter-spacing: 2px;
}

span {
  margin-right: 1em;
}

@media screen and (max-width: 500px) {
  main {
    display: none;
  }
}
</style>
