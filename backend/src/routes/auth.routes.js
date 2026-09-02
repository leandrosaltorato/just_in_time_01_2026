const express = require("express");

const router = express.Router();

const {
  login,
  logout,
  usuarioLogado,
} = require("../controllers/auth.controller");

const autenticar = require("../middlewares/auth.middleware");

router.post("/login", login);
router.post("/logout", autenticar, logout);
router.get("/usuario", autenticar, usuarioLogado);

module.exports = router;
