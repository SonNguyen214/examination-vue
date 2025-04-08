// https://nuxt.com/docs/api/configuration/nuxt-config
import Aura from "@primeuix/themes/aura";
import { themeDarkClassName } from "./constants";

export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },
  css: [
    "~/assets/style/main.scss",
    "primeicons/primeicons.css",
    "flag-icon-css/css/flag-icons.min.css",
  ],
  modules: [
    "@primevue/nuxt-module",
    "@nuxtjs/tailwindcss",
    "@pinia/nuxt",
    "nuxt-lodash",
    "dayjs-nuxt",
    "@nuxtjs/i18n",
    "nuxt-mongoose",
  ],
  //primevue
  primevue: {
    options: {
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: `.${themeDarkClassName}`,
          cssLayer: false,
        },
      },
    },
  },
  app: {
    head: {
      //SEO
      meta: [
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        {
          charset: "utf-8",
        },
        {
          name: "description",
          content: "시험을 볼 수 있는 웹사이트",
        },
        { property: "og:title", content: "Examination" },
        {
          property: "og:description",
          content:
            "다양한 온라인 시험을 쉽고 빠르게 응시하세요. 실시간 점수 확인 및 해설 제공!",
        },
        { property: "og:image", content: "/og-image.jpg" },
        { property: "og:url", content: "https://yourwebsite.com" },
        { property: "og:type", content: "website" },
      ],
      link: [
        { rel: "icon", type: "image/png", href: "/favicon.png" },
        { rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
      ],
    },
  },
  i18n: {
    locales: [
      { code: "kr", language: "ko-KR", file: "kr.json", name: "한국어" },
      { code: "vi", language: "vi-VN", file: "vi.json", name: "Tiếng Việt" },
      { code: "en", language: "en-US", file: "en.json", name: "English" },
    ],
    vueI18n: "./i18n.config.js",
    strategy: "prefix",
    lazy: true,
    langDir: "locales/",
    detectBrowserLanguage: false,
  },
  runtimeConfig: {
    public: {
      apiBaseUrl: process.env.NUXT_API_BASE_URL || "",
    },
  },
  mongoose: {
    uri: process.env.MONGODB_URI,
    options: {},
    modelsDir: "models",
    devtools: true,
  },
});
