# Coworking Meeting POC - Backend

Backend API per il progetto Coworking Meeting Room Management POC.

## Installazione

```bash
npm install
```

## Sviluppo

Per avviare il server in modalità sviluppo con auto-reload:

```bash
npm run dev
```

Il server sarà disponibile su `http://localhost:3001`

## Build

Per compilare il progetto TypeScript:

```bash
npm run build
```

## Produzione

Per avviare il server compilato:

```bash
npm start
```

## Endpoints

### Bookings

- `GET /api/bookings` - Ottiene tutte le prenotazioni (o le prenotazioni di un utente se specificato `?userId=...`)
- `POST /api/bookings` - Crea una nuova prenotazione
- `DELETE /api/bookings/:id` - Elimina una prenotazione

### Pricing

- `GET /api/pricing` - Ottiene i prezzi (tutti o per un mese specifico con `?month=YYYY-MM`)
- `POST /api/pricing` - Aggiorna i prezzi per un mese

### Billing

- `GET /api/billing?month=YYYY-MM` - Genera un rapporto di fatturazione per un mese

### Users

- `GET /api/users` - Ottiene tutti gli utenti
- `GET /api/users/:id` - Ottiene un utente specifico

### Health Check

- `GET /health` - Controlla lo stato del server
- `GET /` - Ottiene informazioni sul server

## Configurazione

Copia `.env.example` in `.env` e personalizza i parametri:

```bash
cp .env.example .env
```

## Struttura del Progetto

```
backend/
├── src/
│   ├── routes/
│   │   ├── bookings.ts
│   │   ├── bookings/
│   │   │   └── [id].ts
│   │   ├── pricing.ts
│   │   ├── billing.ts
│   │   └── users.ts
│   ├── lib/
│   │   ├── api.ts
│   │   ├── mockData.ts
│   │   └── utils.ts
│   ├── types/
│   │   └── index.ts
│   └── server.ts
├── package.json
├── tsconfig.json
├── .env.example
├── .gitignore
└── README.md
```

## Dipendenze

- **express** - Framework web
- **cors** - Middleware per CORS
- **typescript** - Linguaggio tipizzato
- **ts-node** - Esecuzione diretta di TypeScript
- **@types/express** - Tipi TypeScript per Express
- **@types/node** - Tipi TypeScript per Node.js

## Note

Questo è un POC (Proof of Concept) con dati mock in memoria. In produzione, integrare con un database reale.
