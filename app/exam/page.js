import ExamComponnet from "@/components/examcomponent";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { Suspense } from "react";

export default async function Exampage(){
    const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }
return(
    <Suspense fallback={<div>Loading...</div>}>
    <ExamComponnet/>
    </Suspense>
)
}