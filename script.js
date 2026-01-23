let currentScore = parseFloat(localStorage.getItem("tilt-score")) || 0;

const tiltLevels = {
  1: { label: "Tranquilo", emoji: "😁", msg: "Ruído irrelevante. Se isso te afeta, sua base é mais frágil do que você admite." },
  2: { label: "Suave", emoji: "😄", msg: "Início da negligência. Você está baixando a guarda e chamando isso de calma." },
  3: { label: "ainda de boa", emoji: "🙂", msg: "A paciência é uma corda esticada. A disciplina deve assumir antes que ela rompa." },
  4: { label: "Cuidado", emoji: "😐", msg: "Zona de perigo. Sua lógica foi substituída por reatividade pura." },
  5: { label: "Vixe", emoji: "😟", msg: "Dano crítico. Você parou de liderar e começou a apenas sobreviver ao caos." },
  6: { label: "Deu merda", emoji: "😡", msg: "Falência total. Sua inteligência emocional foi nocauteada pelo seu ego." },
};

window.onload = () => {
  updateUI();
  renderSavedHistory();
};

/**
 * Define o estado ATUAL do medidor (Substitui o acúmulo)
 */
function applyInputValue() {
  const inputField = document.getElementById("gauge-input");
  const value = parseInt(inputField.value);

  if (isNaN(value) || value < 1 || value > 6) {
    inputField.value = "";
    return;
  }

  // MUDANÇA: O valor agora é fixo para cada nível (Mapeado para 100%)
  // Ex: Nível 1 = 17%, Nível 3 = 50%, Nível 6 = 100%
  currentScore = Math.round((value / 6) * 100);

  localStorage.setItem("tilt-score", currentScore);

  updateUI();
  addEntryToHistory(value);

  inputField.value = "";
  inputField.focus();
}

function updateUI() {
  const card = document.getElementById("percentage-card");
  const percentage = Math.round(currentScore);

  // Converte 100% de score para 180 graus de agulha
  const degrees = currentScore * 1.8;
  
  document.documentElement.style.setProperty("--gauge-value", degrees);
  card.innerText = percentage + "%";

  card.classList.add("update");
  setTimeout(() => card.classList.remove("update"), 300);
}

function addEntryToHistory(level) {
  const now = new Date();
  const entry = {
    date: `${String(now.getDate()).padStart(2, "0")}/${String(now.getMonth() + 1).padStart(2, "0")}`,
    time: now.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }),
    level: level,
    label: tiltLevels[level].label,
    emoji: tiltLevels[level].emoji,
    message: tiltLevels[level].msg
  };

  const history = JSON.parse(localStorage.getItem("tilt-history")) || [];
  history.unshift(entry);
  localStorage.setItem("tilt-history", JSON.stringify(history.slice(0, 50)));

  renderHistoryItem(entry);
}

function renderHistoryItem(entry) {
  const list = document.getElementById("history-list");
  const li = document.createElement("li");
  li.className = "history-item";

  li.innerHTML = `
        <div class="history-info">
            <div class="history-main">
                <span class="history-emoji">${entry.emoji}</span>
                <div class="history-text">
                    <strong>${entry.label.toUpperCase()} (Nível ${entry.level})</strong>
                    <p>${entry.message}</p>
                </div>
            </div>
            <small>${entry.date} - ${entry.time}</small>
        </div>
    `;
  list.prepend(li);
}

function renderSavedHistory() {
  const history = JSON.parse(localStorage.getItem("tilt-history")) || [];
  history.reverse().forEach((entry) => renderHistoryItem(entry));
}

function toggleHistory() {
  document.getElementById("history-panel").classList.toggle("active");
}

function clearHistory() {
  if (confirm("Deseja apagar TUDO e zerar o medidor?")) {
    localStorage.removeItem("tilt-history");
    document.getElementById("history-list").innerHTML = "";
    currentScore = 0;
    localStorage.setItem("tilt-score", 0);
    updateUI();
    document.getElementById("history-panel").classList.remove("active");
  }
}

function resetGauge() {
  if (confirm("Zerar medidor?")) {
    currentScore = 0;
    localStorage.setItem("tilt-score", 0);
    updateUI();
  }
}

window.onclick = function (event) {
  const panel = document.getElementById("history-panel");
  const card = document.getElementById("percentage-card");
  if (panel && panel.classList.contains("active") && !panel.contains(event.target) && !card.contains(event.target)) {
    panel.classList.remove("active");
  }
};