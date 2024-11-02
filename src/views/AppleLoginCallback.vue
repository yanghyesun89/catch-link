<template>
  <div></div>
</template>
<script>
export default {
  name: "AppleLoginCallback",
  mounted() {
    document.addEventListener("AppleIDSignInOnSuccess", (data) => {
      //handle successful response
      console.log(data);
      //todo success logic
    });
  },
};
</script>
<style scoped></style>
