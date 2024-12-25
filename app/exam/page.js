import ExamComponnet from "@/components/examcomponent";
import { Suspense } from "react";

export default function Exampage(){
return(
    <Suspense fallback={<div>Loading...</div>}>
    <ExamComponnet/>
    </Suspense>
)
}