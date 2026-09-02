require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cors());

const authRoutes = require("./src/routes/auth.routes");
const producaoRoutes = require("./src/routes/producao.routes");
const produtoRoutes = require("./src/routes/produto.routes");
const usuarioRoutes = require("./src/routes/usuario.routes");

app.use("/auth", authRoutes);
app.use("/producao", producaoRoutes);
app.use("/produto", produtoRoutes);
app.use("/usuario", usuarioRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
