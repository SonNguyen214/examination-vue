export const useCheckViewPort = () => {
  // Function to determine if the viewport width is at least 960px
  const getIsValidWindowSize = () =>
    typeof window !== "undefined" &&
    window.matchMedia("(min-width: 960px)").matches;

  // Reactive reference to store the viewport size status
  const isValidWindowSize = ref(getIsValidWindowSize() || true);

  // Function to update the reactive state when the viewport changes
  const updateBreakpoint = () => {
    isValidWindowSize.value = getIsValidWindowSize();
  };

  let mediaQuery; // Variable to store the MediaQueryList object

  onMounted(() => {
    if (typeof window !== "undefined") {
      mediaQuery = window.matchMedia("(min-width: 960px)");
      // Add event listener to detect viewport changes
      mediaQuery.addEventListener("change", updateBreakpoint);
    }
  });

  onUnmounted(() => {
    // Remove event listener when the component is unmounted to prevent memory leaks
    if (mediaQuery) {
      mediaQuery.removeEventListener("change", updateBreakpoint);
    }
  });

  // Return the reactive state so it can be used in components
  return isValidWindowSize;
};
