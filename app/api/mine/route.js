import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized: Please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }
    // Hardcoded mockId for testing
    const mockId = new ObjectId("676273a15339b25b64e7db43");

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Fetch the mock details
    const mock = await db.collection("mock").findOne({ _id: mockId });
    if (!mock) {
      return new Response(JSON.stringify({ message: "Mock not found." }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch questions associated with the mock
    const questions = await db
      .collection("xatquestions")
      .find({ mockId })
      .toArray();

    if (questions.length === 0) {
      return new Response(JSON.stringify({ message: "No questions found for this mock." }), {
        status: 409,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Fetch options for these questions
    const questionIds = questions.map((q) => q._id);
    const options = await db
      .collection("xatoptions")
      .find({ questionId: { $in: questionIds } })
      .toArray();

    // Combine questions and their options
    const combinedData = questions.map((question) => {
      const questionOptions = options.filter(
        (opt) => opt.questionId.toString() === question._id.toString()
      );

      return {
        questionId: question._id,
        questionText: question.question,
        options: {
          A: questionOptions[0]?.a || "",
          B: questionOptions[0]?.b || "",
          C: questionOptions[0]?.c || "",
          D: questionOptions[0]?.d || "",
        },
      };
    });

    return new Response(JSON.stringify({ mockId, questions: combinedData }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching questions or options:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch questions and options" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
