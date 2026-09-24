// Modalità demo locale: la piattaforma funziona senza backend.
// Per attivare login, database e storage privato sostituisci i valori
// seguendo config.example.js e README.md.
window.DRONEPAD_CONFIG = {
  supabase: {
    enabled: false,
    url: '',
    anonKey: '',
    requireAuth: true,
    storageBucket: 'dronepad-documents'
  }
};
