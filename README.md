# StockFlow - Grupo 777

Controle de estoque com API Java Spring Boot + H2, front web em Angular e app mobile em Expo. As duas interfaces consomem a mesma API: um produto cadastrado no Angular aparece no Expo, e uma entrada ou saída registrada no Expo muda o saldo mostrado no Angular.

- Board do projeto: https://github.com/users/arthur-brasil/projects/5

## Integrantes

| Integrante | GitHub | Parte | Issues |
|---|---|---|---|
| Arthur Brasil | [arthur-brasil](https://github.com/arthur-brasil) | API Java Spring Boot (`backend/`) | #1, #2, #3 |
| Lucas Lonardi | [Lucaslonardi](https://github.com/Lucaslonardi) | Front web Angular (`frontend-web/`) | #4, #5 |
| Sophia | [winter717](https://github.com/winter717) | App mobile Expo (`frontend-mobile/`) | #6, #7 |

README e demonstração (#8): os três.

## Estrutura

```
hackathon-stockflow-grupo-777/
├── backend/          API REST Java 25 + Spring Boot 4.1 + H2
├── frontend-web/     Angular 21
├── frontend-mobile/  Expo (React Native) + React Navigation
├── README.md
└── .gitignore
```

## API

URL base: `http://localhost:8080/api/produtos` (na rede: `http://IP-DO-PC:8080/api/produtos`)

| Método | Rota | Operação | Respostas |
|---|---|---|---|
| GET | `/api/produtos` | Listar produtos | 200 |
| GET | `/api/produtos/{id}` | Consultar produto | 200, 404 |
| POST | `/api/produtos` | Cadastrar produto | 201 + `Location`, 400 |
| PUT | `/api/produtos/{id}` | Editar dados do produto | 204, 400, 404 |
| DELETE | `/api/produtos/{id}` | Excluir produto | 204, 404 |
| PATCH | `/api/produtos/{id}/movimentacao` | Registrar entrada ou saída | 200 com o produto atualizado, 400, 404 |

Corpo do cadastro e da edição:

```json
{ "nome": "Caderno", "descricao": "Opcional", "categoria": "Papelaria", "quantidade": 10, "estoqueMinimo": 3 }
```

Corpo da movimentação (`tipo` é `ENTRADA` ou `SAIDA`, `quantidade` inteira maior que zero):

```json
{ "tipo": "SAIDA", "quantidade": 3 }
```

Regras:

- `nome` e `categoria` obrigatórios; `quantidade` e `estoqueMinimo` obrigatórios e maiores ou iguais a zero.
- Uma saída maior que o saldo é recusada com 400 `Estoque insuficiente: saldo atual de N unidade(s)` e o saldo não muda.
- A resposta traz `estoqueBaixo: true` quando `quantidade <= estoqueMinimo`.
- Erros de validação: `{"status": 400, "erros": ["..."]}`. Id inexistente: `{"status": 404, "mensagem": "Produto não encontrado"}`.
- CORS liberado para `http://localhost:4200` (Angular) e `http://localhost:8081` (Expo web).
- O banco H2 é em memória e o `data.sql` cria 5 produtos de exemplo cada vez que a API sobe. H2 Console: `http://localhost:8080/h2-console` (JDBC URL `jdbc:h2:mem:stockflow`, usuário `sa`, sem senha).

## Como rodar

Pré-requisitos: Git, JDK 25, Node 20 ou mais novo e o app Expo Go no celular.

### 1. API (backend)

```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

A API sobe em `http://localhost:8080`. Testes: `.\mvnw.cmd test` (12 testes, incluindo o fluxo da demonstração).

### 2. Front web (Angular)

```powershell
cd frontend-web
npm install
npm start
```

Abra `http://localhost:4200`. A URL da API fica em `src/app/services/produto.service.ts`. Testes: `npx ng test --watch=false`.

### 3. App mobile (Expo)

```powershell
cd frontend-mobile
npm install
copy .env.example .env
npx expo start -c
```

Escaneie o QR code com o Expo Go. No Expo web (tecla `w`) o app abre em `http://localhost:8081`.

### Configurar o IP para o celular

No celular, `localhost` é o próprio celular, então o app precisa do IP do computador onde a API está rodando:

1. No PC da API, rode `ipconfig` e copie o **Endereço IPv4** do Wi-Fi (ex.: `192.168.0.10`).
2. No arquivo `frontend-mobile/.env`, coloque `EXPO_PUBLIC_API_URL=http://192.168.0.10:8080`.
3. Reinicie o Expo com `npx expo start -c` (o `-c` limpa o cache e lê o `.env` de novo).
4. O celular e o PC precisam estar na mesma rede. Se o Windows perguntar, libere o Java no firewall para rede privada. Para conferir, abra `http://192.168.0.10:8080/api/produtos` no navegador do celular.

O `.env` não vai para o GitHub; o modelo está em `.env.example`. No emulador Android, sem `.env`, o app usa `http://10.0.2.2:8080`.

## Demonstração

1. No Angular, cadastrar "Caderno", categoria Papelaria, quantidade 10, estoque mínimo 3.
2. No Expo, puxar a lista para atualizar e abrir o Caderno.
3. No Expo, registrar uma Saída de 8 unidades (saldo vai para 2).
4. No Angular, clicar em Atualizar: saldo 2 e o produto destacado como "Estoque baixo".
5. No Expo, tentar uma Saída de 3: a API recusa com "Estoque insuficiente: saldo atual de 2 unidade(s)".

## Organização no GitHub

- `main` protegida: tudo entra por Pull Request com aprovação de outro integrante.
- Uma branch por funcionalidade: `feat/api-produtos`, `feat/angular-produtos`, `feat/expo-movimentacao`, `docs/readme`.
- Commits com emoji, tipo e descrição: `:sparkles: feat:`, `:bug: fix:`, `:books: docs:`, `:test_tube: test:`, `:tada: chore:`.
- Cada PR fecha suas issues com `Closes #N`, e o card anda no board de A fazer para Em andamento e Concluído.
