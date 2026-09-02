const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));

const form = document.getElementById("formProducao");
const selectProduto = document.getElementById("produto");
const listaProdutos = document.getElementById("listaProdutos");
const mensagem = document.getElementById("mensagem");

if (!token) {
  window.location.href = "../index.html";
}

if (usuario) {
  document.getElementById("nomeUsuario").textContent =
    "Usuário: " + usuario.nome;
}

async function carregarProdutos() {
  try {
    const resposta = await fetch("http://localhost:3000/produto/listar", {
      headers: {
        Authorization: "Bearer " + token,
      },
    });

    if (!resposta.ok) {
      if (resposta.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("usuario");
        window.location.href = "../index.html";
      }

      return;
    }

    const produtos = await resposta.json();
    produtos.sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", {
        sensitivity: "base",
      })
    );

    selectProduto.innerHTML =
      '<option value="">Selecione um produto</option>';

    listaProdutos.innerHTML = "";

    produtos.forEach((produto) => {
      const option = document.createElement("option");

      option.value = produto.id;
      option.textContent = produto.nome;

      selectProduto.appendChild(option);

      const linha = document.createElement("tr");

      linha.innerHTML = `
        <td>${produto.nome}</td>
        <td>${produto.quantidadeEstoque}</td>
        <td>${produto.estoqueMinimo}</td>
      `;

      listaProdutos.appendChild(linha);
    });
  } catch (erro) {
    mensagem.textContent = "Erro ao carregar produtos";
    mensagem.style.color = "red";
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const produtoId = Number(selectProduto.value);
  const tipo = document.getElementById("tipo").value;
  const quantidade = Number(
    document.getElementById("quantidade").value
  );
  const data = document.getElementById("data").value;

  if (!produtoId || !tipo || !quantidade || !data) {
    mensagem.textContent = "Preencha todos os campos";
    mensagem.style.color = "red";
    return;
  }

  if (quantidade <= 0) {
    mensagem.textContent = "A quantidade deve ser maior que zero";
    mensagem.style.color = "red";
    return;
  }

  const dados = {
    tipo,
    quantidade,
    data,
    produtoId,
    usuarioId: usuario.id,
  };

  try {
    const resposta = await fetch(
      "http://localhost:3000/producao/cadastrar",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(dados),
      }
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      mensagem.textContent =
        resultado.erro || "Erro ao registrar movimentação";
      mensagem.style.color = "red";
      return;
    }

    mensagem.textContent = resultado.mensagem;
    mensagem.style.color = "green";

    if (resultado.alertaEstoque) {
      mensagem.textContent += " " + resultado.alertaEstoque;
      mensagem.style.color = "orange";
    }

    form.reset();

    carregarProdutos();
  } catch (erro) {
    mensagem.textContent = "Erro ao conectar com o servidor";
    mensagem.style.color = "red";
  }
});

document.getElementById("btnSair").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("usuario");

  window.location.href = "../index.html";
});

carregarProdutos();
