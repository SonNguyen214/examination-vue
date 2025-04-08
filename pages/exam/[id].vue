<script setup>
import BoxQuestions from "@/components/Exam/BoxQuestions.vue";
import BoxAnswers from "@/components/Exam/BoxAnswers.vue";

useHead({
  title: "Exam | CBT Exam",
});

// Enable warning when the page is reloaded
useWarningReloadPage();

const questionStore = useQuestionStore();

// Check if the viewport size is valid
const isValidWindowSize = useCheckViewPort();
const route = useRoute();

onMounted(() => {
  questionStore.fetchDataQuestionsExam(route.params.id);
});

const loading = useFakeLoadingTimeOut(questionStore.loadingList);
</script>

<template>
  <div v-if="!isValidWindowSize">{{ $t("invalid_screen_size") }}</div>
  <!-- Exam interface with question and answer sections -->
  <div v-else class="exam-page">
    <BoxQuestions :loading="loading" />
    <BoxAnswers :loading="loading" />
  </div>
</template>
