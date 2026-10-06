# FinanceHub — Mapa do Projeto

## 1. Visão Geral
* **Domínio:** Gestão financeira pessoal e empresarial de pequeno porte.
* **Backend:** Laravel 13 (PHP 8.4/8.3), PostgreSQL 16, Sanctum, DomPDF, Larastan, Pint.
* **Frontend:** React 19, TypeScript, Vite, React Router 7, TanStack Query 5, Zustand, React Hook Form, Zod, Recharts, Lucide Icons.
* **DevOps:** Docker Compose (Nginx, Backend PHP-FPM, Frontend Vite, PostgreSQL).

## 2. Estrutura de Diretórios
```text
financehub/
├── backend/                   # API REST Laravel
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   ├── Requests/
│   │   │   └── Resources/
│   │   ├── Models/
│   │   ├── Policies/
│   │   └── Services/
│   ├── config/
│   ├── database/
│   │   ├── migrations/
│   │   └── seeders/
│   ├── routes/
│   │   └── api.php
│   ├── tests/
│   ├── phpstan.neon
│   └── Dockerfile
│
├── frontend/                  # SPA React TypeScript
│   ├── src/
│   │   ├── app/               # Providers, layouts e router
│   │   ├── components/        # UI atômica, forms, feedback e navegação
│   │   ├── features/          # Domínios verticais (auth, dashboard, accounts, etc.)
│   │   ├── hooks/             # Custom hooks globais
│   │   ├── lib/api/           # Cliente Axios e interceptors
│   │   ├── stores/            # Zustand UI store
│   │   ├── styles/            # Design tokens e CSS moderno
│   │   ├── types/             # Contratos TypeScript da API
│   │   └── utils/             # Formatadores (moeda BRL, datas)
│   ├── test/                  # Testes e setup Vitest
│   ├── vite.config.ts
│   ├── tsconfig.app.json
│   └── Dockerfile
│
├── docker/
│   └── nginx/default.conf     # Reverse proxy de desenvolvimento
├── docker-compose.yml
├── .env.example
└── financehub.md
```

## 3. Comandos de Validação e Qualidade
* **Backend Pint:** `cd backend && .\vendor\bin\pint`
* **Backend Larastan:** `cd backend && .\vendor\bin\phpstan analyse`
* **Backend Testes:** `cd backend && php artisan test`
* **Frontend Lint:** `cd frontend && npm run lint`
* **Frontend Testes:** `cd frontend && npm run test`
* **Frontend Build:** `cd frontend && npm run build`
* **Frontend Format:** `cd frontend && npm run format:check`
