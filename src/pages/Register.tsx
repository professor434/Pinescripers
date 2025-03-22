
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    // Απλή mock λογική - σε πραγματικό app θα πας σε API
    localStorage.setItem("user", JSON.stringify({ email }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-zinc-900 to-black text-white">
      <form
        onSubmit={handleRegister}
        className="bg-zinc-800 p-6 rounded-lg shadow-md w-full max-w-md space-y-4"
      >
        <h2 className="text-xl font-semibold text-center">Register</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 rounded bg-zinc-700 text-white"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 rounded bg-zinc-700 text-white"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded"
        >
          Register
        </button>
        <p className="text-center text-sm">
          Έχεις ήδη λογαριασμό;{" "}
          <a href="/" className="text-blue-400 hover:underline">
            Σύνδεση
          </a>
        </p>
      </form>
    </div>
  );
}
