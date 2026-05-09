/**
 * OLÉ DIFERENTE - Configuración de Supabase
 * Conexión con la base de datos y autenticación.
 */

const SUPABASE_URL = 'https://bhrxmevodepoxkdesqvq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJocnhtZXZvZGVwb3hrZGVzcXZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgzMzg0ODgsImV4cCI6MjA5MzkxNDQ4OH0.A-mYCWnT0O-QXVj31WK8J6JrD2Z1fMpt7dgGkiCmTZM';

const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Exportar para usar en otros archivos
window.supabase = supabaseClient;
