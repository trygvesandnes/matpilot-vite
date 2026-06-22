# Sette opp Supabase for Matpilot

## Hva er gjort i koden
- Erstattet det lokale, usikre "passord lagret i appen"-systemet med ekte
  Supabase-autentisering (sikker passord-hashing, ekte e-post for
  tilbakestilling av passord, sesjoner som fungerer på flere enheter).
- Ny fil: `src/lib/supabaseAuth.js` – alle auth-funksjoner.
- `KontoSide` i `App.jsx` bruker nå disse async-funksjonene.

## Steg 1 – Opprett Supabase-prosjekt
1. Gå til supabase.com og logg inn (kan bruke GitHub)
2. "New project" → velg organisasjon → gi prosjektet et navn, f.eks. "matpilot"
3. Velg et databasepassord (lagre dette et trygt sted, men du trenger det sjelden)
4. Velg region nærmest Norge (f.eks. Frankfurt/eu-central)
5. Vent ca. 2 minutter til prosjektet er klart

## Steg 2 – Hent API-nøklene
1. I Supabase-dashbordet: Settings → API
2. Kopier "Project URL"
3. Kopier "anon public" key (IKKE service_role-nøkkelen – den er hemmelig)

## Steg 3 – Legg til nøklene i Vercel
1. Gå til vercel.com → ditt matpilot-vite-prosjekt → Settings → Environment Variables
2. Legg til:
   - `VITE_SUPABASE_URL` = (URL-en du kopierte)
   - `VITE_SUPABASE_ANON_KEY` = (anon-nøkkelen du kopierte)
3. Redeploy prosjektet for at variablene skal tas i bruk

## Steg 4 – For lokal/Codemagic-bygging
Legg samme variabler til i Codemagic under Environment Variables i workflow-innstillingene,
eller opprett en `.env.local`-fil basert på `.env.example` (denne filen skal ALDRI committes til Git).

## Steg 5 – Konfigurer e-post for tilbakestilling av passord
1. I Supabase: Authentication → Email Templates
2. Som standard fungerer dette automatisk med Supabase sin egen e-postserver (begrenset antall e-poster/dag på gratisplanen)
3. For produksjon: under Authentication → Settings, kan du sette opp egen SMTP (f.eks. via Gmail eller SendGrid) for å sende flere e-poster

## Steg 6 – Viktig: Hold prosjektet aktivt
Gratis Supabase-prosjekter settes på pause etter 7 dager uten aktivitet.
Når appen er lansert med ekte brukere er dette ikke et problem (innlogginger holder den aktiv).
Men i test-fasen: logg inn i appen minst én gang i uken, eller sett opp en enkel
"ping" via en gratis cron-tjeneste (f.eks. cron-job.org) som kaller et enkelt
Supabase-endepunkt hver dag.

## Testing
Etter oppsett: prøv å registrere en ny konto i appen, logg ut, logg inn igjen.
Prøv "Glemt passordet" – du skal få en ekte e-post med en lenke.
