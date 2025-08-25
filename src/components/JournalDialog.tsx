import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/modern-button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BookOpen, ArrowLeft, Save, Mic, ChevronDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface JournalEntry {
  id: string;
  timestamp: Date;
  prompt_text: string;
  body: string;
  emoji: string;
}

const CALMING_EMOJIS = ["🌿", "🌊", "🌙", "☁️", "✨", "🌸", "🕊️", "🌅", "🫧", "🌱"];

const MICRO_PROMPTS = [
  "One small moment of ease I noticed today was…",
  "Right now, my body feels most tense in… and that sensation feels like…",
  "If my body had a voice today, it would say…",
  "Something that gently soothed me today (even a little) was…",
  "When my pain rose today, I responded by…",
  "A tiny act of care I offered myself was…",
  "One thing I want to thank my body for is…",
  "A boundary I honored (or want to try next time) was…",
  "The weather or environment affected me by…",
  "My energy levels moved like this across the day…",
  "A sensation that changed after breathing slowly was…",
  "I noticed my pain was easier/harder when I was…",
  "One supportive phrase I can tell myself is…",
  "A song, sound, or silence that helped was…",
  "Something I postponed or paced well today was…",
  "If ease were a color or texture right now, it would be…",
  "One thing I can control today is… One thing I'll let be is…",
  "A person or pet that brought comfort was…",
  "One place in my body that felt neutral (or less intense) was…",
  "A small win I might have missed if I wasn't looking is…",
  "What I needed most this morning/afternoon/evening was…",
  "A kindness I received (or offered) was…",
  "My sleep influenced my pain by…",
  "One movement or stretch that felt okay was…",
  "A helpful position/posture I found was…",
  "I noticed my thoughts saying… and I gently replied…",
  "When I stepped outside (or looked out a window), I felt…",
  "A fear I can acknowledge without fixing today is…",
  "Something I can ask for help with is…",
  "One part of my routine I want to soften is…",
  "A food or drink that felt supportive was…",
  "The most challenging moment today was… and I got through it by…",
  "A reminder I want to leave for future-me on a hard day…",
  "If comfort were a place, it would look like…",
  "One value I still lived today (despite pain) was…",
  "What I said \"no\" to (or wish I had) was…",
  "My breath felt like… and changed to…",
  "Something I learned about my triggers (or relievers) is…",
  "I noticed judgment in my mind when… and I met it with…",
  "A micro-break that helped was…",
  "My pain made this task harder… and I adapted by…",
  "An expectation I can gently loosen is…",
  "I'm grateful my body allowed me to…",
  "A scent, tea, or temperature that soothed me was…",
  "An image or memory that brought ease was…",
  "One step I can take to pace tomorrow is…",
  "I practiced acceptance today when…",
  "I practiced advocacy (for myself) today by…",
  "A limit I respected was… and that felt…",
  "What compassion looks like for me tonight is…",
  "A worry I'll place on a mental shelf for now is…",
  "I noticed catastrophizing when… and reframed it to…",
  "My inner critic said… and my kinder voice said…",
  "One thing I can do 1% gentler is…",
  "A flare signal I noticed early was…",
  "Three words that describe my body right now are…",
  "I am proud that I… (even if small)",
  "I allowed myself to rest when…",
  "A tool from my 'comfort kit' I used (or want to try) is…",
  "I felt seen or understood when…",
  "I honored my pace today by…",
  "The most supportive time of day for me is… because…",
  "A belief about pain I'm revisiting is…",
  "I can bring curiosity to this sensation by asking…",
  "What would ease look like for the next 10 minutes?",
  "A gentle movement I might try tomorrow is…",
  "I forgave myself for…",
  "One expectation I'll carry lighter is…",
  "A small joy that coexisted with pain was…",
  "I'm noticing my breath in this way…",
  "My posture experiment today felt…",
  "I asked for (or will ask for) accommodations by…",
  "Something I want my future clinician to know is…",
  "I tracked a pattern between activity and pain: …",
  "I noticed numbness/tingling/pressure described as…",
  "I felt more/less sensitive to light/sound/temperature when…",
  "I practiced grounding by noticing 5-4-3-2-1…",
  "I gave myself permission to…",
  "When plans changed because of pain, I…",
  "I softened a should/must into could/might by…",
  "Sleep prep that may help tonight is…",
  "A gentle affirmation I'll keep nearby is…",
  "I balanced connection and solitude by…",
  "I tried (or will try) a pleasant activity: …",
  "I limited scrolling/news and noticed…",
  "I hydrated/fueled and my body responded by…",
  "I noticed kinks/tightness melt a bit when…",
  "An accessibility aid or tool that helped was…",
  "I created a kinder workstation/chair/bed setup by…",
  "I named this emotion and let it be: …",
  "If pain had weather today, it would be…",
  "I chose my battles by focusing on…",
  "I let someone support me by…",
  "I practiced saying \"that's enough for now\" when…",
  "A hopeful thread I can follow is…",
  "I reframed all-or-nothing thinking to…",
  "My body surprised me today when…",
  "I reminded myself: pain is real, and so is…",
  "I noticed a 1% improvement in…",
  "I gently planned a flare contingency: …",
  "I felt grounded when my senses noticed…",
  "The next right tiny step is…",
  "I will end today with one kind thought for my body: …"
];

interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function JournalDialog({ open, onOpenChange }: JournalDialogProps) {
  const [view, setView] = useState<'compose' | 'history'>('compose');
  const [journalText, setJournalText] = useState<string>("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const savedEntries = localStorage.getItem('journalEntries');
    if (savedEntries) {
      const parsed = JSON.parse(savedEntries);
      setEntries(parsed.map((entry: any) => ({
        ...entry,
        timestamp: new Date(entry.timestamp)
      })));
    }
  }, []);

  const saveEntry = () => {
    if (!journalText.trim()) return;

    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      prompt_text: "", // No longer tracking specific prompts since they're inline
      body: journalText,
      emoji: CALMING_EMOJIS[entries.length % CALMING_EMOJIS.length]
    };

    const updatedEntries = [newEntry, ...entries];
    setEntries(updatedEntries);
    localStorage.setItem('journalEntries', JSON.stringify(updatedEntries));

    toast({
      title: "Entry saved",
      description: "Your journal entry has been saved safely.",
    });

    setJournalText("");
    setView('history');
  };

  const addPromptToText = (prompt: string) => {
    if (journalText.trim()) {
      setJournalText(prompt + "\n\n" + journalText);
    } else {
      setJournalText(prompt + "\n\n");
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] font-tech bg-black/90 border-2 border-primary/30 text-white">
        <DialogHeader>
          <DialogTitle className="font-tech text-2xl text-center text-primary">
            {view === 'compose' && "Your Micro-Journal"}
            {view === 'history' && "Your Small Notes of Care"}
          </DialogTitle>
        </DialogHeader>

        {view === 'compose' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-center mb-6">
              <Button 
                variant="outline" 
                onClick={() => setView('history')}
                className="font-tech"
              >
                View Journal
              </Button>
            </div>

            <div className="mb-6 text-center">
              <p className="font-tech text-sm text-muted-foreground leading-relaxed">
                This is your journaling space — a gentle place to reflect on your body, your pain, and the small moments of ease. Choose a prompt below, or just start writing what's on your mind.
              </p>
            </div>

            <div className="mb-4">
              <Select onValueChange={addPromptToText}>
                <SelectTrigger className="w-full font-tech bg-background/50 border-border/50 text-white rounded-none">
                  <SelectValue placeholder="Inspiration to get you started..." />
                  <ChevronDown className="w-4 h-4" />
                </SelectTrigger>
                <SelectContent className="max-h-[300px] bg-background border-border/50 rounded-none z-50">
                  <div className="bg-background">
                    {MICRO_PROMPTS.map((prompt, index) => (
                      <SelectItem 
                        key={index} 
                        value={prompt}
                        className="font-tech text-sm py-3 px-4 hover:bg-card/70 focus:bg-card/70 text-white"
                      >
                        {prompt}
                      </SelectItem>
                    ))}
                  </div>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1 mb-4">
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write a few lines. Anything is welcome."
                className="h-full resize-none font-tech bg-background/50 border-border/50 text-white placeholder:text-muted-foreground"
              />
            </div>

            <div className="flex justify-between">
              <Button 
                variant="outline" 
                className="font-tech"
                onClick={() => {
                  // Voice-to-text placeholder
                  toast({
                    title: "Voice to text",
                    description: "Voice-to-text feature coming soon!",
                  });
                }}
              >
                <Mic className="w-4 h-4 mr-2" />
                Voice to Text
              </Button>
              <Button 
                variant="default" 
                onClick={saveEntry}
                disabled={!journalText.trim()}
                className="font-tech"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Entry
              </Button>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="flex flex-col h-full">
            <div className="flex justify-center mb-4">
              <Button 
                variant="default" 
                onClick={() => setView('compose')}
                className="font-tech"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Start Journaling
              </Button>
            </div>

            <ScrollArea className="flex-1">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p className="font-tech text-lg">First step counts. Pick a prompt to begin.</p>
                </div>
              ) : (
                <div className="space-y-4 p-4">
                  {entries.map((entry) => (
                    <div 
                      key={entry.id}
                      className="bg-card/50 border border-border/50 p-4 rounded-none"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <span className="text-xl">{entry.emoji}</span>
                          <span className="font-tech text-primary">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                      </div>
                      
                      {entry.prompt_text && (
                        <p className="font-tech text-sm text-muted-foreground mb-2">
                          {entry.prompt_text}
                        </p>
                      )}
                      
                      <div className="font-tech text-sm">
                        {expandedEntry === entry.id ? (
                          <div>
                            <p className="whitespace-pre-wrap">{entry.body}</p>
                            <button
                              onClick={() => setExpandedEntry(null)}
                              className="text-primary hover:underline mt-2"
                            >
                              Show less
                            </button>
                          </div>
                        ) : (
                          <div>
                            <p>{truncateText(entry.body)}</p>
                            {entry.body.length > 100 && (
                              <button
                                onClick={() => setExpandedEntry(entry.id)}
                                className="text-primary hover:underline mt-2"
                              >
                                Read more
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}