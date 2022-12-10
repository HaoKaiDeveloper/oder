<template>
  <router-view></router-view>
</template>

<script>
export default {};
</script>

<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&family=Roboto:wght@300;400;500&display=swap");

:root {
  --grey-0: #fff;
  --grey-50: #f5f5f5;
  --grey-100: #8b8b8b;
  --grey-200: #2d2d2d;

  --dash-background: #f0f3f4;

  --primary-1: #ede7f6;
  --primary-2: #b388ff;
  --primary-3: #7c4dff;
  --primary-4: rgb(101, 31, 255);
  /* --primary-5: #6200ea; */

  --box-shadow-1: 5px 5px 10px rgba(0, 0, 0, 0.2);
  --box-shadow-2: 3px 3px 10px rgba(0, 0, 0, 1);

  --font-xsmall: 1rem;
  --font-small: 1.3rem;
  --font-medium: 1.6rem;
  --font-large: 2rem;
  --font-xlarge: 2.5rem;

  --border-1: 1px solid var(--grey-100);
  --border-2: 0.8px solid var(--grey-100);
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html {
  font-size: 62.5%;
}

body {
  font-family: "Noto Sans TC", sans-serif;
  font-family: "Roboto", sans-serif;
  background-color: var(--dash-background);
}

img {
  width: 100%;
  height: 100%;
}

li {
  list-style: none;
}

a {
  text-decoration: none;
}
input::placeholder {
  font-size: 1.4rem;
}

.dark {
  --grey-0: #222222;
  --grey-50: #424242;
  --grey-100: #8b8b8b;
  --grey-200: #fff;
  --dash-background: #101010;
}

.flex-row {
  display: flex;
  align-items: center;
}

.flex-column {
  display: flex;
  flex-direction: column;
}

.grid-center {
  display: grid;
  place-content: center;
}

.absolute-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.fixed-center {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.popBackground {
  width: 100%;
  height: 100%;
  background-color: #2d2d2d;
  opacity: 0.4;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
}

.scroll-box,
body {
  width: 100%;
  overflow: auto;
}
.scroll-box::-webkit-scrollbar,
body::-webkit-scrollbar {
  width: 2px;
}
.scroll-box::-webkit-scrollbar-thumb,
body::-webkit-scrollbar {
  -webkit-border-radius: 4px;
  border-radius: 4px;
  background: var(--grey-100);
}
.scroll-box::-webkit-scrollbar-track,
body::-webkit-scrollbar-track {
  -webkit-border-radius: 10px;
  border-radius: 10px;
  margin: 10px;
}

.fade-enter-active {
  animation: page 0.8s ease;
}
.fade-leave-active {
  animation: page 0.5s ease reverse;
}

@keyframes page {
  from {
    transform: translateY(5em);
    opacity: 0;
  }
  to {
    transform: translateY(0em);
    opacity: 1;
  }
}
</style>
