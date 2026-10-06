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
│   │   │   ├── Controllers/Api/V1/
│   │   │   ├── Middleware/
│   │   │   ├── Requests/Auth/
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
│   ├── tests/Feature/
│   ├── phpstan.neon
│   └── Dockerfile
│
├── frontend/                  # SPA React TypeScript
│   ├── src/
│   │   ├── app/               # Providers, layouts e router (guards)
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

## 3. Estado das Etapas
* [x] **Etapa 0 — Análise e Planejamento**
* [x] **Etapa 1 — Foundation** (Infraestrutura, Laravel, React, TypeScript, Docker, Testes)
* [x] **Etapa 2 — Autenticação e RBAC** (Sanctum SPA, AuthController, UserPolicy, AuthProvider, Route Guards, LoginPage)
* [x] **Etapa 3 — Contas e Categorias** (CRUD, API Resources, Políticas, Frontend React, TanStack Query, Testes)
* [x] **Etapa 4 — Transações, Extrato e Relacionamentos** (CRUD, Lógica de Transferência, Atualização Atômica de Saldos, Testes)
* [x] **Etapa 5 — Dashboards, Gráficos e Relatórios** (Métricas consolidadas, Fluxo de Caixa Recharts, Rosca de Despesas, Relatório Analítico, Exportação CSV e PDF)
* [x] **Etapa 6 — Configurações, Perfil, RBAC e Auditoria** (Perfil do Usuário, Segurança, Preferências, Notificações com Alertas Inteligentes, Painel Administrativo de Usuários e Logs de Auditoria)
* [ ] **Etapa 7 — Qualidade Global, Revisão de Segurança e Responsividade Multidispositivo** (Pendente de início)

## 4. Comandos de Validação e Qualidade
* **Backend Pint:** `cd backend && .\vendor\bin\pint`
* **Backend Larastan:** `cd backend && .\vendor\bin\phpstan analyse --memory-limit=1G`
* **Backend Testes:** `cd backend && php artisan test`
* **Frontend Lint:** `cd frontend && npm run lint`
* **Frontend Testes:** `cd frontend && npm run test`
* **Frontend Build:** `cd frontend && npm run build`
* **Frontend Format:** `cd frontend && npm run format:check`
