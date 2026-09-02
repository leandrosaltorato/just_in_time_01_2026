const token = localStorage.getItem("token");
const usuario = JSON.parse(localStorage.getItem("usuario"));

const listaProdutos = document.getElementById("listaProdutos");
const formProduto = document.getElementById("formProduto");
const mensagem = document.getElementById("mensagem");

let produtos = [];

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

    produtos = await resposta.json();

    // Ordena os produtos em ordem alfabética pelo nome
    produtos.sort((a, b) =>
      a.nome.localeCompare(b.nome, "pt-BR", {
        sensitivity: "base",
      }),
    );

    mostrarProdutos(produtos);
  } catch (erro) {
    mensagem.textContent = "Erro ao carregar produtos.";
    mensagem.style.color = "red";
  }
}

function mostrarProdutos(lista) {
  listaProdutos.innerHTML = "";

  lista.forEach((produto) => {
    const linha = document.createElement("tr");

    linha.innerHTML = `
      <td>${produto.nome}</td>
      <td>${produto.descricao || ""}</td>
      <td>R$ ${Number(produto.custo).toFixed(2)}</td>
      <td>${produto.quantidadeEstoque}</td>
      <td>${produto.estoqueMinimo}</td>
      <td>
        <button onclick="editarProduto(${produto.id})">Editar</button>
        <button onclick="excluirProduto(${produto.id})">Excluir</button>
      </td>
    `;

    listaProdutos.appendChild(linha);
  });
}

document.getElementById("btnBuscar").addEventListener("click", () => {
  const termo = document.getElementById("busca").value.toLowerCase().trim();

  const resultado = produtos.filter((produto) =>
    produto.nome.toLowerCase().includes(termo),
  );

  mostrarProdutos(resultado);
});

document.getElementById("btnLimpar").addEventListener("click", () => {
  document.getElementById("busca").value = "";
  mostrarProdutos(produtos);
});

formProduto.addEventListener("submit", async (event) => {
  event.preventDefault();

  const id = document.getElementById("produtoId").value;
  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const custo = Number(document.getElementById("custo").value);

  const quantidadeEstoque = Number(
    document.getElementById("quantidadeEstoque").value,
  );

  const estoqueMinimo = Number(document.getElementById("estoqueMinimo").value);

  if (!nome) {
    alert("Informe o nome do produto.");
    return;
  }

  if (isNaN(custo) || custo < 0) {
    alert("Informe um custo válido.");
    return;
  }

  if (isNaN(quantidadeEstoque) || quantidadeEstoque < 0) {
    alert("Informe uma quantidade de estoque válida.");
    return;
  }

  if (isNaN(estoqueMinimo) || estoqueMinimo < 0) {
    alert("Informe um estoque mínimo válido.");
    return;
  }

  const dados = {
    nome,
    descricao,
    custo,
    quantidadeEstoque,
    estoqueMinimo,
  };

  try {
    let resposta;

    if (id) {
      resposta = await fetch(`http://localhost:3000/produto/atualizar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(dados),
      });
    } else {
      resposta = await fetch("http://localhost:3000/produto/cadastrar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(dados),
      });
    }

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.erro || "Erro ao salvar produto.");
      return;
    }

    mensagem.textContent = id
      ? "Produto atualizado com sucesso."
      : "Produto cadastrado com sucesso.";

    mensagem.style.color = "green";

    limparFormulario();

    carregarProdutos();
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
});

function editarProduto(id) {
  const produto = produtos.find((item) => item.id === id);

  if (!produto) {
    return;
  }

  document.getElementById("produtoId").value = produto.id;
  document.getElementById("nome").value = produto.nome;
  document.getElementById("descricao").value = produto.descricao || "";
  document.getElementById("custo").value = produto.custo;
  document.getElementById("quantidadeEstoque").value =
    produto.quantidadeEstoque;
  document.getElementById("estoqueMinimo").value = produto.estoqueMinimo;

  document.getElementById("btnSalvar").textContent = "Atualizar";

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

async function excluirProduto(id) {
  const confirmar = confirm("Deseja realmente excluir este produto?");

  if (!confirmar) {
    return;
  }

  try {
    const resposta = await fetch(
      `http://localhost:3000/produto/excluir/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + token,
        },
      },
    );

    const resultado = await resposta.json();

    if (!resposta.ok) {
      alert(resultado.erro || "Erro ao excluir produto.");
      return;
    }

    alert("Produto excluído com sucesso.");

    carregarProdutos();
  } catch (erro) {
    alert("Erro ao conectar com o servidor.");
  }
}

function limparFormulario() {
  document.getElementById("produtoId").value = "";
  document.getElementById("nome").value = "";
  document.getElementById("descricao").value = "";
  document.getElementById("custo").value = "";
  document.getElementById("quantidadeEstoque").value = "";
  document.getElementById("estoqueMinimo").value = "";

  document.getElementById("btnSalvar").textContent = "Cadastrar";
}

document.getElementById("btnCancelar").addEventListener("click", () => {
  limparFormulario();
});

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

carregarProdutos();
