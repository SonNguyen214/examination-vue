<template>
  <div
    class="h-dvh w-dvw flex justify-center flex-col gap-3 items-center !text-xl font-semibold"
  >
    <div>{{ $t("page_error_text") }}</div>
    <NuxtLink href="/" class="!underline !cursor-pointer !text-blue-700"
      >{{ $t("back_to_home") }} -></NuxtLink
    >
  </div>
</template>
