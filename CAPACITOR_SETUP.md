# Matpilot – iOS-app via Capacitor + Codemagic

## Hva er gjort
Prosjektet er nå konfigurert med Capacitor, som pakker web-appen inn i en ekte iOS-app.

## Filer lagt til
- `capacitor.config.ts` – appens iOS-konfigurasjon (navn, app-ID)
- `package.json` – oppdatert med Capacitor-avhengigheter

## Neste steg (gjøres på Codemagic.io, ingen Mac nødvendig)

### 1. Opprett Codemagic-konto
Gå til codemagic.io → Sign up → koble til GitHub-kontoen din

### 2. Legg til prosjektet
- Velg `matpilot-vite`-repoet ditt
- Velg "Capacitor" som prosjekttype når du blir spurt

### 3. Koble Apple Developer-konto
- Når du har Apple Developer-kontoen klar, last opp signeringssertifikatet i Codemagic
- Codemagic har en guide for dette under "iOS code signing"

### 4. Konfigurer bygg
Codemagic oppdager automatisk Capacitor-prosjekter. Standard workflow:
1. `npm install`
2. `npm run build` (Vite bygger web-appen)
3. `npx cap sync ios` (Capacitor kopierer inn i iOS-prosjektet)
4. Xcode bygger og signerer appen
5. Last opp til App Store Connect (TestFlight eller direkte til review)

### 5. App-ikon og splash screen
Disse må legges til i `ios/App/App/Assets.xcassets/` etter første `cap sync`.
Bruk `@capacitor/assets`-pakken for automatisk generering fra ett ikon.

## App-ID
Appen er konfigurert med ID `no.matpilot.app` – dette må matche Bundle ID i Apple Developer-kontoen.

## Når Apple Developer-konto er klar
1. Opprett App ID i Apple Developer-portalen som matcher `no.matpilot.app`
2. Opprett en ny app i App Store Connect med samme Bundle ID
3. Koble dette til Codemagic-bygget
