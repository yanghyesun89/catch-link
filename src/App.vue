<template>
  <div class="catchLink">
    <router-view />
  </div>
</template>

<style>
html {
  background-color: var(--gray50);
}
body {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  background-color: var(--gray50);
  /* min-height: 700px; */
}
p {
  margin: 0px;
  padding: 0px;
}
.catchLink {
  width: 100%;
  height: 100%;
  /* max-width: 768px; */
  margin: 0 auto;
}
#app {
  width: 100%;
  height: 100%;
  margin: 0px;
  padding: 0px;
  /* min-height: 700px; */
}
</style>
