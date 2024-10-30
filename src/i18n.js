import { createI18n } from "vue-i18n";

//브라우저 언어 가져오기
/* eslint-disable */
let localeLang = window.navigator.language || window.navigator.userLanguage || window.navigator.systemLanguage || "en";
localeLang = localeLang.toLowerCase();
localeLang = localeLang.substring(0, 2);

// json 파일을 읽어들이기 위한 function
const requireLang = require.context(
  "@/locales", // 폴더명 입니다.
  true,
  /\.json$/ // 폴더 아래 json 찾기용
);

const messages = {};

// json file read
for (const file of requireLang.keys()) {
  const path = file.replace(/(\.\/|\.json$)/g, "").split("/"); // 폴더 패스
  path.reduce((o, s, i) => {
    if (o[s]) return o[s];

    o[s] = i + 1 === path.length ? requireLang(file) : {};
    return o[s];
  }, messages);
}
Object.freeze(messages);

const i18n = new createI18n({
  locale: localeLang, // 기본 locale
  fallbackLocale: "en", // locale 설정 실패시 사용할 locale
  messages, // 다국어 메시지
  silentTranslationWarn: true, // 메시지 코드가 없을때 나오는 console 경고 off
});

export default i18n;
