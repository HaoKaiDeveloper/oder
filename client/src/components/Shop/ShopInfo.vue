<template>
  <main>
    <div class="info">
      <div class="headerImg flex-row">
        <img :src="headerSrc" alt="header" v-if="headerSrc" />
        <span v-else>
          <font-awesome-icon icon="fa-solid fa-user" />
        </span>
      </div>

      <div class="name">
        <h1>
          {{ storeInfo.storeName }}
        </h1>
        <p class="address">
          <span>{{ storeInfo.address }}</span>
        </p>
      </div>

      <div class="storeInfo">
        <p>
          <span>{{ storeInfo.email }}</span>
        </p>
        <p>
          <span>{{ storeInfo.phoneNumber }}</span>
        </p>
      </div>
    </div>
  </main>
</template>

<script>
import { computed } from "vue";
import { host } from "../../utils/RouteApi";
export default {
  props: ["storeInfo", "categories"],
  setup(props) {
    const headerSrc = computed(() => {
      if (props.storeInfo.headerImg.length > 0) {
        return `${host}/${props.storeInfo.headerImg}`;
      } else {
        return "";
      }
    });
    return {
      headerSrc,
    };
  },
};
</script>

<style scoped>
main {
  width: 100%;
  height: 100%;
  background-color: var(--grey-0);
  padding: 1.5em;
  border-radius: 0.5em;
}

.headerImg {
  width: 6em;
  height: 6em;
  border-radius: 1em;
  overflow: hidden;
  background-color: var(--grey-50);
  justify-content: center;
}
.headerImg span {
  font-size: 2em;
  color: var(--grey-100);
}

img {
  object-fit: cover;
}
p {
  font-size: 1.5rem;
  letter-spacing: 1px;
}
.info {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5em;
  position: relative;
}
.storeInfo {
  align-self: flex-end;
  text-align: end;
  color: var(--grey-400);
  font-weight: 500;
}

.name {
  flex: 1;
}

.name h1 {
  font-size: var(--font-xlarge);
  letter-spacing: 2px;
  font-weight: 500;
}

@media screen and (max-width: 570px) {
  .info {
    display: grid;
    grid-template-columns: min-content 1fr;
    grid-template-rows: max-content 1fr;
    justify-items: start;
    gap: 0;
    column-gap: 1.5em;
  }
  .headerImg {
    width: 5em;
    height: 5em;
    grid-column: 1/2;
    grid-row: 1/-1;
  }

  .name {
    grid-column: 2/-1;
    grid-row: 1/2;
  }

  .name h1 {
    font-size: var(--font-large);
  }
  .address {
    display: none;
  }
  p {
    font-size: var(--font-xsmall);
    margin-top: 0.2em;
  }
  .storeInfo {
    text-align: start;
    grid-column: 2/-1;
    grid-row: 2/-1;
    transform: translateY(-3px);
  }
}
</style>
