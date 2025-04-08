// Format milliseconds into mm:ss format
export const formatTime = (milliseconds) => {
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

export const convertMillisecondsToMinutes = (milliseconds) => {
  return (milliseconds / 60000 || 0).toLocaleString("en-US", {
    maximumFractionDigits: 4,
  }); // 1 minute = 60,000 ms
};

// Function to determine the background color for an answer choice
export const checkColorAnswer = (questionStore, question, answer) => {
  const isSubmitted = questionStore.submitAnswers;
  const isSelected = questionStore.selectedAnswers[question._id] === answer;

  return isSubmitted
    ? isSelected
      ? question.hasAnswerCorrect
        ? { "!bg-[var(--primary-color)]": true } // Highlight correct answer with primary color
        : { "!bg-[var(--error-color)]": true } // Highlight incorrect answer with error color
      : { "": true } // No specific background color
    : isSelected
    ? { "!bg-[var(--gray-400)]": true } // Highlight selected answer before submission with gray color
    : { "": true }; // Default case with no background color
};
