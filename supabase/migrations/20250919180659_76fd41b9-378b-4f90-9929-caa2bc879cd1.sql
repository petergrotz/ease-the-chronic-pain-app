-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL,
  prompt_text TEXT,
  emoji TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create pain_entries table
CREATE TABLE public.pain_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  intensity INTEGER NOT NULL,
  location TEXT[] NOT NULL DEFAULT '{}',
  quality TEXT[] NOT NULL DEFAULT '{}',
  impact_activity INTEGER DEFAULT 0,
  impact_mood INTEGER DEFAULT 0,
  impact_sleep INTEGER DEFAULT 0,
  impact_concentration INTEGER DEFAULT 0,
  context TEXT[] NOT NULL DEFAULT '{}',
  notes TEXT,
  helped TEXT[] DEFAULT '{}',
  helped_effectiveness JSONB DEFAULT '{}',
  sleep_hours INTEGER,
  sleep_quality TEXT,
  daytime_rest BOOLEAN DEFAULT false,
  stress INTEGER,
  mood_state TEXT,
  social_connection TEXT,
  flare_up BOOLEAN DEFAULT false,
  flare_duration TEXT,
  pain_spikes TEXT,
  fatigue INTEGER,
  brain_fog INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on both tables
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pain_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries" 
ON public.journal_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own journal entries" 
ON public.journal_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
ON public.journal_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
ON public.journal_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for pain_entries
CREATE POLICY "Users can view their own pain entries" 
ON public.pain_entries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own pain entries" 
ON public.pain_entries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own pain entries" 
ON public.pain_entries 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own pain entries" 
ON public.pain_entries 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_pain_entries_updated_at
BEFORE UPDATE ON public.pain_entries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX idx_journal_entries_created_at ON public.journal_entries(created_at DESC);
CREATE INDEX idx_pain_entries_user_id ON public.pain_entries(user_id);
CREATE INDEX idx_pain_entries_created_at ON public.pain_entries(created_at DESC);