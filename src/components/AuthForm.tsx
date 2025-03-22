import { useState } from "react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { supabase } from "../lib/supabaseClient";

export default function AuthForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else setMessage("✅ Check your email to confirm registration.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMessage(error.message);
      else setMessage("✅ Logged in successfully!");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-zinc-800 rounded-lg shadow grid gap-4">
      <h2 className="text-xl font-bold text-center">{isSignUp ? "Register" : "Login"}</h2>
      <form onSubmit={handleSubmit} className="grid gap-3">
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">{isSignUp ? "Sign Up" : "Sign In"}</Button>
      </form>
      <button onClick={() => setIsSignUp(!isSignUp)} className="text-sm text-blue-400 underline">
        {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
      </button>
      {message && <p className="text-sm pt-2 text-yellow-300 text-center">{message}</p>}
    </div>
  );
}