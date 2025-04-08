<script setup lang="ts">
import { pages } from "@/constants";
import dayjs from "dayjs";
import { requestGetListExams } from "~/service/exams";

useHead({
  title: "Home | CBT Exam",
});
const router = useRouter();
const { $api } = useNuxtApp();
const toast = useToast();

const examsList = ref();
const loading = ref(false);

onMounted(() => {
  getData();
});

const getData = async () => {
  loading.value = true;
  try {
    const { url, config } = requestGetListExams();

    const res = await $api(url, config);

    examsList.value = res.data.data;
    loading.value = false;
  } catch (error: any) {
    toast.add({
      severity: "error",
      summary: "Error",
      detail: "Error to get exams, please try again later!",
      life: 3000,
    });
  }
};

// ✅ Create a computed property to check if the deadline has expired. 🚀
const isDeadlineOver = (deadline: string) => {
  return dayjs().valueOf() > dayjs(deadline).valueOf();
};

// Redirect to exam page
const openExamPage = (idExam: string) => {
  router.push(pages.exam + "/" + idExam);
};
</script>

<template>
  <div
    class="home-page flex flex-wrap justify-center gap-7 items-center h-full"
  >
    <div v-if="loading" class="flex gap-7 flex-wrap justify-center">
      <Skeleton height="21.625rem" width="21.875rem" class="mb-2"></Skeleton>
      <Skeleton height="21.625rem" width="21.875rem" class="mb-2"></Skeleton>
      <Skeleton height="21.625rem" width="21.875rem" class="mb-2"></Skeleton>
    </div>
    <div
      v-else
      v-for="(item, index) in examsList"
      :key="index"
      class="card overflow-hidden relative w-[350px] border py-5 border-gray-400 rounded-lg flex flex-col gap-6 transition-all hover:-translate-y-1 shadow hover:shadow-xl"
    >
      <div class="px-6">
        <span
          class="text-sm font-semibold text-gray-500 relative"
          v-tooltip.top="'시험 제출 마감'"
        >
          {{ dayjs(item.expiredAt).format("YYYY-MM-DD") }}
          <hr
            v-if="isDeadlineOver(item.expiredAt)"
            class="w-[90px] absolute top-1/2 !bg-red-600 h-[2px] -translate-y-1/2"
          />
        </span>
        <div class="text-xl font-semibold mt-1">
          {{ $t("homepage." + item.title) }}
        </div>
      </div>

      <div class="score absolute right-3 top-5 flex gap-1 items-center">
        <span
          class="text-sm font-semibold text-[var(--green-darker)] whitespace-nowrap"
          >{{ $t("total_point") }}:</span
        >
        <div class="text-base text-red-600">
          {{ item?.totalPoint || 0 }}
        </div>
      </div>

      <div class="px-6">
        <span
          class="text-sm font-semibold h text-[var(--green-darker)] whitespace-nowrap"
          >{{ $t("homepage.summary.text") }}</span
        >
        <div class="text-base mt-1">
          {{ $t("homepage.summary." + item.des) }}
        </div>
      </div>

      <div class="px-6 flex gap-16">
        <div>
          <span class="text-sm font-semibold text-[var(--green-darker)]">{{
            $t("homepage.duration.text")
          }}</span>
          <div class="mt-1">
            {{
              convertMillisecondsToMinutes(item.timeExpired) +
              " " +
              $t("minutes")
            }}
          </div>
        </div>
        <div>
          <span class="text-sm font-semibold text-[var(--green-darker)]">{{
            $t("homepage.status.text")
          }}</span>
          <div class="flex items-center gap-2 mt-1">
            <div
              class="w-5 h-5 rounded-full"
              :class="{
                'bg-yellow-500':
                  useSize(JSON.parse(item.userAnswers)) !== item.data.length,
                'bg-green-500':
                  useSize(JSON.parse(item.userAnswers)) === item.data.length,
              }"
            ></div>
            <div>
              {{
                useSize(JSON.parse(item.userAnswers)) === item.data.length
                  ? $t("homepage.status.finish")
                  : $t("homepage.status.un_finish")
              }}
            </div>
          </div>
        </div>
      </div>

      <div class="h-12 relative" @click="() => openExamPage(item._id)">
        <div class="absolute left-6 bottom-0">
          <span class="text-sm font-semibold text-[var(--green-darker)]">{{
            $t("progress")
          }}</span>
          <div>
            {{ useSize(JSON.parse(item.userAnswers)) + "/" + item.data.length }}
          </div>
        </div>
        <div class="btn-exam">
          <div>{{ $t("start_exam") }}</div>
          <i class="pi pi-arrow-right"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.card:hover .btn-exam {
  background: var(--primary-color);
  color: #f5f5f5;
  transform: translateX(140px);
  transition: transform 0.4s ease-in-out;
}

.btn-exam {
  position: absolute;
  right: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px;
  margin: 0 12px;
  border-radius: 6px;
  background: var(--seconde-color);
  color: var(--green-darker);
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, transform 0.3s;
}

.btn-exam:hover {
  background: var(--primary-color);
}
</style>
