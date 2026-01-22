let currentScore = 0;

function adjustLevel(delta) {
    currentScore += delta;
    if (currentScore < 0) currentScore = 0;
    if (currentScore > 180) currentScore = 180;
    document.documentElement.style.setProperty('--gauge-value', currentScore);
}