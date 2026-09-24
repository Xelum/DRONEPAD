// Copia questo file in config.js e compila i valori di Supabase.
// NON usare mai la SERVICE_ROLE_KEY nel browser.
window.DRONEPAD_CONFIG = {
  supabase: {
    enabled: true,
    url: 'https://YOUR_PROJECT.supabase.co',
    anonKey: 'YOUR_SUPABASE_ANON_KEY',
    requireAuth: true,
    storageBucket: 'dronepad-documents'
  }
};
