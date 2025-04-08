import { defineEventHandler, readBody, getQuery } from "h3";
import ExamSchema from "~/server/models/ExamSchema";

export default defineEventHandler(async (event) => {
  const method = event.method;
  const id = event.context.params.id;

  // Check if the exam ID is provided
  if (!id) {
    throw createError({ statusCode: 400, message: "Missing exam ID" });
  }

  if (method === "GET") {
    const query = getQuery(event);
    try {
      // Find the exam by ID
      const data = await ExamSchema.findById(id);

      if (!data) {
        throw createError({ statusCode: 404, message: "Exam not found" });
      }

      // If the reset query parameter is present, reset the exam data
      if (query.reset) {
        const transformData = data.data.map((q) => {
          return {
            _id: q._id,
            No: q.No,
            question: q.question,
            answers: q.answers,
            score: q.score,
            correctAnswer: q.correctAnswer,
            hasAnswerCorrect: false, // Reset correct answer tracking
          };
        });

        // Update the exam with the reset data
        await ExamSchema.findByIdAndUpdate(id, {
          timeRemaining: Number(data.timeExpired),
          hasSubmitted: false,
          totalPoint: 0,
          data: transformData,
          userAnswers: "{}",
        });

        return {
          status: 200,
          message: "Reset exam successfully",
        };
      }

      // Return exam details
      return {
        status: 200,
        message: "Get exam successfully",
        data: {
          timeExpired: data.timeExpired,
          timeRemaining: data.timeRemaining,
          hasSubmitted: data.hasSubmitted,
          totalPoint: data.totalPoint,
          userAnswers: JSON.parse(data.userAnswers) || {}, // Parse user answers
          data: data.data.map((q) => ({
            _id: q._id,
            No: q.No,
            question: q.question,
            answers: q.answers,
            hasAnswerCorrect: q.hasAnswerCorrect,
            score: q.score,
          })),
        },
      };
    } catch (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
  }

  if (method === "PUT") {
    try {
      const query = getQuery(event);
      const body = await readBody(event);
      const data = await ExamSchema.findById(id);

      if (!data) {
        throw createError({ statusCode: 404, message: "Exam not found" });
      }

      // Process the submitted answers and calculate the score
      const transformData = data.data.map((q) => {
        const userAnswer = body[q._id.toString()];
        const isCorrect = userAnswer === q.correctAnswer;

        return {
          _id: q._id,
          No: q.No,
          question: q.question,
          answers: q.answers,
          score: q.score,
          correctAnswer: q.correctAnswer,
          hasAnswerCorrect: isCorrect, // Mark whether the answer is correct
        };
      });

      // Calculate the total score
      const totalPoint = transformData.reduce(
        (sum, q) => sum + (q.hasAnswerCorrect ? q.score : 0),
        0
      );

      // Update the exam with the submitted answers
      await ExamSchema.findByIdAndUpdate(id, {
        timeRemaining: Number(query.timeRemaining),
        hasSubmitted: true,
        totalPoint,
        data: transformData,
        userAnswers: JSON.stringify(body),
      });

      return {
        status: 200,
        message: "Submitted exam successfully",
      };
    } catch (error) {
      throw createError({ statusCode: 400, message: error.message });
    }
  }

  // Return error if the HTTP method is not allowed
  throw createError({ statusCode: 405, message: "Method Not Allowed" });
});
