import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [hasName, setHasName] = useState<boolean | null>(null);
  const { user, loading } = useAuth();

  useEffect(() => {
    const checkUserName = async () => {
      // Clear stored name to always show welcome screen (temporary for testing)
      localStorage.removeItem("userName");
      
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
