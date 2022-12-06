const table = document.getElementById("tabelaPostagens");
const picker = document.getElementById("qtdRegistros");
const btnBuscar = document.getElementById("btnBuscar");
const fldBusca = document.getElementById("fldBusca");
const pnlNavegacao = document.getElementById("pnlNavegacao");
const btnAvancar = document.getElementById("btnAvancar");
const btnVoltar = document.getElementById("btnVoltar");
const btnMdlDeletar = document.getElementById("btnMdlDeletar");
const btnMdlSalvar = document.getElementById("btnMdlSalvar");
const btnNovaPostagem = document.getElementById("btnNovaPostagem");
const arrPostagens = [];
let pgAtual = 0;
let currentPostId = null;

window.addEventListener("load", function () {
  init();
});

picker.addEventListener("change", function (e) {
  exibirPosts();
});

btnBuscar.addEventListener("click", function () {
  buscarPostagensTitulo(fldBusca.value);
});

btnAvancar.addEventListener("click", function () {
  avancarLista();
});

btnVoltar.addEventListener("click", function () {
  voltarLista();
});

btnMdlDeletar.addEventListener("click", function () {
  if (currentPostId == null) {
    return;
  }

  if (!confirm("Deseja excluir a postagem?")) {
    return;
  }

  fetch("https://localhost:4567/postagem/" + currentPostId, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      init();
    })
    .catch((erro) => {
      console.log(Error(erro));
    });
});

btnMdlSalvar.addEventListener("click", function () {
  if (isEmptyOrSpaces(document.getElementById("mdlInputTitulo").value)) {
    alert("Informe o título.");
    return;
  }

  if (isEmptyOrSpaces(document.getElementById("mdlInputMensagem").value)) {
    alert("Informe a mensagem.");
    return;
  }

  if (currentPostId != null) {
    atualizarPostagem();
  } else {
    inserirPostagem();
  }
});

btnNovaPostagem.addEventListener("click", function () {
  clearPopUp();
});

function tratarExibicaoNavegacao() {
  pnlNavegacao.classList.remove("ocultar");
  if (arrPostagens.length <= picker.value) {
    pnlNavegacao.classList.add("ocultar");
    return;
  }
}

function avancarLista() {
  if ((pgAtual + 1) * picker.value > arrPostagens.length - 1) {
    return;
  }

  pgAtual++;
  exibirPosts();
}

function voltarLista() {
  if (pgAtual == 0) {
    return;
  }

  pgAtual--;
  exibirPosts();
}

function getTotalPaginas() {
  return Math.ceil(arrPostagens.length / picker.value);
}

function exibirPosts() {
  limparTabela();
  tratarExibicaoNavegacao();
  const qtd = picker.value;
  const min = pgAtual * qtd;
  const max = parseInt(pgAtual) * parseInt(qtd) + parseInt(qtd);
  for (let i = min; i < max && i < arrPostagens.length; i++) {
    carregarPostagem(arrPostagens[i]);
  }
  addRowHandlers();
}

function buscarPostagensTitulo(titulo) {
  if (titulo == null) titulo = "";

  titulo = titulo.trim();
  let url = "https://localhost:4567/postagem";

  if (!isEmptyOrSpaces(titulo)) {
    url = url.concat("?title=").concat(titulo);
  }

  limparBusca();

  fetch(url)
    .then((response) => response.json())
    .then((retorno) => {
      Array.from(retorno).forEach((postagem) => {
        arrPostagens.push(postagem);
      });
      exibirPosts();
    })
    .catch((erro) => {
      console.log(Error(erro));
    });
}

function buscarPostagens() {
  limparBusca();

  fetch("https://localhost:4567/postagem")
    .then((response) => response.json())
    .then((retorno) => {
      Array.from(retorno).forEach((postagem) => {
        arrPostagens.push(postagem);
      });
      exibirPosts();
    })
    .catch((erro) => {
      console.log(Error(erro));
    });
}

function limparBusca() {
  arrPostagens.length = 0;
  pgAtual = 0;
}

function limparTabela() {
  const tBody = table.getElementsByTagName("tbody")[0];
  while (tBody.firstChild) {
    tBody.removeChild(tBody.firstChild);
  }
}

function carregarPostagem(postagem) {
  const row = table.getElementsByTagName("tbody")[0].insertRow(table.length);
  row.classList.add("content");
  row.setAttribute("data-toggle", "modal");
  row.setAttribute("data-target", "#janelaModal");
  // row.setAttribute("data-id", j);

  const colId = row.insertCell(0);
  const colTitulo = row.insertCell(1);
  const colCategorias = row.insertCell(2);
  const colConteudo = row.insertCell(3);
  const colVersao = row.insertCell(4);

  colId.innerHTML = postagem.id;
  colTitulo.innerHTML = postagem.title;
  colCategorias.innerHTML = postagem.categories;
  colConteudo.innerHTML = postagem.content;
  colVersao.innerHTML = postagem.version;

  colId.classList.add("numero");
  colVersao.classList.add("numero");
}

function atualizarPostagem() {
  const url = "https://localhost:4567/postagem/" + currentPostId;
  fetch(url, {
    method: "PUT",
    body: JSON.stringify({
      id: currentPostId,
      title: document.getElementById("mdlInputTitulo").value,
      content: document.getElementById("mdlInputMensagem").value,
      categories: document.getElementById("mdlInputTags").value.split(","),
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then(() => init());
}

function inserirPostagem() {
  fetch("https://localhost:4567/postagem", {
    method: "POST",
    body: JSON.stringify({
      title: document.getElementById("mdlInputTitulo").value,
      content: document.getElementById("mdlInputMensagem").value,
      categories: document.getElementById("mdlInputTags").value.split(","),
    }),
    headers: { "Content-type": "application/json; charset=UTF-8" },
  }).then(() => init());
}

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}

function addRowHandlers() {
  Array.from(table.rows).forEach((row) => {
    row.onclick = (function () {
      return function () {
        clearPopUp();
        document.getElementById("mdlInputTitulo").value = this.cells[1].innerHTML;
        document.getElementById("mdlInputTags").value = this.cells[2].innerHTML;
        document.getElementById("mdlInputMensagem").value = this.cells[3].innerHTML;
        currentPostId = this.cells[0].innerHTML;
      };
    })(row);
  });
}

function clearPopUp() {
  document.getElementById("mdlInputTitulo").value = "";
  document.getElementById("mdlInputTags").value = "";
  document.getElementById("mdlInputMensagem").value = "";
  currentPostId = null;
}

function init() {
  picker.value = 50;
  fldBusca.value = "";
  buscarPostagens();
}
