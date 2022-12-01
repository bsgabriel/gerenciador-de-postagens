const table = document.getElementById("tabelaPostagens");
const picker = document.getElementById("qtdRegistros");
const btnBuscar = document.getElementById("btnBuscar");
const fldBusca = document.getElementById("fldBusca");
const pnlNavegacao = document.getElementById("pnlNavegacao");
const btnAvancar = document.getElementById("btnAvancar");
const btnVoltar = document.getElementById("btnVoltar");
const arrPostagens = [];
let pgAtual = 0;

window.addEventListener("load", function () {
  picker.value = 50;
  fldBusca.value = "";
  buscarPostagens();
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

function isEmptyOrSpaces(str) {
  return str === null || str.match(/^ *$/) !== null;
}
