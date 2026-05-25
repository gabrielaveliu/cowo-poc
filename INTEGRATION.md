# Integrazione Frontend-Backend

## 🚀 Setup Completo

Il progetto è stato diviso in **frontend** (Next.js) e **backend** (Express) per una migliore separazione delle responsabilità.

### 📁 Struttura Progetto

```
coworking-meeting-poc/
├── src/                    # Frontend Next.js
│   ├── app/               # Pages e layouts
│   ├── components/        # Componenti React
│   ├── lib/              # Utilities e API client
│   └── types/            # TypeScript types
├── backend/               # Backend Express
│   ├── src/
│   │   ├── server.ts      # Server principale
│   │   ├── lib/          # Logica API
│   │   ├── routes/       # Route handlers
│   │   └── types/        # TypeScript types
│   ├── dist/             # Output compilato
│   └── package.json
└── .env.local            # Config frontend
```

---

## 🛠️ Avvio Applicazione

### Terminale 1 - Backend (Express)

```bash
cd backend
npm run dev
```

Output atteso:
```
Server running on http://localhost:3001
```

### Terminale 2 - Frontend (Next.js)

```bash
npm run dev
```

Output atteso:
```
Local:        http://localhost:3000
```

---

## 🔌 Configurazione API

### Frontend

Il frontend comunica con il backend tramite `/src/lib/api.ts` usando la variabile di ambiente:

**`.env.local`** (già configurato)
```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### API Client Utility

Tutti i fetch calls passano tramite `apiClient`:

```typescript
// src/lib/api.ts
import { apiClient } from '@/lib/api';

// Booking
await apiClient.getAllBookings();
await apiClient.createBooking(bookingData);
await apiClient.deleteBooking(bookingId);

// Pricing
await apiClient.getPricing(month);
await apiClient.updatePricing(month, pricing);

// Billing
await apiClient.getBillingReport(month);
```

---

## 📡 Endpoint API Backend

### Bookings
- `GET /api/bookings` - Tutte le prenotazioni
- `GET /api/bookings?userId=USER_ID` - Prenotazioni utente
- `POST /api/bookings` - Crea prenotazione
- `DELETE /api/bookings/:id` - Cancella prenotazione

### Pricing
- `GET /api/pricing` - Tutti i prezzi
- `GET /api/pricing?month=YYYY-MM` - Prezzi mese
- `POST /api/pricing` - Aggiorna prezzi

### Billing
- `GET /api/billing?month=YYYY-MM` - Report fatturazione

### Users
- `GET /api/users` - Tutti gli utenti
- `GET /api/users/:id` - Utente specifico

### Health
- `GET /health` - Health check
- `GET /` - Info server

---

## 🔄 Flusso Dati

```
Browser (Next.js Frontend)
    ↓
Client Components (React)
    ↓
API Client Utility (src/lib/api.ts)
    ↓
HTTP Request (localhost:3001)
    ↓
Express Backend
    ├─ Route Handler (src/routes/)
    ├─ API Logic (src/lib/api.ts)
    └─ Mock Data (src/lib/mockData.ts)
    ↓
HTTP Response (JSON)
    ↓
Client Component Update
    ↓
Browser Re-render
```

---

## 🛠️ Sviluppo

### Aggiungere Nuova API

1. **Backend**: Aggiungi route in `backend/src/routes/`
2. **Frontend**: Aggiungi metodo in `src/lib/api.ts`
3. **Componenti**: Usa `apiClient` nei componenti

### Esempio: Aggiungere GET /api/reports

**Backend** (`backend/src/routes/reports.ts`):
```typescript
export async function GET(req) {
  const reports = reportsAPI.getAll();
  return Response.json(reports);
}
```

**Frontend** (`src/lib/api.ts`):
```typescript
getReports: () =>
  fetch(`${API_URL}/api/reports`).then((res) => res.json()),
```

**Componente**:
```typescript
const reports = await apiClient.getReports();
```

---

## 🔐 Sicurezza Note

- ✅ CORS configurato per accesso frontend
- ⚠️ Mock data - Sostituire con DB reale
- ⚠️ Aggiungere autenticazione
- ⚠️ Input validation su tutte le route

---

## 📦 Deployment

### Backend (Express)
```bash
npm run build
npm start
# o su Heroku/Railway: npm start
```

### Frontend (Next.js)
```bash
npm run build
npm start
# o su Vercel: git push
```

Ricorda di aggiornare `NEXT_PUBLIC_API_URL` con il domain del backend in produzione!

---

## 🐛 Troubleshooting

**Errore: Cannot reach backend**
- Verifica che il backend sia in ascolto su porta 3001
- Controlla CORS: il backend deve permettere richieste da `localhost:3000`

**Errore: CORS policy blocked**
- Il backend Express ha CORS abilitato per `http://localhost:3000`
- In produzione, configura CORS con il domain reale

**Port già in uso**
- Backend: `PORT=3001 npm run dev`
- Frontend: `PORT=3000 npm run dev`

---

## 📚 Resources

- [Express.js Docs](https://expressjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
