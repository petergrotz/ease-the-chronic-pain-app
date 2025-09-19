import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Heart, Activity, Brain, Moon, Smile, Zap, Calendar, TrendingUp, Clock, Star } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface PainEntry {
  id: string;
  date: string;
  intensity: number;
  location: string[];
  quality: string[];
  impact: {
    activity: number;
    mood: number;
    sleep: number;
    concentration?: number;
  };
  context: string[];
  notes: string;
  helped?: string[];
  helpedEffectiveness?: { [key: string]: number };
  sleepHours?: number;
  sleepQuality?: string;
  daytimeRest?: boolean;
  stress?: number;
  moodState?: string;
  socialConnection?: string;
  flareUp?: boolean;
  flareDuration?: string;
  painSpikes?: string;
  fatigue?: number;
  brainFog?: number;
}

interface PainTrackerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PAIN_LOCATIONS = [
  "Head/Neck", "Shoulders", "Upper Back", "Lower Back", "Arms", "Hands/Wrists", 
  "Chest", "Abdomen", "Hips", "Legs", "Knees", "Feet/Ankles", "Whole Body"
];

const PAIN_QUALITIES = [
  "Sharp", "Dull", "Throbbing", "Burning", "Cramping", "Stabbing", 
  "Aching", "Tight", "Stiff", "Tingling", "Numb", "Electric"
];

const CONTEXT_OPTIONS = [
  "After Waking", "During Activity", "At Rest", "Weather Change", "Stress", 
  "Poor Sleep", "Long Sitting", "Physical Activity", "Emotional Upset", "Eating", "Unknown"
];

const HELPED_OPTIONS = [
  "Rest", "Heat", "Cold", "Gentle Movement", "Stretching", "Massage", "Medication", 
  "Deep Breathing", "Meditation", "Hot Bath", "Walking", "Music", "Nature", "Tea"
];

const PainTrackerDialog = ({ open, onOpenChange }: PainTrackerDialogProps) => {
  const [view, setView] = useState<'entry' | 'post-save' | 'insights'>('entry');
  const [intensity, setIntensity] = useState([5]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedHelped, setSelectedHelped] = useState<string[]>([]);
  const [helpedEffectiveness, setHelpedEffectiveness] = useState<{ [key: string]: number }>({});
  const [impact, setImpact] = useState({ activity: 0, mood: 0, sleep: 0, concentration: 0 });
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const [loading, setLoading] = useState(false);
  
  // New tracking fields
  const [sleepHours, setSleepHours] = useState(7);
  const [sleepQuality, setSleepQuality] = useState("");
  const [daytimeRest, setDaytimeRest] = useState(false);
  const [stress, setStress] = useState(2);
  const [moodState, setMoodState] = useState("");
  const [socialConnection, setSocialConnection] = useState("");
  const [flareUp, setFlareUp] = useState(false);
  const [flareDuration, setFlareDuration] = useState("");
  const [painSpikes, setPainSpikes] = useState("");
  const [fatigue, setFatigue] = useState(2);
  const [brainFog, setBrainFog] = useState(2);
  
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (open && user) {
      loadEntries();
    }
  }, [open, user]);

  const loadEntries = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('pain_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEntries = data.map(entry => ({
        id: entry.id,
        date: entry.created_at,
        intensity: entry.intensity,
        location: entry.location || [],
        quality: entry.quality || [],
        impact: {
          activity: entry.impact_activity || 0,
          mood: entry.impact_mood || 0,
          sleep: entry.impact_sleep || 0,
          concentration: entry.impact_concentration || 0,
        },
        context: entry.context || [],
        notes: entry.notes || "",
        helped: entry.helped || [],
        helpedEffectiveness: (entry.helped_effectiveness as { [key: string]: number }) || {},
        sleepHours: entry.sleep_hours,
        sleepQuality: entry.sleep_quality,
        daytimeRest: entry.daytime_rest,
        stress: entry.stress,
        moodState: entry.mood_state,
        socialConnection: entry.social_connection,
        flareUp: entry.flare_up,
        flareDuration: entry.flare_duration,
        painSpikes: entry.pain_spikes,
        fatigue: entry.fatigue,
        brainFog: entry.brain_fog,
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading pain entries:', error);
      toast({
        title: "Error loading entries",
        description: "Could not load your pain tracking data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIntensity([5]);
    setSelectedQualities([]);
    setSelectedLocations([]);
    setSelectedContext([]);
    setSelectedHelped([]);
    setHelpedEffectiveness({});
    setImpact({ activity: 0, mood: 0, sleep: 0, concentration: 0 });
    setNotes("");
    setSleepHours(7);
    setSleepQuality("");
    setDaytimeRest(false);
    setStress(2);
    setMoodState("");
    setSocialConnection("");
    setFlareUp(false);
    setFlareDuration("");
    setPainSpikes("");
    setFatigue(2);
    setBrainFog(2);
  };

  const handleSave = async () => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('pain_entries')
        .insert({
          user_id: user.id,
          intensity: intensity[0],
          location: selectedLocations,
          quality: selectedQualities,
          impact_activity: impact.activity,
          impact_mood: impact.mood,
          impact_sleep: impact.sleep,
          impact_concentration: impact.concentration,
          context: selectedContext,
          notes,
          sleep_hours: sleepHours,
          sleep_quality: sleepQuality,
          daytime_rest: daytimeRest,
          stress,
          mood_state: moodState,
          social_connection: socialConnection,
          flare_up: flareUp,
          flare_duration: flareDuration,
          pain_spikes: painSpikes,
          fatigue,
          brain_fog: brainFog,
        });

      if (error) throw error;

      setView('post-save');
      toast({
        title: "Saved. Thank you for checking in with your body.",
        description: "Your pain log has been recorded.",
      });

      await loadEntries(); // Refresh the entries
    } catch (error) {
      console.error('Error saving pain entry:', error);
      toast({
        title: "Error saving entry",
        description: "Could not save your pain tracking data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveHelped = async () => {
    if (!user || entries.length === 0) return;

    setLoading(true);
    try {
      const latestEntry = entries[0];
      const { error } = await supabase
        .from('pain_entries')
        .update({
          helped: selectedHelped,
          helped_effectiveness: helpedEffectiveness
        })
        .eq('id', latestEntry.id)
        .eq('user_id', user.id);

      if (error) throw error;

      resetForm();
      setView('entry');
      setSelectedHelped([]);
      setHelpedEffectiveness({});
      await loadEntries(); // Refresh the entries
    } catch (error) {
      console.error('Error updating pain entry:', error);
      toast({
        title: "Error updating entry",
        description: "Could not update your pain tracking data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const renderInsights = () => {
    if (entries.length === 0) {
      return (
        <div className="text-center py-8">
          <Activity className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No data yet</h3>
          <p className="text-muted-foreground mb-4">
            Track some pain entries to see your insights and patterns
          </p>
          <Button onClick={() => setView('entry')}>
            Log Your First Entry
          </Button>
        </div>
      );
    }

    const recentEntries = entries.slice(0, 7);
    const avgIntensity = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
    
    const chartData = recentEntries.reverse().map((entry, index) => ({
      day: `Day ${index + 1}`,
      intensity: entry.intensity,
      date: new Date(entry.date).toLocaleDateString()
    }));

    // Helper strategies based on what has been marked as helpful
    const helpfulStrategies = entries
      .filter(entry => entry.helped && entry.helped.length > 0)
      .flatMap(entry => entry.helped || [])
      .reduce((acc: { [key: string]: number }, strategy) => {
        acc[strategy] = (acc[strategy] || 0) + 1;
        return acc;
      }, {});

    const topStrategies = Object.entries(helpfulStrategies)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 6);

    return (
      <div className="space-y-6">
        {/* Weekly Summary */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              This Week's Summary
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-primary">{avgIntensity.toFixed(1)}</div>
              <div className="text-sm text-muted-foreground">Avg Pain Level</div>
            </div>
            <div className="text-center p-3 bg-muted/50 rounded-lg">
              <div className="text-2xl font-bold text-secondary">{entries.length}</div>
              <div className="text-sm text-muted-foreground">Total Entries</div>
            </div>
          </CardContent>
        </Card>

        {/* Pain Timeline */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Pain Level Timeline
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis domain={[0, 10]} />
                  <Tooltip 
                    labelFormatter={(label, payload) => {
                      if (payload && payload[0]) {
                        return payload[0].payload.date;
                      }
                      return label;
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="intensity" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Comfort Toolkit */}
        {topStrategies.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Star className="w-5 h-5" />
                Your Comfort Toolkit
              </CardTitle>
              <p className="text-sm text-muted-foreground">
                Strategies that have helped you most
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {topStrategies.map(([strategy, count]) => (
                  <Badge key={strategy} variant="secondary" className="justify-center py-2">
                    {strategy} ({count}x)
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Calendar Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Calendar Heatmap Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }, (_, i) => {
                const dayEntry = entries.find(entry => {
                  const entryDate = new Date(entry.date);
                  const checkDate = new Date();
                  checkDate.setDate(checkDate.getDate() - (13 - i));
                  return entryDate.toDateString() === checkDate.toDateString();
                });
                
                const intensity = dayEntry?.intensity || 0;
                const opacity = intensity > 0 ? (intensity / 10) * 0.8 + 0.2 : 0.1;
                
                return (
                  <div
                    key={i}
                    className="aspect-square rounded-sm"
                    style={{
                      backgroundColor: intensity > 0 
                        ? `hsl(var(--primary) / ${opacity})` 
                        : 'hsl(var(--muted))',
                    }}
                    title={`Pain level: ${intensity}/10`}
                  />
                );
              })}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Last 14 days • Darker = Higher pain
            </p>
          </CardContent>
        </Card>

        {/* Recent Entries */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Recent Entries
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {entries.slice(0, 5).map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <div className="font-medium">
                      {new Date(entry.date).toLocaleDateString()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {entry.location.slice(0, 2).join(', ')}
                      {entry.location.length > 2 && ` +${entry.location.length - 2} more`}
                    </div>
                  </div>
                  <Badge variant={entry.intensity > 7 ? "destructive" : entry.intensity > 4 ? "secondary" : "default"}>
                    {entry.intensity}/10
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {(view === 'post-save' || view === 'insights') && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView(view === 'post-save' ? 'entry' : 'entry')}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              <DialogTitle>
                {view === 'entry' ? 'Pain Check-In' : 
                 view === 'post-save' ? 'What Helped?' : 'Your Insights'}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription>
            {view === 'entry' 
              ? 'Track your pain levels and discover patterns in your healing journey.'
              : view === 'post-save'
              ? 'Help us learn what brings you comfort and relief.'
              : 'Understanding your pain patterns and effective strategies.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {view === 'entry' ? (
            <div className="space-y-6">
              {/* Pain Intensity */}
              <div className="space-y-3">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Heart className="w-4 h-4" />
                  Current Pain Level: {intensity[0]}/10
                </label>
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={10}
                  step={1}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>No pain</span>
                  <span>Severe pain</span>
                </div>
              </div>

              {/* Pain Location */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Where do you feel pain?</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAIN_LOCATIONS.map((location) => (
                    <Button
                      key={location}
                      variant={selectedLocations.includes(location) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(location, selectedLocations, setSelectedLocations)}
                      className="text-xs"
                    >
                      {location}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Pain Quality */}
              <div className="space-y-3">
                <label className="text-sm font-medium">How would you describe the pain?</label>
                <div className="grid grid-cols-3 gap-2">
                  {PAIN_QUALITIES.map((quality) => (
                    <Button
                      key={quality}
                      variant={selectedQualities.includes(quality) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(quality, selectedQualities, setSelectedQualities)}
                      className="text-xs"
                    >
                      {quality}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="space-y-4">
                <label className="text-sm font-medium">How is pain affecting you today?</label>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Activity className="w-4 h-4" />
                      Daily Activities: {impact.activity}/10
                    </span>
                  </div>
                  <Slider
                    value={[impact.activity]}
                    onValueChange={([value]) => setImpact(prev => ({ ...prev, activity: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Smile className="w-4 h-4" />
                      Mood: {impact.mood}/10
                    </span>
                  </div>
                  <Slider
                    value={[impact.mood]}
                    onValueChange={([value]) => setImpact(prev => ({ ...prev, mood: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Moon className="w-4 h-4" />
                      Sleep Quality: {impact.sleep}/10
                    </span>
                  </div>
                  <Slider
                    value={[impact.sleep]}
                    onValueChange={([value]) => setImpact(prev => ({ ...prev, sleep: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Concentration: {impact.concentration}/10
                    </span>
                  </div>
                  <Slider
                    value={[impact.concentration]}
                    onValueChange={([value]) => setImpact(prev => ({ ...prev, concentration: value }))}
                    max={10}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Context */}
              <div className="space-y-3">
                <label className="text-sm font-medium">What might have contributed to this pain?</label>
                <div className="grid grid-cols-2 gap-2">
                  {CONTEXT_OPTIONS.map((context) => (
                    <Button
                      key={context}
                      variant={selectedContext.includes(context) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(context, selectedContext, setSelectedContext)}
                      className="text-xs"
                    >
                      {context}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Additional tracking */}
              <div className="space-y-4">
                <div className="space-y-3">
                  <label className="text-sm font-medium">Stress Level: {stress}/5</label>
                  <Slider
                    value={[stress]}
                    onValueChange={([value]) => setStress(value)}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium">Fatigue Level: {fatigue}/5</label>
                  <Slider
                    value={[fatigue]}
                    onValueChange={([value]) => setFatigue(value)}
                    max={5}
                    step={1}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Additional notes (optional)</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Anything else you'd like to remember about how you're feeling today?"
                  className="min-h-[80px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setView('insights')}
                  className="flex-1"
                >
                  View Insights
                </Button>
                <Button 
                  onClick={handleSave}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </div>
          ) : view === 'post-save' ? (
            <div className="space-y-4">
              <div className="text-center mb-6">
                <Heart className="w-12 h-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Thank you for checking in</h3>
                <p className="text-muted-foreground">
                  What has helped bring you comfort or relief today?
                </p>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium">What helped? (Select all that apply)</label>
                <div className="grid grid-cols-2 gap-2">
                  {HELPED_OPTIONS.map((option) => (
                    <Button
                      key={option}
                      variant={selectedHelped.includes(option) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleSelection(option, selectedHelped, setSelectedHelped)}
                      className="text-xs"
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {selectedHelped.length > 0 && (
                <div className="space-y-3">
                  <label className="text-sm font-medium">How effective was each strategy?</label>
                  {selectedHelped.map((item) => (
                    <div key={item} className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">{item}</span>
                        <span className="text-sm text-muted-foreground">
                          {helpedEffectiveness[item] || 1}/5
                        </span>
                      </div>
                      <Slider
                        value={[helpedEffectiveness[item] || 1]}
                        onValueChange={([value]) => 
                          setHelpedEffectiveness(prev => ({ ...prev, [item]: value }))
                        }
                        max={5}
                        step={1}
                        className="w-full"
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-3 mt-6">
                <Button 
                  variant="outline" 
                  onClick={handleSaveHelped}
                  disabled={loading}
                  className="flex-1"
                  
                >
                  {loading ? "Saving..." : "Skip for now"}
                </Button>
                <Button 
                  onClick={handleSaveHelped}
                  disabled={loading}
                  className="flex-1"
                >
                  {loading ? "Saving..." : "Save & Finish"}
                </Button>
              </div>
            </div>
          ) : (
            renderInsights()
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PainTrackerDialog;
