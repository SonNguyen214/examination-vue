export const requestGetListExams = () => {
  const url = "/api/exams";
  const config = {
    method: "GET",
  };
  return { url, config };
};

export const requestGetDetailExam = ({ examId, limit, offset }) => {
  const url = `/api/exam/${examId}?limit=${limit}&offset=${offset}`;
  const config = {
    method: "GET",
  };
  return { url, config };
};

export const requestSubmitExam = ({ examId, timeRemaining, body }) => {
  const url = `/api/exam/${examId}?timeRemaining=${timeRemaining}`;
  const config = {
    method: "PUT",
    data: body,
  };
  return { url, config };
};

export const requestResetExam = ({ examId }) => {
  const url = `/api/exam/${examId}?reset=true`;
  const config = {
    method: "GET",
  };
  return { url, config };
};
