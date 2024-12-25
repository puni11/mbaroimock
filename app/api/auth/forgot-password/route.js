import clientPromise from "@/lib/mongodb";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return new Response(JSON.stringify({ error: "Email is required" }), { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("sample_mflix");
    const usersCollection = db.collection("users");

    // Check if the user exists
    const user = await usersCollection.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Email not found" }), { status: 404 });
    }

    // Generate a reset token
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // Generate a reset link
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    // Configure nodemailer
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT, 10), // Ensure port is a number
      secure: true, // Use true if using port 465, false otherwise
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Verify the transporter before sending the email
    await transporter.verify();

    // Send the email
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to: email,
      subject: "Reset Your Password",
      text: `Click the link to reset your password: ${resetLink}`,
      html: `<p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    return new Response(
      JSON.stringify({ message: "Password reset link sent to your email!" }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error:", error);

    // Specific error handling for common cases
    if (error instanceof jwt.JsonWebTokenError) {
      return new Response(
        JSON.stringify({ error: "Invalid token operation" }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later." }),
      { status: 500 }
    );
  }
}
