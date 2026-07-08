# Fincard — Angular 20 Fintech Dashboard

A production-architecture Angular 20 rebuild of the original static Fincard
HTML/CSS/JS dashboard, restyled as a premium SaaS fintech product (in the
spirit of Stripe/Revolut/Linear) while preserving the original navigation
and feature set.

## Stack

- Angular 20, standalone components only (no NgModules)
- Signals for state (no NgRx needed at this scale)
- New control flow (`@if`, `@for`)
- Lazy-loaded routes, functional guards, functional interceptors
- SCSS design system driven entirely by CSS custom properties (light/dark)
- Reactive Forms with validation

## Getting started

```bash
npm install
npm start        # ng serve, http://localhost:4200
npm run build     # production build to dist/fincard
```

## Project structure

```
src/app/
  core/           # models, services, guards, interceptors, error handler
  layout/         # sidebar, navbar, authenticated shell
  shared/         # reusable UI primitives (button, card, badge, avatar, ...)
  pages/          # one folder per route (login, dashboard, my-banks, ...)
src/theme/        # design tokens (_tokens.scss) and SCSS mixins
src/environments/ # environment.ts / environment.prod.ts
```

## Notes on data

`AccountService` and `TransactionService` currently return mocked, delayed
observables so the UI is fully interactive out of the box. Each mock method
is isolated at the bottom of its service — swap it for `HttpClient` calls
against your real API without touching any component code.

## Status

Converted so far: **Login**, **Dashboard**, **My Banks**, **Transactions**,
**Transfer Funds**, **Profile**, **Settings**, plus 401/404/500 pages, the
full design system, and all core/shared architecture. This mirrors 100% of
the pages in the original static project.
