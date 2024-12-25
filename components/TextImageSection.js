import Image from "next/image";
export default function TextImageSection() {
    return (
        <>
        <section className="container flex flex-col-reverse lg:flex-row justify-between items-center mt-72 lg:mt-12 ">
  <div className="w-full lg:w-1/2 text-center lg:text-left px-4 lg:px-0">
    <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
      MBAROI Present
    </span>
    <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mt-4 leading-tight text-gray-900">
      Practice, Educate, <br /> Prepare with{" "}
      <span className="text-red-600">MBAROI Mock Test</span>
    </h1>
    <p className="mt-4 md:mt-5 text-sm md:text-base">
    Master your MBA preparation with our cutting-edge mock test platform, designed to give you a competitive edge. Experience real-time assessments that simulate the actual exam environment, helping you build familiarity and reduce test-day anxiety. <br/>Gain access to detailed analytics that provide valuable insights into your strengths and areas for improvement, enabling you to focus your efforts strategically.<br/> Our expert-designed questions cover a wide range of topics, ensuring comprehensive preparation and exposing you to diverse question types. With our platform, you can track your progress, refine your skills, and boost your confidence, setting yourself up for success in your MBA journey.
    </p>
    <button className="mt-6 bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 px-6 rounded">
      See All Mock Test
    </button>
  </div>

  <div className="w-full lg:w-1/2 flex justify-center relative mt-8 lg:mt-0">
    <Image src="/onlineexam.jpg" height={700} width={700} className="md:h-72 md:w-72 lg:h-96 lg:w-96" alt="mbaroi mock" />
  </div>
</section>

      </>
    );
  }
  