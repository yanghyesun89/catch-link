<template>
  <div class="error">
    <div class="errorInner">
      <div class="errorMsg">500 ERROR</div>
      <img src="../../public/images/img_cat_question.png" class="errorIcon" />
      <div class="errorMsg">{{ $t("error") }}</div>
    </div>
  </div>
</template>
<script>
export default {
  name: "errorCode500",
};
</script>
<style scoped>
.error {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.errorInner {
  text-align: center;
}
.errorIcon {
  width: 63px;
}
.errorMsg {
  font-weight: 600;
  font-size: 18px;
  color: var(--gray400);
  margin-top: 12px;
}
</style>
