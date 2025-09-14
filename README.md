# API Checkout Rest e GraphQL

Se você é aluno da Pós-Graduação em Automação de Testes de Software (Turma 2), faça um fork desse repositório e boa sorte em seu trabalho de conclusão da disciplina.

## Instalação

```bash
npm install express jsonwebtoken swagger-ui-express apollo-server-express graphql
```

## Exemplos de chamadas

### REST

#### Registro de usuário
```bash
curl -X POST http://localhost:3000/api/users/register \
	-H "Content-Type: application/json" \
	-d '{"name":"Novo Usuário","email":"novo@email.com","password":"senha123"}'
```

#### Login
```bash
curl -X POST http://localhost:3000/api/users/login \
	-H "Content-Type: application/json" \
	-d '{"email":"novo@email.com","password":"senha123"}'
```

#### Checkout (boleto)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":1,"quantity":2}],
		"freight": 20,
		"paymentMethod": "boleto"
	}'
```

#### Checkout (cartão de crédito)
```bash
curl -X POST http://localhost:3000/api/checkout \
	-H "Content-Type: application/json" \
	-H "Authorization: Bearer <TOKEN_JWT>" \
	-d '{
		"items": [{"productId":2,"quantity":1}],
		"freight": 15,
		"paymentMethod": "credit_card",
		"cardData": {
			"number": "4111111111111111",
			"name": "Nome do Titular",
			"expiry": "12/30",
			"cvv": "123"
		}
	}'
```

### GraphQL

#### Registro de usuário
Mutation:
```graphql
mutation Register($name: String!, $email: String!, $password: String!) {
  register(name: $name, email: $email, password: $password) {
    email
    name
  }
}

Variables:
{
  "name": "Julio",
  "email": "julio@abc.com",
  "password": "123456"
}
```

#### Login
Mutation:
```graphql
mutation Login($email: String!, $password: String!) {
  login(email: $email, password: $password) {
    token
  }
}

Variables:
{
  "email": "alice@email.com",
  "password": "123456"
}
```


#### Checkout (boleto)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation Checkout($items: [CheckoutItemInput!]!, $freight: Float!, $paymentMethod: String!, $cardData: CardDataInput) {
  checkout(items: $items, freight: $freight, paymentMethod: $paymentMethod, cardData: $cardData) {
    freight
    items {
      productId
      quantity
    }
    paymentMethod
    userId
    valorFinal
  }
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "boleto"
}
```

#### Checkout (cartão de crédito)
Mutation (envie o token JWT no header Authorization: Bearer <TOKEN_JWT>):
```graphql
mutation {
	checkout(
		items: [{productId: 2, quantity: 1}],
		freight: 15,
		paymentMethod: "credit_card",
		cardData: {
			number: "4111111111111111",
			name: "Nome do Titular",
			expiry: "12/30",
			cvv: "123"
		}
	) {
		valorFinal
		paymentMethod
		freight
		items { productId quantity }
	}
}

Variables:
{
  "items": [
    {
      "productId": 1,
      "quantity": 2
    },
    {
      "productId": 2,
      "quantity": 1
    }
  ],
  "freight": 10,
  "paymentMethod": "credit_card",
  "cardData": {
    "cvv": "123",
    "expiry": "10/04",
    "name": "Julio Costa",
    "number": "1234432112344321"
  }
}
```

#### Consulta de usuários
Query:
```graphql
query Users {
  users {
    email
    name
  }
}
```

## Como rodar

### REST
```bash
node rest/server.js
```
Acesse a documentação Swagger em [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### GraphQL
```bash
node graphql/app.js
```
Acesse o playground GraphQL em [http://localhost:4000/graphql](http://localhost:4000/graphql)

## API de Transferências e Usuários

Esta API permite o registro, login, consulta de usuários e transferências de valores entre usuários, com regras básicas de negócio e documentação via Swagger.

### Instalação

1. Clone o repositório e acesse a pasta do projeto.
2. Instale as dependências:

```
npm install express swagger-ui-express
```

### Como rodar a API

```
node server.js
```

A API estará disponível em `http://localhost:3000`.

### Documentação Swagger

Acesse a documentação interativa em: [http://localhost:3000/api-docs](http://localhost:3000/api-docs)

### Endpoints principais

- `POST /users/register` — Registro de usuário
- `POST /users/login` — Login de usuário
- `GET /users` — Listar usuários
- `POST /transfers` — Realizar transferência
- `GET /transfers` — Listar transferências

### Regras de negócio

- Login exige usuário e senha.
- Não é possível registrar usuários duplicados.
- Transferências para destinatários não favorecidos só podem ser realizadas se o valor for menor que R$ 5.000,00.
- Banco de dados em memória (os dados são perdidos ao reiniciar o servidor).

### Estrutura do projeto

- `controller/` — Rotas e validações
- `service/` — Lógica de negócio
- `model/` — Dados em memória
- `app.js` — Configuração do Express
- `server.js` — Inicialização do servidor
- `swagger.json` — Documentação Swagger

### Testes

A API foi estruturada para facilitar testes automatizados, especialmente com Supertest, importando o `app.js` sem o método `listen()`.
