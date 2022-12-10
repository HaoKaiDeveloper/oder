<template>
  <main class="imgs_container">
    <label>商品相片(四張為限，單張上限3Mb)</label>

    <input
      type="file"
      @change="upload"
      ref="imgInput"
      accept=".png, .jpg, .jpeg"
    />

    <span class="grid-center" @click="clickUplodImg"
      ><font-awesome-icon icon="fa-solid fa-cloud-arrow-up"
    /></span>

    <div class="imgs flex-row" v-if="tempProductImgs.length > 0">
      <div
        v-for="imgUrl in tempProductImgs"
        :key="imgUrl"
        class="img_card flex-column"
      >
        <div class="img_box">
          <img :src="`${serverUrl}/${imgUrl}`" alt="img" />
        </div>
        <base-button-2 type="button" @click="deleteImg(imgUrl)"
          >刪除</base-button-2
        >
      </div>
    </div>
  </main>
</template>

<script>
import { ref } from "vue";
import BaseButton2 from "../UI/BaseButton2.vue";

export default {
  props: ["serverUrl", "tempProductImgs"],
  emits: ["upload", "delete-img"],
  components: { BaseButton2 },
  setup(props, context) {
    const imgInput = ref(null);
    function clickUplodImg() {
      if (props.tempProductImgs.length >= 4) return;
      imgInput.value.click();
    }
    function upload(e) {
      if (e.target.files[0].size > 300000) {
        return;
      } else {
        context.emit("upload", e);
      }
    }

    function deleteImg(url) {
      context.emit("delete-img", url);
    }

    return {
      clickUplodImg,
      imgInput,
      upload,
      deleteImg,
    };
  },
};
</script>

<style scoped>
.imgs_container {
  position: relative;
  margin-top: 5em;
}

.imgs_container span {
  width: 2.3em;
  height: 2.3em;
  border-radius: 50%;
  background-color: var(--grey-50);
  font-size: var(--font-large);
  color: var(--primary-3);
  position: absolute;
  top: -0.1em;
  right: -0.5em;
  animation: upload 1s linear infinite;
  cursor: pointer;
}

@keyframes upload {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}

label {
  color: var(--grey-200);
}

.imgs {
  width: 100%;
  height: 100%;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 2em;
  gap: 1em;
}

.img_card {
  align-items: center;
  gap: 0.7em;
}

.img_box {
  width: 130px;
  height: 80px;
  border-radius: 0.7em;
  overflow: hidden;
}
img {
  object-fit: cover;
}
input[type="file"] {
  display: none;
}
</style>
