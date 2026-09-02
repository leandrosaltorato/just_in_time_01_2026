const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));

if (!token) {
  window.location.href = "../index.html";
}

if (usuario) {
  document.getElementById("nomeUsuario").textContent =
    "Usuário: " + usuario.nome;
}

document.getElementById("btnSair").addEventListener("click", async () => {
  try {
    await fetch("http://localhost:3000/auth/logout", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + token,
      },
    });
  } catch (erro) {
    console.error(erro);
  }

  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "../index.html";
});
