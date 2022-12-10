import { createApp } from "vue";
import App from "./App.vue";
import router from "./router.js";
import store from "./store/index.js";

import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import BaseButton from "./components/UI/BaseButton.vue";
import BaseCard from "./components/UI/BaseCard.vue";
import BaseButton2 from "./components/UI/BaseButton2.vue";

import {
  faUser,
  faHouse,
  faRectangleList,
  faShop,
  faBoxesStacked,
  faChartPie,
  faRightFromBracket,
  faMagnifyingGlass,
  faXmark,
  faCloudArrowUp,
  faCamera,
  faEnvelope,
  faPhone,
  faLocationDot,
  faImage,
  faPlus,
  faMinus,
  faCartShopping,
  faCheck,
  faMoneyBill1,
  faCreditCard,
  faTruck,
  faReceipt,
  faAlignRight,
  faChevronUp,
  faChartColumn,
  faArrowTrendUp,
  faTruckFast,
  faWallet,
  faFileExport,
  faGear,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faAngleRight,
  faCircleHalfStroke,
} from "@fortawesome/free-solid-svg-icons";

import {
  faBell,
  faCalendar,
  faChartBar,
  faMoon,
} from "@fortawesome/free-regular-svg-icons";

library.add(
  faUser,
  faHouse,
  faRectangleList,
  faShop,
  faBoxesStacked,
  faChartPie,
  faRightFromBracket,
  faMagnifyingGlass,
  faXmark,
  faCloudArrowUp,
  faCamera,
  faEnvelope,
  faPhone,
  faLocationDot,
  faImage,
  faPlus,
  faMinus,
  faCartShopping,
  faCheck,
  faMoneyBill1,
  faCreditCard,
  faTruck,
  faReceipt,
  faCalendar,
  faAlignRight,
  faChevronUp,
  faBell,
  faChartColumn,
  faArrowTrendUp,
  faChartBar,
  faTruckFast,
  faWallet,
  faFileExport,
  faGear,
  faEye,
  faEyeSlash,
  faAngleLeft,
  faAngleRight,
  faMoon,
  faCircleHalfStroke
);

const app = createApp(App);

app.component("font-awesome-icon", FontAwesomeIcon);
app.component("base-button", BaseButton);
app.component("base-card", BaseCard);
app.component("base-button-2", BaseButton2);

app.use(router);
app.use(store);
app.mount("#app");
