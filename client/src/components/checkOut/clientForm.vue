<template>
  <main>
    <h1>聯絡資料</h1>
    <form>
      <div>
        <label for="clientName">顧客姓名</label>
        <input type="text" id="clientName" v-model="clientinfo.clientName" />
      </div>
      <div>
        <label for="clientPhone">聯絡電話</label>
        <input type="text" id="clientPhone" v-model="clientinfo.clientPhone" />
      </div>
      <div>
        <label for="clientEmail">Email</label>
        <input type="email" id="clientEmail" v-model="clientinfo.clientEmail" />
      </div>
      <div>
        <label for="delivery">收貨方式</label>
        <select v-model="clientinfo.delivery">
          <option value="inStore">到店取貨</option>
          <option value="post">郵寄取貨</option>
        </select>
      </div>

      <div v-if="clientinfo.delivery === 'post'">
        <label for="clientAddress">郵寄地址</label>
        <input
          type="text"
          id="clientAddress"
          v-model="clientinfo.clientAddress"
        />
      </div>

      <div class="radio">
        <label for="payment" class="title">付款方式</label>
        <div>
          <label for="cash">現金付款</label>
          <input
            type="radio"
            name="payment"
            id="cash"
            value="cash"
            v-model="clientinfo.payment"
          />
        </div>
        <div>
          <label for="credit">信用卡付款</label>
          <input
            type="radio"
            name="payment"
            id="credit"
            value="credit"
            v-model="clientinfo.payment"
          />
        </div>
      </div>

      <div v-if="clientinfo.payment === 'credit'">
        <label>信用卡號</label>
        <div class="credit_input">
          <input
            type="number"
            v-model="creditNum.num_1"
            placeholder="Card Number"
          />
          <input type="number" v-model="creditNum.num_2" placeholder="CVV" />
          <input type="text" v-model="creditNum.num_3" placeholder="MM/YY" />
        </div>
      </div>

      <p class="total">總計: NT.{{ clientinfo.total }}</p>
      <div class="btns flex-row">
        <p class="error">{{ error.msg }}</p>
        <base-button
          type="button"
          font_m="medium"
          @click="showPopup(submitData, '確認送出', 'addNewOrder')"
          >送出訂單</base-button
        >
      </div>
    </form>
    <check-popup
      v-if="popupInfo.show"
      :info="popupInfo"
      @close-popup="closePopup"
      :storeId="clientinfo.storeId"
    ></check-popup>
  </main>
</template>

<script>
import { reactive, ref, computed, watch } from "vue";
import { useStore } from "vuex";
import CheckPopup from "../../components/ProductList/Check_Popup.vue";

export default {
  components: { CheckPopup },
  props: ["total", "storeId"],
  setup(props) {
    const store = useStore();
    const clientinfo = reactive({
      storeId: props.storeId,
      clientName: "",
      clientPhone: "",
      clientEmail: "",
      clientAddress: "",
      delivery: "inStore",
      payment: "cash",
      total: "",
      productList: [],
    });
    const cart = ref(JSON.parse(localStorage.getItem("cart")));
    const creditNum = reactive({
      num_1: "",
      num_2: "",
      num_3: "",
    });
    const error = reactive({
      msg: "",
    });
    const submitData = computed(() => {
      const credit = creditNum.num_1 + creditNum.num_2 + creditNum.num_3;
      return {
        ...clientinfo,
        productList: cart.value,
        creditNum: credit,
      };
    });

    clientinfo.total = props.total;

    const popupInfo = ref({
      show: false,
      title: "",
      info: "",
      funName: "",
    });
    function showPopup(info, title, funName) {
      const {
        storeId,
        clientName,
        clientPhone,
        clientEmail,
        clientAddress,
        delivery,
        total,
        productList,
        payment,
      } = submitData.value;
      const { num_1, num_2, num_3 } = creditNum;

      if (
        !storeId ||
        !clientName ||
        !clientPhone ||
        !total ||
        productList.length < 1 ||
        !clientEmail
      ) {
        error.msg = "資料請填寫齊全";
        return;
      }

      if (delivery === "post" && !clientAddress) {
        error.msg = "請填寫郵寄地址";
        return;
      }

      if (payment === "credit") {
        if (!num_1 || !num_2 || !num_3) {
          error.msg = "請填寫信用卡號";
          return;
        }
      }

      popupInfo.value = {
        show: true,
        title: title,
        info: info,
        funName: funName,
      };
    }
    function closePopup(value) {
      popupInfo.value = {
        show: false,
        ...value,
      };
    }

    watch(error, () => {
      if (error.msg) {
        setTimeout(() => {
          error.msg = "";
        }, 1500);
      }
    });

    return {
      creditNum,
      clientinfo,
      popupInfo,
      showPopup,
      closePopup,
      submitData,
      error,
    };
  },
};
</script>

<style scoped>
main {
  margin-top: 1em;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 45em;
  padding: 2em;
  margin: 2em 0;
}

label {
  display: block;
  margin-bottom: 0.2em;
  font-size: 1.4rem;
  letter-spacing: 1px;
}

input {
  width: 100%;
  min-width: 12em;
  padding: 0.5em 0.7em;
  letter-spacing: 1px;
  border: none;
  border-bottom: var(--border-2);
  outline: none;
  background-color: transparent;
}

.radio {
  display: flex;
  flex-wrap: wrap;
  column-gap: 1em;
}
.radio label {
  display: inline;
}
.radio .title {
  width: 100%;
}

.radio input {
  width: 1em;
  min-width: 1em;
  margin-left: 0.1em;
}

.credit_input {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  gap: 0.7em;
}

.credit_input input {
  width: 100%;
}
.credit_input input::placeholder {
  color: var(--grey-300);
}
.credit_input :not(:first-child) {
  width: 45%;
  min-width: 5em;
}

.total {
  font-size: 1.7em;
  align-self: flex-end;
}
.btns {
  width: 100%;
  justify-content: space-between;
}
.error {
  font-size: var(--font-small);
}
@media screen and (max-width: 300px) {
  .btns {
    flex-direction: column;
    align-items: center;
    gap: 0.7em;
  }
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
input[type="number"] {
  -moz-appearance: textfield;
}
@media screen and (max-width: 400px) {
  form {
    padding: 0em;
  }
}
</style>
