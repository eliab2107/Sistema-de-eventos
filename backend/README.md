# API REST - Sistema de Eventos

API REST simples, funcional e organizada para gerenciamento de eventos com autenticação JWT.

## 🚀 Quick Start

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
Copie `.env.example` para `.env`:
```bash
cp .env.example .env
```

### 3. Configurar banco de dados
```bash
npm run prisma:migrate
npm run prisma:seed
```

### 4. Iniciar servidor em desenvolvimento
```bash
npm run dev
```

Servidor rodando em `http://localhost:3000`

## 📝 Autenticação

### Login
```bash
POST /auth/login
Content-Type: application/json

{
  "email": "admin@email.com",
  "password": "123456"
}
```

Retorna:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "admin@email.com"
  }
}
```

### Usar token em requisições protegidas
```bash
Authorization: Bearer {token}
```

## 📊 Endpoints

### Eventos
- `GET /eventos` - Listar eventos (com filtros opcionais)
- `GET /eventos/:id` - Obter evento
- `POST /eventos` - Criar evento
- `PUT /eventos/:id` - Atualizar evento
- `DELETE /eventos/:id` - Deletar evento

**Filtros opcionais em GET /eventos:**
- `nome` - Filtro por nome
- `status` - Filtro por status (Ativo/Encerrado)
- `local` - Filtro por local
- `dataInicial` - Data inicial (ISO 8601)
- `dataFinal` - Data final (ISO 8601)

### Participantes
- `GET /participantes` - Listar participantes
- `POST /participantes` - Criar participante
- `PUT /participantes/:id` - Atualizar participante
- `DELETE /participantes/:id` - Deletar participante
- `POST /participantes/:id/inscrever` - Inscrever em evento
- `PUT /participantes/:id/transferir` - Transferir entre eventos
- `PUT /participantes/:id/checkin` - Fazer check-in

### Dashboard
- `GET /dashboard` - Retorna estatísticas gerais

### Regras de Check-in
- `GET /eventos/:eventoId/regras-checkin` - Listar regras
- `POST /eventos/:eventoId/regras-checkin` - Criar regra
- `PUT /eventos/:eventoId/regras-checkin/:id` - Atualizar regra
- `DELETE /eventos/:eventoId/regras-checkin/:id` - Deletar regra

## 🏗️ Arquitetura

Estrutura simples em camadas:

```
src/
├── server.ts                 # Entry point
├── app.ts                    # Configuração Express
├── prisma.ts                 # Cliente Prisma
├── middleware/
│   └── auth.middleware.ts    # Autenticação JWT
└── modules/
    ├── auth/                 # Autenticação
    ├── eventos/              # Gerenciamento de eventos
    ├── participantes/        # Gerenciamento de participantes
    ├── dashboard/            # Estatísticas
    └── regrasCheckin/        # Regras de check-in
```

Cada módulo contém:
- `controller.ts` - Handlers HTTP
- `service.ts` - Lógica de negócio
- `routes.ts` - Definição de rotas

## 🔧 Scripts

```bash
npm run dev              # Desenvolvimento com hot-reload
npm run build            # Compilar TypeScript
npm start                # Iniciar servidor em produção
npm run prisma:migrate   # Executar migrações
npm run prisma:seed      # Popular banco com dados iniciais
```

## 🛡️ Validações

### Eventos
- Status deve ser "Ativo" ou "Encerrado"
- Data deve ser um formato ISO 8601 válido

### Participantes
- Email único
- Não pode inscrever participante já inscrito no mesmo evento
- Pode transferir apenas se já inscrito no evento de origem

### Regras de Check-in
- Deve existir pelo menos 1 regra ativa por evento
- Não pode haver conflito entre regras obrigatórias ativas
- Conflito = sobreposição de intervalos [-minutosAntes, +minutosDepois]

## 📦 Dependências

- **Express** - Framework HTTP
- **TypeScript** - Tipagem estática
- **Prisma** - ORM e migrations
- **SQLite** - Banco de dados local
- **JWT** - Autenticação
- **bcryptjs** - Hash de senhas

## 🚨 Status HTTP

- `200` - OK
- `201` - Criado
- `204` - Deletado com sucesso
- `400` - Validação falhou
- `401` - Não autenticado
- `404` - Não encontrado
- `500` - Erro interno

## 📌 Notas

- Token JWT expira em 1 hora
- Logout é responsabilidade do frontend (delete token)
- Banco de dados SQLite local em `prisma/dev.db`
- Em produção, usar `.env` com as variáveis corretas
