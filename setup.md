
---

## 1. Installer toutes les dépendances

```bash
# State management
npm install zustand

# Visualisation de graphes
npm install reactflow

# Icônes
npm install lucide-react

# Composants UI (shadcn — à initialiser séparément, voir étape 3)
npm install class-variance-authority clsx tailwind-merge

# Gestion des formulaires et validation
npm install react-hook-form zod @hookform/resolvers

# Import / Export CSV
npm install papaparse
npm install --save-dev @types/papaparse

# Notifications / toasts
npm install sonner

# Animations
npm install framer-motion

# Utilitaires
npm install lodash
npm install --save-dev @types/lodash
```

## 2.Ito raha hi-clone le projet

```bash
git clone https://github.com/<user>/affectation-min-max.git
cd affectation-min-max
npm install        # installe tout via package.json
npx shadcn@latest init    # si les composants shadcn ne sont pas versionnés
npm run dev
```
