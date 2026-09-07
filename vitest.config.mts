import { defineConfig } from "vitest/config";

// Unit-Tests decken die reine Domänenlogik in lib/ ab — keine DB, kein Netz, kein DOM.
// Genau wie im Fellowship OS: was geprüft werden soll, muss eine reine Funktion sein.
export default defineConfig({
  test: {
    environment: "node",
    include: ["lib/**/*.test.ts"],
  },
});
