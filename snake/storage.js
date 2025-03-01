/**
 * snake/storage.js
 * Handles leaderboard functionality and localStorage operations
 */

// Leaderboard data
let leaderboard = [];

/**
 * Load leaderboard from localStorage
 */
function loadLeaderboard() {
    const savedLeaderboard = localStorage.getItem('snakeLeaderboard');
    if (savedLeaderboard) {
        leaderboard = JSON.parse(savedLeaderboard);
    } else {
        // Default entries if none exist
        leaderboard = [
            { name: "AI", score: 200, consciousness: 3 },
            { name: "CPU", score: 150, consciousness: 2 },
            { name: "BOT", score: 100, consciousness: 1 }
        ];
        saveLeaderboard();
    }
}

/**
 * Save leaderboard to localStorage
 */
function saveLeaderboard() {
    localStorage.setItem('snakeLeaderboard', JSON.stringify(leaderboard));
}

/**
 * Add new score to leaderboard
 * @param {string} name - Player name
 * @param {number} score - Player score
 * @param {number} consciousness - Consciousness level
 */
function addToLeaderboard(name, score, consciousness) {
    leaderboard.push({
        name: name || "???",
        score: score,
        consciousness: consciousness
    });
    
    // Sort by score (highest first)
    leaderboard.sort((a, b) => b.score - a.score);
    
    // Keep only top 10
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }
    
    saveLeaderboard();
}

/**
 * Display leaderboard in the DOM
 */
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = '';
    
    leaderboard.forEach((entry, index) => {
        const entryElement = document.createElement('div');
        entryElement.className = 'leaderboard-entry';
        
        // Get color based on consciousness level
        const colors = ['#fff', '#0ff', '#0f0', '#ff0', '#f0f'];
        const color = colors[Math.min(entry.consciousness - 1, colors.length - 1)];
        
        entryElement.innerHTML = `
            <span>${index + 1}. ${entry.name} 
                <span class="consciousness-indicator" style="background-color: ${color}"></span>
            </span>
            <span>${entry.score}</span>
        `;
        
        leaderboardList.appendChild(entryElement);
    });
}

// Export functions
export {
    leaderboard,
    loadLeaderboard,
    saveLeaderboard,
    addToLeaderboard,
    displayLeaderboard
};