<script setup>
import CustomButton from "./CustomButton.vue";

const props = defineProps({
  open: Boolean,
  class: String,
  header: { type: [String, Boolean], default: false },
  footer: Boolean,
  loadingBtn: Boolean,
  labelBtnSubmit: String,
});

const emit = defineEmits(["closeModal", "handleSubmit"]);
</script>

<template>
  <Dialog
    :visible="open"
    modal
    class="custom-modal"
    :class="props.class"
    :dismissableMask="true"
    @update:visible="(val) => !val && emit('closeModal')"
  >
    <i class="pi pi-times close-icon" @click="emit('closeModal')" />

    <!-- Header -->
    <div v-if="header" class="header">
      <div class="title">{{ $t(header) }}</div>
    </div>

    <!-- Content -->
    <div class="content">
      <slot name="content" />
    </div>

    <!-- Footer -->
    <div v-if="footer" class="footer">
      <CustomButton
        :loading="loadingBtn"
        :label="labelBtnSubmit || 'exam_page.submit_exam'"
        @click="emit('handleSubmit')"
      />
      <CustomButton
        type="button"
        label="cancel"
        @click="emit('closeModal')"
        variant="cancel"
      />
    </div>
  </Dialog>
</template>
