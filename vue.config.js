const { defineConfig } = require("@vue/cli-service");

module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      "/api": {
        target: "https://catchlinkapi.meomimo.com",
        changeOrigin: true,
      },
      "/oauth2.0": {
        target: "https://nid.naver.com",
      },
      "/token": {
        target: "https://oauth2.googleapis.com",
      },
    },
  },
});
