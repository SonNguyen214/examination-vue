/**
 * Custom composable `useWarningReloadPage` to prevent accidental page reloads or navigation.
 * This function warns users before they reload or leave the page.
 */
export const useWarningReloadPage = () => {
  const handleBeforeUnload = (event) => {
    event.preventDefault();
    // Required for showing the browser's default confirmation dialog
    event.returnValue = "";
  };

  // Attach the event listener when the component is mounted
  onMounted(() => {
    window.addEventListener("beforeunload", handleBeforeUnload);
  });

  // Remove the event listener when the component is unmounted
  onUnmounted(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
  });
};
