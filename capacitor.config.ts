import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "app.vercel.bpsc365.capacitor",
  appName: "BPSC 365",
  webDir: "dist-capacitor",
  server: {
    url: "https://bpsc365.vercel.app",
    cleartext: false,
    androidScheme: "https",
  },
  android: {
    allowMixedContent: false,
  },
};

export default config;
