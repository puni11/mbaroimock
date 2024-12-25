
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ExamSelect from "@/components/ExamSelect";
import { redirect } from "next/navigation";
export default async function ExamSelectPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  // Only allow teachers to access the page
  if (session.user.role !== "teacher") {
    redirect("/");
  }
 

  return (
    <ExamSelect/>
  );
}
