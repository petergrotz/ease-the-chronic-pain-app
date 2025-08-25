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
  "posture", "stress", "weather", "medication", 
  "movement", "hydration", "rest", "screen time", 
  "outside", "inside"
];

const helpedOptions = [
  "heat", "stretching", "breathing", "walk", 
  "rest", "hydration", "medication", "talking with someone"
];

const PainTrackerDialog = ({ open, onOpenChange }: PainTrackerDialogProps) => {
  const [view, setView] = useState<'entry' | 'post-save' | 'history'>('entry');
  const [intensity, setIntensity] = useState([5]);
  const [selectedQualities, setSelectedQualities] = useState<string[]>([]);
  const [selectedContext, setSelectedContext] = useState<string[]>([]);
  const [selectedHelped, setSelectedHelped] = useState<string[]>([]);
  const [impact, setImpact] = useState({ activity: 3, mood: 3, sleep: 3 });
  const [notes, setNotes] = useState("");
  const [entries, setEntries] = useState<PainEntry[]>([]);
  const { toast } = useToast();

  const resetForm = () => {
    setIntensity([5]);
    setSelectedQualities([]);
    setSelectedContext([]);
    setSelectedHelped([]);
    setImpact({ activity: 3, mood: 3, sleep: 3 });
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
      title: "Saved. Thank you for listening to your body.",
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
          <DialogTitle className="font-retro text-2xl text-center flex items-center justify-center gap-3">
            {view === 'history' && (
              <button
                onClick={() => setView('entry')}
                className="p-1 hover:bg-accent rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <Heart className="w-6 h-6 text-pain-primary" />
            {view === 'entry' && "Track how your pain feels right now"}
            {view === 'post-save' && "What helped today?"}
            {view === 'history' && "Your Pain Timeline"}
          </DialogTitle>
        </DialogHeader>

        <div className="overflow-y-auto h-full px-6 pb-6">
          {view === 'entry' && (
            <>
              {/* Pain Intensity Slider */}
              <div className="space-y-3">
                <label className="text-sm font-medium">How is your pain right now?</label>
                <div className="px-3">
                  <Slider
                    value={intensity}
                    onValueChange={setIntensity}
                    max={10}
                    min={0}
                    step={1}
                    className="w-full pain-slider"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0 - No pain</span>
                    <span className="font-medium text-pain-primary">{intensity[0]}</span>
                    <span>10 - Worst pain</span>
                  </div>
                </div>
              </div>

              {/* Quality Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">What does it feel like?</label>
                <div className="flex flex-wrap gap-2">
                  {qualityOptions.map((quality) => (
                    <button
                      key={quality}
                      onClick={() => toggleSelection(quality, selectedQualities, setSelectedQualities)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        selectedQualities.includes(quality)
                          ? 'bg-pain-primary text-white border-pain-primary'
                          : 'bg-background border-border hover:border-pain-primary'
                      }`}
                    >
                      {quality}
                    </button>
                  ))}
                </div>
              </div>

              {/* Impact Assessment */}
              <div className="space-y-4">
                <label className="text-sm font-medium">How has pain affected you today?</label>
                
                {(['activity', 'mood', 'sleep'] as const).map((category) => (
                  <div key={category} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="capitalize">{category}</span>
                      <span className="text-pain-primary font-medium">{impact[category]}/5</span>
                    </div>
                    <Slider
                      value={[impact[category]]}
                      onValueChange={([value]) => setImpact(prev => ({ ...prev, [category]: value }))}
                      max={5}
                      min={1}
                      step={1}
                      className="w-full pain-slider"
                    />
                  </div>
                ))}
              </div>

              {/* Context Tags */}
              <div className="space-y-3">
                <label className="text-sm font-medium">What's happening around you?</label>
                <div className="flex flex-wrap gap-2">
                  {contextOptions.map((context) => (
                    <button
                      key={context}
                      onClick={() => toggleSelection(context, selectedContext, setSelectedContext)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        selectedContext.includes(context)
                          ? 'bg-pain-accent text-pain-accent-foreground border-pain-accent'
                          : 'bg-background border-border hover:border-pain-accent'
                      }`}
                    >
                      {context}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Add a few words if you'd like</label>
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How are you feeling? What's on your mind?"
                  className="min-h-[80px] resize-none"
                  maxLength={200}
                />
              </div>

              {/* Save Button */}
              <Button onClick={handleSave} className="w-full" size="lg">
                <Save className="w-4 h-4 mr-2" />
                Save Log
              </Button>
            </>
          )}

          {view === 'post-save' && (
            <>
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-pain-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8 text-pain-primary" />
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  Your pain log has been saved. What helped you today?
                </p>
              </div>

              {/* What Helped Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">What helped? (Optional)</label>
                <div className="flex flex-wrap gap-2">
                  {helpedOptions.map((helped) => (
                    <button
                      key={helped}
                      onClick={() => toggleSelection(helped, selectedHelped, setSelectedHelped)}
                      className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                        selectedHelped.includes(helped)
                          ? 'bg-pain-primary text-white border-pain-primary'
                          : 'bg-background border-border hover:border-pain-primary'
                      }`}
                    >
                      {helped}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
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
                    <Heart className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">
                      Your first check-in creates your pain timeline.
                    </p>
                  </div>
                ) : (
                  entries.map((entry) => (
                    <div key={entry.id} className="p-4 border rounded-lg space-y-2">
                      <div className="flex justify-between items-start">
                        <div className="text-sm text-muted-foreground">
                          {new Date(entry.date).toLocaleDateString()} • Pain: {entry.intensity}/10
                        </div>
                      </div>
                      {entry.quality.length > 0 && (
                        <div className="text-xs">
                          <span className="font-medium">Quality:</span> {entry.quality.join(', ')}
                        </div>
                      )}
                      {entry.context.length > 0 && (
                        <div className="text-xs">
                          <span className="font-medium">Context:</span> {entry.context.join(', ')}
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
                  ))
                )}
              </div>
            </ScrollArea>
          )}

          {view === 'entry' && entries.length > 0 && (
            <Button 
              variant="outline" 
              onClick={() => setView('history')} 
              className="w-full"
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