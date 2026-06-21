import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'no.matpilot.app',
  appName: 'Matpilot',
  webDir: 'dist',
  ios: {
    contentInset: 'automatic',
  },
  server: {
    androidScheme: 'https',
  },
};

export default config;
