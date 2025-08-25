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
import { ArrowLeft, Save, Heart } from "lucide-react";
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
  };
  context: string[];
  notes: string;
  helped?: string[];
}

interface PainTrackerDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const qualityOptions = [
  "Burning", "Stabbing", "Throbbing", "Aching", 
  "Electric", "Stiff", "Pressure"
];

const contextOptions = [
  "My posture or body position", "Stress or emotional strain", "Weather or temperature changes", "Recent medication use", 
  "Recent movement or exercise", "How much water I've had", "Whether I rested or napped", "Time spent looking at screens", 
  "Time spent outside", "Time spent indoors"
];

const helpedOptions = [
  "Heat", "Stretching", "Breathing", "Walking", 
  "Resting", "Drinking water", "Medication", "Talking with someone",
  "Music", "Distraction"
];

const PainTrackerDialog = ({ open, onOpenChange }: PainTrackerDialogProps) => {
  const [view, setView] = useState<'entry' | 'post-save' | 'history'>('entry');
  const [intensity, setIntensity] = useState([5]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedHelped, setSelectedHelped] = useState<string[]>([]);
  const [impact, setImpact] = useState({ activity: 0, mood: 0, sleep: 0 });
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const { toast } = useToast();

  const resetForm = () => {
    setIntensity([5]);
    setSelectedQualities([]);
    setSelectedContext([]);
    setSelectedHelped([]);
    setImpact({ activity: 0, mood: 0, sleep: 0 });
    setNotes("");
  };

  const handleSave = () => {
    const entry: PainEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      intensity: intensity[0],
      location: [], // TODO: Add body diagram
      quality: selectedQualities,
      impact,
      context: selectedContext,
      notes,
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
      updatedEntries[0] = { ...updatedEntries[0], helped: selectedHelped };
      setEntries(updatedEntries);
    }
    resetForm();
    setView('entry');
    setSelectedHelped([]);
  };

  const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
    if (selected.includes(item)) {
      setSelected(selected.filter(i => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] font-retro border-2 border-pain-primary/20 text-foreground backdrop-blur-sm rounded-2xl" style={{backgroundColor: 'hsl(var(--pain-bg))'}}>
        <DialogHeader>
          <DialogTitle className="font-retro text-2xl text-center flex items-center justify-center gap-3 text-pain-primary">
            {view === 'history' && (
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
          </DialogTitle>
          {view === 'entry' && (
            <p className="text-sm text-muted-foreground text-center mt-2 px-4">
              Log a quick snapshot of your pain today. A few taps help you notice patterns over time.
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
                  <div className="text-center text-xs text-muted-foreground mt-2">
                    5 = Moderate
                  </div>
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
                  { key: 'sleep' as const, label: 'Your ability to rest or sleep well' }
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

          {view === 'entry' && entries.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setView('history')} 
              className="w-full mt-6"
            >
              View History ({entries.length} entries)
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PainTrackerDialog;