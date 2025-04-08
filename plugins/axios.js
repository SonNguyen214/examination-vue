import axios from "axios";
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  // Create an Axios instance with a base URL from runtime configuration
  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
  });

  return {
    provide: {
      api,
    },
  };
});
