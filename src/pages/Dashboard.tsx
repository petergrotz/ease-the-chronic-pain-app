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
    <div className="min-h-screen bg-gradient-calm">
      <div className="container mx-auto px-4 py-8">
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

        {/* User Profile Card */}
        <Card className="mb-8 animate-in fade-in-50 duration-500">
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Avatar className="w-16 h-16">
                <AvatarImage src={profile?.avatar_url || ""} alt="Profile" />
                <AvatarFallback className="bg-primary text-primary-foreground text-lg">
                  {profile?.full_name?.charAt(0) || profile?.email.charAt(0).toUpperCase() || <User className="w-6 h-6" />}
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className="text-xl">
                  {profile?.full_name || 'Welcome!'}
                </CardTitle>
                <CardDescription className="text-base">
                  {profile?.email}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

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
    </div>
  );
};

export default Dashboard;