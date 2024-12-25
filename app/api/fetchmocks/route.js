import clientPromise from "../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const mockCollection = await db.collection("mock").find({}).toArray();

    return new Response(JSON.stringify(mockCollection), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching mock test details:", error);
    return new Response(
      JSON.stringify({ message: "Failed to fetch mock test details" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
