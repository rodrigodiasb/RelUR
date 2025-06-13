
const form = document.getElementById("form");
const lista = document.getElementById("lista-avaliacoes");
const glasgowSelect = document.getElementById("glasgow");
for (let i = 1; i <= 15; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i;
  glasgowSelect.appendChild(option);
}
function formatCPF(value) {
  return value.replace(/\D/g, "").replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
}
function isCPF(str) {
  return /^\d{11}$/.test(str.replace(/\D/g, ""));
}
function togglePrejudicado(inputId, checkboxId) {
  const input = document.getElementById(inputId);
  const checkbox = document.getElementById(checkboxId);
  checkbox.addEventListener("change", () => {
    if (checkbox.checked) {
      input.value = "Prejudicado";
      input.disabled = true;
    } else {
      input.value = "";
      input.disabled = false;
    }
  });
}
["pressao", "frequencia", "saturacao", "respiracao"].forEach(field => {
  togglePrejudicado(field, field + "_prejudicada");
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (isCPF(data.documento)) {
    data.documento = formatCPF(data.documento);
  }
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  avaliacoes.push(data);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  form.reset();
  renderAvaliacoes();
});
function renderAvaliacoes() {
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  lista.innerHTML = "";
  avaliacoes.forEach((a, index) => {
    const div = document.createElement("div");
    div.className = "avaliacao";
    div.innerHTML = `
      <strong>${a.nome}</strong><br>
      <small>${a.documento}</small><br>
      <button onclick="editar(${index})">Editar</button>
      <button onclick="copiar(${index})">Copiar Avaliação</button>
      <button onclick="excluir(${index})">Excluir</button>
    `;
    lista.appendChild(div);
  });
}
function editar(index) {
  const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes") || "[]");
  const a = avaliacoes[index];
  for (const key in a) {
    if (form[key]) form[key].value = a[key];
  }
  avaliacoes.splice(index, 1);
  localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
  renderAvaliacoes();
}
function copiar(index) {
  const a = JSON.parse(localStorage.getItem("avaliacoes"))[index];
  const texto = Object.entries(a).map(([k, v]) => `${k}: ${v}`).join("\n");
  navigator.clipboard.writeText(texto);
  alert("Avaliação copiada!");
}
function excluir(index) {
  if (confirm("Deseja mesmo excluir esta avaliação?")) {
    const avaliacoes = JSON.parse(localStorage.getItem("avaliacoes"));
    avaliacoes.splice(index, 1);
    localStorage.setItem("avaliacoes", JSON.stringify(avaliacoes));
    renderAvaliacoes();
  }
}
renderAvaliacoes();
