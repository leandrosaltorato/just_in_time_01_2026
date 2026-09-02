const express = require("express");
const autenticar = require("../middlewares/auth.middleware");

const router = express.Router();

const {
  cadastrar,
  listar,
  buscar,
  atualizar,
  excluir,
} = require("../controllers/produto.controller");

router.post("/cadastrar", autenticar, cadastrar);
router.get("/listar", autenticar, listar);
router.get("/buscar/:id", autenticar, buscar);
router.put("/atualizar/:id", autenticar, atualizar);
router.delete("/excluir/:id", autenticar, excluir);

module.exports = router;
