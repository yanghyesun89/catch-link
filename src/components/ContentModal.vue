<template>
  <div class="modalBackground">
    <div class="modal1" :style="{ height: height }">
      <div class="inner">
        <slot name="header"></slot>
        <slot name="content"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "ContentModal",
  props: {
    height: {
      type: String,
      default: "420px",
    },
  },
};
</script>
<style scoped>
.modalBackground {
  z-index: 9;
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-color: #00000073;
}
.modal1 {
  width: 377px;
  height: 420px;
  border-radius: 16px;
  background-color: var(--white);
  overflow: auto;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.modal1 .inner {
  /* padding: 20px; */
  height: 100%;
  position: relative;
}
@media screen and (max-width: 834px) {
  .modal1 {
    width: 336px;
  }
}
</style>
