import Image from "next/image";
import Link from "next/link";
import TextImageSection from "@/components/TextImageSection";
import JoinOurTeam from "@/components/JoinOurTeam";
import MockTests from "@/components/MockTests";

export default function Home() {
  return (
    <div className="grid grid-rows-[400px_1fr_400px] items-center justify-items-center min-h-screen pt-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <TextImageSection />
      <MockTests />
      <JoinOurTeam />
    </div>
  );
}


