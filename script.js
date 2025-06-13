document.addEventListener("DOMContentLoaded", () => {
  preencherDataHora();
  carregarAvaliacoes();
});

function preencherDataHora() {
  const agora = new Date();
  const dataHora = agora.toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit"
  });
  document.getElementById("dataHora").value = dataHora;
}

function salvarAvaliacao() {
  const dados = obterDadosFormulario();
  if (!dados.nome) {
    alert("Nome é obrigatório.");
    return;
  }

  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  avaliacoes.push(dados);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));

  mostrarMensagemSucesso();
  limparCampos();
  carregarAvaliacoes();
}

function obterDadosFormulario() {
  const getVal = id => document.getElementById(id).value.trim();
  const check = id => document.getElementById(id).checked;

  const checarOuTexto = (idInput, idCheck, texto) => check(idCheck) ? texto : getVal(idInput);

  return {
    nome: getVal("nome"),
    documento: getVal("documento"),
    endereco: getVal("endereco"),
    dataHora: getVal("dataHora"),

    pressao: checarOuTexto("pressao", "pressaoPrejudicado", "prejudicado"),
    frequencia: checarOuTexto("frequencia", "frequenciaPrejudicado", "prejudicado"),
    saturacao: checarOuTexto("saturacao", "saturacaoPrejudicado", "prejudicado"),
    respiracao: checarOuTexto("respiracao", "respiracaoPrejudicado", "prejudicado"),
    glasgow: check("glasgowPrejudicado") ? "prejudicado" : getVal("glasgow"),

    observacao: getVal("observacao")
  };
}

function limparCampos() {
  const campos = ["nome", "documento", "endereco", "pressao", "frequencia", "saturacao", "respiracao", "glasgow", "observacao"];
  campos.forEach(id => document.getElementById(id).value = "");
  ["pressaoPrejudicado", "frequenciaPrejudicado", "saturacaoPrejudicado", "respiracaoPrejudicado", "glasgowPrejudicado"]
    .forEach(id => document.getElementById(id).checked = false);
  preencherDataHora();
}

function mostrarMensagemSucesso() {
  const msg = document.getElementById("mensagem-sucesso");
  msg.classList.remove("oculto");
  setTimeout(() => msg.classList.add("oculto"), 3000);
}

function carregarAvaliacoes(filtro = "") {
  const lista = document.getElementById("lista-avaliacoes");
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");

  lista.innerHTML = "";
  avaliacoes
    .filter(a => a.nome.toLowerCase().includes(filtro.toLowerCase()) || a.documento.includes(filtro))
    .forEach((a, index) => {
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${a.nome}</strong><br>
        <small>${a.dataHora}</small><br>
        <button onclick="copiarEvolucao(${index})">Copiar Evolução</button>
        <button onclick="editarAvaliacao(${index})">Editar</button>
        <button onclick="excluirAvaliacao(${index})">Excluir</button>
      `;
      lista.appendChild(li);
    });
}

function filtrarAvaliacoes() {
  const termo = document.getElementById("pesquisa").value;
  carregarAvaliacoes(termo);
}

function editarAvaliacao(index) {
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  const a = avaliacoes[index];

  document.getElementById("nome").value = a.nome;
  document.getElementById("documento").value = a.documento;
  document.getElementById("endereco").value = a.endereco;
  document.getElementById("dataHora").value = a.dataHora;

  const preencherCampo = (campo, valor, idCheck) => {
    if (valor === "prejudicado") {
      document.getElementById(idCheck).checked = true;
      document.getElementById(campo).value = "";
    } else {
      document.getElementById(campo).value = valor;
      document.getElementById(idCheck).checked = false;
    }
  };

  preencherCampo("pressao", a.pressao, "pressaoPrejudicado");
  preencherCampo("frequencia", a.frequencia, "frequenciaPrejudicado");
  preencherCampo("saturacao", a.saturacao, "saturacaoPrejudicado");
  preencherCampo("respiracao", a.respiracao, "respiracaoPrejudicado");
  preencherCampo("glasgow", a.glasgow, "glasgowPrejudicado");

  document.getElementById("observacao").value = a.observacao;

  avaliacoes.splice(index, 1);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  carregarAvaliacoes();
}

function excluirAvaliacao(index) {
  if (!confirm("Deseja excluir esta avaliação?")) return;

  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  avaliacoes.splice(index, 1);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  carregarAvaliacoes();
}

function copiarEvolucao(index) {
  const a = JSON.parse(localStorage.getItem("avaliacoes") || "[]")[index];
  const texto = 
`🧍‍♂️ Nome: ${a.nome}
🪪 Documento: ${a.documento}
📍 Endereço: ${a.endereco}
🕐 Data/Hora: ${a.dataHora}

🩺 Pressão: ${a.pressao}
❤️ Frequência: ${a.frequencia}
🫁 Saturação: ${a.saturacao}
💨 Respiração: ${a.respiracao}
🧠 Glasgow: ${a.glasgow}

📝 Observações:
${a.observacao}`;

  navigator.clipboard.writeText(texto).then(() => alert("Evolução copiada para área de transferência!"));
}
