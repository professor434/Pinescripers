import { useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (!error && data?.role === "admin") {
        setAuthorized(true);
      }

      setLoading(false);
    };

    checkAccess();
  }, []);

  if (loading) return <p className="text-center">Checking access...</p>;
  if (!authorized) return <p className="text-center text-red-400">Access denied</p>;

  return <>{children}</>;
}