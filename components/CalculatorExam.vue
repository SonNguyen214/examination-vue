<template>
  <div class="calculator">
    <!-- Display the last expression as a label after evaluation -->
    <div class="name">{{ $t("exam_page.calculator") }}</div>
    <div class="last-expression">
      {{ lastExpression }}
    </div>
    <!-- Display the current input or result -->
    <div class="input-value">
      {{ currentInput || "0" }}
    </div>
    <div class="group-button">
      <button
        v-for="btn in buttons"
        :key="btn"
        @click="handleClick(btn)"
        :class="{
          '!text-[var(--primary-color)] hover:!text-[var(--primary-color)]':
            listBtnGreen.includes(btn),
          '!text-[var(--error-color)] hover:!text-[var(--error-color)]':
            listBtnRed.includes(btn),
        }"
      >
        {{ btn }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { evaluate } from "mathjs";

const toast = useToast();

//ref for button color
const listBtnRed = ["/", "*", "+", "-", "="];
const listBtnGreen = ["C", "(", ")"];

const currentInput = ref(""); // Stores the user input
const lastExpression = ref(""); // Stores the last evaluated expression

const buttons = [
  "C",
  "(",
  ")",
  "/",
  "7",
  "8",
  "9",
  "*",
  "4",
  "5",
  "6",
  "-",
  "1",
  "2",
  "3",
  "+",
  ".",
  "0",
  "←",
  "=",
];

const handleClick = (value) => {
  if (value === "C") {
    currentInput.value = "";
    lastExpression.value = "";
  } else if (value === "←") {
    currentInput.value = currentInput.value.slice(0, -1);
  } else if (value === "=") {
    try {
      if (/[^0-9+\-*/.;()]/.test(currentInput.value)) {
        toast.add({
          severity: "error",
          detail: "입력에 잘못된 문자가 있습니다.",
          summary: "오류",
          life: 2000,
        });
        return;
      }
      if (/[+\-*/.]{2,}/.test(currentInput.value)) {
        toast.add({
          severity: "error",
          detail: "연속된 연산자는 허용되지 않습니다.",
          summary: "오류",
          life: 2000,
        });
        return;
      }
      lastExpression.value = currentInput.value; // Store the last expression
      currentInput.value = evaluate(currentInput.value.replace(";", ",")); //Calculate
    } catch (error) {
      toast.add({
        severity: "error",
        detail: "다시 한번 확인해 주세요",
        summary: "오류",
        life: 2000,
      });
      console.log(error.message);
      // currentInput.value = ''
    }
  } else {
    if (/[+\-*/.]{2,}$/.test(currentInput.value + value)) {
      toast.add({
        severity: "error",
        detail: "연속된 연산자를 입력할 수 없습니다.",
        summary: "오류",
        life: 2000,
      });

      return;
    }
    currentInput.value += value;
  }
};
</script>

<style></style>
