const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
  try {
    const { nome, descricao, custo, quantidadeEstoque, estoqueMinimo } =
      req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        erro: "O nome do produto é obrigatório.",
      });
    }

    if (
      custo === undefined ||
      custo === "" ||
      isNaN(Number(custo)) ||
      Number(custo) < 0
    ) {
      return res.status(400).json({
        erro: "O custo deve ser um número válido e não pode ser negativo.",
      });
    }

    if (
      quantidadeEstoque === undefined ||
      quantidadeEstoque === "" ||
      isNaN(Number(quantidadeEstoque)) ||
      Number(quantidadeEstoque) < 0 ||
      !Number.isInteger(Number(quantidadeEstoque))
    ) {
      return res.status(400).json({
        erro: "A quantidade em estoque deve ser um número inteiro válido e não pode ser negativa.",
      });
    }

    if (
      estoqueMinimo === undefined ||
      estoqueMinimo === "" ||
      isNaN(Number(estoqueMinimo)) ||
      Number(estoqueMinimo) < 0 ||
      !Number.isInteger(Number(estoqueMinimo))
    ) {
      return res.status(400).json({
        erro: "O estoque mínimo deve ser um número inteiro válido e não pode ser negativo.",
      });
    }

    const item = await prisma.produto.create({
      data: {
        nome: nome.trim(),
        descricao: descricao ? descricao.trim() : null,
        custo: Number(custo),
        quantidadeEstoque: Number(quantidadeEstoque),
        estoqueMinimo: Number(estoqueMinimo),
      },
    });

    return res.status(201).json(item);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao cadastrar produto.",
    });
  }
};

const listar = async (req, res) => {
  try {
    const lista = await prisma.produto.findMany({
      orderBy: {
        nome: "asc",
      },
    });

    return res.status(200).json(lista);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao listar produtos.",
    });
  }
};

const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        erro: "ID do produto inválido.",
      });
    }

    const item = await prisma.produto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!item) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    return res.status(200).json(item);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar produto.",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;

    const { nome, descricao, custo, quantidadeEstoque, estoqueMinimo } =
      req.body;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        erro: "ID do produto inválido.",
      });
    }

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        erro: "O nome do produto é obrigatório.",
      });
    }

    if (
      custo === undefined ||
      custo === "" ||
      isNaN(Number(custo)) ||
      Number(custo) < 0
    ) {
      return res.status(400).json({
        erro: "O custo deve ser um número válido e não pode ser negativo.",
      });
    }

    if (
      quantidadeEstoque === undefined ||
      quantidadeEstoque === "" ||
      isNaN(Number(quantidadeEstoque)) ||
      Number(quantidadeEstoque) < 0 ||
      !Number.isInteger(Number(quantidadeEstoque))
    ) {
      return res.status(400).json({
        erro: "A quantidade em estoque deve ser um número inteiro válido e não pode ser negativa.",
      });
    }

    if (
      estoqueMinimo === undefined ||
      estoqueMinimo === "" ||
      isNaN(Number(estoqueMinimo)) ||
      Number(estoqueMinimo) < 0 ||
      !Number.isInteger(Number(estoqueMinimo))
    ) {
      return res.status(400).json({
        erro: "O estoque mínimo deve ser um número inteiro válido e não pode ser negativo.",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    const item = await prisma.produto.update({
      where: {
        id: Number(id),
      },
      data: {
        nome: nome.trim(),
        descricao: descricao ? descricao.trim() : null,
        custo: Number(custo),
        quantidadeEstoque: Number(quantidadeEstoque),
        estoqueMinimo: Number(estoqueMinimo),
      },
    });

    return res.status(200).json(item);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao atualizar produto.",
    });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(Number(id)) || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        erro: "ID do produto inválido.",
      });
    }

    const produto = await prisma.produto.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!produto) {
      return res.status(404).json({
        erro: "Produto não encontrado.",
      });
    }

    const producoes = await prisma.producao.count({
      where: {
        produtoId: Number(id),
      },
    });

    if (producoes > 0) {
      return res.status(400).json({
        erro: "Não é possível excluir um produto que possui movimentações de produção.",
      });
    }

    const item = await prisma.produto.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(200).json({
      mensagem: "Produto excluído com sucesso.",
      produto: item,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao excluir produto.",
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
