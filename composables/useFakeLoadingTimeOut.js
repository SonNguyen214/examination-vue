export const useFakeLoadingTimeOut = (mainLoadingData) => {
  const loading = ref(true);
  let timeOutId;

  watchEffect(() => {
    loading.value = true;

    timeOutId = setTimeout(() => {
      loading.value = mainLoadingData.value;
    }, 1000);
  });

  onUnmounted(() => {
    clearTimeout(timeOutId);
  });

  return loading;
};
