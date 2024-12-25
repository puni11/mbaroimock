import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";
import { ObjectId } from "mongodb";

export async function GET(req) {
  try {
    // Retrieve the mockId from the query parameters
    const url = new URL(req.url);
    console.log(url)
    const mockIdParam = url.searchParams.get('mock');
    console.log(mockIdParam)
    if (!mockIdParam) {
      return new Response(
        JSON.stringify({ message: "Mock ID is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Validate the mockId format (it should be a valid ObjectId)
    const mockId = new ObjectId(mockIdParam)
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(
        JSON.stringify({ message: "Unauthorized: Please log in" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Fetch the mock details using the mockId
    const mock = await db.collection("mock").findOne({ _id: mockId });
    if (!mock) {
      return new Response(
        JSON.stringify({ message: "Mock not found." }),
        {
          status: 404,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    let collectionName;
    let optionsname;
    if (mock.examName.toLowerCase().includes("xat")) {
      collectionName = "xatquestions";
      optionsname = "xatoptions";
    } else if (mock.examName.toLowerCase().includes("cat")) {
      collectionName = "catquestions";
      optionsname = "catoptions";
    } else if (mock.examName.toLowerCase().includes("cmat")) {
      collectionName = "cmatquestions";
      optionsname = "cmatoptions";
    } else if (mock.examName.toLowerCase().includes("gmat")) {
      collectionName = "gmatquestions";
      optionsname = "gmatoptions";
    }
    // Fetch questions associated with the mock
    const questions = await db
      .collection(collectionName)
      .find({ mockId })
      .toArray();

    if (questions.length === 0) {
      return new Response(
        JSON.stringify({ message: "No questions found for this mock." }),
        {
          status: 409,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Fetch options for these questions
    const questionIds = questions.map((q) => q._id);
    const options = await db
      .collection(optionsname)
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

    return new Response(
      JSON.stringify({ mockId, questions: combinedData }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error fetching questions or options:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch questions and options" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
