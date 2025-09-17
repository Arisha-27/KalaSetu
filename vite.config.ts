import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
<<<<<<< HEAD
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
=======
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
>>>>>>> 93ec03dfc2a662c75957e56607bc43c05e1ce8f7
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
<<<<<<< HEAD
=======











>>>>>>> 93ec03dfc2a662c75957e56607bc43c05e1ce8f7
