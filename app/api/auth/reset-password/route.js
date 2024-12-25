import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function POST(req) {
  const { token, password } = await req.json();

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const client = await clientPromise;
    const db = client.db('sample_mflix');
    const usersCollection = db.collection("users");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the password in the database
    await usersCollection.updateOne(
      { email: decoded.email },
      { $set: { password: hashedPassword } }
    );

    return new Response(JSON.stringify({ message: "Password reset successful!" }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), { status: 400 });
  }
}
