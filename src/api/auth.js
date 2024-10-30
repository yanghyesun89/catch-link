import axios from "axios";

const axiosAuthService = axios.create({
  headers: {
    ContentType: "application/json",
  },
});

axiosAuthService.interceptors.response.use(
  async (response) => {
    return response;
  },
  async (error) => {
    const { response } = error;
    if (response.status === 401) {
      window.location.href = "/error";
    } else if (response.status >= 500) {
      console.log("500 error");
      window.location.href = "/error";
    } else {
      console.log(error.response);
      return error.response;
    }
  }
);

const postLogin = async (accessToken, socialType) => {
  let languageType = "korean";
  let localeLang =
    window.navigator.language ||
    window.navigator.userLanguage ||
    window.navigator.systemLanguage ||
    "en";
  localeLang = localeLang.toLowerCase();
  localeLang = localeLang.substring(0, 2);

  if (localeLang === "en") languageType = "english";

  localStorage.clear();
  let header = "";
  let headers;
  if (socialType.trim() === "apple") {
    header = accessToken;
    headers = { "id-token": header };
  } else {
    header = "Bearer " + accessToken;
    headers = { Authorization: header };
  }

  return await axiosAuthService.post(
    "/api/user/signin",
    {
      socialType: socialType,
      languageType: languageType,
      deviceType: "web",
    },
    { headers }
  );
};

const getLogout = async (accessToken, clientSecret, clientId) => {
  const url = `/oauth2.0/token?grant_type=delete&client_id=${clientId}&client_secret=${clientSecret}&access_token=${accessToken}&service_provider=NAVER`;
  return await axiosAuthService.get(url);
};

const getGoogleAccessToken = async (code, clientId, clientSecret) => {
  return await axiosAuthService.post("/token", {
    code: code,
    client_id: clientId,
    client_secret: clientSecret,
    redirect_uri: "http://localhost:8080/google",
    grant_type: "authorization_code",
  });
};

export { postLogin, getLogout, getGoogleAccessToken };
