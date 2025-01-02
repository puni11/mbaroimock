import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return new Response(
      JSON.stringify({ message: "Unauthorized: Please log in" }),
      { status: 401, headers: { "Content-Type": "application/json" } }
    );
  }

  if (session.user.role !== "teacher") {
    return new Response(
      JSON.stringify({ message: "Forbidden: Access denied" }),
      { status: 403, headers: { "Content-Type": "application/json" } }
    );
  }

  try {
  
    

    const body = await req.json();
    const { question, topic, subject, level, type, options, para, solution, examName } = body;
    if (!examName) {
      return new Response(
        JSON.stringify({ message: "Invalid request: Missing exam name" }),
        { status: 411, headers: { "Content-Type": "application/json" } }
      );
    }
    if (!question || !type) {
      return new Response(
        JSON.stringify({ message: "Invalid request: Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Determine collection name dynamically
    let collectionName = "questions";
    let optionsname = 'options'; // Default collection if no match
    if (examName.toLowerCase().includes("xat")) {
      collectionName = "xatquestions";
      optionsname = "xatoptions";
    } else if (examName.toLowerCase().includes("cat")) {
      collectionName = "catquestions";
      optionsname = "catoptions";
    } else if (examName.toLowerCase().includes("cmat")) {
      collectionName = "cmatquestions";
      optionsname = "cmatoptions";
    } else if (examName.toLowerCase().includes("gmat")) {
      collectionName = "gmatquestions";
      optionsname = "gmatoptions";
    }

    // Check if the mock exam exists
    const mock = await db.collection("mock").findOne({ examName });
    if (!mock) {
      return new Response(
        JSON.stringify({ message: "Exam not found" }),
        { status: 404 }
      );
    }

    if (mock.uploadedquestion >= mock.limit) {
      return new Response(
        JSON.stringify({
          message: "Upload limit reached for this mock",
          uploadedquestion: mock.uploadedquestion,
          limit: mock.limit,
        }),
        { status: 410 }
      );
    }

    // Check if the question already exists
    const existingQuestion = await db
      .collection(collectionName)
      .findOne({ question });
    if (existingQuestion) {
      return new Response(
        JSON.stringify({
          message: "Question already exists",
          uploadedquestion: mock.uploadedquestion,
          limit: mock.limit,
        }),
        { status: 409 }
      );
    }

    // Insert the question
    const questionResult = await db.collection(collectionName).insertOne({
      question,
      topic,
      subject,
      level,
      type,
      solution,
      para,
      mockId: mock._id,
      createdAt: 'new Date()',
    });

    const questionId = questionResult.insertedId;

    if (type === "mcq") {
      await db.collection(optionsname).insertOne({
        questionId,
        ...options,
      });
    } else if (type === "para") {
      await db.collection("para").insertOne({
        questionId,
        para,
      });
      await db.collection(optionsname).insertOne({
        questionId,
        ...options,
      });
    }

    await db.collection("mock").updateOne(
      { _id: mock._id },
      { $inc: { uploadedquestion: 1 } }
    );

    return new Response(
      JSON.stringify({
        message: "Question added successfully",
        questionId,
        uploadedquestion: mock.uploadedquestion + 1,
        limit: mock.limit,
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Internal server error:", error);
    return new Response(
      JSON.stringify({ message: "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
