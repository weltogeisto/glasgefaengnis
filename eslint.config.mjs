// eslint-config-next 16 liefert bereits Flat Config. Der FlatCompat-Umweg aus
// älteren Vorlagen kippt hier mit „Converting circular structure to JSON".
import coreWebVitals from "eslint-config-next/core-web-vitals";
import typescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: [".next/**", "node_modules/**", ".artifacts/**", "next-env.d.ts"] },
  ...coreWebVitals,
  ...typescript,
];

export default eslintConfig;
