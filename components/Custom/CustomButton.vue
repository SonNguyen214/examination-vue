<script setup>
const props = defineProps({
  icon: String,
  label: {
    type: String,
    required: true,
  },
  variant: String,
  type: String,
  disabled: Boolean,
  loading: Boolean,
});
const emit = defineEmits(["handleClick"]);

//check variant to add class to button and style class in custom-button.scss
const checkVariant = () => {
  if (props.disabled) {
    return "btn-cancel";
  }
  switch (props.variant) {
    case "cancel":
      return "btn-cancel";
    case "outline":
      return "btn-outline";
    default:
      return "";
  }
};
</script>

<template>
  <Button
    :icon="icon"
    :label="label.length > 0 ? $t(label) : ''"
    @click="emit('handleClick')"
    :disabled="disabled || loading"
    class="custom-button"
    :class="checkVariant()"
    :loading="loading"
    :aria-label="label + Math.random().toString()"
  />
</template>
