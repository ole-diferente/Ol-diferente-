CREATE TABLE IF NOT EXISTS public.inventory (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

INSERT INTO public.inventory (name, stock) VALUES 
('Lattafa Asad', 1),
('Lattafa His Confession', 0),
('Armaf Club de Nuit', 1),
('Afnan 9 PM', 1),
('VS Aqua Kiss', 1),
('VS Bare Vanilla', 1),
('VS Coconut Passion', 1),
('VS Pure Seduction', 1),
('VS Rush', 1),
('Dark Door Sport', 1),
('Afnan Turathi Blue', 1),
('Maison Alhambra Salvo Elixir', 1),
('Lattafa Qaed Al Fursan', 1),
('Lattafa Bade''e Al Oud For Glory', 1),
('Lattafa Pride Shaheen Gold', 1),
('Lattafa Khamrah Dukhan', 1),
('Armaf Club De Nuit Woman', 1),
('Lattafa Eclaire', 1),
('Maison Alhambra Sceptre Malachite', 1),
('Armaf Odyssey Homme Black', 0),
('Lattafa Bade''e Al Oud Honor & Glory', 1),
('Rasasi Hawas for Him', 1),
('Lattafa Atlas', 1),
('Lattafa Pride Vintage Radio', 1),
('Armaf Uniq Oud Forever', 1),
('Fragrance World Liquid Brun', 1),
('Afnan 9 PM Elixir', 1),
('Lattafa Asad Bourbon', 1),
('Lattafa Bade''e Al Oud Sublime', 1),
('Lattafa Hayaati Gold Elixir', 1),
('Lattafa Mayar Cherry', 1),
('Armaf Odyssey Aqua', 1),
('Armaf Odyssey Homme White Edition', -1),
('Lattafa The Kingdom', 1),
('Emper Stallion 53', 1),
('Lattafa Hayaati Al Maleky', 1),
('Lattafa Her Confession', 1),
('Lattafa Bade''e Al Oud Noble Blush', 1),
('Philos Pura', 1),
('Haya Pink', 1),
('Opulent Musk', 1)
ON CONFLICT (name) DO UPDATE SET stock = EXCLUDED.stock;

ALTER TABLE public.inventory ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Enable read access for all users" ON public.inventory
    FOR SELECT
    TO public
    USING (true);

-- Policy to allow updates from admin/authenticated users
CREATE POLICY "Enable update for all users" ON public.inventory
    FOR UPDATE
    TO public
    USING (true)
    WITH CHECK (true);
