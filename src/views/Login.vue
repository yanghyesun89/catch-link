<template>
  <div class="loginContent">
    <div class="loginTitleContent">
      <div class="loginTitle">
        <p class="sub1">{{ $t("save_link") }}</p>
        <p class="sub2">{{ $t("catch_link") }}</p>
        <img src="../../public/images/login_logo.png" class="sub3" />
      </div>
    </div>
    <div class="loginSocialContent">
      <div class="loginSocial">
        <div>
          <div id="naver_id_login" class="inlineBlock"></div>
        </div>
        <div>
          <div id="G_OAuth_btn" class="inlineBlock" @click="onClickGoogleLogin">
            <img
              src="../../public/images/google_login.png"
              class="googleLogin"
            />
          </div>
        </div>
        <div>
          <div class="inlineBlock">
            <div
              id="appleid-signin"
              data-color="black"
              data-border="true"
              data-type="sign in"
              class="appleLogin"
              @click="onClickAppleLogin"
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
const naverClientId = process.env.VUE_APP_NAVER_LOGIN_CLIENT_ID;
const googleClientId = process.env.VUE_APP_GOOGLE_LOGIN_CLIENT_ID;
const appleClientId = process.env.VUE_APP_APPLE_LOGIN_CLIENT_ID;
const domain = "http://localhost:8080";
export default {
  name: "LoginView",
  data() {
    return {
      test: "",
    };
  },
  mounted() {
    //naver 로그인
    this.naverLogin = new window.naver_id_login(
      naverClientId,
      `${domain}/naver`
    );
    var state = this.naverLogin.getUniqState();
    this.naverLogin.setButton("green", 3, 50); // 버튼설정
    this.naverLogin.setDomain(domain);
    this.naverLogin.setState(state);
    // this.naverLogin.setPopup();
    this.naverLogin.init_naver_id_login();

    //구글 로그인
    // let google = window.google;
    // google.accounts.id.initialize({
    //   client_id: "YOUR_GOOGLE_CLIENT_ID",
    //   callback: handleCredentialResponse,
    // });
    // google.accounts.id.prompt();

    // google.accounts.id.renderButton(document.getElementById("G_OAuth_btn"), {
    //   theme: "outline",
    //   size: "large",
    // });

    //애플 로그인
    let AppleID = window.AppleID;
    AppleID.auth.init({
      clientId: appleClientId,
      scope: "email",
      redirectURI: `${domain}/apple`,
      state: "[STATE]",
      nonce: "[NONCE]",
      usePopup: true,
    });
  },
  methods: {
    onClickGoogleLogin() {
      const url =
        "https://accounts.google.com/o/oauth2/v2/auth?client_id=" +
        googleClientId +
        "&redirect_uri=" +
        `${domain}/google` +
        "&response_type=code" +
        "&scope=email profile";
      window.location.href = url;
    },
    async onClickAppleLogin() {
      try {
        let AppleID = window.AppleID;
        const data = await AppleID.auth.signIn();
        console.log(data);
      } catch (error) {
        alert(this.$i18n.t("apple_login_error"));
      }
    },
  },
};
</script>
<style>
.loginContent {
  height: 100%;
}
.loginTitleContent {
  position: relative;
  height: 40%;
  background-color: #f1480010;
}
.loginTitle {
  position: absolute;
  text-align: center;
  top: 73%;
  left: 50%;
  transform: translate(-50%, 0);
}
.loginTitle .sub1 {
  color: var(--gray400);
  font-size: 16px;
}
.loginTitle .sub2 {
  margin-top: 12px;
  color: var(--blue500);
  font-size: 24px;
}
.loginTitle .sub3 {
  margin-top: 4px;
  width: 64px;
}
.loginSocialContent {
  height: 60%;
  text-align: center;
}
.loginSocial {
  padding-top: 13%;
}
.inlineBlock {
  display: inline-block;
}
.loginBox {
  width: 60px;
}
.googleLogin {
  width: 229px;
  border: 1px solid var(--gray200);
  border-radius: 10px;
  cursor: pointer;
}
.appleLogin {
  width: 231px;
  height: 47px;
  cursor: pointer;
}
@media screen and (min-width: 360px) {
  .loginTitle {
    top: 73%;
  }
  .loginSocial {
    padding-top: 12%;
  }
}
@media screen and (max-height: 668px) {
  .loginTitle {
    top: 66%;
  }
  .loginSocial {
    padding-top: 12%;
  }
}
@media screen and (min-width: 520px) {
  .loginTitle {
    top: 75%;
  }
  .loginSocial {
    padding-top: 10%;
  }
}
@media screen and (min-width: 768px) {
  .loginTitle {
    top: 77%;
  }
  .loginSocial {
    padding-top: 8%;
  }
}
@media screen and (min-width: 1024px) {
  .loginTitle {
    top: 78%;
  }
  .loginSocial {
    padding-top: 5%;
  }
}
</style>
