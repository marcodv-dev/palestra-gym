# Deploy Gratuito (Vercel + Render)

## Panoramica
- **Frontend**: Vercel (gratis per sempre)
- **Backend + MySQL**: Render (1GB MySQL gratis)

## Passo 1: Deploy Backend su Render

1. Vai su [render.com](https://render.com) e registrati
2. Clicca **New + → Web Service**
3. Connetti la tua repo GitHub
4. Configurazione:
   - **Name**: `gym-backend`
   - **Environment**: `Node`
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && node server.js`
5. Clicca **Add Database → MySQL**
   - Scegli il piano **Free** (1GB)
   - Render imposta automaticamente `DATABASE_URL`
6. **Environment Variables** (aggiungi se non presenti):
   - `JWT_SECRET`: `una_stringa_casuale_lunga`
   - `NODE_ENV`: `production`
7. Clicca **Create Web Service**
8. **Ottieni l'URL**: `https://gym-backend.onrender.com`

## Passo 2: Importa il database su Render

Dopo il deploy, vai su Render → Database → "Connect" → ottieni credenziali
Poi da terminale:
```bash
mysql -h <host> -u <user> -p <database> < database/schema.sql
```

## Passo 3: Deploy Frontend su Vercel

1. Vai su [vercel.com](https://vercel.com) e registrati
2. **New Project → Import GitHub repo**
3. Configurazione:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL`: `https://gym-backend.onrender.com`
5. Clicca **Deploy**
6. **Ottieni l'URL**: `https://gym.vercel.app`

## Note importanti

- **Render Free Tier**: il backend si "addormenta" dopo 15 min di inattività.
  Al primo accesso impiegherà ~30s per "svegliarsi"
- **Vercel**: sempre gratis, CDN globale
- **Database**: 1GB su Render sono sufficienti per migliaia di esercizi/utenti

## Costo
**€0/mese** ✅
