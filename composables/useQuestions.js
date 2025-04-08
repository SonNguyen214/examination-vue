import { requestResetExam, requestSubmitExam } from "~/service/exams";

export const useQuestions = () => {
  const questionStore = useQuestionStore();
  const toast = useToast();
  const { $api } = useNuxtApp();
  const route = useRoute();

  // Handle user answer selection
  const handleChooseAnswer = (questionId, answer) => {
    if (questionStore.timeRemaining <= 0 && questionStore.submitAnswers) return;
    // Store first attempt answer
    questionStore.setSelectedAnswers(questionId, answer);
  };

  // Handle submitting answers to the API
  const handleSendAnswers = async () => {
    if (questionStore.submitAnswers) return;
    try {
      delete questionStore.selectedAnswers["[object Object]"];
      // Send answers to the API

      const { url, config } = requestSubmitExam({
        examId: route.params.id || "",
        timeRemaining: questionStore.timeRemaining,
        body: toRaw(questionStore.selectedAnswers),
      });
      const response = await $api(url, config);
      if (response?.status === 200) {
        questionStore.fetchDataQuestionsExam();
        toast.add({
          severity: "success",
          summary: "축하해요!",
          detail: "과제를 성공적으로 제출했습니다.",
          life: 3000,
        });
      } else {
        toast.add({
          severity: "error",
          summary: "오류!",
          detail: "나중에 다시 시도해 주세요.",
          life: 3000,
        });
      }
    } catch (error) {
      // Show error notification if submission fails
      toast.add({
        severity: "error",
        summary: "오류!",
        detail: error?.response?.data?.message || "나중에 다시 시도해 주세요.",
        life: 3000,
      });
    }
  };

  const handleRestart = async () => {
    const { url, config } = requestResetExam({
      examId: route.params.id || "",
    });
    const res = await $api(url, config);
    if (res?.status === 200) {
      questionStore.fetchDataQuestionsExam();
      // Show success notification
      toast.add({
        severity: "success",
        summary: "축하해요!",
        detail: "테스트 재설정 성공",
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "오류!",
        detail: "나중에 다시 시도해 주세요.",
        life: 3000,
      });
    }
  };

  return {
    handleSendAnswers,
    handleChooseAnswer,
    handleRestart,
  };
};
