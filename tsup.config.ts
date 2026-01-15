import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/server.ts"],
  format: ["esm"], // 👈 MUITO IMPORTANTE
  target: "node22",
  outDir: "dist",
  splitting: false,
  sourcemap: true,
  clean: true,
});
