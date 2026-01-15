const API_URL = "http://localhost:3333";

/* ================= ESTADO GLOBAL ================= */
let currentCpf = null;
let currentUser = null;
let discountToApply = 0;
let qrCode = null;

/* ================= ELEMENTOS DOM ================= */
const cpfInput = document.getElementById("cpfInput");
const nameInput = document.getElementById("nameInput");
const itemsInput = document.getElementById("itemsInput");
const valueInput = document.getElementById("valueInput");

const searchBtn = document.getElementById("searchBtn");
const registerBtn = document.getElementById("registerBtn");
const shoppingBtn = document.getElementById("shoppingBtn");

const messageEl = document.getElementById("message");
const discountInfo = document.getElementById("discountInfo");
const discountValueEl = document.getElementById("discountValue");
const progressBar = document.getElementById("progressBar");

/* Modal pagamento */
const paymentModal = document.getElementById("paymentModal");
const paymentCard = document.getElementById("paymentCard");
const qrCodeEl = document.getElementById("qrCode");
const paymentValueEl = document.getElementById("paymentValue");
const closePaymentModal = document.getElementById("closePaymentModal");
const confirmPaymentBtn = document.getElementById("confirmPaymentBtn");

/* ================= EVENTOS ================= */
searchBtn.addEventListener("click", () => buscarUsuario(true));
registerBtn.addEventListener("click", cadastrarUsuario);
shoppingBtn.addEventListener("click", abrirModalPagamento);
closePaymentModal.addEventListener("click", fecharModal);
confirmPaymentBtn.addEventListener("click", confirmarPagamentoPIX);

document
  .querySelectorAll(".payment-btn")
  .forEach((btn) => btn.addEventListener("click", selecionarMetodoPagamento));

/* ================= FLUXO DE PAGAMENTO ================= */
function abrirModalPagamento() {
  const itens = getItens();
  const value = Number(valueInput.value);

  if (!itens.length || !value) {
    showMessage("Informe itens e valor", "error");
    return;
  }

  paymentValueEl.textContent = value.toFixed(2);
  paymentModal.classList.remove("hidden");
  paymentCard.classList.add("hidden");
}

function selecionarMetodoPagamento(e) {
  if (e.target.classList.contains("disabled")) return;

  if (e.target.dataset.method === "pix") {
    gerarQRCodePIX();
  }
}

function gerarQRCodePIX() {
  paymentCard.classList.remove("hidden");

  const value = Number(valueInput.value);
  const pixKey = "seu-email@pix.com";

  const pixString = `PIX:${pixKey}|VALOR:${value.toFixed(2)}`;

  qrCodeEl.innerHTML = "";
  qrCode = new QRCode(qrCodeEl, {
    text: pixString,
    width: 200,
    height: 200,
  });
}

function fecharModal() {
  paymentModal.classList.add("hidden");
  if (qrCode) qrCode.clear();
}

async function confirmarPagamentoPIX() {
  const itens = getItens();
  let value = Number(valueInput.value);

  const discount = discountToApply > 0 ? value * discountToApply : 0;
  value -= discount;

  fecharModal();
  toggleLoading(shoppingBtn, true);

  try {
    const res = await fetch(`${API_URL}/shopping`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ cpf: currentCpf, itens, value }),
    });

    if (!res.ok) throw new Error();

    showMessage(`Compra registrada! Valor: R$ ${value.toFixed(2)}`);
    limparFormulario();
    await buscarUsuario(false);
  } catch {
    showMessage("Erro ao registrar compra", "error");
  }

  toggleLoading(shoppingBtn, false);
}

/* ================= USUÁRIO ================= */
async function buscarUsuario(showMessageFound = true) {
  const cpf = cpfInput.value.trim();
  if (!cpf) return showMessage("Informe o CPF", "error");

  currentCpf = cpf;
  toggleLoading(searchBtn, true);

  try {
    const res = await fetch(`${API_URL}/users/${cpf}`);
    if (!res.ok) throw new Error();

    const { user } = await res.json();
    currentUser = user;

    if (showMessageFound) showMessage(`Cliente: ${user.name}`);

    atualizarDesconto(user.accumulatedValue);
    mostrarHistorico(user);
  } catch {
    showMessage("Cliente não encontrado", "error");
  }

  toggleLoading(searchBtn, false);
}

async function cadastrarUsuario() {
  if (!nameInput.value.trim()) {
    return showMessage("Informe o nome", "error");
  }

  toggleLoading(registerBtn, true);

  try {
    await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: nameInput.value, cpf: currentCpf }),
    });

    showMessage("Cliente cadastrado!");
    nameInput.value = "";
    buscarUsuario(false);
  } catch {
    showMessage("Erro ao cadastrar", "error");
  }

  toggleLoading(registerBtn, false);
}

/* ================= HISTÓRICO ================= */
function mostrarHistorico(user, filter = "all") {
  const historyList = document.getElementById("historyList");
  historyList.innerHTML = "";

  const compras =
    filter === "discount"
      ? user.shopping.filter((s) => s.discountApplied > 0)
      : user.shopping;

  if (!compras.length) {
    historyList.innerHTML = "<li>Nenhuma compra registrada.</li>";
    return;
  }

  compras.forEach((s) => {
    const li = document.createElement("li");
    li.className = `history-item ${s.discountApplied > 0 ? "discount" : ""}`;

    li.innerHTML = `
      <div class="history-summary">
        <span>${new Date(s.data).toLocaleDateString()}</span>
        <span>R$ ${s.value.toFixed(2)}</span>
      </div>
      <div class="history-details">
        <p><strong>Itens:</strong> ${s.itens.join(", ")}</p>
        <p><strong>Desconto:</strong> R$ ${s.discountApplied.toFixed(2)}</p>
      </div>
    `;

    li.onclick = () => li.classList.toggle("expanded");
    historyList.appendChild(li);
  });
}

/* ================= HELPERS ================= */
function getItens() {
  return itemsInput.value
    .split(",")
    .map((i) => i.trim())
    .filter(Boolean);
}

function atualizarDesconto(acumulado) {
  discountToApply = acumulado >= 500 ? 0.2 : 0;
  discountInfo.classList.toggle("hidden", !discountToApply);
  discountValueEl.textContent = `${discountToApply * 100}%`;
  progressBar.style.width = `${((acumulado % 500) / 500) * 100}%`;
}

function limparFormulario() {
  itemsInput.value = "";
  valueInput.value = "";
}

function showMessage(text, type = "success") {
  messageEl.textContent = text;
  messageEl.className = `message ${type} show`;
  setTimeout(() => messageEl.classList.remove("show"), 3000);
}

function toggleLoading(btn, loading) {
  btn.disabled = loading;
  btn.textContent = loading ? "Processando..." : btn.dataset.text;
}

cpfInput.focus();
