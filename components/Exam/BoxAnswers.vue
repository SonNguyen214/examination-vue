<script setup>
defineProps({
  loading: Boolean,
});
import CustomButton from "../Custom/CustomButton.vue";
import CountDownTime from "../CountDownTime.vue";
import CustomModal from "../Custom/CustomModal.vue";
import { checkColorAnswer } from "@/utils";
const questionStore = useQuestionStore();

const { handleSendAnswers, handleChooseAnswer } = useQuestions();

// Modal state for submission confirmation
const openModalConfirm = ref(false);

// Toggle submission confirmation modal
const toggleModalConfirm = () => {
  openModalConfirm.value = !openModalConfirm.value;
};

const handleSubmit = () => {
  handleSendAnswers();
  toggleModalConfirm();
};
</script>

<template>
  <div class="box-answers">
    <div class="content">
      <!-- Countdown Timer -->
      <CountDownTime
        :time-expired="questionStore.dataQuestionsExam.timeExpired || 0"
        :stop-count-down="questionStore.submitAnswers"
        @handle-out-of-time="handleSendAnswers"
        :loading="loading"
      />

      <!-- Question answers -->
      <div class="answers" :class="{ ' !overflow-hidden': loading }">
        <div v-if="loading">
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
          <Skeleton height="2.5rem" class="my-1 !w-full"></Skeleton>
        </div>
        <div
          v-else
          v-for="question in questionStore.dataQuestionsExam.data"
          :key="question.No"
          class="items"
          v-memo="[
            questionStore.selectedAnswers[question._id],
            questionStore.submitAnswers,
          ]"
        >
          <a :href="'#' + question._id" class="no-question">{{
            question.No
          }}</a>
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
            <span :class="checkColorAnswer(questionStore, question, answer)">
              {{ index + 1 }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Submit Button -->
    <CustomButton
      label="exam_page.submit_exam"
      @handle-click="toggleModalConfirm"
      icon="pi pi-file-check"
      :disabled="questionStore.submitAnswers || loading"
    />
  </div>

  <!-- Confirmation modal for submission -->
  <CustomModal
    :open="openModalConfirm"
    @closeModal="toggleModalConfirm"
    @handleSubmit="handleSubmit"
    header="notice"
    class="modal-confirm"
    footer
  >
    <template #content>
      <div>{{ $t("confirm_submit") }}</div>
      <div>{{ $t("warn_submit") }}</div>
      <div
        v-if="
          questionStore.remainingQuestions &&
          questionStore.remainingQuestions.length > 0
        "
        class="text-[var(--error-color)]"
      >
        {{ $t("exam_page.remaining_questions") }}:
        {{ questionStore.remainingQuestions.length }}
      </div>
    </template>
  </CustomModal>
</template>
