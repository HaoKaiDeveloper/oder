<template>
  <main :class="{ description: textarea }">
    <label :for="forValue">{{ name }} :</label>
    <input
      :type="type"
      :id="forValue"
      v-if="!textarea"
      :name="forValue"
      :value="inputValue"
      @input="valueChange"
    />
    <textarea
      v-else
      class="scroll-box"
      :id="forValue"
      :name="forValue"
      :value="inputValue"
      @input="valueChange"
    ></textarea>
  </main>
</template>

<script>
export default {
  props: ["forValue", "name", "type", "textarea", "inputValue"],
  emits: ["value-change"],
  setup(props, context) {
    function valueChange(e) {
      let value = e.target.value;
      if (props.type === "number") {
        value = Number(value);
      }

      context.emit("value-change", [value, e.target.name]);
    }

    return {
      valueChange,
    };
  },
};
</script>

<style scoped>
main {
  width: 100%;
  margin-bottom: 2rem;
  color: var(--grey-200);
}
main label {
  font-size: var(--font-medium);
  font-weight: 600;
  color: var(--grey-100);
}
input,
textarea {
  width: 100%;
  font-size: var(--font-medium);
  padding: 0.5em 0.7em;
  outline: none;
  border: none;
  border-bottom: var(--border-2);
  background-color: var(--grey-0);
  color: var(--grey-200);
  letter-spacing: 1px;
}
textarea {
  margin: 0.7em 0;
  height: 10em;
  border: var(--border-2);
  border-radius: 3px;
  resize: none;
}
.description {
  width: 100%;
  height: 100%;
  max-height: 15em;
}
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
