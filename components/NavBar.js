"use client";

import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import TogglePopoverLogin from "./TogglePopoverLogin";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="container mx-auto flex justify-between items-center py-4 px-8 shadow-sm">
      {/* Brand Name */}
      <div className="text-2xl font-bold">
        <Link href='/'>
        <span className="text-red-600">MBAROI</span>
        <span className="text-black"> Mock</span>
        </Link>
      </div>

      {/* Navigation Menu */}
      <nav>
        <ul className="hidden md:flex gap-6 text-gray-700 font-medium">
          <li>
            <Link href="#" className="hover:text-blue-600">
              MBA Exam
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-600">
              Topic Wise
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-600">
              Previous Year Papers
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-600">
              About Us
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-blue-600">
              Resources
            </Link>
          </li>
        </ul>
      </nav>

      {/* Login/Logout Section */}
      {session ? (
        <TogglePopoverLogin user={session} />
      ) : (
        <button
  onClick={() => signIn()}
  className="relative z-10 text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
  style={{ pointerEvents: "auto" }} // Ensures it’s clickable
>
  Sign In
</button>
      )}
    </header>
  );
}
