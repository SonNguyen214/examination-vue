import { defineStore } from "pinia";
import { pages } from "~/constants";
import { requestGetDetailExam } from "~/service/exams";

export const useQuestionStore = defineStore("handleQuestionStore", () => {
  const { $api } = useNuxtApp();
  const toast = useToast();
  const route = useRoute();
  const router = useRouter();

  // 🌟 State variables
  const selectedAnswers = reactive({}); // Stores selected answers with question IDs as keys
  const totalPoint = ref(0); // Stores the total score after submitting the exam
  const submitAnswers = ref(false); // Tracks if the user has submitted their answers
  const timeRemaining = ref(0); // Stores the remaining exam time
  const dataQuestionsExam = ref({}); // Holds exam question data
  const loadingList = ref(false); // Indicates whether data is being loaded

  // 🌟 Fetch exam question data from API
  const fetchDataQuestionsExam = async (examId, offset = 0, limit = 9999) => {
    try {
      loadingList.value = true; // Set loading state to true before fetching

      const { url, config } = requestGetDetailExam({
        examId: examId || route.params.id,
        limit: limit,
        offset: offset,
      });
      const response = await $api(url, config);

      dataQuestionsExam.value = response.data.data || {}; // Store fetched questions
      submitAnswers.value = dataQuestionsExam.value?.hasSubmitted; // Set submission status
      useKeys(selectedAnswers).forEach((key) => delete selectedAnswers[key]);
      useAssign(selectedAnswers, dataQuestionsExam.value?.userAnswers); // Store user answers
      totalPoint.value = dataQuestionsExam.value?.totalPoint || 0; // Store total points
      timeRemaining.value = dataQuestionsExam.value?.timeRemaining || 0; // Store remaining time
    } catch (err) {
      console.error("Error fetching data", err);
      //when submit value is true, disable website
      toast.add({
        severity: "error",
        summary: "Error",
        detail: err.message || "Error",
        life: 3000,
      });

      //redirect to error page when call error.
      router.push(pages.errorPage);
    } finally {
      loadingList.value = false;
    }
  };

  // 🌟 Set selected answers for a question
  const setSelectedAnswers = (questionId, answer) => {
    selectedAnswers[questionId] = answer; // Store selected answer for a specific question
  };

  // 🌟 Set total score
  const setTotalPoint = (points) => {
    totalPoint.value = points;
  };

  // 🌟 Mark exam as submitted
  const submit = (bol) => {
    submitAnswers.value = Boolean(bol);
  };

  // 🌟 Update remaining time
  const setTimeRemaining = (time) => {
    timeRemaining.value = useToNumber(time);
  };

  // 🌟 Compute the total number of exam questions
  const totalQuestions = computed(
    () => dataQuestionsExam.value?.data?.length ?? 0
  );

  return {
    totalQuestions,
    selectedAnswers,
    totalPoint,
    submitAnswers,
    timeRemaining,
    dataQuestionsExam,
    loadingList,
    setSelectedAnswers,
    setTotalPoint,
    submit,
    setTimeRemaining,
    fetchDataQuestionsExam,
  };
});
