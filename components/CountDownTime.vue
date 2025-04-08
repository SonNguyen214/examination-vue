<script setup>
const props = defineProps({
  timeExpired: {
    type: Number,
    required: true,
  }, // Initial countdown time in milliseconds
  stopCountDown: Boolean, // Boolean flag to stop the countdown
  loading: Boolean, // Boolean flag to show loading state
});

const emit = defineEmits(["handleOutOfTime"]);

import CustomModal from "./Custom/CustomModal.vue";
import { convertMillisecondsToMinutes, formatTime } from "@/utils";

const questionStore = useQuestionStore();

// Reactive state for countdown timer, initialized with remaining time from store
const timeCountDown = ref(questionStore.timeRemaining);

// Watch for changes in the question store's remaining time and update countdown
watch(
  () => questionStore.timeRemaining,
  (newVal) => {
    timeCountDown.value = newVal;
  }
);

// Reactive state for formatted time display
const timeLeft = ref(formatTime(timeCountDown.value));
let interval = null; // Variable to store the countdown interval

// Track whether the countdown should be stopped
const stop = ref(props.stopCountDown);

// State to control the visibility of the timeout modal
const openModalLimitTime = ref(false);

// Watch for changes in the stopCountDown prop and update the local stop ref
watch(
  () => props.stopCountDown,
  (newVal) => {
    stop.value = newVal;
    if (newVal) {
      // If countdown is stopped, reset the displayed time and clear the interval
      timeLeft.value = formatTime(questionStore.timeRemaining);
      clearInterval(interval);
      return;
    } else {
      // Restart the countdown if not stopped
      startCountdown();
    }
  }
);

// Function to start the countdown timer
function startCountdown() {
  interval = setInterval(() => {
    if (timeCountDown.value > 0) {
      // Decrease countdown time by 1 second
      timeCountDown.value -= 1000;
      questionStore.setTimeRemaining(timeCountDown.value);
      timeLeft.value = formatTime(timeCountDown.value);
    } else {
      // When countdown reaches 0, stop the timer and trigger the modal
      clearInterval(interval);
      timeLeft.value = "00:00";
      questionStore.setTimeRemaining(0);
      toggleModalLimitTime();
    }
  }, 1000);
}

// Start the countdown when the component is mounted, if it’s not stopped
onMounted(() => {
  if (!stop.value) {
    startCountdown();
  }
});

// Clear the interval when the component is unmounted to prevent memory leaks
onUnmounted(() => {
  if (interval) {
    clearInterval(interval);
  }
});

// Function to toggle the time limit modal
const toggleModalLimitTime = () => {
  if (openModalLimitTime.value) {
    emit("handleOutOfTime", true); // When closing the modal, submit the exam and show correct answers
  }
  openModalLimitTime.value = !openModalLimitTime.value;
};
</script>

<template>
  <div class="countdown-time">
    <div class="title">{{ $t("exam_page.your_answers") }}</div>
    <i
      class="pi pi-question-circle"
      v-tooltip.top="'시간이 초과되면 자동으로 제출됩니다.'"
    ></i>

    <div class="wrapper">
      <i class="pi pi-stopwatch"></i>
      <div v-if="loading" class="flex flex-col gap-2">
        <!-- Display loading skeleton while data is loading -->
        <Skeleton height="1.2rem" width="10rem"></Skeleton>
        <Skeleton height="1.2rem" width="10rem"></Skeleton>
      </div>
      <div v-else>
        <!-- Display total exam time in minutes -->
        <div>
          {{ $t("exam_page.total_time") }}:
          {{ convertMillisecondsToMinutes(timeExpired) }}
          {{ $t("minutes") }}
        </div>
        <!-- Display remaining countdown time -->
        <div class="time-left">
          {{ $t("exam_page.remaining_time") }}: <span>{{ timeLeft }}</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Modal to show when time runs out -->
  <CustomModal
    header="공고"
    :open="openModalLimitTime"
    @closeModal="toggleModalLimitTime"
    class="modal-expired-time"
  >
    <template #content>
      <div>시험시간이 끝났습니다. 시험이 제출됩니다</div>
    </template>
  </CustomModal>
</template>
