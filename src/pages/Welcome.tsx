import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

const Welcome = () => {
  const [name, setName] = useState("");
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const navigate = useNavigate();
  const { user } = useAuth();

  const handleNameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    // Store name in profile
    if (user) {
      await supabase
        .from("profiles")
        .update({ full_name: name.trim() })
        .eq("user_id", user.id);
    }

    // Store in localStorage as backup
    localStorage.setItem("userName", name.trim());

    // Show welcome message
    setShowWelcomeMessage(true);

    // Navigate to dashboard after animation
    setTimeout(() => {
      navigate("/dashboard");
    }, 8000);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-background to-muted/20 overflow-hidden relative">
      {/* Breathing Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="breathing-circle rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Content */}
      <div className={`relative z-10 text-center transition-all duration-1000 ${showWelcomeMessage ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}>
        {!showWelcomeMessage ? (
          <form onSubmit={handleNameSubmit} className="space-y-8 px-6">
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-12 animate-fade-in">
              What should we call you...
            </h1>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="max-w-md mx-auto text-center text-2xl h-14 bg-background/50 backdrop-blur-sm border-primary/20 focus-visible:border-primary/40 transition-all"
              autoFocus
            />
          </form>
        ) : (
          <div className="max-w-2xl mx-auto px-6 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-light text-foreground mb-6">
              Welcome {name} to Ease
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              Your platform for chronic pain exercises, education, and tools. Select a virtual environment to choose from a wide range of clinically proven exercises for pain relief, or select tools for journaling or pain tracking to begin...
            </p>
          </div>
        )}
      </div>

      <style>{`
        .breathing-circle {
          width: 300px;
          height: 300px;
          animation: breathe 6s ease-in-out infinite;
        }

        @keyframes breathe {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.5);
            opacity: 0.5;
          }
        }

        @media (min-width: 768px) {
          .breathing-circle {
            width: 500px;
            height: 500px;
          }
        }
      `}</style>
    </div>
  );
};

export default Welcome;
