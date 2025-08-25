import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/modern-button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChartContainer } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { ArrowLeft, Save, BarChart3, Calendar, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const qualityOptions = [
  "Burning", "Stabbing", "Throbbing", "Aching", 
  "Electric", "Stiff", "Pressure"
];

const bodyLocationOptions = [
  "Head & face", "Neck & shoulders", "Arms & hands", "Upper back",
  "Lower back", "Chest & ribs", "Abdomen & pelvis", "Hips & thighs",
  "Knees", "Lower legs & calves", "Ankles & feet", "Whole body / widespread"
];

const contextOptions = [
  "My posture or body position", "Stress or emotional strain", "Weather or temperature changes", "Recent medication use", 
  "Recent movement or exercise", "How much water I've had", "Whether I rested or napped", "Time spent looking at screens", 
  "Time spent outdoors", "Time spent indoors", "Exposure to noise or bright light"
];

const helpedOptions = [
  "Heat", "Stretching", "Breathing", "Walking", 
  "Resting", "Drinking water", "Medication", "Talking with someone",
  "Music", "Distraction"
];

const moodOptions = [
  "Calm", "Anxious", "Frustrated", "Hopeful", "Sad", "Content", "Irritated", "Peaceful"
];

const socialOptions = [
  "Time with others", "Feeling isolated", "Received support", "Helped someone else", "Alone by choice"
];

const PainTrackerDialog = ({ open, onOpenChange }: PainTrackerDialogProps) => {
  const [view, setView] = useState<'entry' | 'post-save' | 'history' | 'insights'>('entry');
  const [intensity, setIntensity] = useState([5]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedHelped, setSelectedHelped] = useState<string[]>([]);
  const [helpedEffectiveness, setHelpedEffectiveness] = useState<{ [key: string]: number }>({});
  const [impact, setImpact] = useState({ activity: 0, mood: 0, sleep: 0, concentration: 0 });
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<PainEntry[]>([]);
  
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

  const handleSave = () => {
    const entry: PainEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      intensity: intensity[0],
      location: selectedLocations,
      quality: selectedQualities,
      impact,
      context: selectedContext,
      notes,
      sleepHours,
      sleepQuality,
      daytimeRest,
      stress,
      moodState,
      socialConnection,
      flareUp,
      flareDuration,
      painSpikes,
      fatigue,
      brainFog,
    };

    setEntries(prev => [entry, ...prev]);
    setView('post-save');
    toast({
      title: "Saved. Thank you for checking in with your body.",
      description: "Your pain log has been recorded.",
    });
  };

  const handleSaveHelped = () => {
    if (entries.length > 0) {
      const updatedEntries = [...entries];
      updatedEntries[0] = { 
        ...updatedEntries[0], 
        helped: selectedHelped,
        helpedEffectiveness 
      };
      setEntries(updatedEntries);
    }
    resetForm();
    setView('entry');
    setSelectedHelped([]);
    setHelpedEffectiveness({});
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
        <div className="text-center py-12">
          <BarChart3 className="w-12 h-12 text-pain-primary mx-auto mb-4" />
          <p className="text-muted-foreground text-sm mb-2">
            Start tracking to see your pain insights
          </p>
          <p className="text-xs text-muted-foreground">
            Track at least a few entries to see patterns and trends.
          </p>
        </div>
      );
    }

    const avgPain = entries.reduce((sum, entry) => sum + entry.intensity, 0) / entries.length;
    const recentEntries = entries.slice(0, 7);
    const weeklyAvg = recentEntries.reduce((sum, entry) => sum + entry.intensity, 0) / recentEntries.length;
    
    // Find most common helpful strategies
    const allHelped = entries.flatMap(entry => entry.helped || []);
    const helpedCounts = allHelped.reduce((acc, item) => {
      acc[item] = (acc[item] || 0) + 1;
      return acc;
    }, {} as { [key: string]: number });
    const topHelped = Object.entries(helpedCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 3)
      .map(([item]) => item);

    return (
      <ScrollArea className="h-[400px]">
        <div className="space-y-6">
          {/* Weekly Summary Card */}
          <div className="p-4 bg-pain-primary/5 rounded-lg border border-pain-primary/20">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-pain-primary" />
              <h3 className="font-medium text-pain-primary">This Week's Reflection</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              You've logged {entries.length} entries. Your average pain this week was {weeklyAvg.toFixed(1)}/10.
              {topHelped.length > 0 && (
                <> {topHelped[0]} appeared most often on easier days.</>
              )}
            </p>
          </div>

          {/* Pain Timeline Graph */}
          <div className="p-4 border rounded-lg">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-5 h-5 text-pain-primary" />
              <h3 className="font-medium">Pain Timeline</h3>
            </div>
            <div className="h-48">
              <ChartContainer
                config={{
                  intensity: {
                    label: "Pain Intensity",
                    color: "hsl(var(--pain-primary))",
                  },
                }}
                className="h-full w-full"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={entries
                      .slice(0, 14)
                      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                      .map((entry) => ({
                        date: new Date(entry.date).toLocaleDateString('en-US', { 
                          month: 'short', 
                          day: 'numeric' 
                        }),
                        intensity: entry.intensity,
                        fullDate: new Date(entry.date).toLocaleDateString(),
                      }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                    <XAxis 
                      dataKey="date" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      domain={[0, 10]}
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="rounded-lg border bg-background p-2 shadow-sm">
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">
                                    Date
                                  </span>
                                  <span className="text-sm font-bold">
                                    {payload[0]?.payload?.fullDate}
                                  </span>
                                </div>
                                <div className="flex flex-col">
                                  <span className="text-xs text-muted-foreground">
                                    Pain Level
                                  </span>
                                  <span className="text-sm font-bold text-pain-primary">
                                    {payload[0]?.value}/10
                                  </span>
                                </div>
                              </div>
                            </div>
                          )
                        }
                        return null
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="intensity"
                      stroke="hsl(var(--pain-primary))"
                      strokeWidth={2}
                      dot={{ fill: "hsl(var(--pain-primary))", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6, stroke: "hsl(var(--pain-primary))", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Most Helpful Strategies */}
          {topHelped.length > 0 && (
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-3">Your Comfort Toolkit</h3>
              <div className="flex flex-wrap gap-2">
                {topHelped.map((strategy) => (
                  <span
                    key={strategy}
                    className="px-3 py-1.5 text-xs bg-pain-primary/10 text-pain-primary rounded-full border border-pain-primary/20"
                  >
                    {strategy} ({helpedCounts[strategy]}x)
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Calendar Heatmap Preview */}
          <div className="p-4 border rounded-lg">
            <h3 className="font-medium mb-3">Recent Pain Levels</h3>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: 14 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - (13 - i));
                const entry = entries.find(e => 
                  new Date(e.date).toDateString() === date.toDateString()
                );
                const intensity = entry?.intensity || 0;
                const color = intensity === 0 ? 'bg-muted' : 
                             intensity <= 3 ? 'bg-green-200' :
                             intensity <= 6 ? 'bg-yellow-200' :
                             intensity <= 8 ? 'bg-orange-200' : 'bg-red-200';
                
                return (
                  <div
                    key={i}
                    className={`w-6 h-6 rounded ${color} border border-border`}
                    title={`${date.toLocaleDateString()}: ${intensity}/10`}
                  />
                );
              })}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Less</span>
              <span>More</span>
            </div>
          </div>
        </div>
      </ScrollArea>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] font-retro border-2 border-pain-primary/20 text-foreground backdrop-blur-sm rounded-2xl" style={{backgroundColor: 'hsl(var(--pain-bg))'}}>
        <DialogHeader>
          <DialogTitle className="font-retro text-2xl text-center flex items-center justify-center gap-3 text-pain-primary">
            {(view === 'history' || view === 'insights') && (
              <button
                onClick={() => setView('entry')}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            {view === 'entry' && "Track your Trends and Symptoms"}
            {view === 'post-save' && "What helped ease your pain today?"}
            {view === 'history' && "Your Pain Timeline"}
            {view === 'insights' && "Your Pain Insights"}
          </DialogTitle>
          {view === 'entry' && (
            <p className="text-sm text-muted-foreground text-center mt-2 px-4 mb-6">
              Log a quick snapshot of your pain today. A few taps help you notice patterns over time.
            </p>
          )}
          {view === 'insights' && (
            <p className="text-sm text-muted-foreground text-center mt-2 px-4 mb-6">
              Discover patterns and trends in your pain journey over time.
            </p>
          )}
        </DialogHeader>

        <div className="overflow-y-auto h-full px-8 pb-8">
          {view === 'entry' && (
            <>
              {/* Pain Intensity Slider */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-medium">Overall, how intense is your pain right now?</label>
                <div className="px-3 py-2">
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full pain-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-3">
                    <span>0 = No pain</span>
                    <span className="font-medium text-pain-primary">{intensity[0]}</span>
                    <span>10 = Worst imaginable</span>
                  </div>
                </div>
              </div>

              {/* Body Location Selector */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-medium">Where is your pain located?</label>
                <div className="flex flex-wrap gap-3">
                  {bodyLocationOptions.map((location) => (
                    <button
                      key={location}
                      onClick={() => toggleSelection(location, selectedLocations, setSelectedLocations)}
                      className={`px-4 py-2 text-xs rounded-full border transition-colors ${
                        selectedLocations.includes(location)
                          ? 'bg-pain-primary text-white border-pain-primary shadow-sm'
                          : 'bg-background border-border hover:border-pain-primary hover:bg-pain-primary/5'
                      }`}
                    >
                      {location}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-medium">What type of pain are you feeling right now?</label>
                <div className="flex flex-wrap gap-3">
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => toggleSelection(quality, selectedQualities, setSelectedQualities)}
                      className={`px-4 py-2 text-xs rounded-full border transition-colors ${
                        selectedQualities.includes(quality)
                          ? 'bg-pain-primary text-white border-pain-primary shadow-sm'
                          : 'bg-background border-border hover:border-pain-primary hover:bg-pain-primary/5'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="space-y-5 mb-8">
                <label className="text-sm font-medium">How much has pain interfered with…</label>
                
                {[
                  { key: 'activity' as const, label: 'Your ability to do daily tasks' },
                  { key: 'mood' as const, label: 'Your emotions and mental state' },
                  { key: 'sleep' as const, label: 'Your ability to rest or sleep well' },
                  { key: 'concentration' as const, label: 'Your ability to think clearly or concentrate (optional)' }
                ].map(({ key, label }) => (
                  <div key={key} className="space-y-3">
                    <div className="flex justify-between text-xs">
                      <span>{label}</span>
                      <span className="text-pain-primary font-medium">{impact[key]}/5</span>
                    </div>
                    <div className="px-3 py-2">
                      <Slider
                        value={[impact[key]]}
                        onValueChange={([value]) => setImpact(prev => ({ ...prev, [key]: value }))}
                        max={5}
                        min={0}
                        step={1}
                        className="w-full pain-slider"
                      />
                      <div className="flex justify-between text-xs text-muted-foreground mt-2">
                        <span>0 = Not at all</span>
                        <span>5 = Severely</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Context Tags */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-medium">What factors might be influencing your pain right now?</label>
                <div className="flex flex-wrap gap-3">
                  {contextOptions.map((context) => (
                    <button
                      key={context}
                      onClick={() => toggleSelection(context, selectedContext, setSelectedContext)}
                      className={`px-4 py-2 text-xs rounded-full border transition-colors ${
                        selectedContext.includes(context)
                          ? 'bg-pain-accent text-pain-accent-foreground border-pain-accent shadow-sm'
                          : 'bg-background border-border hover:border-pain-accent hover:bg-pain-accent/5'
                      }`}
                    >
                      {context}
                    </button>
                  ))}
                </div>
              </div>

              {/* Sleep & Rest */}
              <div className="space-y-5 mb-8">
                <label className="text-sm font-medium">Sleep & Rest</label>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Hours of sleep last night</span>
                    <span className="text-pain-primary font-medium">{sleepHours}h</span>
                  </div>
                  <div className="px-3 py-2">
                    <Slider
                      value={[sleepHours]}
                      onValueChange={([value]) => setSleepHours(value)}
                      max={12}
                      min={0}
                      step={0.5}
                      className="w-full pain-slider"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs">Sleep quality</label>
                  <div className="flex gap-2">
                    {['Restful', 'Average', 'Restless'].map((quality) => (
                      <button
                        key={quality}
                        onClick={() => setSleepQuality(quality)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          sleepQuality === quality
                            ? 'bg-pain-primary text-white border-pain-primary'
                            : 'bg-background border-border hover:border-pain-primary'
                        }`}
                      >
                        {quality}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="daytimeRest"
                    checked={daytimeRest}
                    onChange={(e) => setDaytimeRest(e.target.checked)}
                    className="rounded border-border"
                  />
                  <label htmlFor="daytimeRest" className="text-xs">I napped or rested during the day</label>
                </div>
              </div>

              {/* Emotional & Social */}
              <div className="space-y-5 mb-8">
                <label className="text-sm font-medium">Emotional & Social</label>
                
                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Stress level</span>
                    <span className="text-pain-primary font-medium">{stress}/5</span>
                  </div>
                  <div className="px-3 py-2">
                    <Slider
                      value={[stress]}
                      onValueChange={([value]) => setStress(value)}
                      max={5}
                      min={0}
                      step={1}
                      className="w-full pain-slider"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs">Mood check-in</label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((mood) => (
                      <button
                        key={mood}
                        onClick={() => setMoodState(mood)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          moodState === mood
                            ? 'bg-pain-primary text-white border-pain-primary'
                            : 'bg-background border-border hover:border-pain-primary'
                        }`}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs">Social connection</label>
                  <div className="flex flex-wrap gap-2">
                    {socialOptions.map((social) => (
                      <button
                        key={social}
                        onClick={() => setSocialConnection(social)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                          socialConnection === social
                            ? 'bg-pain-primary text-white border-pain-primary'
                            : 'bg-background border-border hover:border-pain-primary'
                        }`}
                      >
                        {social}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Flare & Symptom Tracking */}
              <div className="space-y-5 mb-8">
                <label className="text-sm font-medium">Flare & Symptoms</label>
                
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="flareUp"
                    checked={flareUp}
                    onChange={(e) => setFlareUp(e.target.checked)}
                    className="rounded border-border"
                  />
                  <label htmlFor="flareUp" className="text-xs">I experienced a flare-up today</label>
                </div>

                {flareUp && (
                  <div className="space-y-3">
                    <label className="text-xs">Duration of flare</label>
                    <div className="flex gap-2">
                      {['Short', 'Moderate', 'All-day'].map((duration) => (
                        <button
                          key={duration}
                          onClick={() => setFlareDuration(duration)}
                          className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                            flareDuration === duration
                              ? 'bg-pain-primary text-white border-pain-primary'
                              : 'bg-background border-border hover:border-pain-primary'
                          }`}
                        >
                          {duration}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Fatigue level</span>
                    <span className="text-pain-primary font-medium">{fatigue}/5</span>
                  </div>
                  <div className="px-3 py-2">
                    <Slider
                      value={[fatigue]}
                      onValueChange={([value]) => setFatigue(value)}
                      max={5}
                      min={0}
                      step={1}
                      className="w-full pain-slider"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between text-xs">
                    <span>Brain fog / concentration difficulties</span>
                    <span className="text-pain-primary font-medium">{brainFog}/5</span>
                  </div>
                  <div className="px-3 py-2">
                    <Slider
                      value={[brainFog]}
                      onValueChange={([value]) => setBrainFog(value)}
                      max={5}
                      min={0}
                      step={1}
                      className="w-full pain-slider"
                    />
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4 mb-8">
                <label className="text-sm font-medium">Optional: Add a quick note</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g., what made today easier or harder?"
                  className="min-h-[100px] resize-none"
                  maxLength={200}
                />
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} className="w-full bg-pain-primary text-pain-primary-foreground hover:bg-pain-primary/80" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Log
              </Button>
            </>
          )}

          {view === 'post-save' && (
            <>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-pain-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Save className="w-8 h-8 text-pain-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Your pain log has been saved. What helped ease your pain today?
                </p>
              </div>

              {/* What Helped Selection */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {helpedOptions.map((helped) => (
                    <button
                      key={helped}
                      onClick={() => toggleSelection(helped, selectedHelped, setSelectedHelped)}
                      className={`px-4 py-2 text-xs rounded-full border transition-colors ${
                        selectedHelped.includes(helped)
                          ? 'bg-pain-primary text-white border-pain-primary shadow-sm'
                          : 'bg-background border-border hover:border-pain-primary hover:bg-pain-primary/5'
                      }`}
                    >
                      {helped}
                    </button>
                  ))}
                </div>
              </div>

              {/* Effectiveness Rating */}
              {selectedHelped.length > 0 && (
                <div className="space-y-4">
                  <label className="text-sm font-medium">How much did it help?</label>
                  {selectedHelped.map((helped) => (
                    <div key={helped} className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span>{helped}</span>
                        <span className="text-pain-primary font-medium">
                          {helpedEffectiveness[helped] || 1}/3
                        </span>
                      </div>
                      <div className="flex gap-2">
                        {['Not at all', 'A little', 'A lot'].map((level, index) => (
                          <button
                            key={level}
                            onClick={() => setHelpedEffectiveness(prev => ({ ...prev, [helped]: index + 1 }))}
                            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                              (helpedEffectiveness[helped] || 1) === index + 1
                                ? 'bg-pain-primary text-white border-pain-primary'
                                : 'bg-background border-border hover:border-pain-primary'
                            }`}
                          >
                            {level}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-4 mt-8">
                <Button variant="outline" onClick={() => { resetForm(); setView('entry'); }} className="flex-1">
                  Skip
                </Button>
                <Button onClick={handleSaveHelped} className="flex-1">
                  Save & Continue
                </Button>
              </div>
            </>
          )}

          {view === 'insights' && renderInsights()}

          {view === 'history' && (
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {entries.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-12 h-12 bg-pain-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Save className="w-6 h-6 text-pain-primary" />
                    </div>
                    <p className="text-muted-foreground text-sm">
                      Your first check-in creates your pain timeline.
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      Your pain logs stay on your device unless you choose to export them.
                    </p>
                  </div>
                ) : (
                  <>
                    <div className="text-xs text-muted-foreground text-center mb-4 p-2 bg-pain-primary/5 rounded-lg">
                      Your pain logs stay on your device unless you choose to export them.
                    </div>
                    {entries.map((entry) => {
                      const emojis = ["🌿", "🌊", "🌙", "☁️", "✨"];
                      const emoji = emojis[Math.floor(Math.random() * emojis.length)];
                      return (
                        <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="text-sm text-muted-foreground flex items-center gap-2">
                              <span>{emoji}</span>
                              <span>{new Date(entry.date).toLocaleDateString()}</span>
                              <span>• Pain: {entry.intensity}/10</span>
                            </div>
                          </div>
                          {entry.location && entry.location.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Location:</span> {entry.location.join(', ')}
                            </div>
                          )}
                          {entry.quality.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Type:</span> {entry.quality.join(', ')}
                            </div>
                          )}
                          {entry.context.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">Factors:</span> {entry.context.join(', ')}
                            </div>
                          )}
                          {entry.helped && entry.helped.length > 0 && (
                            <div className="text-xs">
                              <span className="font-medium">What helped:</span> {entry.helped.join(', ')}
                            </div>
                          )}
                          {entry.notes && (
                            <div className="text-xs italic">"{entry.notes}"</div>
                          )}
                        </div>
                      );
                    })}
                  </>
                )}
              </div>
            </ScrollArea>
          )}

          {view === 'entry' && (
            <div className="flex gap-4 mt-6">
              {entries.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setView('history')} 
                  className="flex-1"
                >
                  View History ({entries.length} entries)
                </Button>
              )}
              {entries.length > 0 && (
                <Button 
                  variant="outline" 
                  onClick={() => setView('insights')} 
                  className="flex-1"
                >
                  <BarChart3 className="w-4 h-4 mr-2" />
                  View Insights
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PainTrackerDialog;