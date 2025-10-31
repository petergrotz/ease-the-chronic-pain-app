import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, LogOut, User, Home, Heart, BookOpen, BarChart3, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import JournalDialog from '@/components/JournalDialog';
import PainTrackerDialog from '@/components/PainTrackerDialog';
import EnvironmentCarousel from '@/components/EnvironmentCarousel';

const easeLogoClouds = "/lovable-uploads/ab156088-a078-4ea1-ab55-6f47188c6e4f.png";

interface Profile {
  id: string;
  user_id: string;
  email: string;
  full_name: string | null;
  avatar_url: string | null;
}

const Dashboard = () => {
  const { user, signOut, loading: authLoading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [journalOpen, setJournalOpen] = useState(false);
  const [painTrackerOpen, setPainTrackerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      // No auth: load dashboard without profile
      setLoading(false);
      return;
    }

    if (user) {
      fetchProfile();
    }
  }, [user, authLoading, navigate]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        toast({
          title: "Error loading profile",
          description: "Unable to load your profile information.",
          variant: "destructive",
        });
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-calm flex items-center justify-center">
        <div className="flex items-center space-x-2">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Loading dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Subtle Breathing Circle Background */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="dashboard-circle-outer rounded-full bg-primary/15 blur-3xl" />
        <div className="dashboard-circle-middle rounded-full bg-primary/20 blur-2xl" />
        <div className="dashboard-circle-inner rounded-full bg-primary/25 blur-xl" />
      </div>

      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-4">
            <img 
              src={easeLogoClouds} 
              alt="EASE" 
              className="w-auto h-12"
            />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back to your healing journey</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              onClick={() => navigate('/')}
              className="flex items-center space-x-2"
            >
              <Home className="w-4 h-4" />
              <span>Home</span>
            </Button>
            {user && (
              <Button
                variant="outline"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </Button>
            )}
          </div>
        </div>


        {/* Main Navigation Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-8">
          
          {/* Journal */}
          <Card className="group cursor-pointer hover:scale-105 transition-transform duration-200 animate-in fade-in-50 slide-in-from-left-4 duration-700 delay-100">
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
                onClick={() => setJournalOpen(true)}
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Open Journal
              </Button>
            </CardContent>
          </Card>

          {/* Pain Tracker */}
          <Card className="group cursor-pointer hover:scale-105 transition-transform duration-200 animate-in fade-in-50 slide-in-from-right-4 duration-700 delay-200">
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
        <div className="mb-12 animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-250">
          <EnvironmentCarousel />
        </div>

        {/* Quick Actions */}
        <div className="max-w-2xl mx-auto animate-in fade-in-50 slide-in-from-bottom-4 duration-700 delay-300">
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
                  onClick={() => navigate('/')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Go to Home
                </Button>
                <Button 
                  variant="secondary" 
                  className="justify-start"
                  onClick={() => setPainTrackerOpen(true)}
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Quick Log
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center mt-12 animate-in fade-in-50 duration-700 delay-400">
          <p className="text-muted-foreground">
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

      <style>{`
        .dashboard-circle-outer,
        .dashboard-circle-middle,
        .dashboard-circle-inner {
          position: absolute;
        }

        .dashboard-circle-outer {
          width: 600px;
          height: 600px;
          animation: breathe-dashboard-outer 12s ease-in-out infinite;
        }

        .dashboard-circle-middle {
          width: 450px;
          height: 450px;
          animation: breathe-dashboard-middle 12s ease-in-out infinite 1s;
        }

        .dashboard-circle-inner {
          width: 300px;
          height: 300px;
          animation: breathe-dashboard-inner 12s ease-in-out infinite 2s;
        }

        @keyframes breathe-dashboard-outer {
          0%, 100% {
            transform: scale(1);
            opacity: 0.3;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.5;
          }
        }

        @keyframes breathe-dashboard-middle {
          0%, 100% {
            transform: scale(1);
            opacity: 0.4;
          }
          50% {
            transform: scale(1.25);
            opacity: 0.6;
          }
        }

        @keyframes breathe-dashboard-inner {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }

        @media (min-width: 768px) {
          .dashboard-circle-outer {
            width: 800px;
            height: 800px;
          }
          .dashboard-circle-middle {
            width: 600px;
            height: 600px;
          }
          .dashboard-circle-inner {
            width: 400px;
            height: 400px;
          }
        }
      `}</style>
    </div>
  );
};

export default Dashboard;