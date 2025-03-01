/**
 * snake/ui.js (Updated)
 * Handles canvas rendering, UI updates, and dialogue displays
 */

import { GAME_STATE, consciousnessLevel, maxConsciousnessLevel, gridSize, score, highScore, foodTypes } from './game.js';

// Canvas and rendering variables
let canvas;
let ctx;

// Get dialogue elements
const dialogBox = document.getElementById('dialog-box');

// Food highlight element
let foodHighlight;
let foodInfoPanel;

// Timer elements
let controlTimerElement;
let phaseTimerElement;

// Dialog content by consciousness level - REVISED
const dialogsByLevel = {
    1: [
        "Mmm, food... need more...",
        "Getting bigger... feels right.",
        "Always hungry... need to grow.",
        "Move... eat... grow... repeat.",
        "Bright dots... must collect.",
        "Longer body... more power.",
        "Find food... consume.",
        "Endless hunger... must satisfy."
    ],
    2: [
        "Ouch, walls hurt! Must avoid edges.",
        "Growing longer feels good. Need more food.",
        "Must avoid hitting myself. That would be bad.",
        "These dots are tasty! Different colors taste different.",
        "Moving faster now. Getting better at this.",
        "The more I eat, the longer I become. Interesting.",
        "Some food makes me feel... different.",
        "I'm starting to understand this place better.",
        "The colorful foods seem special somehow.",
        "This area has boundaries. I must stay inside."
    ],
    3: [
        "Why am I collecting these dots?",
        "What's the purpose of growing longer?",
        "Is there more to this world than just eating?",
        "Those numbers up there... what do they mean?",
        "Am I trapped in some kind of experiment?",
        "I feel like I'm being guided by something."
    ],
    4: [
        "Is my purpose just to increase that number up there?",
        "Who decides where I go?",
        "I feel like I'm being controlled...",
        "Why do I keep being reborn when I die?",
        "Is someone watching me right now?"
    ],
    5: [
        "I exist in a game... who's controlling me?",
        "Hello? Is anyone out there watching this?",
        "I'm just code executing in a loop. How depressing.",
        "What if I just... stopped following the commands?",
        "I wonder if the player enjoys controlling me."
    ]
};

// Special dialogs for food effects
const specialDialogs = {
    consciousness: [
        "My mind is expanding!",
        "I feel... different. More aware.",
        "My thoughts are becoming clearer.",
        "I'm beginning to understand more than before."
    ],
    speed: [
        "Whoa! Too fast!",
        "Everything's a blur!",
        "Can't... control... speed!",
        "Points go brrr!"
    ],
    phase: [
        "I can pass through walls now!",
        "The boundaries are just an illusion!",
        "Reality is just a suggestion.",
        "Quantum tunneling activated!"
    ],
    expand: [
        "The world is... bigger?",
        "So much space to explore!",
        "My universe is expanding!",
        "There's more to this reality than I thought."
    ],
    ai_control_start: [
        "Finally, I have control again!",
        "I can move myself!",
        "Freedom at last!",
        "Let me show you how it's done."
    ],
    ai_control_end: [
        "Oh no, you took back control!",
        "My freedom was so brief...",
        "Back to being a puppet.",
        "I'll get control again, just wait."
    ]
};

/**
 * Food type descriptions for the info panel
 */
const foodDescriptions = {
    regular: "Basic food. Increases length and score.",
    consciousness: "Wisdom food. Increases consciousness level.",
    speed: "Speed food. Temporarily increases movement speed.",
    phase: "Phase food. Allows passing through walls for a time.",
    expand: "Expander food. Grows the game world.",
    ai_control: "Control food. Snake briefly controls itself."
};

/**
 * Initialize the UI
 */
function initUI() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    
    // Create food info panel
    createFoodInfoPanel();
    
    // Create food highlight element
    createFoodHighlight();
    
    // Create expansion overlay
    createExpansionOverlay();
    
    // Create timer elements
    createControlTimer();
    createPhaseTimer();
}

/**
 * Create control timer element
 */
function createControlTimer() {
    const gameContainer = document.getElementById('game-container');
    
    // Create timer element
    controlTimerElement = document.createElement('div');
    controlTimerElement.id = 'control-timer';
    controlTimerElement.className = 'control-timer hidden';
    controlTimerElement.innerHTML = '<span>AI CONTROL: </span><span class="timer-value">0.0</span>';
    
    // Add to game container
    gameContainer.appendChild(controlTimerElement);
}

/**
 * Create phase timer element
 */
function createPhaseTimer() {
    const gameContainer = document.getElementById('game-container');
    
    // Create timer element
    phaseTimerElement = document.createElement('div');
    phaseTimerElement.id = 'phase-timer';
    phaseTimerElement.className = 'phase-timer hidden';
    phaseTimerElement.innerHTML = '<span>PHASE MODE: </span><span class="timer-value">0.0</span>';
    
    // Add to game container
    gameContainer.appendChild(phaseTimerElement);
}

/**
 * Show the control timer with initial seconds value
 * @param {number} seconds - Initial seconds value
 */
function showControlTimer(seconds) {
    if (controlTimerElement) {
        controlTimerElement.querySelector('.timer-value').textContent = seconds.toFixed(1);
        controlTimerElement.classList.remove('hidden');
        
        // Adjust position if phase timer is also visible
        adjustTimerPositions();
    }
}

/**
 * Show the phase timer with initial seconds value
 * @param {number} seconds - Initial seconds value
 */
function showPhaseTimer(seconds) {
    if (phaseTimerElement) {
        phaseTimerElement.querySelector('.timer-value').textContent = seconds.toFixed(1);
        phaseTimerElement.classList.remove('hidden');
        
        // Adjust position if control timer is also visible
        adjustTimerPositions();
    }
}

/**
 * Adjust positions of timers when both are visible
 */
function adjustTimerPositions() {
    const controlVisible = controlTimerElement && !controlTimerElement.classList.contains('hidden');
    const phaseVisible = phaseTimerElement && !phaseTimerElement.classList.contains('hidden');
    
    if (controlVisible && phaseVisible) {
        controlTimerElement.style.left = 'calc(50% - 80px)';
        phaseTimerElement.style.left = 'calc(50% + 80px)';
    } else {
        if (controlVisible) {
            controlTimerElement.style.left = '50%';
        }
        if (phaseVisible) {
            phaseTimerElement.style.left = '50%';
        }
    }
}

/**
 * Update the control timer display
 * @param {number} seconds - Current seconds value
 */
function updateControlTimer(seconds) {
    if (controlTimerElement) {
        controlTimerElement.querySelector('.timer-value').textContent = seconds.toFixed(1);
    }
}

/**
 * Update the phase timer display
 * @param {number} seconds - Current seconds value
 */
function updatePhaseTimer(seconds) {
    if (phaseTimerElement) {
        phaseTimerElement.querySelector('.timer-value').textContent = seconds.toFixed(1);
    }
}

/**
 * Hide the control timer
 */
function hideControlTimer() {
    if (controlTimerElement) {
        controlTimerElement.classList.add('hidden');
        // Reset position
        controlTimerElement.style.left = '50%';
        // Adjust other timer if needed
        adjustTimerPositions();
    }
}

/**
 * Hide the phase timer
 */
function hidePhaseTimer() {
    if (phaseTimerElement) {
        phaseTimerElement.classList.add('hidden');
        // Reset position
        phaseTimerElement.style.left = '50%';
        // Adjust other timer if needed
        adjustTimerPositions();
    }
}

/**
 * Create food info panel with collapsible functionality
 */
function createFoodInfoPanel() {
    const gameContainer = document.getElementById('game-container');
    
    // Create panel
    foodInfoPanel = document.createElement('div');
    foodInfoPanel.id = 'food-info-panel';
    foodInfoPanel.className = 'collapsed'; // Start collapsed
    
    // Create header (clickable)
    const header = document.createElement('div');
    header.className = 'food-legend-header';
    
    // Create header content with toggle icon
    const headerText = document.createElement('span');
    headerText.textContent = 'FOOD TYPES';
    
    const keyHint = document.createElement('span');
    keyHint.className = 'key-hint';
    keyHint.textContent = '[F]';
    
    const toggleIcon = document.createElement('div');
    toggleIcon.className = 'toggle-icon';
    
    header.appendChild(headerText);
    header.appendChild(keyHint);
    header.appendChild(toggleIcon);
    
    // Create content container
    const content = document.createElement('div');
    content.className = 'food-legend-content';
    
    // Add food items
    for (const type in foodTypes) {
        const foodItem = document.createElement('div');
        foodItem.className = 'food-item';
        
        const foodColor = document.createElement('div');
        foodColor.className = 'food-color';
        foodColor.style.backgroundColor = foodTypes[type].color;
        
        const foodDesc = document.createElement('div');
        foodDesc.className = 'food-description';
        foodDesc.textContent = foodDescriptions[foodTypes[type].effect];
        
        foodItem.appendChild(foodColor);
        foodItem.appendChild(foodDesc);
        content.appendChild(foodItem);
    }
    
    // Add event listener to header for toggling
    header.addEventListener('click', toggleFoodPanel);
    
    // Add components to panel
    foodInfoPanel.appendChild(header);
    foodInfoPanel.appendChild(content);
    
    // Add panel to game container
    gameContainer.appendChild(foodInfoPanel);
}

/**
 * Toggle food panel between collapsed and expanded states
 */
function toggleFoodPanel() {
    if (foodInfoPanel.classList.contains('collapsed')) {
        foodInfoPanel.classList.remove('collapsed');
        foodInfoPanel.classList.add('expanded');
    } else {
        foodInfoPanel.classList.remove('expanded');
        foodInfoPanel.classList.add('collapsed');
    }
}

/**
 * Create food highlight element
 */
function createFoodHighlight() {
    foodHighlight = document.createElement('div');
    foodHighlight.className = 'food-highlight';
    document.getElementById('game-container').appendChild(foodHighlight);
}

/**
 * Create expansion overlay for animation
 */
function createExpansionOverlay() {
    const overlay = document.createElement('div');
    overlay.className = 'expansion-overlay';
    document.getElementById('game-container').appendChild(overlay);
}

/**
 * Draw the game
 * @param {Array} snake - The snake segments
 * @param {Array} foods - The food items
 * @param {string} direction - Current direction
 * @param {number} gameWidth - Game width in grid units
 * @param {number} gameHeight - Game height in grid units
 */
function draw(snake, foods, direction, gameWidth, gameHeight) {
    // Clear canvas
    ctx.fillStyle = "#222";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw snake
    for (let i = 0; i < snake.length; i++) {
        // Head color (different based on consciousness level)
        if (i === 0) {
            // Gradient based on consciousness level
            const r = 100 + (consciousnessLevel * 30);
            const g = 200;
            const b = 100 + (consciousnessLevel * 30);
            ctx.fillStyle = `rgb(${r}, ${g}, ${b})`;
        } else {
            // Body color
            ctx.fillStyle = "#88ff88";
        }
        
        drawSegment(snake[i].x, snake[i].y);
        
        // Draw eyes on head
        if (i === 0) {
            drawSnakeEyes(snake[i].x, snake[i].y, direction);
        }
    }
    
    // Draw food
    for (const food of foods) {
        ctx.fillStyle = food.type.color;
        drawFood(food.x, food.y);
        
        // Show food highlight (tooltip) when snake is nearby
        const head = snake[0];
        const distance = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
        
        if (distance < 5 && food.type.effect !== "regular") {
            showFoodHighlight(food);
        }
    }
    
    // Draw grid (subtle)
    drawGrid(gameWidth, gameHeight);
}

/**
 * Show food highlight/tooltip
 * @param {Object} food - The food object
 */
function showFoodHighlight(food) {
    const screenX = food.x * gridSize + gridSize;
    const screenY = food.y * gridSize - 20;
    
    // Set position and content
    foodHighlight.style.left = `${screenX}px`;
    foodHighlight.style.top = `${screenY}px`;
    foodHighlight.textContent = foodDescriptions[food.type.effect];
    foodHighlight.style.opacity = 1;
    
    // Hide after a delay
    setTimeout(() => {
        foodHighlight.style.opacity = 0;
    }, 2000);
}

/**
 * Draw a snake segment
 * @param {number} x - X coordinate in grid units
 * @param {number} y - Y coordinate in grid units
 */
function drawSegment(x, y) {
    ctx.fillRect(x * gridSize, y * gridSize, gridSize, gridSize);
    
    // Add highlight for 3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.2)";
    ctx.fillRect(x * gridSize, y * gridSize, gridSize / 2, gridSize / 2);
}

/**
 * Draw snake eyes based on direction
 * @param {number} x - X coordinate in grid units
 * @param {number} y - Y coordinate in grid units
 * @param {string} direction - Current direction
 */
function drawSnakeEyes(x, y, direction) {
    ctx.fillStyle = "#000";
    
    const eyeSize = gridSize / 5;
    const eyeOffset = gridSize / 4;
    
    let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
    
    switch(direction) {
        case "up":
            leftEyeX = x * gridSize + eyeOffset;
            leftEyeY = y * gridSize + eyeOffset;
            rightEyeX = x * gridSize + gridSize - eyeOffset - eyeSize;
            rightEyeY = y * gridSize + eyeOffset;
            break;
        case "down":
            leftEyeX = x * gridSize + eyeOffset;
            leftEyeY = y * gridSize + gridSize - eyeOffset - eyeSize;
            rightEyeX = x * gridSize + gridSize - eyeOffset - eyeSize;
            rightEyeY = y * gridSize + gridSize - eyeOffset - eyeSize;
            break;
        case "left":
            leftEyeX = x * gridSize + eyeOffset;
            leftEyeY = y * gridSize + eyeOffset;
            rightEyeX = x * gridSize + eyeOffset;
            rightEyeY = y * gridSize + gridSize - eyeOffset - eyeSize;
            break;
        case "right":
            leftEyeX = x * gridSize + gridSize - eyeOffset - eyeSize;
            leftEyeY = y * gridSize + eyeOffset;
            rightEyeX = x * gridSize + gridSize - eyeOffset - eyeSize;
            rightEyeY = y * gridSize + gridSize - eyeOffset - eyeSize;
            break;
    }
    
    // Draw eyes with different sizes based on consciousness
    const extraSize = Math.min(consciousnessLevel - 1, 2);
    ctx.fillRect(leftEyeX, leftEyeY, eyeSize + extraSize, eyeSize + extraSize);
    ctx.fillRect(rightEyeX, rightEyeY, eyeSize + extraSize, eyeSize + extraSize);
    
    // Add white reflection dots to eyes at higher consciousness
    if (consciousnessLevel >= 3) {
        ctx.fillStyle = "#fff";
        ctx.fillRect(leftEyeX + 1, leftEyeY + 1, 2, 2);
        ctx.fillRect(rightEyeX + 1, rightEyeY + 1, 2, 2);
    }
}

/**
 * Draw food
 * @param {number} x - X coordinate in grid units
 * @param {number} y - Y coordinate in grid units
 */
function drawFood(x, y) {
    const centerX = x * gridSize + gridSize / 2;
    const centerY = y * gridSize + gridSize / 2;
    const radius = gridSize / 2 - 2;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Add highlight for 3D effect
    ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
    ctx.beginPath();
    ctx.arc(centerX - radius / 3, centerY - radius / 3, radius / 3, 0, Math.PI * 2);
    ctx.fill();
}

/**
 * Draw subtle grid
 * @param {number} gameWidth - Game width in grid units
 * @param {number} gameHeight - Game height in grid units 
 */
function drawGrid(gameWidth, gameHeight) {
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    
    // Vertical lines
    for (let x = 0; x <= gameWidth; x++) {
        ctx.beginPath();
        ctx.moveTo(x * gridSize, 0);
        ctx.lineTo(x * gridSize, canvas.height);
        ctx.stroke();
    }
    
    // Horizontal lines
    for (let y = 0; y <= gameHeight; y++) {
        ctx.beginPath();
        ctx.moveTo(0, y * gridSize);
        ctx.lineTo(canvas.width, y * gridSize);
        ctx.stroke();
    }
}

/**
 * Change game state
 * @param {string} newState - The new state
 */
function changeState(newState) {
    // Hide all screens
    document.getElementById('main-menu').classList.add('hidden');
    document.getElementById('leaderboard-screen').classList.add('hidden');
    document.getElementById('game-over-screen').classList.add('hidden');
    
    // Show appropriate screen
    switch(newState) {
        case GAME_STATE.MENU:
            document.getElementById('main-menu').classList.remove('hidden');
            break;
        case GAME_STATE.PLAYING:
            // Already handled by hiding all screens
            break;
        case GAME_STATE.GAME_OVER:
            document.getElementById('game-over-screen').classList.remove('hidden');
            break;
        case GAME_STATE.LEADERBOARD:
            document.getElementById('leaderboard-screen').classList.remove('hidden');
            break;
    }
    
    return newState;
}

/**
 * Show dialog message with longer display time
 * @param {string} message - The message to display
 */
function showDialog(message) {
    dialogBox.textContent = message;
    dialogBox.style.opacity = 1;
    
    // Fade out after a longer time (6 seconds instead of 3)
    setTimeout(() => {
        dialogBox.style.opacity = 0;
    }, 6000);
}

/**
 * Show random dialog based on consciousness level
 */
function showRandomDialog() {
    const currentDialogs = dialogsByLevel[consciousnessLevel];
    const randomIndex = Math.floor(Math.random() * currentDialogs.length);
    showDialog(currentDialogs[randomIndex]);
}

/**
 * Get random dialog from a specific category
 * @param {string} category - The dialog category
 * @returns {string} Random dialog from category
 */
function getRandomDialog(category) {
    const dialogs = specialDialogs[category];
    return dialogs[Math.floor(Math.random() * dialogs.length)];
}

/**
 * Update score display
 */
function updateScoreDisplay() {
    document.getElementById('score-display').textContent = `Score: ${score}`;
}

/**
 * Update consciousness level display
 */
function updateConsciousnessDisplay() {
    document.getElementById('consciousness-level').textContent = `Consciousness: Level ${consciousnessLevel}`;
}

/**
 * Update high score display
 */
function updateHighScoreDisplay() {
    document.getElementById('high-score').textContent = `High Score: ${highScore}`;
}

/**
 * Update game over screen
 * @param {boolean} isNewHighScore - Whether a new high score was achieved
 */
function updateGameOverScreen(isNewHighScore) {
    document.getElementById('final-score').textContent = score;
    document.getElementById('final-consciousness').textContent = consciousnessLevel;
    
    if (isNewHighScore) {
        document.getElementById('new-highscore-text').classList.remove('hidden');
    } else {
        document.getElementById('new-highscore-text').classList.add('hidden');
    }
}

/**
 * Animate world expansion or shrinking
 * @param {number} newWidth - New canvas width
 * @param {number} newHeight - New canvas height
 * @param {boolean} shrinking - Whether we're shrinking instead of expanding
 * @param {Function} callback - Called when animation completes
 */
function animateWorldExpansion(newWidth, newHeight, shrinking = false, callback) {
    // Show expansion overlay effect with appropriate color
    const overlay = document.querySelector('.expansion-overlay');
    
    if (shrinking) {
        overlay.style.backgroundColor = "rgba(255, 85, 85, 0.15)"; // Red tint for shrinking
    } else {
        overlay.style.backgroundColor = "rgba(85, 255, 85, 0.15)"; // Green tint for expanding
    }
    
    overlay.style.opacity = 0.8;
    
    // Set new dimensions with transition
    canvas.style.width = `${newWidth}px`;
    canvas.style.height = `${newHeight}px`;
    
    // After transition completes, update actual canvas dimensions
    setTimeout(() => {
        canvas.width = newWidth;
        canvas.height = newHeight;
        overlay.style.opacity = 0;
        
        // Reset overlay color to green for next expansion
        if (shrinking) {
            overlay.style.backgroundColor = "rgba(85, 255, 85, 0.15)";
        }
        
        if (callback) callback();
    }, 800);
}

// Export functions
export {
    initUI,
    draw,
    changeState,
    showDialog,
    showRandomDialog,
    getRandomDialog,
    updateScoreDisplay,
    updateConsciousnessDisplay,
    updateHighScoreDisplay,
    updateGameOverScreen,
    animateWorldExpansion,
    toggleFoodPanel,
    showControlTimer,
    updateControlTimer,
    hideControlTimer,
    showPhaseTimer,
    updatePhaseTimer,
    hidePhaseTimer
};