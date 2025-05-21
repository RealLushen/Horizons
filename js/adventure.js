// Adventure mechanics for Horizons RPG

// Initialize Adventure page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the adventure page
    if (!document.querySelector('.adventure-container')) return;
    
    // Initialize player data display
    updateAdventureUI();
    
    // Setup event listeners
    initAdventureEvents();
    
    // Display leaderboard
    displayLeaderboard('leaderboard');
    
    // Add initial log entry
    addLogEntry('Your adventure begins! Click "Go Further" to explore.');
});

// Initialize adventure event listeners
function initAdventureEvents() {
    const goFurtherBtn = document.getElementById('goFurtherBtn');
    
    if (goFurtherBtn) {
        goFurtherBtn.addEventListener('click', function() {
            // Disable button during cooldown
            goFurtherBtn.disabled = true;
            goFurtherBtn.classList.add('disabled');
            
            // Random cooldown between 1-10 seconds
            const cooldown = getRandomInt(1, 3); // Reduced for testing, change to 1-10 for production
            const cooldownMs = cooldown * 1000;
            
            // Update button text to show cooldown
            const originalText = goFurtherBtn.textContent;
            goFurtherBtn.textContent = `Exploring... (${cooldown}s)`;
            
            // Countdown timer
            let timeLeft = cooldown;
            const countdownInterval = setInterval(() => {
                timeLeft--;
                goFurtherBtn.textContent = `Exploring... (${timeLeft}s)`;
                
                if (timeLeft <= 0) {
                    clearInterval(countdownInterval);
                }
            }, 1000);
            
            // Process adventure step after cooldown
            setTimeout(() => {
                // Re-enable button
                goFurtherBtn.disabled = false;
                goFurtherBtn.classList.remove('disabled');
                goFurtherBtn.textContent = originalText;
                
                // Process adventure step
                processAdventureStep();
            }, cooldownMs);
        });
    }
    
    // Event delegation for encounter container
    const encounterContainer = document.getElementById('encounterContainer');
    if (encounterContainer) {
        encounterContainer.addEventListener('click', function(e) {
            // Handle encounter action buttons
            if (e.target.classList.contains('btn-attack')) {
                attackEnemy();
            } else if (e.target.classList.contains('btn-flee')) {
                fleeFromEnemy();
            } else if (e.target.classList.contains('btn-harvest')) {
                harvestResource();
            } else if (e.target.classList.contains('btn-take-item')) {
                takeItem();
            }
        });
    }
}

// Process a step in the adventure
function processAdventureStep() {
    // Get player data
    const playerData = getPlayerData();
    
    // Add basic rewards for exploring (XP and gold)
    const baseXp = Math.round(5 + (playerData.level * 0.5));
    const xpGained = getRandomInt(Math.max(1, baseXp - 2), baseXp + 2);
    
    const baseGold = Math.round(1 + (playerData.level * 0.2));
    const goldGained = getRandomInt(Math.max(1, baseGold - 1), baseGold + 1);
    
    // Add XP and gold
    addExperience(xpGained);
    addGold(goldGained);
    
    // Increment steps counter
    incrementCounter('stepsCount');
    
    // Log step
    addLogEntry(`You took a step forward. (+${xpGained} XP, +${goldGained} gold)`);
    
    // Determine what the player encounters
    determineEncounter();
    
    // Update UI
    updateAdventureUI();
}

// Determine what the player encounters
function determineEncounter() {
    // Roll to determine encounter type
    const roll = Math.random() * 100;
    let encounterType;
    let currentTotal = 0;
    
    // Check what type of encounter based on configured chances
    for (const type in ENCOUNTER_CHANCES) {
        currentTotal += ENCOUNTER_CHANCES[type];
        if (roll < currentTotal) {
            encounterType = type;
            break;
        }
    }
    
    // Process encounter based on type
    switch (encounterType) {
        case 'ENEMY':
            encounterEnemy();
            break;
        case 'MINERAL':
            encounterResource('MINERAL');
            break;
        case 'TREE':
            encounterResource('TREE');
            break;
        case 'LAKE':
            encounterResource('LAKE');
            break;
        case 'ITEM':
            encounterItem();
            break;
        case 'NOTHING':
        default:
            encounterNothing();
            break;
    }
}

// Encounter an enemy
function encounterEnemy() {
    const playerData = getPlayerData();
    const enemy = generateRandomEnemy(playerData.level);
    
    // Store enemy data in session storage for combat
    sessionStorage.setItem('current_enemy', JSON.stringify(enemy));
    
    // Create enemy encounter UI
    const encounterHtml = `
        <div class="monster-card">
            <div class="monster-level">Level ${enemy.level}</div>
            <div class="monster-image">${enemy.emoji}</div>
            <div class="monster-name">${enemy.name}</div>
            <div class="monster-description">${enemy.description}</div>
            <div class="monster-stats">
                <div class="monster-health">
                    <span>HP: ${enemy.health}/${enemy.maxHealth}</span>
                    <div class="progress-container">
                        <div class="progress-bar" style="width: 100%"></div>
                    </div>
                </div>
                <div class="monster-damage">DMG: ${enemy.damage.min}-${enemy.damage.max}</div>
            </div>
            <div class="monster-actions">
                <button class="btn btn-danger btn-attack">Attack</button>
                <button class="btn btn-secondary btn-flee">Flee</button>
            </div>
        </div>
    `;
    
    // Update encounter container
    document.getElementById('encounterContainer').innerHTML = encounterHtml;
    
    // Log encounter
    addLogEntry(`You encountered a Level ${enemy.level} ${enemy.name}! Prepare for battle!`);
}

// Encounter a resource (mineral, tree, or lake)
function encounterResource(resourceType) {
    let resourceName, resourceEmoji, resourceSkill;
    
    switch (resourceType) {
        case 'MINERAL':
            resourceName = 'Mineral Deposit';
            resourceEmoji = '⛏️';
            resourceSkill = 'mining';
            incrementCounter('mineralsGathered');
            break;
        case 'TREE':
            resourceName = 'Ancient Tree';
            resourceEmoji = '🌲';
            resourceSkill = 'woodcutting';
            incrementCounter('treesGathered');
            break;
        case 'LAKE':
            resourceName = 'Clear Lake';
            resourceEmoji = '🌊';
            resourceSkill = 'fishing';
            incrementCounter('lakesGathered');
            break;
        default:
            resourceName = 'Strange Resource';
            resourceEmoji = '❓';
            resourceSkill = 'mining';
    }
    
    // Store resource data in session storage
    sessionStorage.setItem('current_resource', JSON.stringify({
        type: resourceType,
        skill: resourceSkill
    }));
    
    // Create resource encounter UI
    const encounterHtml = `
        <div class="resource-card">
            <div class="resource-icon">${resourceEmoji}</div>
            <div class="resource-details">
                <div class="resource-title">${resourceName}</div>
                <div class="resource-description">You've discovered a ${resourceName.toLowerCase()}. You can harvest materials from it.</div>
            </div>
            <button class="btn btn-primary btn-harvest">Harvest Material</button>
        </div>
    `;
    
    // Update encounter container
    document.getElementById('encounterContainer').innerHTML = encounterHtml;
    
    // Log encounter
    addLogEntry(`You discovered a ${resourceName.toLowerCase()}. You can harvest materials from it.`);
}

// Encounter an item
function encounterItem() {
    const playerData = getPlayerData();
    const item = generateRandomItem(playerData.level);
    
    // Store item data in session storage
    sessionStorage.setItem('current_item', JSON.stringify(item));
    
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
    // Create item encounter UI
    const encounterHtml = `
        <div class="item-found-card">
            <div class="item-found-icon">${item.emoji || '📦'}</div>
            <div class="item-found-details">
                <div class="item-found-title">You found an item!</div>
                <div class="item-found-name ${rarityClass}">${rarityEmoji} ${item.name}</div>
                <div class="item-found-description">${item.description || 'An item you can use or sell.'}</div>
                <div class="item-found-stats">
                    ${item.type === ITEM_TYPE.WEAPON ? 
                        `<div class="item-stat">Damage: ${item.damageMin}-${item.damageMax}</div>` : 
                        item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL ? 
                        `<div class="item-stat">Health: +${item.health}</div>` : ''}
                    <div class="item-stat">Value: ${item.value} gold</div>
                    ${item.levelReq ? `<div class="item-stat">Required Level: ${item.levelReq}</div>` : ''}
                </div>
            </div>
            <button class="btn btn-primary btn-take-item">Take Item</button>
        </div>
    `;
    
    // Update encounter container
    document.getElementById('encounterContainer').innerHTML = encounterHtml;
    
    // Log encounter
    addLogEntry(`You found a ${item.rarity} ${item.name}!`);
}

// Encounter nothing special
function encounterNothing() {
    // Random peaceful encounters
    const peacefulEncounters = [
        { text: "You walk through a peaceful meadow. Nothing of interest here.", emoji: "🌼" },
        { text: "The path ahead is clear. You continue your journey undisturbed.", emoji: "🛤️" },
        { text: "You rest for a moment under the shade of a large tree.", emoji: "🌳" },
        { text: "A gentle breeze blows through the area. It's quite refreshing.", emoji: "🍃" },
        { text: "You spot some birds flying overhead. They pay you no mind.", emoji: "🐦" },
        { text: "The sun shines brightly overhead. It's a beautiful day.", emoji: "☀️" },
        { text: "You cross a small stream. The water is crystal clear.", emoji: "💧" },
        { text: "A small rabbit hops across your path before disappearing into the bushes.", emoji: "🐇" },
        { text: "You find a comfortable spot and take a short break.", emoji: "⏸️" },
        { text: "The area is quiet and serene. Nothing happens.", emoji: "😌" }
    ];
    
    // Select a random encounter
    const encounter = peacefulEncounters[Math.floor(Math.random() * peacefulEncounters.length)];
    
    // Create peaceful encounter UI
    const encounterHtml = `
        <div class="peaceful-encounter">
            <div class="peaceful-emoji">${encounter.emoji}</div>
            <div class="peaceful-text">${encounter.text}</div>
        </div>
    `;
    
    // Update encounter container
    document.getElementById('encounterContainer').innerHTML = encounterHtml;
    
    // Log encounter
    addLogEntry(encounter.text);
}

// Attack the current enemy
function attackEnemy() {
    // Get player and enemy data
    const playerData = getPlayerData();
    const enemy = JSON.parse(sessionStorage.getItem('current_enemy'));
    
    if (!enemy) return;
    
    // Calculate player damage
    const playerDamageRange = calculateDamageRange(playerData);
    const playerDamage = getRandomInt(playerDamageRange.min, playerDamageRange.max);
    
    // Apply damage to enemy
    enemy.health -= playerDamage;
    
    // Log attack
    addLogEntry(`You attack the ${enemy.name} for ${playerDamage} damage!`);
    
    // Check if enemy is defeated
    if (enemy.health <= 0) {
        defeatEnemy(enemy);
        return;
    }
    
    // Enemy attacks back
    const enemyDamage = enemyAttack(enemy);
    
    // Apply damage to player
    const playerDied = takeDamage(enemyDamage);
    
    // Log enemy attack
    addLogEntry(`The ${enemy.name} attacks you for ${enemyDamage} damage!`);
    
    // Check if player died
    if (playerDied) {
        // Player died, end combat
        document.getElementById('encounterContainer').innerHTML = '';
        addLogEntry(`You were defeated by the ${enemy.name}!`);
        return;
    }
    
    // Update enemy UI
    updateEnemyUI(enemy);
    
    // Update combat session storage
    sessionStorage.setItem('current_enemy', JSON.stringify(enemy));
    
    // Update player UI
    updateAdventureUI();
}

// Flee from the current enemy
function fleeFromEnemy() {
    const enemy = JSON.parse(sessionStorage.getItem('current_enemy'));
    
    if (!enemy) return;
    
    // 70% chance to flee successfully
    if (Math.random() < 0.7) {
        // Successful flee
        addLogEntry(`You successfully fled from the ${enemy.name}!`);
        document.getElementById('encounterContainer').innerHTML = '';
        sessionStorage.removeItem('current_enemy');
    } else {
        // Failed flee, enemy gets a free attack
        const enemyDamage = enemyAttack(enemy);
        const playerDied = takeDamage(enemyDamage);
        
        addLogEntry(`You failed to flee! The ${enemy.name} attacks you for ${enemyDamage} damage!`);
        
        // Check if player died
        if (playerDied) {
            // Player died, end combat
            document.getElementById('encounterContainer').innerHTML = '';
            addLogEntry(`You were defeated by the ${enemy.name}!`);
            return;
        }
        
        // Update player UI
        updateAdventureUI();
    }
}

// Defeat the enemy
function defeatEnemy(enemy) {
    // Calculate rewards
    const xpGained = enemy.experience;
    const goldGained = enemy.gold;
    
    // Add rewards
    addExperience(xpGained);
    addGold(goldGained);
    
    // Increment counter
    incrementCounter('monstersKilled');
    
    // Log victory
    addLogEntry(`You defeated the ${enemy.name}! (+${xpGained} XP, +${goldGained} gold)`);
    
    // Check for item drop
    if (shouldDropItem(enemy)) {
        const playerData = getPlayerData();
        const item = generateRandomItem(playerData.level);
        addItemToInventory(item);
        
        // Log item drop
        addLogEntry(`The ${enemy.name} dropped a ${item.rarity} ${item.name}!`);
    }
    
    // Clear encounter
    document.getElementById('encounterContainer').innerHTML = '';
    sessionStorage.removeItem('current_enemy');
    
    // Update UI
    updateAdventureUI();
}

// Harvest the current resource
function harvestResource() {
    // Get resource data
    const resourceData = JSON.parse(sessionStorage.getItem('current_resource'));
    const playerData = getPlayerData();
    
    if (!resourceData) return;
    
    // Get corresponding skill level
    const skillLevel = playerData.skills[resourceData.skill].level;
    
    // Determine material type based on resource
    let materialType;
    switch (resourceData.type) {
        case 'MINERAL':
            materialType = MATERIAL_TYPE.ORE;
            break;
        case 'TREE':
            materialType = MATERIAL_TYPE.WOOD;
            break;
        case 'LAKE':
            materialType = MATERIAL_TYPE.FISH;
            break;
        default:
            materialType = MATERIAL_TYPE.ORE;
    }
    
    // Generate material
    const material = generateMaterial(materialType, skillLevel);
    
    // Add to inventory
    addItemToInventory(material);
    
    // Calculate skill XP gained - base amount plus random bonus
    const baseSkillXp = 5 + skillLevel;
    const skillXpGained = getRandomInt(baseSkillXp, baseSkillXp + 5);
    
    // Add skill XP
    addSkillExperience(resourceData.skill, skillXpGained);
    
    // Calculate main XP gained
    const baseXp = 10 + playerData.level;
    const xpGained = getRandomInt(baseXp, baseXp + 10);
    
    // Add main XP
    addExperience(xpGained);
    
    // Log harvest
    addLogEntry(`You harvested ${material.name}! (+${skillXpGained} ${resourceData.skill} XP, +${xpGained} XP)`);
    
    // Clear encounter
    document.getElementById('encounterContainer').innerHTML = '';
    sessionStorage.removeItem('current_resource');
    
    // Update UI
    updateAdventureUI();
}

// Take the current item
function takeItem() {
    // Get item data
    const item = JSON.parse(sessionStorage.getItem('current_item'));
    
    if (!item) return;
    
    // Add to inventory
    addItemToInventory(item);
    
    // Log item taken
    addLogEntry(`You took the ${item.name} and added it to your inventory.`);
    
    // Clear encounter
    document.getElementById('encounterContainer').innerHTML = '';
    sessionStorage.removeItem('current_item');
}

// Update enemy UI during combat
function updateEnemyUI(enemy) {
    const healthPercentage = (enemy.health / enemy.maxHealth) * 100;
    const healthBar = document.querySelector('.monster-card .progress-bar');
    const healthText = document.querySelector('.monster-card .monster-health span');
    
    if (healthBar) {
        healthBar.style.width = `${healthPercentage}%`;
    }
    
    if (healthText) {
        healthText.textContent = `HP: ${Math.max(0, enemy.health)}/${enemy.maxHealth}`;
    }
}

// Update adventure UI elements
function updateAdventureUI() {
    const playerData = getPlayerData();
    
    // Update player info in header
    document.getElementById('playerGold').textContent = `${playerData.gold}g`;
    document.getElementById('playerLevel').textContent = `Lvl ${playerData.level}`;
    
    // Update health bar
    document.getElementById('playerHealth').textContent = `${playerData.stats.health}/${playerData.stats.maxHealth}`;
    const healthPercentage = (playerData.stats.health / playerData.stats.maxHealth) * 100;
    document.getElementById('healthBar').style.width = `${healthPercentage}%`;
    
    // Update XP bar
    document.getElementById('playerExperience').textContent = `${playerData.experience}/${playerData.experienceToNextLevel}`;
    const xpPercentage = (playerData.experience / playerData.experienceToNextLevel) * 100;
    document.getElementById('xpBar').style.width = `${xpPercentage}%`;
    
    // Update sidebar player stats
    document.getElementById('playerAvatar').src = `assets/avatars/${playerData.avatar}.png`;
    document.getElementById('playerName').textContent = playerData.username;
    document.getElementById('statLevel').textContent = playerData.level;
    
    const damageRange = calculateDamageRange(playerData);
    document.getElementById('statDamage').textContent = `${damageRange.min}-${damageRange.max}`;
    
    document.getElementById('statHealth').textContent = `${playerData.stats.health}/${playerData.stats.maxHealth}`;
    document.getElementById('statGold').textContent = playerData.gold;
}

// Add entry to adventure log
function addLogEntry(message) {
    const logContainer = document.getElementById('adventureLog');
    
    if (!logContainer) return;
    
    // Create new log entry
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = message;
    
    // Add to log
    logContainer.appendChild(entry);
    
    // Scroll to bottom
    logContainer.scrollTop = logContainer.scrollHeight;
    
    // Limit log entries (keep last 20)
    while (logContainer.children.length > 20) {
        logContainer.removeChild(logContainer.firstChild);
    }
}