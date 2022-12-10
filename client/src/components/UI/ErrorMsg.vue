<template>
  <div class="errorMsg">
    <span>
      <font-awesome-icon icon="fa-solid fa-xmark" />
    </span>
    <p>請稍後再嘗試</p>
  </div>
</template>

<script>
export default {};
</script>

<style>
.errorMsg {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}
.errorMsg span {
  min-width: 40px;
  min-height: 40px;
  font-size: 25px;
  border: 1.5px solid #f44336;
  color: #f44336;
  display: grid;
  place-content: center;
  border-radius: 50%;
}
.errorMsg p {
  font-size: var(--font-small);
}
</style>
