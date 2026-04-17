import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.bpsccosmos.app",
  appName: "BPSC Cosmos",
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
