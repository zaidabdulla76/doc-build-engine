-- Create stakeholders table for managing vendor contacts and personas
CREATE TABLE public.stakeholders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  department TEXT,
  persona_type TEXT,
  influence_level TEXT CHECK (influence_level IN ('high', 'medium', 'low')),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stakeholders ENABLE ROW LEVEL SECURITY;

-- Create policies for stakeholders
CREATE POLICY "Users can view their own stakeholders" 
ON public.stakeholders 
FOR SELECT 
USING (user_id = auth.uid());

CREATE POLICY "Users can create their own stakeholders" 
ON public.stakeholders 
FOR INSERT 
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own stakeholders" 
ON public.stakeholders 
FOR UPDATE 
USING (user_id = auth.uid());

CREATE POLICY "Users can delete their own stakeholders" 
ON public.stakeholders 
FOR DELETE 
USING (user_id = auth.uid());

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stakeholders_updated_at
BEFORE UPDATE ON public.stakeholders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();