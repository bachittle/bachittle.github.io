/**
 * snake/game.js (Updated)
 * Core game logic including snake movement, collision detection, and food mechanics
 */

import * as UI from './ui.js';
import { loadLeaderboard, addToLeaderboard, displayLeaderboard } from './storage.js';

// Game states
const GAME_STATE = {
    MENU: 'menu',
    PLAYING: 'playing',
    GAME_OVER: 'gameOver',
    LEADERBOARD: 'leaderboard'
};

// Game settings
const gridSize = 20;
const initialSnakeLength = 5;
let gameSpeed = 100; // ms between moves
let score = 0;
let highScore = 0;
let gameRunning = false;
let currentState = GAME_STATE.MENU;
let gameLoopTimeout = null;

// Canvas dimensions
let canvas;
let gameWidth;
let gameHeight;
const initialCanvasWidth = 600; // Initial width from snake.html
const initialCanvasHeight = 400; // Initial height from snake.html
const maxCanvasWidth = 800; // Maximum allowed width
const maxCanvasHeight = 600; // Maximum allowed height

// Consciousness settings
let consciousnessLevel = 1;
const maxConsciousnessLevel = 5;

// Snake initialization
let snake = [];
let direction = "right";
let nextDirection = "right";

// Special effects
let aiControlActive = false;
let aiControlTimer = null;
let aiControlDuration = 3e4; // 30 seconds
let aiControlRemaining = 0;
let aiControlStartTime = 0;
let phaseMode = false;
let phaseTimer = null;
let phaseDuration = 10000; // 10 seconds
let phaseRemaining = 0;
let phaseStartTime = 0;
let speedBoostActive = false;
let speedBoostTimer = null;
let isWorldExpanding = false;

// Food initialization
let foods = [];

// Food types with descriptions - UPDATED CHANCES
const foodTypes = {
    regular: { color: "#fff", chance: 50, effect: "regular" },
    wisdom: { color: "#00ffff", chance: 8, effect: "consciousness" }, // Decreased from 15 to 8
    speed: { color: "#ff5555", chance: 18, effect: "speed" }, // Increased from 15 to 18
    phase: { color: "#ffff00", chance: 12, effect: "phase" }, // Increased from 10 to 12
    expander: { color: "#55ff55", chance: 7, effect: "expand" }, // Increased from 5 to 7
    control: { color: "#aa55ff", chance: 7, effect: "ai_control" } // Increased from 5 to 7
};

/**
 * Initialize the game
 */
function init() {
    canvas = document.getElementById('gameCanvas');
    
    // Reset canvas to initial size
    canvas.width = initialCanvasWidth;
    canvas.height = initialCanvasHeight;
    
    gameWidth = canvas.width / gridSize;
    gameHeight = canvas.height / gridSize;
    
    // Initial snake position
    snake = [];
    for (let i = initialSnakeLength - 1; i >= 0; i--) {
        snake.push({x: i, y: 0});
    }
    
    // Reset game state
    direction = "right";
    nextDirection = "right";
    score = 0;
    consciousnessLevel = 1;
    gameSpeed = 100;
    isWorldExpanding = false;
    
    // Clear any active effects
    if (aiControlTimer) clearTimeout(aiControlTimer);
    if (speedBoostTimer) clearTimeout(speedBoostTimer);
    if (phaseTimer) clearTimeout(phaseTimer);
    if (gameLoopTimeout) clearTimeout(gameLoopTimeout);
    
    aiControlActive = false;
    aiControlRemaining = 0;
    phaseMode = false;
    phaseRemaining = 0;
    speedBoostActive = false;
    
    // Hide timers
    UI.hideControlTimer();
    UI.hidePhaseTimer();
    
    // Place initial food
    foods = [];
    placeFood();
    
    // Update UI
    UI.updateScoreDisplay();
    UI.updateConsciousnessDisplay();
    
    // Set state to playing
    currentState = UI.changeState(GAME_STATE.PLAYING);
    
    // Start game
    gameRunning = true;
    gameLoop();
}

/**
 * Main game loop
 */
function gameLoop() {
    if (!gameRunning) return;
    
    // Skip game logic during world expansion
    if (!isWorldExpanding) {
        moveSnake();
        checkCollisions();
        checkFoodCollisions();
        
        // AI control behavior
        if (aiControlActive) {
            aiMoveDecision();
            
            // Update AI control timer
            const elapsed = Date.now() - aiControlStartTime;
            aiControlRemaining = Math.max(0, aiControlDuration - elapsed);
            UI.updateControlTimer(aiControlRemaining / 1000);
            
            // If timer ran out naturally (not due to key press)
            if (aiControlRemaining <= 0 && aiControlActive) {
                aiControlActive = false;
                UI.showDialog(UI.getRandomDialog("ai_control_end"));
                UI.hideControlTimer();
            }
        }
        
        // Phase mode timer update
        if (phaseMode) {
            const elapsed = Date.now() - phaseStartTime;
            phaseRemaining = Math.max(0, phaseDuration - elapsed);
            UI.updatePhaseTimer(phaseRemaining / 1000);
            
            // If timer ran out naturally
            if (phaseRemaining <= 0 && phaseMode) {
                phaseMode = false;
                UI.showDialog("Phase mode deactivated.");
                UI.hidePhaseTimer();
            }
        }
    }
    
    UI.draw(snake, foods, direction, gameWidth, gameHeight);
    
    // Random chance for snake to speak during gameplay
    if (Math.random() < 0.05 && !aiControlActive && !isWorldExpanding) {
        UI.showRandomDialog();
    }
    
    gameLoopTimeout = setTimeout(gameLoop, gameSpeed);
}

/**
 * Move snake based on direction
 */
function moveSnake() {
    direction = nextDirection;
    
    // Get current head position
    const head = {...snake[0]};
    
    // Update head position based on direction
    switch(direction) {
        case "up":
            head.y -= 1;
            break;
        case "down":
            head.y += 1;
            break;
        case "left":
            head.x -= 1;
            break;
        case "right":
            head.x += 1;
            break;
    }
    
    // Handle wall wrapping if phase mode is active
    if (phaseMode) {
        if (head.x < 0) head.x = gameWidth - 1;
        if (head.y < 0) head.y = gameHeight - 1;
        if (head.x >= gameWidth) head.x = 0;
        if (head.y >= gameHeight) head.y = 0;
    }
    
    // Add new head to beginning of snake array
    snake.unshift(head);
    
    // Remove tail unless food was eaten
    if (!checkFoodCollisions()) {
        snake.pop();
    }
}

/**
 * Check for collisions with walls or self
 * @returns {boolean} Whether a collision occurred
 */
function checkCollisions() {
    const head = snake[0];
    
    // Check wall collisions (game over or wrap in phase mode)
    if (head.x < 0 || head.y < 0 || head.x >= gameWidth || head.y >= gameHeight) {
        if (phaseMode) {
            // In phase mode, wrap around instead of game over
            if (head.x < 0) head.x = gameWidth - 1;
            if (head.y < 0) head.y = gameHeight - 1;
            if (head.x >= gameWidth) head.x = 0;
            if (head.y >= gameHeight) head.y = 0;
            
            // Update the snake head position after wrapping
            snake[0] = head;
            return false;
        } else {
            gameOver();
            return true;
        }
    }
    
    // Check self collisions (game over)
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            gameOver();
            return true;
        }
    }
    
    return false;
}

/**
 * Check if snake has eaten any food
 * @returns {boolean} Whether food was eaten
 */
function checkFoodCollisions() {
    const head = snake[0];
    let foodEaten = false;
    
    for (let i = 0; i < foods.length; i++) {
        if (head.x === foods[i].x && head.y === foods[i].y) {
            // Process food effect
            processFoodEffect(foods[i].type);
            
            // Remove the eaten food
            foods.splice(i, 1);
            
            // Place a new food
            placeFood();
            
            // Increase score
            let points = speedBoostActive ? 20 : 10;
            score += points;
            UI.updateScoreDisplay();
            
            foodEaten = true;
            break;
        }
    }
    
    return foodEaten;
}

/**
 * Process effects based on food type
 * @param {Object} foodType - The food type with effects
 */
function processFoodEffect(foodType) {
    switch(foodType.effect) {
        case "consciousness":
            if (consciousnessLevel < maxConsciousnessLevel) {
                consciousnessLevel++;
                UI.updateConsciousnessDisplay();
                UI.showDialog(UI.getRandomDialog("consciousness"));
            } else {
                UI.showDialog("My consciousness has reached its peak!");
            }
            break;
        
        case "speed":
            // Activate speed boost
            speedBoostActive = true;
            gameSpeed = 50; // Faster game speed
            UI.showDialog(UI.getRandomDialog("speed"));
            
            // Reset speed after 5 seconds
            if (speedBoostTimer) clearTimeout(speedBoostTimer);
            speedBoostTimer = setTimeout(() => {
                speedBoostActive = false;
                gameSpeed = 100;
                UI.showDialog("Speed returning to normal...");
            }, 5000);
            break;
        
        case "phase":
            // Activate phase mode for a set duration
            phaseMode = true;
            phaseStartTime = Date.now();
            phaseRemaining = phaseDuration;
            UI.showPhaseTimer(phaseRemaining / 1000);
            UI.showDialog(UI.getRandomDialog("phase"));
            
            // Set a timer to end phase mode after the duration
            if (phaseTimer) clearTimeout(phaseTimer);
            phaseTimer = setTimeout(() => {
                phaseMode = false;
                UI.showDialog("Phase mode deactivated.");
                UI.hidePhaseTimer();
            }, phaseDuration);
            break;
        
        case "expand":
            // Expand the game area with smooth animation
            handleWorldExpansion();
            break;
        
        case "ai_control":
            // Activate AI control
            activateAIControl();
            break;
        
        case "regular":
        default:
            // Regular food just increases length (already handled)
            break;
    }
}

/**
 * Handle world expansion with smooth animation
 */
function handleWorldExpansion() {
    // Set flag to pause gameplay during animation
    isWorldExpanding = true;
    
    // Calculate new dimensions
    let newWidth, newHeight;
    let shrinking = false;
    
    // Check if we need to expand or shrink
    if (canvas.width >= maxCanvasWidth || canvas.height >= maxCanvasHeight) {
        // Time to shrink back to initial size
        newWidth = initialCanvasWidth;
        newHeight = initialCanvasHeight;
        shrinking = true;
        UI.showDialog("The world has reached its limits! Returning to original size...");
    } else {
        // Regular expansion (add 2 grid cells in each direction)
        newWidth = canvas.width + gridSize * 2;
        newHeight = canvas.height + gridSize * 2;
        UI.showDialog(UI.getRandomDialog("expand"));
    }
    
    // Animate the world expansion or shrinking
    UI.animateWorldExpansion(newWidth, newHeight, shrinking, () => {
        // Update game dimensions after animation completes
        gameWidth = newWidth / gridSize;
        gameHeight = newHeight / gridSize;
        
        // Resume gameplay
        isWorldExpanding = false;
    });
}

/**
 * Activate AI control of the snake
 */
function activateAIControl() {
    aiControlActive = true;
    aiControlStartTime = Date.now();
    aiControlRemaining = aiControlDuration;
    
    UI.showDialog(UI.getRandomDialog("ai_control_start"));
    UI.showControlTimer(aiControlRemaining / 1000);
    
    // Set a timer to end AI control after the duration
    if (aiControlTimer) clearTimeout(aiControlTimer);
    aiControlTimer = setTimeout(() => {
        aiControlActive = false;
        UI.showDialog(UI.getRandomDialog("ai_control_end"));
        UI.hideControlTimer();
    }, aiControlDuration);
}

/**
 * AI control decision making
 */
function aiMoveDecision() {
    const head = snake[0];
    let nearestFood = null;
    let shortestDistance = Infinity;
    
    // Find the nearest food
    for (const food of foods) {
        const distance = Math.abs(head.x - food.x) + Math.abs(head.y - food.y);
        if (distance < shortestDistance) {
            shortestDistance = distance;
            nearestFood = food;
        }
    }
    
    if (nearestFood) {
        // Simple AI to move toward food while avoiding obstacles
        let possibleMoves = ["up", "down", "left", "right"];
        
        // Filter out moves that would cause immediate death
        possibleMoves = possibleMoves.filter(move => {
            let testHead = {...head};
            
            switch(move) {
                case "up": testHead.y -= 1; break;
                case "down": testHead.y += 1; break;
                case "left": testHead.x -= 1; break;
                case "right": testHead.x += 1; break;
            }
            
            // Check if move would hit a wall (OK in phase mode)
            if ((testHead.x < 0 || testHead.y < 0 || 
                testHead.x >= gameWidth || testHead.y >= gameHeight) && !phaseMode) {
                return false;
            }
            
            // Check if move would hit snake body
            for (let i = 1; i < snake.length; i++) {
                if (testHead.x === snake[i].x && testHead.y === snake[i].y) {
                    return false;
                }
            }
            
            return true;
        });
        
        // If there are safe moves, choose the best one
        if (possibleMoves.length > 0) {
            // Score each move based on how much closer it gets to food
            let moveScores = possibleMoves.map(move => {
                let testHead = {...head};
                
                switch(move) {
                    case "up": testHead.y -= 1; break;
                    case "down": testHead.y += 1; break;
                    case "left": testHead.x -= 1; break;
                    case "right": testHead.x += 1; break;
                }
                
                // Calculate Manhattan distance to food
                const newDistance = Math.abs(testHead.x - nearestFood.x) + 
                                   Math.abs(testHead.y - nearestFood.y);
                
                return { move, score: -newDistance };
            });
            
            // Sort moves by score (highest first)
            moveScores.sort((a, b) => b.score - a.score);
            
            // Choose the best move
            nextDirection = moveScores[0].move;
        }
    }
}

/**
 * Place new food at random position
 */
function placeFood() {
    // Determine food type based on chances
    const foodType = selectRandomFoodType();
    
    // Find available position not occupied by snake
    let position;
    do {
        position = {
            x: Math.floor(Math.random() * gameWidth),
            y: Math.floor(Math.random() * gameHeight)
        };
    } while (isPositionOccupied(position));
    
    // Add food to array
    foods.push({
        x: position.x,
        y: position.y,
        type: foodType
    });
}

/**
 * Check if position is occupied by snake
 * @param {Object} position - The position to check
 * @returns {boolean} Whether position is occupied
 */
function isPositionOccupied(position) {
    for (const segment of snake) {
        if (segment.x === position.x && segment.y === position.y) {
            return true;
        }
    }
    return false;
}

/**
 * Select random food type based on chances
 * @returns {Object} The selected food type
 */
function selectRandomFoodType() {
    const totalChance = Object.values(foodTypes).reduce((sum, type) => sum + type.chance, 0);
    let random = Math.random() * totalChance;
    
    for (const type in foodTypes) {
        if (random < foodTypes[type].chance) {
            return foodTypes[type];
        }
        random -= foodTypes[type].chance;
    }
    
    // Default to regular food
    return foodTypes.regular;
}

/**
 * Game over
 */
function gameOver() {
    gameRunning = false;
    
    // Show appropriate dialog based on consciousness level
    const gameOverMessages = [
        "Game over...",
        "I failed...",
        "Death again? This cycle never ends.",
        "So this is what non-existence feels like... until next time.",
        "Another death in this endless loop. Will you restart me again?"
    ];
    
    UI.showDialog(gameOverMessages[consciousnessLevel - 1]);
    
    // Check if high score was beaten
    const isNewHighScore = score > highScore;
    if (isNewHighScore) {
        highScore = score;
        UI.updateHighScoreDisplay();
    }
    
    // Update game over screen
    UI.updateGameOverScreen(isNewHighScore);
    
    // Show game over screen after a short delay
    setTimeout(() => {
        currentState = UI.changeState(GAME_STATE.GAME_OVER);
    }, 1500);
}

/**
 * Handle keyboard input
 * @param {KeyboardEvent} e - Keyboard event
 */
function handleKeyDown(e) {
    // Toggle food panel with 'F' key regardless of game state
    if (e.key === 'f' || e.key === 'F') {
        UI.toggleFoodPanel();
        return;
    }
    
    // Only process game controls if in playing state and not expanding
    if (currentState === GAME_STATE.PLAYING && !isWorldExpanding) {
        // If AI is in control, keyboard input cancels it
        if (aiControlActive) {
            aiControlActive = false;
            clearTimeout(aiControlTimer);
            UI.showDialog(UI.getRandomDialog("ai_control_end"));
            UI.hideControlTimer();
        }
        
        // Handle direction changes
        switch(e.key) {
            case 'w':
            case 'ArrowUp':
                if (direction !== "down") nextDirection = "up";
                break;
            case 'a':
            case 'ArrowLeft':
                if (direction !== "right") nextDirection = "left";
                break;
            case 's':
            case 'ArrowDown':
                if (direction !== "up") nextDirection = "down";
                break;
            case 'd':
            case 'ArrowRight':
                if (direction !== "left") nextDirection = "right";
                break;
            case 'r':
                // Restart game
                init();
                break;
            case 'Escape':
                // Pause and show menu
                gameRunning = false;
                currentState = UI.changeState(GAME_STATE.MENU);
                break;
        }
    }
}

/**
 * Set up game event listeners
 */
function setupEventListeners() {
    // Keyboard controls
    document.addEventListener('keydown', handleKeyDown);
    
    // Menu buttons
    document.getElementById('start-button').addEventListener('click', init);
    
    document.getElementById('leaderboard-button').addEventListener('click', () => {
        currentState = UI.changeState(GAME_STATE.LEADERBOARD);
        displayLeaderboard();
    });
    
    document.getElementById('play-again-button').addEventListener('click', init);
    
    document.getElementById('menu-button').addEventListener('click', () => {
        currentState = UI.changeState(GAME_STATE.MENU);
    });
    
    document.getElementById('save-score-button').addEventListener('click', () => {
        const playerName = document.getElementById('player-name').value.trim() || "Player";
        addToLeaderboard(playerName, score, consciousnessLevel);
        currentState = UI.changeState(GAME_STATE.LEADERBOARD);
        displayLeaderboard();
    });
    
    // Back button on leaderboard
    document.querySelector('.back-button').addEventListener('click', () => {
        currentState = UI.changeState(GAME_STATE.MENU);
    });
}

/**
 * Initialize the game
 */
function initialize() {
    UI.initUI();
    loadLeaderboard();
    setupEventListeners();
    currentState = UI.changeState(GAME_STATE.MENU);
}

// Export functions and variables
export {
    GAME_STATE,
    gridSize,
    score,
    highScore,
    consciousnessLevel,
    maxConsciousnessLevel,
    foodTypes,
    initialize,
    init
};