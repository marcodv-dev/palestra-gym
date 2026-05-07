import { createContext, useContext, useState, useEffect } from 'react';

const translations = {
  it: {
    tipo: 'Tipo',
    esercizio: 'Esercizio',
    serie: 'Serie',
    ripetizioni: 'Ripetizioni',
    peso: 'Peso',
    pesoLabel: 'Peso:',
    kg: 'kg',
    aggiungiEsercizio: 'Aggiungi esercizio',
    esercizioAggiunto: 'Esercizio aggiunto',
    pesoLabel2: 'Peso:',
    kg2: 'kg',
    cercaEsercizio: 'Cerca esercizio...',
    ordineAggiornato: 'Ordine aggiornato',
    seiSicuroEliminare: 'Sei sicuro di voler eliminare?',
    allenamentoEliminato: 'Allenamento eliminato',
    train: 'Train',
    reps: 'Reps:',
    sets: 'Sets:',
    esercizioAggiornato: 'Esercizio aggiornato',
    seiSicuroEliminareEsercizio: 'Sei sicuro di voler eliminare questo esercizio?',
    esercizioEliminato: 'Esercizio eliminato',
    caricamento: 'Caricamento...',
    confermaModifica: 'Conferma modifica',
    stats: 'stats',
    schedeCorrenti: 'Schede correnti',
    allenamentiTotali: 'Allenamenti totali',
    eserciziTotali: 'Esercizi totali',
    mediaAllenamentiMese: 'Media allenamenti/mese',
    datiMensili: 'Dati mensili',
    files: 'files',
    questoCancellera: 'Questo cancellerà TUTTI i dati attuali. Continuare?',
    schedaImportata: 'Scheda importata con successo',
    erroreImport: 'Errore nell\'import: ',
    visualizzaScheda: 'Visualizza scheda corrente',
    esportaScheda: 'Esporta scheda corrente',
    importaNuovaScheda: 'Importa nuova scheda',
    lingua: 'Lingua',
    login: 'Accedi',
    register: 'Registrati',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    loading: 'Caricamento...',
    noAccount: "Non hai un account?",
    hasAccount: "Hai già un account?",
    appTitle: 'Gym',
    logout: 'Esci'
  },
  en: {
    tipo: 'Type',
    esercizio: 'Exercise',
    serie: 'Sets',
    ripetizioni: 'Repetitions',
    peso: 'Weight',
    pesoLabel: 'Weight:',
    kg: 'kg',
    aggiungiEsercizio: 'Add exercise',
    esercizioAggiunto: 'Exercise added',
    pesoLabel2: 'Weight:',
    kg2: 'kg',
    cercaEsercizio: 'Search exercise...',
    ordineAggiornato: 'Order updated',
    seiSicuroEliminare: 'Are you sure you want to delete?',
    allenamentoEliminato: 'Workout deleted',
    train: 'Train',
    reps: 'Reps:',
    sets: 'Sets:',
    esercizioAggiornato: 'Exercise updated',
    seiSicuroEliminareEsercizio: 'Are you sure you want to delete this exercise?',
    esercizioEliminato: 'Exercise deleted',
    caricamento: 'Loading...',
    confermaModifica: 'Confirm changes',
    stats: 'stats',
    schedeCorrenti: 'Current programs',
    allenamentiTotali: 'Total workouts',
    eserciziTotali: 'Total exercises',
    mediaAllenamentiMese: 'Average workouts/month',
    datiMensili: 'Monthly data',
    files: 'files',
    questoCancellera: 'This will delete ALL current data. Continue?',
    schedaImportata: 'Sheet imported successfully',
    erroreImport: 'Import error: ',
    visualizzaScheda: 'View current sheet',
    esportaScheda: 'Export current sheet',
    importaNuovaScheda: 'Import new sheet',
    lingua: 'Language',
    login: 'Login',
    register: 'Register',
    email: 'Email',
    password: 'Password',
    username: 'Username',
    loading: 'Loading...',
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    appTitle: 'Gym',
    logout: 'Logout'
  }
};

const getBrowserLang = () => {
  const lang = navigator.language.split('-')[0];
  return lang === 'it' ? 'it' : 'en';
};

const getStoredLang = () => {
  return localStorage.getItem('palestra-lang');
};

export const setLang = (lang) => {
  localStorage.setItem('palestra-lang', lang);
};

const LangContext = createContext();

export const LangProvider = ({ children }) => {
  const [lang, setLangState] = useState(() => {
    return getStoredLang() || getBrowserLang();
  });

  useEffect(() => {
    localStorage.setItem('palestra-lang', lang);
  }, [lang]);

  const t = (key) => {
    return translations[lang][key] || key;
  };

  return (
    <LangContext.Provider value={{ lang, setLang: setLangState, t }}>
      {children}
    </LangContext.Provider>
  );
};

export const useLang = () => useContext(LangContext);
