import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [hasName, setHasName] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUserName = async () => {
      // Check localStorage first
      const localName = localStorage.getItem("userName");
      if (localName) {
        setHasName(true);
        return;
      }

      // Check Supabase profile
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("full_name")
          .eq("user_id", user.id)
          .single();

        if (data?.full_name) {
          setHasName(true);
          return;
        }
      }

      setHasName(false);
    };

    if (!loading) {
      checkUserName();
    }
  }, [user, loading]);

  if (loading || hasName === null) {
    return null;
  }

  return <Navigate to={hasName ? "/dashboard" : "/welcome"} replace />;
};

export default Index;
