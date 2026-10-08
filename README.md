# 💰 FinanceHub — Sistema Completo de Gestão Financeira Fullstack

[![Laravel](https://img.shields.io/badge/Laravel-13.x-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)](https://laravel.com)
[![PHP](https://img.shields.io/badge/PHP-8.4-777BB4?style=for-the-badge&logo=php&logoColor=white)](https://php.net)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org)
[![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)
[![PHPStan](https://img.shields.io/badge/Larastan-Level%206-8A2BE2?style=for-the-badge)](https://github.com/larastan/larastan)
[![Tests](https://img.shields.io/badge/Tests-101%20Passed-success?style=for-the-badge)](https://github.com/aurelio-muzzi/financehub)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## 📌 Visão Geral

O **FinanceHub** é uma aplicação web fullstack de alta performance para controle e inteligência financeira pessoal e corporativa. Desenvolvido sob rigorosos padrões de engenharia de software (**GOLDCODE v4.0**), o sistema oferece uma experiência segura, responsiva e em tempo real para gestão de patrimônio, fluxo de caixa, orçamentos e relatórios analíticos.

O projeto conta com arquitetura modular desacoplada: **Backend RESTful em Laravel 13** com autenticação SPA segura via Laravel Sanctum e controle de acesso baseado em papéis (**RBAC**), associado a um **Frontend SPA em React 19 com TypeScript estrito**, estado assíncrono via TanStack Query, design tokens consistentes e suporte a múltiplos dispositivos (*Mobile First*).

---

## 🎥 Demonstração em Vídeo

Confira a visão geral das funcionalidades, interface dark mode e fluxo de gestão no vídeo abaixo:

[![Demonstração em Vídeo](https://img.youtube.com/vi/WiFxcvDt2uA/maxresdefault.jpg)](https://www.youtube.com/watch?v=WiFxcvDt2uA)

> 💡 *Clique na imagem acima para assistir ao vídeo de demonstração completo no YouTube.*

---

## 🚀 Principais Funcionalidades

### 📊 1. Dashboard e Inteligência Financeira
- **Cards de Métricas em Tempo Real:** Saldo total consolidado, receitas do mês, despesas do mês e economia líquida.
- **Gráficos Interativos:**
  - *Fluxo de Caixa Mensal:* Comparativo dinâmico de receitas versus despesas construído com Recharts.
  - *Distribuição de Despesas:* Gráfico de rosca detalhando os gastos por categoria.
- **Listagem Rápida:** Últimas transações com status e indicador visual por tipo.

### 💳 2. Contas e Carteiras Financeiras
- Cadastro e gerenciamento de múltiplas contas (Conta Corrente, Poupança, Investimentos, Dinheiro, Cartão de Crédito).
- Atualização atômica de saldos bancários protegida por transações ACID de banco de dados.
- Ocultação e arquivamento de contas inativas.

### 🏷️ 3. Categorias e Orçamentos
- Gestão de categorias hierárquicas para Receitas e Despesas.
- Definição de limites e metas orçamentárias mensais por categoria.
- Cores personalizadas e ícones dinâmicos para identificação visual ágil.

### 💸 4. Transações e Transferências Atômicas
- Registro de movimentações financeiras: **Receitas**, **Despesas** e **Transferências entre Contas**.
- Operações de transferência atômicas com débito na conta de origem e crédito na conta de destino sob transação relacional segura.
- Suporte a filtros dinâmicos por período, conta, categoria e tipo, com ordenação e paginação.

### 📑 5. Relatórios Analíticos e Exportação
- Filtro avançado por período (datas customizadas, mês corrente, trimestre, ano).
- Agrupamentos por categoria, tipo de movimentação e evolução diária.
- **Exportação Multi-formato:**
  - Download de extrato em planilha **CSV**.
  - Emissão de relatório formatado para impressão em **PDF** profissional gerado pelo DomPDF.

### 🔔 6. Notificações e Alertas Inteligentes
- Painel de notificações no cabeçalho com contagem em tempo real e dropdown interativo.
- **Alertas Proativos Automatizados:**
  - Aviso de saldo crítico/baixo em contas ativas (< R$ 100,00).
  - Alerta de vencimentos de despesas pendentes próximos da data limite.
- Ações para marcar individualmente ou todas como lidas.

### 🛡️ 7. Segurança, RBAC e Auditoria (Admin)
- **Controle de Acesso Baseado em Papéis (RBAC):** Níveis de acesso granulares (`admin` e `user`) via Policies e Route Guards.
- **Painel Administrativo de Usuários:** Gestão completa de usuários, alteração de status (`ACTIVE`, `INACTIVE`, `SUSPENDED`) e redefinição de permissões.
- **Trilha de Auditoria Completa (*Audit Logs*):** Rastreabilidade de ações críticas com modal de inspeção de *diff* antes/depois (`old_values` vs `new_values`), IP do cliente e User-Agent.

---

## 🛠️ Stack Tecnológica

### Backend (API RESTful)
- **Linguagem & Framework:** PHP 8.4 / Laravel 13
- **Autenticação:** Laravel Sanctum (Cookies HTTP-Only + CSRF Protection para SPA)
- **Banco de Dados:** PostgreSQL 16 (Índices otimizados e integridade referencial)
- **Exportação de Documentos:** Barryvdh DomPDF (`barryvdh/laravel-dompdf`)
- **Qualidade & Análise Estática:** Larastan / PHPStan (Nível 6 rigoroso)
- **Padronização de Código:** Laravel Pint (PSR-12)
- **Testes Automatizados:** PHPUnit / Laravel Testing Suite (57 testes, 236 asserções)

### Frontend (SPA)
- **Linguagem & Biblioteca:** React 19 / TypeScript 5 (Strict Mode)
- **Build Tool:** Vite 8 (Hot Module Replacement instantâneo e Code Splitting sob demanda)
- **Roteamento:** React Router DOM (com `React.lazy` e rotas protegidas)
- **Gerenciamento de Estado de Servidor:** TanStack Query v5 (React Query com cache inteligente)
- **Gerenciamento de Estado Global:** Zustand (preferências de interface e notificações)
- **Formulários e Validação:** React Hook Form + Zod (inferência estrita de tipos)
- **Gráficos e Visualização de Dados:** Recharts
- **Design System:** CSS Vanilla Moderno baseado em Design Tokens, Flexbox, CSS Grid e Glassmorphism
- **Resiliência:** Error Boundary global com recuperação em tempo de execução
- **Testes Unitários:** Vitest + React Testing Library + jsdom (44 testes aprovados)

### Infraestrutura & DevOps
- **Conteinerização:** Docker & Docker Compose
- **Servidor Web / Proxy Reverso:** Nginx Alpine
- **Ambiente PHP:** PHP-FPM 8.4 com extensões `pdo_pgsql`, `mbstring`, `zip`, `gd`, `bcmath`

---

## 🛡️ Arquitetura e Práticas de Engenharia (GOLDCODE v4.0)

1. **Prevenção de N+1 Queries:** Eloquent configurado com `Model::preventLazyLoading` e `Model::preventSilentlyDiscardingAttributes` ativos em desenvolvimento e testes para garantir performance máxima via *Eager Loading* (`with(...)`).
2. **Segurança OWASP Integrada:**
   - Middleware global de cabeçalhos de proteção: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `X-XSS-Protection: 1; mode=block`, `Referrer-Policy: strict-origin-when-cross-origin` e `Permissions-Policy`.
   - Rate limiting restritivo (`throttle:120,1`) nas rotas autenticadas para prevenção de ataques de força bruta e abusos.
   - Proteção estrita contra SQL Injection através de queries parametrizadas pelo Eloquent ORM.
3. **Resiliência Frontend:** Componente de classe `ErrorBoundary` no React envolvendo a árvore de rotas, interceptando exceções inesperadas com tela amigável e ação de reinicialização.
4. **Code Splitting & Performance:** Divisão do bundle inicial em chunks sob demanda via `React.lazy` e `<Suspense>`, eliminando avisos de bundle excessivo e acelerando o carregamento inicial.
5. **Zero Erros de Tipagem:** Código validado sem supressões artificiais (`@ts-ignore` ou `any`).

---

## 💻 Como Executar o Projeto

### Pré-requisitos
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/) instalados, **OU**
- PHP 8.4+, Composer 2.x, Node.js 20+, npm e PostgreSQL 16 instalados localmente.

---

### Opção 1: Executando com Docker Compose (Recomendado)

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/aurelio-muzzi/financehub.git
   cd financehub
   ```

2. **Configure as variáveis de ambiente:**
   ```bash
   cp .env.example .env
   cp backend/.env.example backend/.env
   ```

3. **Inicie os contêineres Docker:**
   ```bash
   docker-compose up -d --build
   ```

4. **Instale dependências e execute as migrações com seeders no backend:**
   ```bash
   docker-compose exec financehub-backend composer install
   docker-compose exec financehub-backend php artisan key:generate
   docker-compose exec financehub-backend php artisan migrate --seed
   ```

5. **Acesse as aplicações:**
   - **Aplicação Completa (Nginx Proxy):** [http://localhost](http://localhost)
   - **Frontend Vite:** [http://localhost:5173](http://localhost:5173)
   - **API Laravel:** [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
   - **PostgreSQL (Host Externo):** `localhost:5433` (Usuário: `financehub`, Senha: `financehub_secret`)

---

### Opção 2: Executando em Ambiente Local (Sem Docker)

#### 1. Configurar o Backend:
```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```
> Configure os dados de conexão do PostgreSQL no arquivo `backend/.env`. Em seguida execute:
```bash
php artisan migrate --seed
php artisan serve --port=8000
```

#### 2. Configurar o Frontend:
```bash
cd ../frontend
npm install
npm run dev
```
> A aplicação estará disponível em [http://localhost:5173](http://localhost:5173).

---

## 🔑 Credenciais Padrão de Acesso

O banco de dados vem pré-populado com os seguintes usuários para testes e demonstração:

| Perfil | E-mail | Senha | Permissões |
| :--- | :--- | :--- | :--- |
| **Administrador** | `admin@financehub.test` | `password123` | Acesso total, Painel Admin, Usuários e Auditoria |
| **Usuário Regular** | `demo@financehub.test` | `password123` | Dashboard, Contas, Categorias, Transações e Relatórios |

---

## 🧪 Suíte de Testes e Validação de Qualidade

Para verificar a integridade da aplicação em qualquer momento, utilize os scripts automatizados:

### Backend
```bash
cd backend

# 1. Executar todos os 57 testes automatizados
php artisan test

# 2. Análise Estática de Código (PHPStan / Larastan Nível 6)
./vendor/bin/phpstan analyse --memory-limit=2G

# 3. Verificação de Padrões de Código (Pint / PSR-12)
./vendor/bin/pint --test
```

### Frontend
```bash
cd frontend

# 1. Executar os 44 testes unitários e de integração
npm run test

# 2. Validação Estática com ESLint
npm run lint

# 3. Verificação de Estilo com Prettier
npm run format:check

# 4. Verificação de Tipos TypeScript e Build de Produção
npm run build
```

---

## 📁 Estrutura de Diretórios

```text
financehub/
├── .github/                       # Workflows e automações CI/CD
├── backend/                       # API RESTful Laravel 13
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/Api/V1/ # Controllers desacoplados por recurso
│   │   │   ├── Middleware/         # OWASP Headers, RBAC, Rate Limiting
│   │   │   ├── Requests/           # Form Requests com validação estrita
│   │   │   └── Resources/          # Transformação e serialização de dados
│   │   ├── Models/                 # Eloquent Models com relacionamentos e casts
│   │   ├── Policies/               # Políticas de autorização do Laravel
│   │   └── Services/               # Camada de lógica de negócio (Transações, Relatórios)
│   ├── database/
│   │   ├── migrations/             # Migrações relacionais versionadas
│   │   └── seeders/                # Seeders com dados consistentes de teste
│   ├── routes/
│   │   └── api.php                 # Rotas versionadas (v1) agrupadas com auth:sanctum
│   ├── tests/Feature/              # Testes de integração de API e segurança
│   └── phpstan.neon                # Configuração do Larastan no Nível 6
│
├── frontend/                      # SPA React 19 com TypeScript
│   ├── src/
│   │   ├── app/                    # Layouts, Provedores globais e Router com Lazy Loading
│   │   ├── components/             # Componentes de UI (Button, Card, Modal, Input, Badge)
│   │   ├── features/               # Módulos verticais de domínio
│   │   │   ├── accounts/           # Gestão de contas financeiras
│   │   │   ├── admin/              # Gestão de usuários e logs de auditoria
│   │   │   ├── auth/               # Autenticação, login e recuperação de senha
│   │   │   ├── categories/         # Categorias e orçamentos
│   │   │   ├── dashboard/          # Métricas consolidadas e gráficos Recharts
│   │   │   ├── notifications/      # Sistema de alertas e dropdown de notificações
│   │   │   ├── reports/            # Relatórios analíticos e exportação CSV/PDF
│   │   │   ├── settings/           # Perfil e configurações do usuário
│   │   │   └── transactions/       # Registro e conciliação de transações
│   │   ├── hooks/                  # Custom hooks utilitários
│   │   ├── lib/api/                # Cliente Axios tipado com interceptors
│   │   ├── stores/                 # Zustand Store de estado de UI
│   │   ├── styles/                 # Design tokens CSS, temas e estilos globais
│   │   └── types/                  # Definições estritas de contratos TypeScript
│   ├── test/                       # Testes automatizados Vitest + Testing Library
│   └── vite.config.ts              # Configuração do Vite e aliases de importação
│
├── docker/
│   └── nginx/default.conf          # Configuração de Proxy Reverso Nginx
├── docker-compose.yml              # Orquestração dos serviços (App, API, DB, Proxy)
├── financehub.md                   # Mapa de arquitetura e progresso das etapas
└── README.md                       # Documentação técnica principal do projeto
```

---

## 📄 Licença

Este projeto é distribuído sob a licença **MIT**. Consulte o arquivo [LICENSE](LICENSE) para obter mais informações.

---

## 👤 Autor

Desenvolvido por **Aurélio Muzzi** como parte do portfólio profissional de engenharia de software fullstack.  
Entre em contato via [GitHub](https://github.com/aurelio-muzzi) ou [LinkedIn](https://linkedin.com).
