import React, { useState, useEffect } from "react";
import { Link } from "react-router";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [timer, setTimer] = useState(0); // ⏳ Countdown in seconds

  useEffect(() => {
    let interval;

    if (submitted && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0 && submitted) {
      setSubmitted(false); // ⏰ Re-enable form
    }

    return () => clearInterval(interval);
  }, [submitted, timer]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/forgot`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        throw new Error("Failed to send reset link");
      }

      setMessage("✅ Reset link sent! Check your email.");
      setSubmitted(true);
      setTimer(60); // ⏱️ Start 1-minute timer
    } catch (error) {
      setError(error.message || "❌ Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Forgot your password?</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message && (
          <div className="mb-4 text-green-600 text-center text-sm font-medium">{message}</div>
        )}
        {error && (
          <div className="mb-4 text-red-600 text-center text-sm font-medium">{error}</div>
        )}

        {submitted && timer > 0 && (
          <div className="mb-4 text-blue-500 text-center text-sm">
            ⏳ You can request again in {timer} second{timer !== 1 && "s"}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              required
              disabled={submitted}
            />
          </div>
          <button
            type="submit"
            disabled={submitted}
            className={`w-full py-2 px-4 rounded-lg transition duration-200 ${
              submitted
                ? "bg-gray-400 cursor-not-allowed text-white"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            {submitted ? "Link Sent" : "Send reset link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="text-sm text-blue-600 hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
}
