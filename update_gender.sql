-- Add gender column if it doesn't exist
ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT 'Male';
-- Update existing users to 'Male' as requested
UPDATE public.profiles
SET gender = 'Male'
WHERE gender IS NULL
    OR gender = '';
-- Update the handle_new_user function to include gender default
CREATE OR REPLACE FUNCTION public.handle_new_user() RETURNS TRIGGER AS $$ BEGIN
INSERT INTO public.profiles (id, full_name, email, gender)
VALUES (
        new.id,
        new.raw_user_meta_data->>'full_name',
        new.email,
        COALESCE(new.raw_user_meta_data->>'gender', 'Male')
    );
RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;