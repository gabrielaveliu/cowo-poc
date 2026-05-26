# Coworking Meeting POC

POC per la gestione di prenotazioni sale meeting in un coworking. L'applicazione supporta due ruoli:

- **Utente** — visualizza le proprie prenotazioni, prenota una sala e consulta i prezzi
- **Admin** — panoramica di tutte le prenotazioni, gestione prezzi e report di fatturazione

Il progetto è diviso in un frontend **Next.js** (porta 3000) e un backend **Express + SQLite** (porta 3001).

## Usage

### Requisiti

- Node.js 18+
- npm

### Installazione

```bash
# Frontend
npm install

# Backend
cd backend && npm install
```

### Avvio

Aprire due terminali distinti:

```bash
# Terminale 1 — backend
cd backend
npm run dev
```

```bash
# Terminale 2 — frontend
npm run dev
```

L'app è disponibile su [http://localhost:3000](http://localhost:3000).
