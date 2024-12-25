import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(JSON.stringify({ message: "Unauthorized: Please log in" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { mock, answers } = await req.json();

    if (!mock || !answers || typeof answers !== "object") {
      return new Response(
        JSON.stringify({ message: "Invalid request: Missing or invalid data." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const userId = session.user.id; // Get user ID from session
    const client = await clientPromise;
    const db = client.db("sample_mflix");

    // Check if a response already exists for this userId and mock
    const existingResponse = await db.collection("response").findOne({ userId, mock });

    if (existingResponse) {
      // Update the existing document
      const updateResult = await db.collection("response").updateOne(
        { userId, mock },
        { $set: { answers, submittedAt: new Date() } }
      );

      if (updateResult.modifiedCount > 0) {
        return new Response(
          JSON.stringify({ message: "Answers updated successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to update the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      // Insert a new document
      const responseDoc = {
        userId,
        mock,
        answers, // Object containing question IDs as keys and selected options as values
        submittedAt: new Date(),
      };

      const insertResult = await db.collection("response").insertOne(responseDoc);

      if (insertResult.acknowledged) {
        return new Response(
          JSON.stringify({ message: "Answers submitted successfully!" }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      } else {
        return new Response(
          JSON.stringify({ message: "Failed to save the answers." }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }
  } catch (error) {
    console.error("Error in submit-answers API:", error);
    return new Response(
      JSON.stringify({ message: "Internal server error." }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
