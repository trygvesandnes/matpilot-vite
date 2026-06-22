import { createClient } from '@supabase/supabase-js';

// Disse fylles inn av brukeren etter at Supabase-prosjektet er opprettet.
// Finnes i Supabase Dashboard → Settings → API
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://DITT-PROSJEKT.supabase.co";
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || "DIN-ANON-KEY-HER";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

/**
 * Registrer ny bruker med e-post og passord.
 * Supabase håndterer passord-hashing sikkert på serveren.
 */
export async function registrerBruker(navn, epost, passord) {
  const { data, error } = await supabase.auth.signUp({
    email: epost,
    password: passord,
    options: {
      data: { navn }, // lagres i user_metadata
    },
  });
  if (error) return { feil: oversettFeil(error.message) };
  return { bruker: data.user, session: data.session };
}

/**
 * Logg inn med e-post og passord.
 */
export async function loggInnBruker(epost, passord) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: epost,
    password: passord,
  });
  if (error) return { feil: oversettFeil(error.message) };
  return { bruker: data.user, session: data.session };
}

/**
 * Logg ut nåværende bruker.
 */
export async function loggUtBruker() {
  const { error } = await supabase.auth.signOut();
  if (error) return { feil: error.message };
  return { ok: true };
}

/**
 * Send e-post med lenke for å tilbakestille passord.
 * Supabase sender en ekte e-post med sikker lenke - ingen kode vises i appen.
 */
export async function sendTilbakestillEpost(epost) {
  const { error } = await supabase.auth.resetPasswordForEmail(epost, {
    redirectTo: window.location.origin + "/tilbakestill-passord",
  });
  if (error) return { feil: oversettFeil(error.message) };
  return { ok: true };
}

/**
 * Sett nytt passord (brukes etter at bruker har klikket lenken i e-posten,
 * eller når bruker er logget inn og vil bytte passord).
 */
export async function settNyttPassord(nyttPassord) {
  const { error } = await supabase.auth.updateUser({ password: nyttPassord });
  if (error) return { feil: oversettFeil(error.message) };
  return { ok: true };
}

/**
 * Oppdater profilinformasjon (navn, e-post).
 */
export async function oppdaterProfil(navn, epost) {
  const oppdateringer = { data: { navn } };
  if (epost) oppdateringer.email = epost;
  const { data, error } = await supabase.auth.updateUser(oppdateringer);
  if (error) return { feil: oversettFeil(error.message) };
  return { bruker: data.user };
}

/**
 * Hent nåværende innlogget bruker (eller null).
 */
export async function hentNaavaerendeBruker() {
  const { data, error } = await supabase.auth.getUser();
  if (error || !data?.user) return null;
  return data.user;
}

/**
 * Lytt på endringer i innloggingsstatus (login/logout/token-refresh).
 * Returnerer en unsubscribe-funksjon.
 */
export function lyttPaaAuthEndringer(callback) {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session?.user || null);
  });
  return () => data.subscription.unsubscribe();
}

/**
 * Oversetter Supabase sine engelske feilmeldinger til norsk,
 * matchende stilen i resten av appen.
 */
function oversettFeil(msg) {
  const m = msg.toLowerCase();
  if (m.includes("invalid login credentials")) return "Feil e-post eller passord. Prøv igjen, eller bruk «Glemt passordet?».";
  if (m.includes("user already registered") || m.includes("already been registered")) return "Det finnes allerede en konto med denne e-postadressen. Logg inn i stedet.";
  if (m.includes("password should be at least")) return "Passordet må ha minst 6 tegn.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "Skriv inn en gyldig e-postadresse.";
  if (m.includes("email not confirmed")) return "Du må bekrefte e-postadressen din først. Sjekk innboksen din.";
  if (m.includes("rate limit")) return "For mange forsøk. Vent litt og prøv igjen.";
  return "Noe gikk feil. Prøv igjen om litt.";
}
