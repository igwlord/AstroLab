-- Create user_reflections table
CREATE TABLE IF NOT EXISTS public.user_reflections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chart_id TEXT, -- Nullable: puede estar vinculada a una carta natal específica o no
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    tags TEXT[] DEFAULT '{}', -- Array de tags para categorizar reflexiones
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_user_reflections_user_id ON public.user_reflections(user_id);
CREATE INDEX idx_user_reflections_created_at ON public.user_reflections(created_at DESC);
CREATE INDEX idx_user_reflections_chart_id ON public.user_reflections(chart_id) WHERE chart_id IS NOT NULL;

-- Enable Row Level Security
ALTER TABLE public.user_reflections ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Users can only access their own reflections
CREATE POLICY "Users can view their own reflections"
    ON public.user_reflections
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own reflections"
    ON public.user_reflections
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reflections"
    ON public.user_reflections
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reflections"
    ON public.user_reflections
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on row update
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.user_reflections
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant permissions
GRANT ALL ON public.user_reflections TO authenticated;
GRANT ALL ON public.user_reflections TO service_role;
