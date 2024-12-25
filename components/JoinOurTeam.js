// components/JoinOurTeam.js
import Image from "next/image";
import Link from "next/link";
export default function JoinOurTeam() {
    return (
      <div className="container flex flex-col md:flex-row items-center justify-center bg-gradient-to-r from-gray-800 mt-96 via-red-800 to-gray-800 text-white rounded-lg p-8 md:p-12 shadow-lg lg:mt-24">
        {/* Image Section */}
        <div className="w-full md:w-1/2">
        <Image src="/why-mba-roi-mock-are-best.png" height={350} width={680}  alt="mbaroi mock" />
        </div>
  
        {/* Content Section */}
        <div className="w-full md:w-1/2 mt-6 md:mt-0 md:ml-8 text-center md:text-left">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Why MBAROI Mock Are Best?</h2>
          <p className="text-gray-300 mb-6">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Possimus
            magnam voluptatum cupiditate veritatis in accusamus quisquam.
          </p>
          <ul className="space-y-2 text-gray-100">
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> Competitive salaries
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> 30 days of paid vacation
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> Benefits for you and your family
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> Flexible work hours
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> Annual team retreats
            </li>
            <li className="flex items-center">
              <span className="text-yellow-400 mr-2">✔</span> A great work environment
            </li>
          </ul>
          <Link href='/register'
            className="inline-block mt-6 text-yellow-400 hover:underline"
          >
            Register Yourself Now
          </Link>
        </div>
      </div>
    );
  }
  