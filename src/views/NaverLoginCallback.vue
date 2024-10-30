<template>
  <div></div>
</template>
<script>
import { postLogin } from "@/api/auth.js";

const naverClientId = process.env.VUE_APP_NAVER_LOGIN_CLIENT_ID;
export default {
  name: "NaverLoginCallback",
  mounted() {
    this.naverLogin = new window.naver_id_login(naverClientId);
    this.accessToken = this.naverLogin.oauthParams.access_token;

    postLogin(this.accessToken, "naver").then((result) => {
      const data = result.data;
      const status = data.status;
      if (status === 200) {
        sessionStorage.setItem("loginType", "naver");
        sessionStorage.setItem("naverAccessToken", this.accessToken);
        sessionStorage.setItem("accessToken", data.data.accessToken);
        sessionStorage.setItem("refreshToken", data.data.refreshToken);
        sessionStorage.setItem("email", data.data.email);
        this.$router.push("home");
      }
    });
  },
};
</script>
<style></style>
