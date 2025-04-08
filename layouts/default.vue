<script setup>
import { localStorageKey, themeDarkClassName, themes } from "@/constants";
const theme = ref(false);

onMounted(() => {
  theme.value = localStorage.getItem(localStorageKey.theme) === themes.dark;
  toggleDarkMode();
});

function toggleDarkMode() {
  if (theme.value) {
    document.documentElement.classList.add(themeDarkClassName);
    localStorage.setItem(localStorageKey.theme, themes.dark);
  } else {
    document.documentElement.classList.remove(themeDarkClassName);
    localStorage.setItem(localStorageKey.theme, themes.light);
  }
}
</script>

<template>
  <div class="page-layout">
    <div class="!fixed top-[20%] left-4 z-10 flex flex-col">
      <!-- Switch language  -->
      <SwitchLanguage class-name="!absolute top-[-50px]" />
      <!-- Change theme  -->
      <ToggleSwitch
        @value-change="toggleDarkMode"
        v-model="theme"
        aria-label="switch"
      >
        <template #handle="{ checked }">
          <i
            :class="['!text-xs pi', { 'pi-moon': checked, 'pi-sun': !checked }]"
          />
        </template>
      </ToggleSwitch>
    </div>
    <slot> </slot>
  </div>
</template>
