import clientPromise from "../../../lib/mongodb";
import { getToken } from "next-auth/jwt";

export async function POST(req) {
  try {
    // Retrieve token from the incoming request
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });

    // Check if the user is authenticated
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Unauthorized" }),
        { status: 401 }
      );
    }

    // Parse the request body
    const { examName } = await req.json();

    // Validate the input data
    if (!examName || typeof examName !== "string" || examName.trim() === "") {
      return new Response(
        JSON.stringify({ message: "Invalid exam name" }),
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const mockCollection = db.collection("mock");

    // Check if an exam with the same name already exists
    const existingMock = await mockCollection.findOne({ examName });

    if (existingMock) {
      return new Response(
        JSON.stringify({ message: "Mock exam with the same name already exists" }),
        { status: 409 }
      );
    }
    let limit = 0 ;
    const lowerCaseExamName = examName.toLowerCase().trim();
    if (lowerCaseExamName.includes("cat")) {
      limit = 66;
    } else if (lowerCaseExamName.includes("xat")) {
      limit = 100;
    } else if (lowerCaseExamName.includes("cmat")) {
      limit = 100;
    } else if (lowerCaseExamName.includes("gmat")) {
      limit = 100;
    }
    // Insert the new mock exam with the user ID
    const result = await mockCollection.insertOne({
      examName: examName.trim(),
      userId: token.id,
      limit,
      uploadedQuestions: 0, // Add user ID from the token
      createdAt: 'new Date()',
    });

    return new Response(
      JSON.stringify({ message: "Mock exam saved successfully", examId: result.insertedId }),
      { status: 201 }
    );
  } catch (error) {
    console.error("Error saving mock exam:", error);
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
