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
        erro: "tipo de movimentação inválido",
      });
    }

    const quantidadeNumero = Number(quantidade);

    if (quantidadeNumero <= 0 || !Number.isInteger(quantidadeNumero)) {
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
        erro: "usuário não encontrado",
      });
    }

    let novaQuantidade = produto.quantidadeEstoque;

    // FABRICADO aumenta o estoque
    if (tipo === "fabricado") {
      novaQuantidade = produto.quantidadeEstoque + quantidadeNumero;
    }

    // PEDIDO diminui o estoque
    if (tipo === "pedido") {
      // Primeiro verifica se existe estoque suficiente
      if (quantidadeNumero > produto.quantidadeEstoque) {
        return res.status(400).json({
          erro: "estoque insuficiente",
          estoqueAtual: produto.quantidadeEstoque,
          quantidadeSolicitada: quantidadeNumero,
        });
      }

      novaQuantidade = produto.quantidadeEstoque - quantidadeNumero;

      // Impede que o pedido deixe o estoque abaixo do mínimo
      if (novaQuantidade < produto.estoqueMinimo) {
        return res.status(400).json({
          erro: "pedido não permitido: o estoque ficará abaixo do mínimo",
          estoqueAtual: produto.quantidadeEstoque,
          estoqueMinimo: produto.estoqueMinimo,
          quantidadeSolicitada: quantidadeNumero,
          estoqueAposPedido: novaQuantidade,
        });
      }
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
          quantidade: quantidadeNumero,
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
      alerta: estoqueBaixo ? "atenção: estoque abaixo do mínimo" : null,
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

    const quantidadeNova = Number(quantidade);

    if (quantidadeNova <= 0 || !Number.isInteger(quantidadeNova)) {
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

    const produto = await prisma.produto.findUnique({
      where: {
        id: item.produtoId,
      },
    });

    if (!produto) {
      return res.status(404).json({
        erro: "produto não encontrado",
      });
    }

    /*
     * Primeiro desfaz o efeito da movimentação antiga.
     *
     * fabricado antigo -> remove do estoque
     * pedido antigo    -> devolve ao estoque
     */
    let estoqueBase = produto.quantidadeEstoque;

    if (item.tipo === "fabricado") {
      estoqueBase -= item.quantidade;
    }

    if (item.tipo === "pedido") {
      estoqueBase += item.quantidade;
    }

    /*
     * Agora aplica a nova movimentação.
     */
    let novoEstoque = estoqueBase;

    if (tipo === "fabricado") {
      novoEstoque += quantidadeNova;
    }

    if (tipo === "pedido") {
      if (quantidadeNova > estoqueBase) {
        return res.status(400).json({
          erro: "estoque insuficiente para atualizar o pedido",
          estoqueDisponivel: estoqueBase,
          quantidadeSolicitada: quantidadeNova,
        });
      }

      novoEstoque = estoqueBase - quantidadeNova;

      if (novoEstoque < produto.estoqueMinimo) {
        return res.status(400).json({
          erro: "alteração não permitida: o estoque ficará abaixo do mínimo",
          estoqueAtual: produto.quantidadeEstoque,
          estoqueMinimo: produto.estoqueMinimo,
          quantidadeSolicitada: quantidadeNova,
          estoqueAposAlteracao: novoEstoque,
        });
      }
    }

    const resultado = await prisma.$transaction(async (tx) => {
      const produtoAtualizado = await tx.produto.update({
        where: {
          id: produto.id,
        },
        data: {
          quantidadeEstoque: novoEstoque,
        },
      });

      const movimentacaoAtualizada = await tx.producao.update({
        where: {
          id: Number(id),
        },
        data: {
          tipo,
          quantidade: quantidadeNova,
          data: new Date(data),
        },
      });

      return {
        producao: movimentacaoAtualizada,
        produto: produtoAtualizado,
      };
    });

    return res.status(200).json({
      mensagem: "movimentação atualizada com sucesso",
      ...resultado,
    });
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
        erro: "movimentação não encontrada",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: item.produtoId,
      },
    });

    if (!produto) {
      return res.status(404).json({
        erro: "produto não encontrado",
      });
    }

    /*
     * Ao excluir:
     *
     * fabricado -> remove a quantidade que havia sido adicionada
     * pedido    -> devolve a quantidade que havia sido retirada
     */
    let novoEstoque = produto.quantidadeEstoque;

    if (item.tipo === "fabricado") {
      novoEstoque -= item.quantidade;
    }

    if (item.tipo === "pedido") {
      novoEstoque += item.quantidade;
    }

    if (novoEstoque < 0) {
      return res.status(400).json({
        erro: "não é possível excluir esta movimentação pois o estoque ficaria negativo",
      });
    }

    const resultado = await prisma.$transaction(async (tx) => {
      await tx.producao.delete({
        where: {
          id: Number(id),
        },
      });

      const produtoAtualizado = await tx.produto.update({
        where: {
          id: produto.id,
        },
        data: {
          quantidadeEstoque: novoEstoque,
        },
      });

      return produtoAtualizado;
    });

    return res.status(200).json({
      mensagem: "movimentação excluída com sucesso",
      produto: resultado,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "erro ao excluir movimentação",
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
