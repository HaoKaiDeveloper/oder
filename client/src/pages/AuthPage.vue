<template>
  <section>
    <transition>
      <form @submit.prevent="submitData" v-if="show">
        <div class="logo_box">
          <img src="../assets/android-chrome-512x512.png" alt="logo" />
        </div>
        <h1>商家{{ submitBtnText }}</h1>

        <main v-if="!isLoginPage">
          <label for="storeName">商家名稱 :</label>
          <input type="text" v-model="storeData.storeName" id="storeName" />
        </main>

        <main>
          <label for="email">Email :</label>
          <input type="email" id="email" v-model="storeData.email" />
        </main>

        <main>
          <label for="password">密碼 :</label>
          <input
            :type="passwordType"
            id="password"
            v-model="storeData.password"
            autocomplete="off"
          />
          <span @click="toggleShowPassword" class="passBtn grid-center">
            <font-awesome-icon icon="fa-solid fa-eye" v-if="showPassword" />
            <font-awesome-icon icon="fa-solid fa-eye-slash" v-else />
          </span>
        </main>
        <div class="box"></div>

        <div class="submit_box">
          <Loading v-if="isLoading" />
          <button type="submit" v-else>{{ submitBtnText }}</button>
          <p v-if="error">{{ error }}</p>
        </div>

        <div class="text_box">
          <p v-if="!isLoginPage">
            已經註冊? <span @click="toggleIsLoginPage">登入</span>
          </p>
          <p v-else>尚未是會員? <span @click="toggleIsLoginPage">註冊</span></p>
        </div>
      </form>
    </transition>
  </section>
</template>

<script>
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import { ref, reactive, computed } from "vue";
import BaseButton from "../components/UI/BaseButton.vue";
import Loading from "../components/UI/Loading.vue";
export default {
  components: { BaseButton, Loading },
  setup() {
    const store = useStore();
    const router = useRouter();
    const storeData = reactive({
      storeName: "",
      email: "",
      password: "",
    });
    const isLoginPage = ref(true);
    const error = ref(null);
    const showPassword = ref(false);
    const isLoading = ref(false);
    const show = ref(false);

    setTimeout(() => {
      show.value = true;
    }, 1000);

    const submitBtnText = computed(() => {
      if (isLoginPage.value) {
        return "登入";
      }
      return "註冊";
    });

    const passwordType = computed(() => {
      if (showPassword.value) {
        return "text";
      } else {
        return "password";
      }
    });
    function toggleShowPassword() {
      return (showPassword.value = !showPassword.value);
    }

    function toggleIsLoginPage() {
      return (isLoginPage.value = !isLoginPage.value);
    }

    async function submitData() {
      let sendData;
      if (!storeData.email || !storeData.password) {
        error.value = "請輸入登入資料";
      }
      if (storeData.password.length < 6) {
        error.value = "密碼至少為6碼";
      }
      if (
        !isLoginPage.value &&
        (storeData.storeName.length < 2 || storeData.storeName.length > 25)
      ) {
        error.value = "商家名稱2~25字";
      }
      if (error.value) {
        setTimeout(() => {
          error.value = "";
        }, 1500);
        return;
      }

      if (isLoginPage.value) {
        sendData = {
          action: "login",
          email: storeData.email,
          password: storeData.password,
        };
      } else {
        sendData = {
          action: "regiester",
          ...storeData,
        };
      }
      try {
        isLoading.value = true;
        await store.dispatch("storeUser/auth", sendData);
        isLoading.value = false;
        show.value = false;
        setTimeout(() => {
          router.replace("/dashboard/home");
        }, 500);
      } catch (err) {
        error.value = err.message || "錯誤!請稍後再試";
        if (error.value) {
          setTimeout(() => {
            error.value = "";
          }, 1500);
        }
      }
      isLoading.value = false;
    }

    return {
      storeData,
      isLoginPage,
      toggleIsLoginPage,
      submitBtnText,
      submitData,
      error,
      showPassword,
      passwordType,
      toggleShowPassword,
      show,
      isLoading,
    };
  },
};
</script>

<style scoped>
section {
  width: 100vw;
  height: 100vh;
  background-image: url("../assets/background6.jpg");
  background-size: cover;
  background-position: center;
}

form {
  width: 95%;
  max-width: 33em;
  height: 45em;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: rgba(225, 225, 225, 0.1);
  box-shadow: 0px 25px 45px rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(225, 225, 225, 0.8);
  border-right: 1px solid rgba(225, 225, 225, 0.3);
  border-bottom: 1px solid rgba(225, 225, 225, 0.3);
  border-radius: 15px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.2em;
  padding: 2em 1.5em;
  backdrop-filter: blur(7px);
  color: #fff;
}

.logo_box {
  width: 5em;
  height: 5em;
}
.logo_box img {
  filter: drop-shadow(3px 3px 5px rgba(0, 0, 0, 0.3));
}
h1 {
  width: 100%;
  text-align: center;
  border-bottom: 1px solid #fff;
  padding: 5px;
  font-size: 1.9rem;
  letter-spacing: 1.5px;
}
main {
  width: 100%;
  margin-bottom: 0.5em;
  position: relative;
}
label {
  display: block;
  font-size: 1.5em;
  margin-bottom: 2px;
}
input {
  width: 100%;
  outline: none;
  border: 1.3px solid var(--grey-100);
  padding: 0.4em 0.5em;
  font-size: 1.5em;
  border-radius: 0.5em;
}
span,
button {
  cursor: pointer;
}
.passBtn {
  font-size: 1.6em;
  color: var(--primary-4);
  position: absolute;
  right: 0.3em;
  bottom: 0.5em;
}
.box {
  flex: 1;
}
.submit_box {
  width: 100%;
  height: 5em;
  text-align: center;
  padding: 0.5em;
  color: var(--grey-200);
  position: relative;
  display: flex;
  justify-content: center;
}
button {
  width: 8.5em;
  height: 2.5em;
  font-weight: 600;
  background: transparent;
  border: 1px solid rgba(225, 225, 225, 1);
  color: #fff;
  border-radius: 2em;
}
button:active {
  transform: translate(1px, 2px);
}
.submit_box p {
  position: absolute;
  top: -12%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #f5f5f5;
}
.text_box p {
  color: #f5f5f5;
  font-size: 1.4em;
}
.text_box span {
  font-weight: 600;
  border-bottom: 1px solid #fff;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  top: 55%;
}
.v-enter-active {
  animation: showPage 0.8s ease;
}
.v-leave-active {
  animation: showPage 0.5s ease reverse;
}
.v-enter-to,
.v-leave-from {
  opacity: 1;
  top: 50%;
}

@keyframes showPage {
  0% {
    opacity: 0.2;
    top: 55%;
  }
  50% {
    opacity: 0.7;
    top: 48%;
  }
  100% {
    opacity: 1;
    top: 50%;
  }
}
</style>
