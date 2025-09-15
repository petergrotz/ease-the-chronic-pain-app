import { Button } from "@/components/ui/modern-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/modern-card";
import EnvironmentCarousel from "@/components/EnvironmentCarousel";
import JournalDialog from "@/components/JournalDialog";
import PainTrackerDialog from "@/components/PainTrackerDialog";
const easeLogoClouds = "/lovable-uploads/ab156088-a078-4ea1-ab55-6f47188c6e4f.png";
import { Heart, BookOpen, BarChart3, Settings, LogIn, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [journalOpen, setJournalOpen] = useState(false);
  const [painTrackerOpen, setPainTrackerOpen] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="container mx-auto px-4 py-12 text-center">
          {/* Header */}
          <div className="mb-12">
            <img 
              src={easeLogoClouds} 
              alt="EASE" 
              className="w-auto h-32 md:h-40 lg:h-48 mx-auto mb-8"
            />
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
              Welcome to EASE
            </h1>
            <p className="font-pokemon text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed mb-8">
              Take control of your pain with evidence-based CBT, DBT, and mindfulness exercises designed for your healing journey.
            </p>
          </div>

          {/* Sign In Prompt */}
          <Card className="max-w-md mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl mb-2">Get Started</CardTitle>
              <CardDescription className="text-base">
                Sign in to access your personalized pain management tools, track your progress, and begin your healing journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <BookOpen className="w-5 h-5 text-primary" />
                  <span className="text-sm">Personal journal & mood tracking</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-secondary" />
                  <span className="text-sm">Pain level monitoring & insights</span>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-muted/50 rounded-lg">
                  <Heart className="w-5 h-5 text-accent" />
                  <span className="text-sm">Guided meditation environments</span>
                </div>
              </div>
              
              <Button 
                variant="default" 
                size="lg"
                className="w-full mt-6"
                onClick={() => navigate('/login')}
              >
                <LogIn className="w-4 h-4 mr-2" />
                Sign In to Continue
              </Button>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center mt-16">
            <p className="font-pokemon text-muted-foreground">
              Take control of your pain. One breath at a time.
            </p>
            <div className="mt-4 w-16 h-1 bg-primary rounded-full mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-between items-center mb-8">
            <div className="flex-1"></div>
            <div className="flex justify-center">
              <img 
                src={easeLogoClouds} 
                alt="EASE" 
                className="w-auto h-32 md:h-40 lg:h-48"
              />
            </div>
            <div className="flex-1 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard')}
                className="flex items-center space-x-2"
              >
                <User className="w-4 h-4" />
                <span>Dashboard</span>
              </Button>
            </div>
          </div>
          <p className="font-pokemon text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
            Take control of your pain with evidence-based CBT, DBT, and mindfulness exercises designed for your healing journey.
          </p>
        </div>

        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-12">
          
          {/* Journal */}
          <Card className="group cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-primary rounded-xl">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Daily Journal
                  </CardTitle>
                  <CardDescription>
                    Record thoughts, track emotions, and document your healing journey
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => {
                  console.log('Opening journal dialog...');
                  setJournalOpen(true);
                }}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Open Journal
              </Button>
            </CardContent>
          </Card>

          {/* Track Pain */}
          <Card className="group cursor-pointer">
            <CardHeader>
              <div className="flex items-center space-x-4 mb-2">
                <div className="p-3 bg-secondary rounded-xl">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="group-hover:text-primary transition-colors">
                    Pain Tracking
                  </CardTitle>
                  <CardDescription>
                    Monitor symptoms, log pain levels, and visualize your progress
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Button 
                variant="default" 
                className="w-full"
                onClick={() => setPainTrackerOpen(true)}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                Track Symptoms
              </Button>
            </CardContent>
          </Card>

        </div>

        {/* Environment Selection Carousel */}
        <div className="mb-12">
          <EnvironmentCarousel />
        </div>

        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto">
          <Card className="retro-pattern">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Settings className="w-5 h-5 text-muted-foreground" />
                  <CardTitle className="text-lg">Quick Actions</CardTitle>
                </div>
                <Heart className="w-5 h-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button 
                  variant="outline" 
                  className="justify-start"
                  onClick={() => console.log('Navigate to Settings')}
                >
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
                <Button 
                  variant="retro" 
                  className="justify-start"
                  onClick={() => console.log('Quick pain log')}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Quick Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-16">
          <p className="font-pokemon text-muted-foreground">
            Take control of your pain. One breath at a time.
          </p>
          <div className="mt-4 w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </div>

      <JournalDialog 
        open={journalOpen} 
        onOpenChange={setJournalOpen} 
      />
      <PainTrackerDialog 
        open={painTrackerOpen} 
        onOpenChange={setPainTrackerOpen} 
      />
    </div>
  );
};

export default Home;
