import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Link } from "react-router";
import { Loader2 } from "lucide-react";

export default function LoginPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // Optional: for loading state

   const [inputValu,setInputValue]= useState({
        email:"",
        password:""
    })

  const handleGoogleLogin = () => {
    // Replace with actual Google OAuth logic
    window.open("https://api.thryvoo.com/auth/google/callback","_self")
    console.log("Logging in with Google...");
  };
  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true); // Optional: set loading state
    try {
      const response = await fetch("https://api.thryvoo.com/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
        body: JSON.stringify(inputValu),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login successful", data);
        window.open("http://localhost:5173/","_self")
        setError(null); // Clear any previous error messages
        setLoading(false); // Reset loading state
      } else {
        console.error("Login failed", data.message);
        // Show error toast or message to user
        setError(data.message || "Login failed. Please try again.");
        setLoading(false); // Reset loading state
      }
    } catch (error) {
      console.error("Server error:", error);
    }
    
  }
  const handleInputs=(identifier,values)=>{
    setInputValue((previousValue)=>({
        ...previousValue,
        [identifier]:values,
    }))
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Login to your account</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">Email</label>
            <input
              type="email"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              name="email"
              onChange={(event)=>handleInputs("email",event.target.value)}
              value={inputValu.email}
              required

            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">Password</label>
            <input
              type="password"
              name="password"
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              onChange={(event)=>handleInputs("password",event.target.value)}
              value={inputValu.password}
            //   required
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox h-4 w-4 text-blue-600" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <Link to="/forgot" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </Link>
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className={`w-full flex justify-center items-center bg-blue-600 text-white py-2 px-4 rounded-lg transition duration-200 ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-700"
              }`}
          >
          {loading ? (
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
        <div className="my-4 flex items-center justify-between">
          <span className="w-full border-t border-gray-300"></span>
          <span className="px-3 text-gray-500 text-sm">or</span>
          <span className="w-full border-t border-gray-300"></span>
        </div>
        {/* <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 rounded-lg py-2 px-4 hover:bg-gray-50 transition duration-200"
        >
          <FcGoogle className="text-xl" />
          <span className="text-sm font-medium text-gray-700">Login with Google</span>
        </button> */}
        <div className="mt-6 text-center">
          <span className="text-sm text-gray-600">Don't have an account? </span>
          <Link to="/signup" className="text-sm text-blue-600 hover:underline">
            Create one
          </Link>
        </div>
      </div>
    </div>
  );
}
