import ExamResultComponent from "@/components/ExamResult";
import { getServerSession } from "next-auth";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import { authOptions } from "../api/auth/[...nextauth]/route";
export default async function ExamResultPage(){
     const session = await getServerSession(authOptions);
    
      if (!session) {
        redirect("/login");
      }
    return(
        <Suspense fallback={<div>Loading...</div>}>
        <ExamResultComponent/>
        </Suspense>
    )
}