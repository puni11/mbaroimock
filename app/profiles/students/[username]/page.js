import { getServerSession } from "next-auth";
import Image from "next/image";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { signOut } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

export default async function StudentProfile({ params }) {
  // Ensure params are awaited before using them
  const { username } = await params; // Await the params object
  const client = await clientPromise;
  const db = client.db("sample_mflix");
  const session = await getServerSession(authOptions); // Fetch session

  // If not authenticated, redirect to login page
  if (!session) {
    redirect("/login");
  }

  // Check if the user role is "teacher" and the username matches
 
  const student = await db.collection("users").findOne({ name: username });
  const response = await db.collection("response").find({ userId: student._id.toString() }).toArray();
  const mockIds = response.map((item) => item.mock);
  const mocks = await db.collection('mock') .find({ _id: { $in: mockIds.map((id) => new ObjectId(id)) } })
  .toArray();


  return (
    <>
  <div className="container mx-auto h-screen">
  <div className="flex justify-between items-center py-4 px-8 shadow-sm gap-4">
  <div className=" bg-red-900 rounded mb-8 w-1/4">
  <div className="w-full bg-white border border-gray-200 rounded shadow dark:bg-gray-800 dark:border-gray-700">
  <div className="flex justify-end px-2 pt-8">
  </div>
  <div className="flex flex-col items-center pb-10">
    <Image src ="/avtar,png.webp" alt= "avtar"  height={100} width={100} />
    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
      {student.name}
    </h5>
    <span className="text-sm text-gray-500 dark:text-gray-400">
      {student.email}
    </span>
    <span className="text-sm text-black dark:text-gray-400">
      Exam Given - {response.length}
    </span>
    <div className="flex mt-4 md:mt-6 gap-4">
      <LogoutButton/>
      <Link href='/mba-mocks-exam'><button className="text-white bg-gray-900 hover:bg-black focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Give Mock</button></Link>
    </div>
  </div>
</div>

  </div>
  <div className="rounded mb-8 w-3/4">
  {mocks.length > 0 ? (
        <ul className="list-disc ml-6">
          {mocks.map((mock) => (
            
            <div className="w-full mx-auto bg-white shadow-lg rounded-lg mb-2" key={mock._id}>
            <div className="px-6 py-5">
              <div className="flex items-start">
                {/* Icon */}
                <svg className="fill-current flex-shrink-0 mr-5" width="30" height="30" viewBox="0 0 30 30">
                  <path className="text-red-300" d="m16 14.883 14-7L14.447.106a1 1 0 0 0-.895 0L0 6.883l16 8Z" />
                  <path className="text-red-200" d="M16 14.619v15l13.447-6.724A.998.998 0 0 0 30 22V7.619l-14 7Z" />
                  <path className="text-red-500" d="m16 14.619-16-8V21c0 .379.214.725.553.895L16 29.619v-15Z" />
                </svg>
        
                {/* Card content */}
                <div className="flex-grow truncate">
                  {/* Card header */}
                  <div className="w-full sm:flex justify-between items-center mb-1">
                    {/* Title */}
                    <h2 className="text-xl leading-snug font-bold text-black truncate mb-1 sm:mb-0">
                      {mock.examName}
                    </h2>
                    
                    <Link href={`/exam-results?exam=${mock._id}`}><button className="bg-red-800 hover:bg-red-700 text-white px-4 py-2 rounded">See Result</button></Link>
               
                  </div>
        
                  {/* Card body */}
                  <div className="flex items-end justify-between whitespace-normal">
                    {/* Paragraph */}
                    <div className="max-w-md text-gray-900">
                      <p className="mb-2">
                    
                      </p>
                    </div>
                    {/* More link */}
                  </div>
                </div>
              </div>
            </div>
          </div>
          ))}
        </ul>
      ) : (
        <p>No mocks associated with this student.</p>
      )}
      </div>
  </div>
  </div>
  
 </>
  );
}
