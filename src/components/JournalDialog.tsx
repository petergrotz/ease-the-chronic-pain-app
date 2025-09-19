import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, BookOpen, Sparkles, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface JournalEntry {
  id: string;
  timestamp: Date;
  prompt_text: string;
  body: string;
  emoji: string;
}

const CALMING_EMOJIS = ["✨", "🌸", "🍃", "🌊", "☁️", "🌙", "🦋", "🌺", "💙", "🕊️"];

const MICRO_PROMPTS = [
  "Right now, my body feels...",
  "The part of me that needs attention today is...",
  "I'm holding tension in my...",
  "When I breathe deeply, I notice...",
  "My body is asking for...",
  "The sensation I'm most aware of is...",
  "If my body could speak, it would say...",
  "Today I want to honor my body by...",
  "The kindest thing I can do for myself right now is...",
  "I'm grateful my body can...",
  "When I think of healing, I feel...",
  "My body feels safe when...",
  "The part of me that feels strongest today is...",
  "I'm learning to listen to...",
  "My breath feels...",
  "The sensation of relaxation feels like...",
  "When pain visits, I want to remember...",
  "My body and I are...",
  "Something beautiful I noticed in my body today...",
  "I'm sending love to...",
  "The way I want to care for myself is...",
  "When I'm gentle with myself, I feel...",
  "My body's wisdom tells me...",
  "Today I choose to release...",
  "I feel most at peace when my body...",
  "The healing happening in me feels like...",
  "I want to thank my body for...",
  "My experience of comfort is...",
  "When I imagine ease, I see...",
  "The part of my healing journey I'm proud of is...",
  "My body feels supported when...",
  "I'm curious about how my body...",
  "The gentlest sensation I can offer myself right now is...",
  "When I connect with my breath, I discover...",
  "My body's rhythm today feels...",
  "I feel present in my body when...",
  "The kind of movement my body craves is...",
  "What feels nourishing to me right now is...",
  "My body deserves...",
  "When I listen closely, my body whispers...",
  "The quality of attention I want to give myself is...",
  "I feel embodied when...",
  "Today, my relationship with discomfort is...",
  "The word that best describes how I want to feel is...",
  "My body's intelligence shows up as...",
  "I honor my healing by...",
  "The sensation I want to cultivate more of is...",
  "My body feels held when...",
  "I want to remind myself that...",
  "The gentlest truth about my experience today is...",
];

interface JournalDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const JournalDialog = ({ open, onOpenChange }: JournalDialogProps) => {
  const [view, setView] = useState<'compose' | 'history'>('compose');
  const [journalText, setJournalText] = useState("");
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [expandedEntry, setExpandedEntry] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
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
        .from('journal_entries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedEntries = data.map(entry => ({
        id: entry.id,
        timestamp: new Date(entry.created_at),
        prompt_text: entry.prompt_text || "",
        body: entry.body,
        emoji: entry.emoji || "✨"
      }));

      setEntries(formattedEntries);
    } catch (error) {
      console.error('Error loading journal entries:', error);
      toast({
        title: "Error loading entries",
        description: "Could not load your journal entries. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveEntry = async () => {
    if (!journalText.trim() || !user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('journal_entries')
        .insert({
          user_id: user.id,
          body: journalText,
          prompt_text: "",
          emoji: CALMING_EMOJIS[entries.length % CALMING_EMOJIS.length]
        });

      if (error) throw error;

      toast({
        title: "Entry saved",
        description: "Your journal entry has been saved safely.",
      });

      setJournalText("");
      setView('history');
      await loadEntries(); // Refresh the entries
    } catch (error) {
      console.error('Error saving journal entry:', error);
      toast({
        title: "Error saving entry",
        description: "Could not save your journal entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
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

  const truncateToLines = (text: string, maxLines: number = 3) => {
    const lines = text.split('\n');
    if (lines.length <= maxLines) return text;
    return lines.slice(0, maxLines).join('\n') + "...";
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            {view === 'history' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setView('compose')}
                className="h-8 w-8"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
            )}
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <DialogTitle>
                {view === 'compose' ? 'Personal Journal' : 'Journal History'}
              </DialogTitle>
            </div>
          </div>
          <DialogDescription>
            {view === 'compose' 
              ? 'A safe space for your thoughts, feelings, and reflections on your healing journey.'
              : 'Your collection of journal entries and personal reflections.'
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {view === 'compose' ? (
            <div className="space-y-4">
              <div className="space-y-3">
                <label className="text-sm font-medium">Your thoughts and reflections</label>
                <Textarea
                  value={journalText}
                  onChange={(e) => setJournalText(e.target.value)}
                  placeholder="What's on your mind today? How is your body feeling? What do you need right now?"
                  className="min-h-[200px] resize-none"
                  rows={8}
                />
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" />
                  <label className="text-sm font-medium">Gentle Prompts</label>
                </div>
                <p className="text-xs text-muted-foreground">
                  These body-aware prompts can help guide your reflection
                </p>
                <div className="grid grid-cols-1 gap-2 max-h-32 overflow-y-auto">
                  {MICRO_PROMPTS.slice(0, 6).map((prompt, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      onClick={() => addPromptToText(prompt)}
                      className="justify-start text-left h-auto py-2 px-3 whitespace-normal"
                    >
                      {prompt}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  onClick={() => setView('history')}
                  className="flex-1"
                >
                  View History
                </Button>
                <Button 
                  variant="default" 
                  size="lg"
                  onClick={saveEntry}
                  disabled={loading || !journalText.trim()}
                  className="flex-1"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  {loading ? "Saving..." : "Save Entry"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-semibold mb-2">Your Journal History</h3>
                <p className="text-muted-foreground text-sm">
                  A record of your healing journey and reflections
                </p>
              </div>
              
              {loading ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Loading your entries...</p>
                </div>
              ) : entries.length === 0 ? (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No entries yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Start journaling to see your entries here
                  </p>
                  <Button onClick={() => setView('compose')}>
                    Write Your First Entry
                  </Button>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {entries.map((entry) => (
                    <Card key={entry.id} className="transition-all duration-200 hover:shadow-md">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-lg">{entry.emoji}</span>
                            <div>
                              <CardTitle className="text-sm font-medium">
                                {formatDate(entry.timestamp)}
                              </CardTitle>
                              <p className="text-xs text-muted-foreground">
                                {formatTime(entry.timestamp)}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setExpandedEntry(
                              expandedEntry === entry.id ? null : entry.id
                            )}
                            className="h-8 w-8"
                          >
                            {expandedEntry === entry.id ? (
                              <ChevronUp className="h-4 w-4" />
                            ) : (
                              <ChevronDown className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm whitespace-pre-wrap">
                          {expandedEntry === entry.id 
                            ? entry.body 
                            : truncateToLines(entry.body, 3)
                          }
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
              
              <Button 
                variant="outline" 
                onClick={() => setView('compose')}
                className="w-full mt-4"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                Write New Entry
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JournalDialog;