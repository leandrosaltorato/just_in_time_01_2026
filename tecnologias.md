# 3 - Script de Criação e População do Banco de Dados

## 3.1 Banco de Dados

O sistema utiliza o banco de dados MySQL com o nome `preparacao_db`

O banco de dados é executado localmente através do XAMPP

A comunicação entre o sistema e o banco de dados é realizada utilizando o Prisma ORM

## 3.2 Tecnologias utilizadas no banco de dados

- SGBD: MySQL
- Ambiente: XAMPP
- ORM: Prisma
- Banco de dados: `preparacao_db`

## 3.3 Modelagem

O banco de dados possui as entidades necessárias para o funcionamento do sistema, incluindo:

- Usuário
- Produto
- Produção

A tabela de Produção possui relacionamentos com Usuário e Produto por meio de chaves estrangeiras

## 3.4 Requisitos do banco de dados

- O banco de dados deve possuir o nome `preparacao_db`
- As tabelas devem possuir suas respectivas chaves primárias
- Os relacionamentos devem utilizar chaves estrangeiras
- Os campos obrigatórios devem possuir restrição de preenchimento
- A tabela Produto deve armazenar nome, descrição, custo, quantidade em estoque e estoque mínimo
- A tabela Produção deve armazenar o tipo de movimentação, quantidade, data, produto e usuário responsável
- A tabela Usuário deve armazenar os dados necessários para autenticação
- Cada tabela criada deve possuir pelo menos três registros para atender aos requisitos da avaliação

## 3.5 Prisma

O Prisma é utilizado como ORM para facilitar a comunicação entre o Backend e o banco de dados MySQL

A estrutura das tabelas é definida no arquivo:

`prisma/schema.prisma`
```
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
}

model Usuario {
  id        Int        @id @default(autoincrement())
  nome      String
  email     String     @unique
  senha     String
  producoes Producao[]
}

model Produto {
  id                Int        @id @default(autoincrement())
  nome              String
  descricao         String?
  custo             Decimal    @db.Decimal(10, 2)
  quantidadeEstoque Int        @default(0)
  estoqueMinimo     Int        @default(0)
  producoes         Producao[]
}

enum TipoMovimentacao {
  fabricado
  pedido
}

model Producao {
  id         Int              @id @default(autoincrement())
  tipo       TipoMovimentacao
  quantidade Int
  data       DateTime

  produto   Produto @relation(fields: [produtoId], references: [id])
  produtoId Int
  usuario   Usuario @relation(fields: [usuarioId], references: [id])
  usuarioId Int
}

```

Os dados iniciais utilizados para população do banco de dados são definidos no arquivo:

`prisma/seed.js`
```
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { PrismaMariaDb } = require("@prisma/adapter-mariadb");

const adapter = new PrismaMariaDb({
  host: "localhost",
  user: "root",
  database: "preparacao_db",
  connectionLimit: 5,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const ana = await prisma.usuario.create({
    data: {
      nome: "Ana Souza",
      email: "ana.souza@mdffabrica.com",
      senha: "123456",
    },
  });

  const carlos = await prisma.usuario.create({
    data: {
      nome: "Carlos Lima",
      email: "carlos.lima@mdffabrica.com",
      senha: "senha123",
    },
  });

  const beatriz = await prisma.usuario.create({
    data: {
      nome: "Beatriz Alves",
      email: "beatriz.alves@mdffabrica.com",
      senha: "senha456",
    },
  });

  const prateleira = await prisma.produto.create({
    data: {
      nome: "Prateleira MDF 60cm",
      descricao: "Prateleira em MDF branco, 60cm de largura",
      custo: 45.90,
      quantidadeEstoque: 50,
      estoqueMinimo: 10,
    },
  });

  const painel = await prisma.produto.create({
    data: {
      nome: "Painel MDF 15mm",
      descricao: "Chapa de MDF cru, 15mm de espessura",
      custo: 120.00,
      quantidadeEstoque: 30,
      estoqueMinimo: 5,
    },
  });

  const porta = await prisma.produto.create({
    data: {
      nome: "Porta MDF Ripada",
      descricao: "Porta em MDF ripado, acabamento fosco",
      custo: 210.50,
      quantidadeEstoque: 15,
      estoqueMinimo: 5,
    },
  });

  await prisma.producao.create({
    data: {
      produtoId: prateleira.id,
      usuarioId: ana.id,
      tipo: "fabricado",
      quantidade: 20,
      data: new Date("2026-08-10"),
    },
  });

  await prisma.producao.create({
    data: {
      produtoId: painel.id,
      usuarioId: carlos.id,
      tipo: "pedido",
      quantidade: 10,
      data: new Date("2026-08-15"),
    },
  });

  await prisma.producao.create({
    data: {
      produtoId: porta.id,
      usuarioId: beatriz.id,
      tipo: "fabricado",
      quantidade: 5,
      data: new Date("2026-08-20"),
    },
  });

  console.log("seed concluido com sucesso");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

```

## 3.6 Configuração da conexão

A conexão com o banco de dados é realizada através da variável de ambiente configurada no arquivo `.env`

Exemplo de configuração:

```env
DATABASE_URL="mysql://root:@localhost:3306/preparacao_db"
