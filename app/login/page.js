"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";  // Import NextAuth's signIn function
import Link from "next/link";
import Image from "next/image";

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Sign in using NextAuth's credentials provider
    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError("Invalid credentials");
      setLoading(false);
    } else {
      // Redirect to a protected page like dashboard after successful login
      router.push("/");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
  <div className="flex w-full max-w-4xl bg-white shadow-md rounded-md overflow-hidden">
    {/* Left Section: Text and Image */}
    <div className="hidden md:flex flex-col items-center justify-center w-1/2 bg-white p-8">
    <Image src='/exam.png' width={200} height={100} alt="women giving exam"/>
      <h2 className="text-3xl font-bold text-red-800 text-center">
        Welcome Back!
      </h2>
      <p className="text-center text-black mb-2">
        Discover a world of possibilities by signing into your account.
      </p>
    
    </div>
    <div className="w-px bg-gray-300 hidden md:block" />

    {/* Right Section: Login Form */}
    <div className="w-full md:w-1/2 p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full bg-red-800 text-white font-medium py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      <p className="mt-4 text-sm text-center">
        Forgot Password?{" "}
        <Link href="/forgot-password" className="text-red-500 hover:underline">
          Click here
        </Link>
      </p>
      <p className=" text-sm text-center">
        Don't have an account?{" "}
        <Link href="/register" className="text-red-500 hover:underline">
          Register here
        </Link>
      </p>
    </div>
  </div>
</div>

  );
}
