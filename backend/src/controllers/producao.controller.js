const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
  try {
    const { tipo, quantidade, data, produtoId, usuarioId } = req.body;

    if (!tipo || !quantidade || !data || !produtoId || !usuarioId) {
      return res.status(400).json({
        erro: "todos os campos são obrigatórios",
      });
    }

    if (tipo !== "fabricado" && tipo !== "pedido") {
      return res.status(400).json({
        erro: "tipo de movimentação invalido",
      });
    }

    if (Number(quantidade) <= 0 || !Number.isInteger(Number(quantidade))) {
      return res.status(400).json({
        erro: "a quantidade deve ser um número inteiro maior que zero",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: Number(produtoId),
      },
    });

    if (!produto) {
      return res.status(404).json({
        erro: "produto não encontrado",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        id: Number(usuarioId),
      },
    });

    if (!usuario) {
      return res.status(404).json({
        erro: "usuário nao encontrado",
      });
    }

    let novaQuantidade = produto.quantidadeEstoque;

    if (tipo === "fabricado") {
      novaQuantidade += Number(quantidade);
    }

    if (tipo === "pedido") {
      if (Number(quantidade) > produto.quantidadeEstoque) {
        return res.status(400).json({
          erro: "estoque insuficiente",
        });
      }

      novaQuantidade -= Number(quantidade);
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const produtoAtualizado = await tx.produto.update({
        where: {
          id: Number(produtoId),
        },
        data: {
          quantidadeEstoque: novaQuantidade,
        },
      });

      const producao = await tx.producao.create({
        data: {
          tipo,
          quantidade: Number(quantidade),
          data: new Date(data),
          produtoId: Number(produtoId),
          usuarioId: Number(usuarioId),
        },
      });

      return {
        producao,
        produto: produtoAtualizado,
      };
    });

    const estoqueBaixo = novaQuantidade < produto.estoqueMinimo;

    return res.status(201).json({
      mensagem: "movimentação registrada com sucesso.",
      ...resultado,
      alerta: estoqueBaixo ? "atenção: estoque abaixo do minimo" : null,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "erro ao registrar movimentação.",
    });
  }
};

const listar = async (req, res) => {
  try {
    const lista = await prisma.producao.findMany({
      include: {
        produto: true,
        usuario: true,
      },
      orderBy: {
        data: "desc",
      },
    });

    return res.status(200).json(lista);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "erro ao listar movimentações",
    });
  }
};

const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.producao.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        produto: true,
        usuario: true,
      },
    });

    if (!item) {
      return res.status(404).json({
        erro: "movimentação não encontrada",
      });
    }

    return res.status(200).json(item);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "erro ao buscar movimentação",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { tipo, quantidade, data } = req.body;

    if (!tipo || !quantidade || !data) {
      return res.status(400).json({
        erro: "tipo, quantidade e data são obrigatórios",
      });
    }

    if (tipo !== "fabricado" && tipo !== "pedido") {
      return res.status(400).json({
        erro: "tipo de movimentação inválido",
      });
    }

    if (Number(quantidade) <= 0 || !Number.isInteger(Number(quantidade))) {
      return res.status(400).json({
        erro: "a quantidade deve ser um número inteiro maior que zero",
      });
    }

    const item = await prisma.producao.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!item) {
      return res.status(404).json({
        erro: "movimentação não encontrada",
      });
    }

    const atualizada = await prisma.producao.update({
      where: {
        id: Number(id),
      },
      data: {
        tipo,
        quantidade: Number(quantidade),
        data: new Date(data),
      },
    });

    return res.status(200).json(atualizada);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "erro ao atualizar movimentação",
    });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.producao.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!item) {
      return res.status(404).json({
        erro: "Movimentação não encontrada.",
      });
    }

    await prisma.producao.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: "movimentação excluida com sucesso",
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao excluir movimentação.",
    });
  }
};

module.exports = {
  cadastrar,
  listar,
  buscar,
  atualizar,
  excluir,
};
