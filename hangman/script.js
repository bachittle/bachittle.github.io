const words = ["javascript", "hangman", "arcade", "portfolio", "openai"];
let selectedWord;
let guessedLetters;
let remaining;

function startGame() {
    selectedWord = words[Math.floor(Math.random() * words.length)];
    guessedLetters = [];
    remaining = 6;
    updateDisplay();
    document.getElementById('message').textContent = '';
}

function updateDisplay() {
    const wordDisplay = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
    document.getElementById('word').textContent = wordDisplay;
    document.getElementById('remaining').textContent = `Remaining guesses: ${remaining}`;
}

function guess(letter) {
    if (guessedLetters.includes(letter) || remaining === 0) return;
    guessedLetters.push(letter);
    if (!selectedWord.includes(letter)) {
        remaining--;
    }
    updateDisplay();
    checkGameStatus();
}

function checkGameStatus() {
    if (selectedWord.split('').every(letter => guessedLetters.includes(letter))) {
        document.getElementById('message').textContent = 'You win!';
    } else if (remaining === 0) {
        document.getElementById('message').textContent = `Game over! The word was ${selectedWord}`;
    }
}

window.addEventListener('DOMContentLoaded', () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    const lettersDiv = document.getElementById('letters');
    lettersDiv.innerHTML = alphabet.map(letter => `<button class="letter">${letter}</button>`).join('');
    lettersDiv.addEventListener('click', e => {
        if (e.target.classList.contains('letter')) {
            guess(e.target.textContent);
        }
    });
    document.getElementById('reset-button').addEventListener('click', startGame);
    startGame();
});
