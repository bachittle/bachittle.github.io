const easyWords = [
    'cat', 'dog', 'book', 'fish', 'tree',
    'car', 'door', 'sun', 'apple', 'hat'
];
const mediumWords = [
    'javascript', 'hangman', 'arcade', 'portfolio',
    'openai', 'variable', 'function', 'element'
];
const hardWords = [
    'asynchronous', 'configuration', 'transpilation',
    'responsiveness', 'implementation'
];

const hangmanStates = [
` +---+\n |   |\n     |\n     |\n     |\n     |\n=======`,
` +---+\n |   |\n O   |\n     |\n     |\n     |\n=======`,
` +---+\n |   |\n O   |\n |   |\n     |\n     |\n=======`,
` +---+\n |   |\n O   |\n/|   |\n     |\n     |\n=======`,
` +---+\n |   |\n O   |\n/|\\  |\n     |\n     |\n=======`,
` +---+\n |   |\n O   |\n/|\\  |\n/    |\n     |\n=======`,
` +---+\n |   |\n O   |\n/|\\  |\n/ \\  |\n     |\n=======`
];

let selectedWord;
let guessedLetters;
let remaining;
let maxAttempts;

function chooseWord(difficulty) {
    const list = difficulty === 'easy' ? easyWords :
                 difficulty === 'hard' ? hardWords : mediumWords;
    return list[Math.floor(Math.random() * list.length)];
}

function startGame() {
    const diff = document.getElementById('difficulty').value;
    maxAttempts = diff === 'easy' ? 8 : diff === 'hard' ? 4 : 6;
    selectedWord = chooseWord(diff);
    guessedLetters = [];
    remaining = maxAttempts;
    document.getElementById('message').textContent = '';
    updateDisplay();
}

function updateDisplay() {
    const wordDisplay = selectedWord
        .split('')
        .map(letter => guessedLetters.includes(letter) ? letter : '_')
        .join(' ');
    document.getElementById('word').textContent = wordDisplay;
    document.getElementById('remaining').textContent = `Remaining guesses: ${remaining}`;
    updateFigure();
}

function updateFigure() {
    const mistakes = maxAttempts - remaining;
    const index = Math.min(hangmanStates.length - 1,
        Math.floor((mistakes / maxAttempts) * (hangmanStates.length - 1)));
    document.getElementById('hangman-figure').textContent = hangmanStates[index];
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
    document.getElementById('difficulty').addEventListener('change', startGame);
    startGame();
});
