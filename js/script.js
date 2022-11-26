const table = document.getElementById("tabelaPostagens");
const picker = document.getElementById("qtdRegistros");
const btnBuscar = document.getElementById("btnBuscar");
const fldBusca = document.getElementById("fldBusca");
const arrPostagens = [];
let pgAtual = 0;

window.addEventListener("load", function () {
  buscarPostagens();
  exibirPosts();
  console.log(arrPostagens);
});

picker.addEventListener("change", function (e) {
  exibirPosts();
});

btnBuscar.addEventListener("click", function () {
  buscarPostagensPorTitulo(fldBusca.value);
});

function exibirPosts() {
  limparTabela();
  const qtd = picker.value;
  for (let i = 0; i < qtd; i++) {
    if (i == arrPostagens.length) {
      break;
    }
    carregarPostagem(arrPostagens[i]);
  }
}

function buscarPostagensPorTitulo(titulo) {
  titulo = titulo.trim();
  let url = "https://localhost:4567/postagem";

  if (!isEmptyOrSpaces(titulo)) {
    url = url.concat("?title=").concat(titulo);
  }

  limparArray();
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
  limparArray();
  fetch("https://localhost:4567/postagem")
    .then((response) => response.json())
    .then((retorno) => {
      Array.from(retorno).forEach((postagem) => {
        arrPostagens.push(postagem);
      });
    })
    .catch((erro) => {
      console.log(Error(erro));
    });
}

function limparArray() {
  arrPostagens.length = 0;
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

/* funções de teste */
function exibirTodosPosts() {
  fetch("https://localhost:4567/postagem")
    .then((response) => response.json())
    .then((retorno) => {
      Array.from(retorno).forEach((postagem) => {
        carregarPostagem(postagem);
      });
    })
    .catch((erro) => {
      console.log(Error(erro));
    });
}
