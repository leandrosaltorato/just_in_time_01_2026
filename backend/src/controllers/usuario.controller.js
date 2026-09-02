const prisma = require("../data/prisma");

const cadastrar = async (req, res) => {
  try {
    const { nome, email, senha } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        erro: "O nome é obrigatório.",
      });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({
        erro: "O email é obrigatório.",
      });
    }

    if (!senha || senha.length < 6) {
      return res.status(400).json({
        erro: "A senha deve ter pelo menos 6 caracteres.",
      });
    }

    const usuarioExistente = await prisma.usuario.findUnique({
      where: {
        email: email.trim(),
      },
    });

    if (usuarioExistente) {
      return res.status(409).json({
        erro: "Este email já está cadastrado.",
      });
    }

    const item = await prisma.usuario.create({
      data: {
        nome: nome.trim(),
        email: email.trim(),
        senha,
      },
    });

    return res.status(201).json({
      id: item.id,
      nome: item.nome,
      email: item.email,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao cadastrar usuário.",
    });
  }
};

const listar = async (req, res) => {
  try {
    const lista = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return res.status(200).json(lista);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao listar usuários.",
    });
  }
};

const buscar = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.usuario.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    if (!item) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    return res.status(200).json(item);
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar usuário.",
    });
  }
};

const atualizar = async (req, res) => {
  try {
    const { id } = req.params;
    const { nome, email, senha } = req.body;

    if (!nome || nome.trim() === "") {
      return res.status(400).json({
        erro: "O nome é obrigatório.",
      });
    }

    if (!email || email.trim() === "") {
      return res.status(400).json({
        erro: "O email é obrigatório.",
      });
    }

    const dados = {
      nome: nome.trim(),
      email: email.trim(),
    };

    if (senha) {
      if (senha.length < 6) {
        return res.status(400).json({
          erro: "A senha deve ter pelo menos 6 caracteres.",
        });
      }

      dados.senha = senha;
    }

    const item = await prisma.usuario.update({
      where: {
        id: Number(id),
      },
      data: dados,
    });

    return res.status(200).json({
      id: item.id,
      nome: item.nome,
      email: item.email,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao atualizar usuário.",
    });
  }
};

const excluir = async (req, res) => {
  try {
    const { id } = req.params;

    const item = await prisma.usuario.delete({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return res.status(200).json({
      mensagem: "Usuário excluído com sucesso.",
      usuario: item,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao excluir usuário.",
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
