<template>
  <div></div>
</template>
<script>
import { postLogin, getGoogleAccessToken } from "@/api/auth.js";
const googleClientId = process.env.VUE_APP_GOOGLE_LOGIN_CLIENT_ID;
const googleClientSecret = process.env.VUE_APP_GOOGLE_LOGIN_SECRET_KEY;
export default {
  name: "GoogleLoginCallback",
  mounted() {
    const urlParam = new URL(window.location).searchParams;
    const code = urlParam.get("code");

    getGoogleAccessToken(code, googleClientId, googleClientSecret).then(
      (result) => {
        const status = result.status;
        if (status === 200) {
          const data = result.data;
          postLogin(data.access_token, "google").then((loginResult) => {
            const loginData = loginResult.data;
            const loginStatus = loginResult.status;
            if (loginStatus === 200) {
              sessionStorage.setItem("googleAccessToken", data.access_token);
              sessionStorage.setItem("accessToken", loginData.data.accessToken);
              sessionStorage.setItem(
                "refreshToken",
                loginData.data.refreshToken
              );
              sessionStorage.setItem("email", loginData.data.email);
              this.$router.push("home");
            } else {
              alert(this.$i18n.t("error"));
            }
          });
        } else {
          alert(this.$i18n.t("error"));
        }
      }
    );
  },
};
</script>
<style></style>
