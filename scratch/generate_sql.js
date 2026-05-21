const fs = require('fs');
const html = fs.readFileSync('tienda.html', 'utf8');

const regex = /data-name="([^"]+)"/g;
let match;
const products = new Set();
while ((match = regex.exec(html)) !== null) {
    products.add(match[1]);
}

let sql = `CREATE TABLE IF NOT EXISTS public.inventory (
    id SERIAL PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    stock INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);\n\n`;

sql += `INSERT INTO public.inventory (name, stock) VALUES \n`;
const values = [];
for (const p of products) {
    // If name contains 'His Confession' or 'Odyssey Homme Black' set stock to 0, otherwise 1.
    const stock = (p.includes('Confession') || p.includes('Odyssey Homme Black')) ? 0 : 1;
    values.push(`('${p.replace(/'/g, "''")}', ${stock})`);
}
sql += values.join(',\n') + `\nON CONFLICT (name) DO UPDATE SET stock = EXCLUDED.stock;\n`;

// Enable RLS and create a policy for public read access
sql += `
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
`;

fs.writeFileSync('scratch/setup_inventory.sql', sql);
console.log('SQL script generated.');
