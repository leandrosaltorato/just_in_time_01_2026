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
