<template>
  <button v-if="!link" :class="modeClass">
    <slot></slot>
  </button>
  <router-link v-else :to="to" class="">
    <slot></slot>
  </router-link>
</template>

<script>
import { computed, ref } from "vue";
export default {
  props: ["link", "to", "target", "data", "font_m"],
  setup(props) {
    const modeClass = computed(() => {
      if (props.data === props.target) {
        return `active ${props.font_m}`;
      }
    });
    return {
      modeClass,
    };
  },
};
</script>

<style scoped>
button,
a {
  text-decoration: none;
  border: none;
  font-size: var(--font-small);
  padding: 0.4em 1.2em;
  border-radius: 2em;
  background-color: var(--grey-50);
  cursor: pointer;
  letter-spacing: 1px;
  white-space: nowrap;
}

.active {
  background-color: var(--primary-4);
  color: #fff;
}

.medium {
  font-size: var(--font-medium);
  padding: 0.5em 1.5em;
}

button:hover,
a:hover {
  background-color: var(--primary-4);
  color: #fff;
}

@media screen and (max-width: 400px) {
  button,
  a {
    font-size: 0.5rem;
    padding: 0.4em 1.5em;

    border-radius: 2em;
  }
}
</style>
