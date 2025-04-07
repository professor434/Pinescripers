import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";

export default function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const [loading, setLoading] = useState(true);
  const [allowed, setAllowed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        navigate("/login");
        return;
      }

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", user.id)
        .single();

      if (error || !profile) {
        navigate("/login");
        return;
      }

      const role = profile.role;

      if (!allowedRoles.includes(role)) {
        if (role === "admin") navigate("/admin");
        else navigate("/dashboard");
        return;
      }

      setAllowed(true);
      setLoading(false);
    };

    checkAccess();
  }, [allowedRoles, navigate]);

  if (loading) return <p className="text-center p-4">Checking access...</p>;
  if (!allowed) return null;

  return <>{children}</>;
}
