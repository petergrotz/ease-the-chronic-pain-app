import { Button } from "@/components/ui/modern-button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/modern-card";
import EnvironmentCarousel from "@/components/EnvironmentCarousel";
const easeLogoClouds = "/lovable-uploads/ab156088-a078-4ea1-ab55-6f47188c6e4f.png";
import { Heart, BookOpen, BarChart3, Settings } from "lucide-react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-2">
            <img 
              src={easeLogoClouds} 
              alt="EASE" 
              className="w-auto h-32 md:h-40 lg:h-48"
            />
          </div>
          <p className="font-modern text-lg text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
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
                onClick={() => console.log('Navigate to Journal')}
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
                variant="secondary" 
                className="w-full"
                onClick={() => console.log('Navigate to Pain Tracking')}
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
          <p className="font-modern text-muted-foreground">
            Take control of your pain. One breath at a time.
          </p>
          <div className="mt-4 w-16 h-1 bg-primary rounded-full mx-auto"></div>
        </div>
      </div>
    </div>
  );
};

export default Home;
