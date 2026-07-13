# Sistema de Controle de Gastos Residenciais

Aplicação full stack para gerenciar gastos residenciais: cadastro de **pessoas**, cadastro de **transações** (receitas e despesas) e **consulta de totais** por pessoa e geral.

O back-end é uma API RESTful em **C# / .NET** com persistência em banco de dados, e o front-end é uma SPA em **React + TypeScript**.

---

## Funcionalidades

- **Pessoas** — criar, listar e excluir. Ao excluir uma pessoa, todas as transações dela são apagadas automaticamente.
- **Transações** — criar e listar. Uma pessoa menor de 18 anos só pode registrar despesas.
- **Totais** — lista cada pessoa com total de receitas, total de despesas e saldo (receita − despesa), além do consolidado geral.

---

## Tecnologias

| Camada | Stack |
|---|---|
| Back-end | C# / .NET 10 · ASP.NET Core Web API (Controllers) · Entity Framework Core |
| Banco de dados | SQLite (persistência em arquivo, via EF Core) |
| Front-end | React + TypeScript · Vite |

---

## Como o projeto funciona (a lógica por trás)

### Back-end

Organizado em camadas, cada uma com uma responsabilidade clara:

- **`Models/`** — as entidades do domínio (`Person`, `Transaction`, `TransactionType`). São as classes que descrevem o formato dos dados.
- **`Data/AppDbContext`** — a ponte entre as classes C# e o banco (o *ORM* do EF Core). É aqui que ficam os `DbSet` (as tabelas) e, no `OnModelCreating`, os ajustes de mapeamento (precisão do valor monetário e o enum gravado como texto).
- **`Controllers/`** — os endpoints HTTP. Recebem as requisições, aplicam as **regras de negócio** e conversam com o banco através do `AppDbContext` (injetado por injeção de dependência).
- **`Dtos/`** — objetos que definem exatamente o que **entra** e **sai** da API, separados das entidades. Isso protege contra *over-posting*, desacopla o contrato da API do schema do banco e valida a entrada.

**Persistência:** o EF Core mapeia as entidades para tabelas no SQLite (arquivo `app.db`). O schema é versionado por **migrations** (pasta `Migrations/`), então o banco pode ser recriado do zero a qualquer momento.

**Onde vivem as regras de negócio:**

| Regra | Descrição | Onde é garantida |
|---|---|---|
| Cascade | Excluir uma pessoa apaga as transações dela | Banco (`ON DELETE CASCADE`, por convenção do relacionamento 1:N) |
| Menor de idade | Menor de 18 anos só registra despesa | Código (`TransactionsController`) |
| Pessoa existente | O `personId` da transação precisa existir | Código (`TransactionsController` → 404 se não existir) |
| Ids automáticos | Ids únicos gerados pelo banco | Banco (autoincremento) |
| Validações de entrada | Valor > 0, nome/idade válidos | DTOs (Data Annotations) + código |

### Front-end

- **`src/api.ts`** — o cliente HTTP tipado. Centraliza as chamadas à API (`fetch`) e os tipos TypeScript que espelham os DTOs do back-end.
- **`src/pages/`** — uma página por tela: `PeoplePage`, `TransactionsPage`, `TotalsPage`.
- **`src/App.tsx`** — a navegação entre as telas.

**Integração back ↔ front:** o front (em `http://localhost:5173`) chama a API (em `http://localhost:5269`). Como são origens diferentes, o back-end libera o **CORS** para a origem do front. As telas seguem o padrão *carregar → exibir → mutação → recarregar*.

---

## Estrutura do projeto

```
Challenge/
├── backend/
│   └── ExpenseControl.Api/
│       ├── Controllers/     # PeopleController, TransactionsController, TotalsController
│       ├── Data/            # AppDbContext
│       ├── Dtos/            # DTOs de entrada e saída
│       ├── Models/          # Person, Transaction, TransactionType
│       ├── Migrations/      # histórico do schema do banco
│       ├── Program.cs       # configuração da API (DI, EF Core, CORS)
│       └── appsettings.json # connection string do SQLite
├── frontend/
│   └── src/
│       ├── pages/           # PeoplePage, TransactionsPage, TotalsPage
│       ├── api.ts           # cliente HTTP tipado
│       ├── App.tsx          # navegação
│       └── index.css        # estilos
├── .config/
│   └── dotnet-tools.json    # ferramenta local dotnet-ef (migrations)
└── ExpenseControl.postman_collection.json  # coleção de testes da API
```

---

## Como rodar

### Pré-requisitos

- [.NET SDK 10](https://dotnet.microsoft.com/download)
- [Node.js 20+](https://nodejs.org)

O back-end e o front-end rodam **ao mesmo tempo**, em terminais separados.

### 1) Back-end (API)

```bash
cd backend/ExpenseControl.Api

# restaura a ferramenta de migrations (dotnet-ef)
dotnet tool restore

# cria o banco (app.db) e as tabelas a partir das migrations
dotnet ef database update

# sobe a API
dotnet run --launch-profile http
```

A API fica disponível em **http://localhost:5269**.

### 2) Front-end (interface)

Em outro terminal:

```bash
cd frontend

# instala as dependências
npm install

# sobe o servidor de desenvolvimento
npm run dev
```

A interface fica disponível em **http://localhost:5173**. Abra esse endereço no navegador (com a API rodando).

> Para gerar a versão de produção do front: `npm run build`.

---

## Endpoints da API

| Método | Rota | Descrição |
|---|---|---|
| `POST` | `/people` | Cria uma pessoa |
| `GET` | `/people` | Lista as pessoas |
| `DELETE` | `/people/{id}` | Exclui uma pessoa (e suas transações, em cascata) |
| `POST` | `/transactions` | Cria uma transação (valida as regras de negócio) |
| `GET` | `/transactions` | Lista as transações |
| `GET` | `/totals` | Totais por pessoa e o consolidado geral |

Exemplos de corpo (JSON):

```jsonc
// POST /people
{ "name": "Ana", "age": 30 }

// POST /transactions   (type: "Expense" ou "Income")
{ "description": "Mercado", "amount": 150.50, "type": "Expense", "personId": 1 }
```

Exemplo de resposta de `GET /totals`:

```json
{
  "people": [
    { "personId": 1, "name": "Ana", "totalIncome": 3500, "totalExpense": 301, "balance": 3199 }
  ],
  "overall": { "totalIncome": 3500, "totalExpense": 301, "balance": 3199 }
}
```

---

## Testando a API no Postman

O repositório inclui a coleção **`ExpenseControl.postman_collection.json`** com todas as rotas prontas, incluindo os casos de erro (regras de negócio) e um fluxo que demonstra o cascade.

1. Com a API rodando, abra o Postman → **Import** → selecione o arquivo `ExpenseControl.postman_collection.json`.
2. Rode as requisições individualmente **ou** use o **Collection Runner** para executar todas de uma vez. Cada requisição já traz um teste que valida o status esperado, e os ids são capturados e reutilizados automaticamente entre as chamadas.

---

## Decisões e recursos adicionais

- **Ids inteiros com autoincremento** — identificadores estáveis, gerados pelo banco (não são reaproveitados após exclusão).
- **DTOs** separados das entidades — contrato da API desacoplado do banco e protegido contra *over-posting*.
- **Enum gravado como texto** (`Expense`/`Income`) — banco legível e robusto a mudanças de ordem.
- **Validações extras** (valor > 0, idade não negativa, nome/descrição obrigatórios) e respostas de erro claras.
- **Coleção do Postman** versionada para facilitar os testes das rotas.
