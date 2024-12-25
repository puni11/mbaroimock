import Image from "next/image";
export default function TextImageSection() {
    return (
        <>
        <section className="flex justify-evenly items-center py-32 px-20 mt-16">
      
        <div className="lg:w-1/2 text-center lg:text-left">
          <span className="bg-red-100 text-red-600 px-4 py-1 rounded-full text-sm font-medium">
            MBAROI Present
          </span>
          <h1 className="text-4xl lg:text-5xl font-bold mt-4 leading-tight text-gray-900">
            Innovate, Educate, <br /> Elevate Your{" "}
            <span className="text-red-600">Online Exam Hub</span>
          </h1>
          <p className="mt-5">Master your MBA preparation with our mock test platform – <br/>real-time assessments, detailed analytics, and expert-designed questions to boost your confidence and ensure success</p>
          <button className="mt-6 bg-white text-red-600 border-2 border-red-600 hover:bg-red-600 hover:text-white font-semibold py-2 px-4 rounded">
            Unlock Success
          </button>
        </div>

        <div className="lg:w-1/2 flex justify-center relative left-12">
          <div className="w-72 h-72 lg:w-96 lg:h-96 rounded-full absolute top-0 -z-10"></div>
         <Image src='/onlineexam.jpg' height={400} width={400} alt="mbaroi mock"/>
        </div>
      </section>
      </>
    );
  }
  