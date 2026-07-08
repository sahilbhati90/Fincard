# Fincard

A full-stack personal finance dashboard that connects to real bank accounts via **Plaid**, letting users track balances, view transactions, and transfer money between linked accounts — all through a single Spring Boot backend serving an Angular SPA.

## Tech Stack

**Backend**
- Java 24/25, Spring Boot 4.0.5
- Spring Security (session-cookie based auth, dual filter chains for `/api/**` and web routes)
- Spring Data JPA + MySQL
- Plaid Java SDK (`plaid-java` 39.1.0) — Link, Accounts, Transactions, Item APIs
- Lombok
- Spring Mail (email confirmation on registration, via MailDev locally)

**Frontend**
- Angular 20 (standalone components, TypeScript, SCSS)
- Served as compiled static assets from the Spring Boot backend (`src/main/resources/static/fincard`)
- Dev-mode proxy (`proxy.conf.json`) forwards `/api`, `/login`, `/logout` to `localhost:8080`

## Features

- **Auth** — Registration with email confirmation token, session-cookie login/logout (`LoginController`, `WebSecurityConfig`), route guards + HTTP interceptors on the frontend
- **Bank Linking** — Plaid Link integration: create link token → exchange public token → store access token per user (`PlaidController`, `UserBankService`)
- **Dashboard** — Aggregated summary across all linked banks: total balance, bank count (`DashboardController`)
- **Transactions** — Last-30-days transactions pulled live from Plaid across every linked bank, merged and sorted (`TransactionController`)
- **Transfers** — Create transfers between linked accounts with status tracking and history (`TransferController`, `TransferService`)
- **Multi-bank support** — Users can connect and manage multiple institutions, with per-bank balance and transaction rollups

## Project Structure

```
Fincard/
├── src/main/java/com/company/Fincard/
│   ├── Registration/          # Sign-up + email confirmation
│   ├── appuser/                # User entity, roles, service
│   ├── auth/                   # LoginController, PlaidController
│   ├── bank/                   # UserBank entity + service (linked banks)
│   ├── dashboard/               # Dashboard summary endpoint
│   ├── security/Config/         # WebSecurityConfig, PlaidConfig
│   ├── transaction/              # Transaction model + controller
│   ├── transfer/                  # Transfer model, service, controller
│   ├── exception/                  # Global exception handling
│   └── web/                         # SpaController (serves Angular index.html)
└── src/main/resources/
    ├── application.properties        # ⚠️ move secrets to env vars — see Security note
    └── static/fincard/                 # Angular app (built output lives here)
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/v1/registration` | Register a new user |
| GET  | `/api/v1/registration/confirm?token=` | Confirm email via token |
| POST | `/login` | Session-based login |
| POST | `/logout` | Invalidate session |
| POST | `/api/plaid/create-link-token` | Get a Plaid Link token |
| POST | `/api/plaid/exchange-public-token` | Exchange public token, save bank |
| GET  | `/api/plaid/user-banks` | List connected banks + accounts |
| DELETE | `/api/plaid/user-banks/{itemId}` | Disconnect a bank |
| GET  | `/api/dashboard/summary` | Aggregated balance + bank count |
| GET  | `/api/transactions/recent?limit=` | Recent transactions (last 30 days) |
| POST | `/api/transfers/create` | Create a transfer |
| GET  | `/api/transfers/history` | Transfer history |
| GET  | `/api/transfers/{id}` | Single transfer detail |

All `/api/**` routes except registration require an authenticated session.

## Getting Started

### Prerequisites
- Java 24+
- Node.js + Angular CLI (`npm i -g @angular/cli`)
- MySQL running locally
- A [Plaid](https://plaid.com/) sandbox account (client ID + secret)

### 1. Configure environment
Don't put real credentials in `application.properties`. Use environment variables instead:

```bash
export DB_USERNAME=root
export DB_PASSWORD=your_password
export PLAID_CLIENT_ID=your_client_id
export PLAID_SECRET=your_secret
export PLAID_ENV=sandbox
```

And reference them in `application.properties`:
```properties
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
plaid.client-id=${PLAID_CLIENT_ID}
plaid.secret=${PLAID_SECRET}
plaid.env=${PLAID_ENV}
```

### 2. Run the backend
```bash
./mvnw spring-boot:run
```
Backend runs on `http://localhost:8080`.

### 3. Run the frontend (dev mode)
```bash
cd src/main/resources/static/fincard
npm install
npm start
```
Angular dev server runs on `http://localhost:4200` and proxies API calls to the backend.

### 4. Production build
```bash
npm run build:spring
```
Builds Angular and outputs into the Spring Boot static resources folder, so the whole app can be served from a single Spring Boot JAR.

## Security Notes

- `application.properties` currently contains a plaintext DB password and Plaid credentials, and is tracked in git — **move these to environment variables and rotate the Plaid secret** before pushing further or deploying.
- CORS is currently locked to `http://localhost:4200` — update `WebSecurityConfig` for any deployed frontend origin.
- Plaid is configured for `sandbox` — switch to `development`/`production` only after Plaid approval, with production credentials.

## Roadmap

- [ ] Move secrets to env vars / a secrets manager
- [ ] Add automated tests beyond the default `FincardApplicationTests`
- [ ] Pagination for transactions/transfer history
- [ ] Deploy (Docker + CI/CD)

## Author

Built by **Sahil** — Java/Spring Boot backend, Angular frontend, Plaid integration.