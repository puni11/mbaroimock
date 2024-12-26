import clientPromise from "../../../lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(req) {
  try {
    console.log("API Handler: Starting...");

    const url = new URL(req.url);
    const exam = url.searchParams.get("exam");
    if (!exam) {
      console.error("Missing exam query parameter");
      return new Response(
        JSON.stringify({ message: "Invalid request: 'exam' query parameter is required." }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.log("Exam ID:", exam);

    const session = await getServerSession(authOptions);
    if (!session) {
      console.error("Unauthorized access: No session found");
      return new Response(
        JSON.stringify({ message: "Unauthorized: Please log in." }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }
    const userId = session.user.id;
    console.log("User ID:", userId);

    const client = await clientPromise;
    console.log("Connected to MongoDB");
    const db = client.db("sample_mflix");

    const resultData = await db.collection("results").findOne({ mock: exam, userId });
    if (!resultData) {
      console.error("Results not found for exam:", exam, "and userId:", userId);
      return new Response(
        JSON.stringify({ message: "Results not found for the given exam." }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    console.log("Results found:", resultData.results);

    return new Response(
      JSON.stringify({ message: "Success", data: resultData.results }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in results API:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
