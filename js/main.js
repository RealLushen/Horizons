// Main JavaScript file for Horizons RPG

// Check if user already has data in localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the start screen
    const startScreen = document.getElementById('startScreen');
    if (startScreen) {
        // Check if user already has a profile
        if (localStorage.getItem('horizons_player')) {
            // User has already created a profile, redirect to adventure page
            window.location.href = 'adventure.html';
        } else {
            initStartScreen();
        }
    }
    
    // Initialize navigation active state based on current page
    initNavigation();
});

// Initialize the start screen
function initStartScreen() {
    const avatarOptions = document.querySelectorAll('.avatar-option');
    const usernameInput = document.getElementById('usernameInput');
    const startGameBtn = document.getElementById('startGameBtn');
    
    let selectedAvatar = null;
    
    // Avatar selection
    avatarOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove selected class from all options
            avatarOptions.forEach(opt => opt.classList.remove('selected'));
            
            // Add selected class to clicked option
            this.classList.add('selected');
            
            // Store selected avatar
            selectedAvatar = this.getAttribute('data-avatar');
            
            // Check if we can enable the start button
            checkStartButtonState();
        });
    });
    
    // Username input
    usernameInput.addEventListener('input', function() {
        checkStartButtonState();
    });
    
    // Start button click
    startGameBtn.addEventListener('click', function() {
        if (!this.classList.contains('disabled')) {
            createNewPlayer(usernameInput.value.trim(), selectedAvatar);
            window.location.href = 'adventure.html';
        }
    });
    
    // Function to check if start button should be enabled
    function checkStartButtonState() {
        const username = usernameInput.value.trim();
        
        if (username.length >= 3 && selectedAvatar) {
            startGameBtn.classList.remove('disabled');
        } else {
            startGameBtn.classList.add('disabled');
        }
    }
}

// Create a new player
function createNewPlayer(username, avatar) {
    // Default starting stats
    const playerData = {
        username: username,
        avatar: avatar,
        level: 1,
        experience: 0,
        experienceToNextLevel: 100,
        gold: 50,
        stats: {
            health: 100,
            maxHealth: 100,
            damage: {
                min: 2,
                max: 4
            }
        },
        equipment: {
            weapon: {
                id: "starter_axe",
                name: "Wooden Axe",
                type: "weapon",
                damageMin: 2,
                damageMax: 4,
                level: 1,
                rarity: "normal",
                value: 5
            },
            helmet: null,
            chest: null,
            hands: null,
            legs: null,
            feet: null,
            shoulders: null
        },
        inventory: [],
        counters: {
            stepsCount: 0,
            monstersKilled: 0,
            mineralsGathered: 0,
            treesGathered: 0,
            lakesGathered: 0,
            itemsFound: 0
        },
        skills: {
            mining: {
                level: 1,
                experience: 0,
                experienceToNextLevel: 50
            },
            woodcutting: {
                level: 1,
                experience: 0,
                experienceToNextLevel: 50
            },
            fishing: {
                level: 1,
                experience: 0,
                experienceToNextLevel: 50
            }
        }
    };
    
    // Save to localStorage
    localStorage.setItem('horizons_player', JSON.stringify(playerData));
    
    // Also update leaderboard if this is a new player
    updateLeaderboard(playerData);
}

// Initialize navigation
function initNavigation() {
    const currentPage = window.location.pathname.split('/').pop();
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// Show notification
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'notification-close';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => notification.remove());
    
    notification.appendChild(closeBtn);
    document.body.appendChild(notification);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        notification.classList.add('fade-out');
        setTimeout(() => notification.remove(), 500);
    }, 5000);
}

// Generate a random number between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Update player data
function updatePlayerData(newData) {
    let playerData = JSON.parse(localStorage.getItem('horizons_player'));
    playerData = { ...playerData, ...newData };
    localStorage.setItem('horizons_player', JSON.stringify(playerData));
    
    // Update leaderboard if level changed
    if (newData.level && newData.level > playerData.level) {
        updateLeaderboard(playerData);
    }
    
    return playerData;
}

// Get player data
function getPlayerData() {
    return JSON.parse(localStorage.getItem('horizons_player'));
}

// Calculate damage range
function calculateDamageRange(playerData) {
    let minDamage = playerData.stats.damage.min;
    let maxDamage = playerData.stats.damage.max;
    
    // Add weapon damage if equipped
    if (playerData.equipment.weapon) {
        minDamage += playerData.equipment.weapon.damageMin || 0;
        maxDamage += playerData.equipment.weapon.damageMax || 0;
    }
    
    return { min: minDamage, max: maxDamage };
}

// Calculate max health
function calculateMaxHealth(playerData) {
    let baseHealth = 100;
    
    // Add health from level (10 per level)
    baseHealth += (playerData.level - 1) * 10;
    
    // Add health from equipment
    const equipmentSlots = ['helmet', 'chest', 'hands', 'legs', 'feet', 'shoulders'];
    equipmentSlots.forEach(slot => {
        if (playerData.equipment[slot]) {
            baseHealth += playerData.equipment[slot].health || 0;
        }
    });
    
    return baseHealth;
}