<template>
  <div></div>
</template>
<script>
import { postLogin } from "@/api/auth.js";
const appleState = process.env.VUE_APP_APPLE_LOGIN_STATE;
export default {
  name: "AppleLoginCallback",
  mounted() {
    document.addEventListener("AppleIDSignInOnSuccess", (data) => {
      let state = data.detail.authorization.state;
      if (state === appleState) {
        let authId = data.detail.authorization.id_token;
        postLogin(authId, "apple").then((result) => {
          const status = data.status;
          console.log(status);
          if (status === 200) {
            const data = result.data;
            sessionStorage.setItem("loginType", "apple");
            sessionStorage.setItem("appleIdToken", authId);
            sessionStorage.setItem("accessToken", data.data.accessToken);
            sessionStorage.setItem("refreshToken", data.data.refreshToken);
            sessionStorage.setItem("email", data.data.email);
            this.$router.push("home");
          } else {
            alert(this.$i18n.t("error"));
          }
        });
      }
    });
    document.addEventListener("AppleIDSignInOnFailure", (error) => {
      console.log(error);
      alert(this.$i18n.t("apple_login_error"));
    });
  },
};
</script>
<style scoped></style>
