const emojis = ['🐶','🐱','🐭','🐹','🐰','🦊','🐻','🐼'];
let cards = [];
let firstCard = null;
let lockBoard = false;

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function setupGame() {
    const gameContainer = document.getElementById('game');
    gameContainer.innerHTML = '';
    cards = emojis.concat(emojis);
    shuffle(cards);
    cards.forEach(emoji => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.dataset.emoji = emoji;
        card.addEventListener('click', flipCard);
        gameContainer.appendChild(card);
    });
}

function flipCard() {
    if (lockBoard || this.classList.contains('matched') || this === firstCard) return;
    this.textContent = this.dataset.emoji;
    this.classList.add('flipped');

    if (!firstCard) {
        firstCard = this;
        return;
    }

    if (firstCard.dataset.emoji === this.dataset.emoji) {
        firstCard.classList.add('matched');
        this.classList.add('matched');
        resetTurn();
    } else {
        lockBoard = true;
        setTimeout(() => {
            firstCard.textContent = '';
            this.textContent = '';
            firstCard.classList.remove('flipped');
            this.classList.remove('flipped');
            resetTurn();
        }, 800);
    }
}

function resetTurn() {
    [firstCard, lockBoard] = [null, false];
}

document.getElementById('restart').addEventListener('click', setupGame);

document.addEventListener('DOMContentLoaded', setupGame);
