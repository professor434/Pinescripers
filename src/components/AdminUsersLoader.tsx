import { useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function AdminUsersLoader({ onLoad }: { onLoad: (users: any[]) => void }) {
  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from("profiles").select("*");
      if (error) {
        console.error("❌ Failed to load users", error);
        onLoad([]);
      } else {
        onLoad(data || []);
      }
    };
    fetchUsers();
  }, [onLoad]);

  return null;
}
