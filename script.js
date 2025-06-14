let avaliacoes = JSON.parse(localStorage.getItem('avaliacoes')) || [];
let editandoIndex = null;

document.addEventListener("DOMContentLoaded", () => {
  atualizarListaAvaliacoes();
});

function formatarCPFouDoc(valor) {
  const cpfLimpo = valor.replace(/\D/g, '');
  if (cpfLimpo.length === 11) {
    return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
  }
  return valor;
}

function salvarAvaliacao() {
  const data = new Date();
  const horario = data.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const dados = {
    nome: document.getElementById('nome').value.trim(),
    documento: formatarCPFouDoc(document.getElementById('documento').value),
    endereco: document.getElementById('endereco').value.trim(),
    protocolo: document.getElementById('protocolo').value.trim(),
    pressao: document.getElementById('prej_pressao').checked ? 'prejudicado' : document.getElementById('pressao').value,
    frequencia: document.getElementById('prej_frequencia').checked ? 'prejudicado' : document.getElementById('frequencia').value,
    saturacao: document.getElementById('prej_saturacao').checked ? 'prejudicado' : document.getElementById('saturacao').value,
    respiracao: document.getElementById('prej_respiracao').checked ? 'prejudicado' : document.getElementById('respiracao').value,
    glasgow: document.getElementById('glasgow').value,
    observacao: document.getElementById('observacao').value.trim(),
    regulador: document.getElementById('regulador').value.trim(),
    senha: document.getElementById('senha').value.trim(),
    unidade: document.getElementById('unidade').value.trim(),
    admissao: {
      tipo: document.querySelector('input[name="admissao_tipo"]:checked')?.value || '',
      nome: document.getElementById('admitido_nome').value.trim(),
      maca: document.getElementById('maca_retirada').checked,
      horario
    },
    dataHora: new Date().toLocaleString()
  };

  if (editandoIndex !== null) {
    avaliacoes[editandoIndex] = dados;
    editandoIndex = null;
  } else {
    avaliacoes.push(dados);
  }

  localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
  atualizarListaAvaliacoes();
  document.getElementById('form-avaliacao').reset();
  document.getElementById('mensagem-sucesso').classList.remove('oculto');
  setTimeout(() => document.getElementById('mensagem-sucesso').classList.add('oculto'), 3000);
}

function atualizarListaAvaliacoes() {
  const lista = document.getElementById('lista-avaliacoes');
  lista.innerHTML = "";

  avaliacoes.forEach((avaliacao, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <strong>${avaliacao.nome}</strong><br>
      ${avaliacao.documento}<br>
      ${avaliacao.endereco}
      <div class="mt-2">
        <button class="btn btn-sm btn-primary" onclick="editarAvaliacao(${index})">Editar</button>
        <button class="btn btn-sm btn-secondary" onclick="copiarTexto(${index})">Copiar Avaliação</button>
        <button class="btn btn-sm btn-danger" onclick="excluirAvaliacao(${index})">Excluir</button>
      </div>
    `;
    lista.appendChild(li);
  });
}

function editarAvaliacao(index) {
  const a = avaliacoes[index];
  document.getElementById('nome').value = a.nome;
  document.getElementById('documento').value = a.documento;
  document.getElementById('endereco').value = a.endereco;
  document.getElementById('protocolo').value = a.protocolo;
  document.getElementById('pressao').value = a.pressao !== 'prejudicado' ? a.pressao : '';
  document.getElementById('frequencia').value = a.frequencia !== 'prejudicado' ? a.frequencia : '';
  document.getElementById('saturacao').value = a.saturacao !== 'prejudicado' ? a.saturacao : '';
  document.getElementById('respiracao').value = a.respiracao !== 'prejudicado' ? a.respiracao : '';
  document.getElementById('glasgow').value = a.glasgow;
  document.getElementById('observacao').value = a.observacao;
  document.getElementById('regulador').value = a.regulador;
  document.getElementById('senha').value = a.senha;
  document.getElementById('unidade').value = a.unidade;
  document.getElementById('admitido_nome').value = a.admissao.nome;
  document.querySelector(`input[name="admissao_tipo"][value="${a.admissao.tipo}"]`)?.click();
  document.getElementById('maca_retirada').checked = a.admissao.maca;

  document.getElementById('prej_pressao').checked = a.pressao === 'prejudicado';
  document.getElementById('prej_frequencia').checked = a.frequencia === 'prejudicado';
  document.getElementById('prej_saturacao').checked = a.saturacao === 'prejudicado';
  document.getElementById('prej_respiracao').checked = a.respiracao === 'prejudicado';

  editandoIndex = index;
}

function excluirAvaliacao(index) {
  if (confirm("Deseja realmente excluir esta avaliação?")) {
    avaliacoes.splice(index, 1);
    localStorage.setItem('avaliacoes', JSON.stringify(avaliacoes));
    atualizarListaAvaliacoes();
  }
}

function copiarTexto(index) {
  const a = avaliacoes[index];

  const texto = 
`Nome: ${a.nome}
Documento: ${a.documento}
Endereço: ${a.endereco}
Protocolo: ${a.protocolo}

Pressão: ${a.pressao}
Frequência: ${a.frequencia}
Saturação: ${a.saturacao}
Respiração: ${a.respiracao}
Glasgow: ${a.glasgow}

Observação:
${a.observacao}

Médico Regulador: ${a.regulador}
Senha: ${a.senha}
Unidade de Saúde: ${a.unidade}

Vítima admitida aos cuidados do ${a.admissao.tipo} ${a.admissao.nome}${a.admissao.maca ? ` e a maca foi retirada pelo mesmo(a) às ${a.admissao.horario}` : ''}`;

  navigator.clipboard.writeText(texto).then(() => {
    alert("Texto copiado com sucesso!");
  });
}
