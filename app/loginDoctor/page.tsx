"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { verifyDoctor } from "@/lib/actions/doctor.actions";
import { setCookie } from "nookies";

export default function LoginDoctor() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter(); // Initialize useRouter for redirection

  useEffect(() => {
    setEmail("");
    setPassword("");
    setError(null);
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Call verifyDoctor function with email and password
      const response = await verifyDoctor(email, password);

      if (response.success) {
        // Set the JWT token in a cookie
        setCookie(null, "jwt_token", response.token, {
          maxAge: 3600, // Token expiry in seconds (1 hour)
          path: "/", // Cookie path
        });
        // If login is successful, redirect to the doctor's dashboard
        router.push(`/loginDoctor/${response.doctorId}/dashboard`);
      } else {
        // If login fails, display an error message
        setError("Invalid email or password. Please try again.");
      }
    } catch (error) {
      // Handle any errors that occur during login
      setError("Login failed. Please try again.");
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl text-center text-white font-bold mb-4">
          Doctor Login
        </h1>

        {/* Error message */}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="space-y-4">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 block w-full p-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Email Address"
            />
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`mt-1 block w-full p-2 border ${
                error ? "border-red-500" : "border-gray-300"
              } rounded-md shadow-sm focus:ring focus:ring-blue-500 focus:border-blue-500`}
              placeholder="Enter Password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            Login Doctor
          </button>
        </form>
      </div>
    </div>
  );
}
