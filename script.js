let currentScore = 0;

/**
 * Função principal chamada pelo HTML (Botão e Enter)
 */
function applyInputValue() {
    const inputField = document.getElementById('gauge-input');
    const value = parseInt(inputField.value);

    // Validação técnica para evitar erros de cálculo
    if (!isNaN(value)) {
        currentScore += value;

        // Limites físicos do medidor: 0 (Low) a 180 (High)
        if (currentScore < 0) currentScore = 0;
        if (currentScore > 180) currentScore = 180;

        // Atualização da variável CSS no root
        document.documentElement.style.setProperty('--gauge-value', currentScore);
    }

    // Limpeza obrigatória do campo após a execução
    inputField.value = '';
    inputField.focus();
}