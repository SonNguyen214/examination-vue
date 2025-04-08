<script setup>
// Define props for the component
defineProps({
  className: String,
});

import { useI18n } from "vue-i18n";
import { useRouter, useRoute } from "vue-router";

const { locale, setLocale } = useI18n();
const router = useRouter();
const route = useRoute();

// Define the list of available languages with their country codes
const countries = ref([
  { code: "kr", codeLocales: "kr" },
  { code: "vn", codeLocales: "vi" },
  { code: "us", codeLocales: "en" },
]);

// Determine the currently selected language based on the locale
const selectedCountry = computed(
  () =>
    countries.value.find((c) => c.codeLocales === locale.value) ||
    countries.value[2] // Default to 'us'
);

// Function to change the language
const changeLanguage = async (newCountry) => {
  if (newCountry.codeLocales !== locale.value) {
    setLocale(newCountry.codeLocales);

    // Update the URL path to reflect the new language
    await router.push({
      path: `/${newCountry.codeLocales}${route.fullPath.replace(
        /^\/[a-z]{2}/,
        ""
      )}`,
    });

    // Wait for the DOM to update before continuing
    await nextTick();
  }
};
</script>

<template>
  <!-- Language selection dropdown -->
  <Select
    :modelValue="selectedCountry"
    :options="countries"
    optionLabel="name"
    class="w-10"
    :class="className"
    @update:modelValue="changeLanguage"
  >
    <!-- Custom display for the selected language -->
    <template #value="slotProps">
      <div v-if="slotProps.value" class="flex items-center justify-center">
        <span
          :class="`flag-icon flag-icon-${slotProps.value.code.toLowerCase()}`"
        ></span>
      </div>
    </template>

    <!-- Custom display for each language option -->
    <template #option="slotProps">
      <div class="flex items-center">
        <span
          :class="`flag-icon flag-icon-${slotProps.option.code.toLowerCase()}`"
        ></span>
      </div>
    </template>
  </Select>
</template>

<style>
/* Styling for flag icons */
.flag-icon {
  width: 30px;
  height: 30px;
}

/* Hide the dropdown menu */
.p-select-dropdown {
  display: none !important;
}

/* Remove padding from the select label */
.p-select-label {
  padding: 0 !important;
}
</style>
