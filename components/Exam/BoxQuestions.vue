<script setup>
defineProps({
  loading: Boolean,
});
import CustomButton from "../Custom/CustomButton.vue";
import CustomModal from "../Custom/CustomModal.vue";
import CalculatorExam from "../CalculatorExam.vue";
import { useRouter } from "vue-router";
import { fontSizeExam, pages } from "@/constants";
import { checkColorAnswer } from "@/utils";

const questionStore = useQuestionStore();

const { handleChooseAnswer, handleRestart } = useQuestions();

const router = useRouter();

const openModalRestart = ref(false);

//ref for modal remaining questions
const openModalRemaining = ref(false);

// Modal state
let openModalCalculator = ref(false);

// Font size state
const fontSizeChange = ref(fontSizeExam.base);

// References for questionContent class
const questionContentRef = ref();

// Compute the set of answered questions
const answeredQuestions = computed(
  () => new Set(useKeys(questionStore.selectedAnswers))
);

// Compute the list of remaining unanswered questions
const remainingQuestions = computed(
  () =>
    questionStore.dataQuestionsExam?.data?.filter(
      (q) => !answeredQuestions.value.has(q._id)
    ) ?? []
);

// Pagination state
const currentPage = ref(0);
const rowsPerPage = 10;

//data show in a page
const paginatedData = computed(() =>
  questionStore.dataQuestionsExam?.data?.slice(
    currentPage.value * rowsPerPage,
    currentPage.value * rowsPerPage + rowsPerPage
  )
);

// Handle page change
const onPageChange = (page) => {
  currentPage.value = page.page;
  questionContentRef.value.scrollTo({ top: 0, behavior: "smooth" });
};

// Toggle calculator modal
const toggleModalCalculator = () => {
  openModalCalculator.value = !openModalCalculator.value;
};

// Toggle restart modal
const toggleModalRestart = () => {
  openModalRestart.value = !openModalRestart.value;
};

//toggle modal remaining questions
const toggleShowRemaining = () => {
  openModalRemaining.value = !openModalRemaining.value;
};

// Watch for changes in the URL hash to update the current page
watch(
  () => router.currentRoute.value.hash,
  (newHash) => {
    if (!newHash) return; // Exit if there is no hash

    // Extract the question number from the hash (e.g., #question_11 → 11)
    const match = newHash.match(/question_(\d+)/);
    if (match) {
      const questionNumber = parseInt(match[1]); // Convert extracted string to a number

      // Determine the current page based on the question position
      currentPage.value = Math.floor((questionNumber - 1) / rowsPerPage);
    }
  }
);

const handleBackToHome = () => {
  //if submitted => don't need to confirm
  if (questionStore.submitAnswers) {
    router.push(pages.home);
    return;
  }

  if (window.confirm("귀하의 답변은 저장되지 않습니다.외출하실래요?")) {
    router.push(pages.home);
  } else {
    console.log("Click Cancel");
  }
};
</script>

<template>
  <div class="box-questions">
    <div class="questions">
      <!-- Header -->
      <div class="header">
        <!-- font change  -->
        <div class="font-size-change">
          <div>{{ $t("exam_page.change_font") }}</div>
          <div
            v-for="size in [
              fontSizeExam.base,
              fontSizeExam.xl,
              fontSizeExam.xxl,
            ]"
            :key="size"
            class="items"
          >
            <RadioButton
              v-model="fontSizeChange"
              :inputId="`fontSizeChange${size}`"
              name="fontSizeChange"
              :value="size"
            />
            <label :for="`fontSizeChange${size}`">
              {{
                size === fontSizeExam.base
                  ? "100%"
                  : size === fontSizeExam.xl
                  ? "150%"
                  : "200%"
              }}
            </label>
          </div>
        </div>

        <!-- question  -->
        <div class="question-remaining">
          <div>
            {{ $t("exam_page.total_questions") }}:
            {{ loading ? 0 : questionStore.totalQuestions }}
          </div>
          <div>
            {{ $t("exam_page.questions_answered") }}:
            {{ loading ? 0 : answeredQuestions.size }}
          </div>
          <div class="text-[var(--error-color)]">
            {{ $t("exam_page.remaining_questions") }}:
            {{ loading ? 0 : remainingQuestions?.length }}
          </div>
        </div>
      </div>

      <!-- Questions content -->
      <div v-if="loading" class="px-10">
        <Skeleton height="1.5rem" width="30rem" class="mb-2 mt-10"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="45rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="40rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="30rem" class="mb-2 mt-10"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="45rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="40rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="30rem" class="mb-2 mt-10"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="45rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="40rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="30rem" class="mb-2 mt-10"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="45rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="50rem" class="mb-2"></Skeleton>
        <Skeleton height="1.5rem" width="40rem" class="mb-2"></Skeleton>
      </div>
      <div
        v-else
        class="questions-content"
        ref="questionContentRef"
        :style="{ fontSize: fontSizeChange + 'px' }"
      >
        <div
          v-if="questionStore.submitAnswers"
          class="absolute top-15 right-5 text-xl font-semibold text-[var(--primary-color)]"
        >
          {{ $t("submitted") }}
        </div>
        <div
          v-for="question in paginatedData"
          :key="question.No"
          v-memo="[
            questionStore.selectedAnswers[question._id],
            questionStore.submitAnswers,
            fontSizeChange,
          ]"
          class="items"
        >
          <div
            class="title"
            :id="question._id"
            :style="{ fontSize: `${Number(fontSizeChange) + 2}px` }"
          >
            <div class="no-question">{{ question.No }}.</div>
            <span>{{ question.question }}</span>
          </div>
          <div
            v-for="(answer, index) in question.answers"
            :key="index"
            class="answer"
            @click="handleChooseAnswer(question._id, answer)"
            :class="{
              '!pointer-events-none':
                questionStore.timeRemaining <= 0 || questionStore.submitAnswers,
            }"
          >
            <!-- change color -->
            <span :class="checkColorAnswer(questionStore, question, answer)">
              {{ index + 1 }}
            </span>
            <span>{{ answer }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Controls -->
    <div class="action-questions">
      <div class="group-btn">
        <CustomButton
          label="go_back"
          icon="pi pi-arrow-left"
          @handle-click="handleBackToHome"
        />
        <CustomButton
          icon="pi pi-calculator"
          label=""
          @handle-click="toggleModalCalculator"
          class="button-calculator"
          variant="outline"
          aria-label="calculator"
        />
        <CustomButton
          icon="pi pi-refresh"
          label=""
          @handle-click="toggleModalRestart"
          class="button-calculator"
          variant="outline"
          :loading="loading"
        />
      </div>

      <Paginator
        :rows="rowsPerPage"
        :totalRecords="questionStore.totalQuestions"
        :first="currentPage * rowsPerPage"
        template="FirstPageLink PrevPageLink CurrentPageReport NextPageLink LastPageLink"
        @page="onPageChange"
      />

      <div class="group-check flex gap-2">
        <div class="check" v-if="questionStore.submitAnswers">
          <span>{{ $t("total_point") }}: {{ questionStore.totalPoint }}</span>
        </div>
        <!-- label unSolve problems -->
        <div
          class="check"
          :class="{
            error: remainingQuestions?.length > 0,
            '!pointer-events-none': loading,
          }"
          @click="toggleShowRemaining"
        >
          <i
            class="pi pi-check-circle"
            :class="{
              'pi-times-circle': remainingQuestions?.length > 0,
            }"
          >
          </i>
          <span>{{
            remainingQuestions?.length > 0
              ? $t("exam_page.remaining_questions")
              : $t("exam_page.answered_full")
          }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal calculator -->
  <CustomModal
    @closeModal="toggleModalCalculator"
    :open="openModalCalculator"
    class="modal-calculator"
  >
    <template #content>
      <CalculatorExam />
    </template>
  </CustomModal>

  <!-- Modal remaining questions -->
  <CustomModal
    header="exam_page.remaining_questions"
    @closeModal="toggleShowRemaining"
    :open="openModalRemaining"
    class="modal-remaining"
  >
    <template #content>
      <div
        v-if="!remainingQuestions || remainingQuestions?.length <= 0"
        class="mt-20 text-[var(--primary-color)]"
      >
        {{ $t("exam_page.answered_full") }}
      </div>

      <div
        v-for="question in remainingQuestions"
        v-else
        :key="question.No"
        v-memo="[
          questionStore.selectedAnswers[question._id],
          questionStore.submitAnswers,
          fontSizeChange,
        ]"
        class="items"
        :style="{ fontSize: fontSizeChange + 'px' }"
      >
        <div
          class="title"
          :style="{ fontSize: `${Number(fontSizeChange) + 2}px` }"
        >
          <div class="no-question">{{ question.No }}.</div>
          <span>{{ question.question }}</span>
        </div>
        <div
          v-for="(answer, index) in question.answers"
          :key="index"
          class="answer"
          @click="handleChooseAnswer(question._id, answer)"
          :class="{
            '!pointer-events-none':
              questionStore.timeRemaining <= 0 || questionStore.submitAnswers,
          }"
        >
          <!-- change color -->
          <span :class="checkColorAnswer(questionStore, question, answer)">
            {{ index + 1 }}
          </span>
          <span>{{ answer }}</span>
        </div>
      </div>
    </template>
  </CustomModal>

  <CustomModal
    @closeModal="toggleModalRestart"
    :open="openModalRestart"
    class="modal-confirm"
    header="notice"
    footer
    labelBtnSubmit="retake"
    @handle-submit="
      () => {
        handleRestart(), toggleModalRestart();
      }
    "
  >
    <template #content>{{ $t("retake_exam") }}</template>
  </CustomModal>
</template>
