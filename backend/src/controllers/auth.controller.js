const prisma = require("../data/prisma");
const jwt = require("jsonwebtoken");

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({
        erro: "Email e senha são obrigatórios.",
      });
    }

    const usuario = await prisma.usuario.findUnique({
      where: {
        email: email.trim(),
      },
    });

    if (!usuario || usuario.senha !== senha) {
      return res.status(401).json({
        erro: "Email ou senha inválidos.",
      });
    }

    const token = jwt.sign(
      {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2h",
      },
    );

    return res.status(200).json({
      mensagem: "Login realizado com sucesso.",
      token,
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
      },
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao realizar login.",
    });
  }
};

const usuarioLogado = async (req, res) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        id: req.usuario.id,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        erro: "Usuário não encontrado.",
      });
    }

    return res.status(200).json({
      usuario,
    });
  } catch (erro) {
    console.error(erro);

    return res.status(500).json({
      erro: "Erro ao buscar usuário.",
    });
  }
};

const logout = (req, res) => {
  return res.status(200).json({
    mensagem: "Logout realizado com sucesso.",
  });
};

module.exports = {
  login,
  logout,
  usuarioLogado,
};
