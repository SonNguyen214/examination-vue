import { defineEventHandler, readBody, getQuery, createError } from "h3";
import ExamSchema from "../models/ExamSchema";

export default defineEventHandler(async (event) => {
  const method = event.method;

  // Handle POST request: Insert a new exam record
  if (method === "POST") {
    const body = await readBody(event);

    if (!body || Object.keys(body).length === 0) {
      throw createError({ statusCode: 400, message: "Invalid exam data" });
    }

    try {
      // Insert new exam using Mongoose model
      const newExam = new ExamSchema(body);
      await newExam.save();

      return {
        data: newExam,
        message: "Exam inserted successfully!",
      };
    } catch (error) {
      throw createError({
        message: error.message,
        status: 400,
      });
    }
  }

  // Handle GET request: Retrieve the list of exams
  if (method === "GET") {
    try {
      const data = await ExamSchema.aggregate([
        {
          $sort: { expiredAt: -1 },
        },
      ]);

      return {
        data: data,
        status: 200,
        message: "Get list exams successfully!",
      };
    } catch (error) {
      throw createError({
        message: error.message,
        status: 400,
      });
    }
  }

  // Return error if the HTTP method is not supported
  throw createError({ statusCode: 405, message: "Method Not Allowed" });
});
