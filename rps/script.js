const buttons = document.querySelectorAll('button[data-choice]');
const resultDiv = document.getElementById('result');

buttons.forEach(btn => {
    btn.addEventListener('click', () => {
        const userChoice = btn.dataset.choice;
        const choices = ['rock', 'paper', 'scissors'];
        const computerChoice = choices[Math.floor(Math.random() * choices.length)];

        let result;
        if (userChoice === computerChoice) {
            result = "It's a tie!";
        } else if (
            (userChoice === 'rock' && computerChoice === 'scissors') ||
            (userChoice === 'paper' && computerChoice === 'rock') ||
            (userChoice === 'scissors' && computerChoice === 'paper')
        ) {
            result = `You win! ${userChoice} beats ${computerChoice}.`;
        } else {
            result = `You lose! ${computerChoice} beats ${userChoice}.`;
        }
        resultDiv.textContent = `Computer chose ${computerChoice}. ${result}`;
    });
});
