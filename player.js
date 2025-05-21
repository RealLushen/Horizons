// Player management for Horizons RPG

// Add experience to player
function addExperience(amount) {
    const playerData = getPlayerData();
    let experience = playerData.experience + amount;
    let level = playerData.level;
    let experienceToNextLevel = playerData.experienceToNextLevel;
    
    // Check if player leveled up
    let levelsGained = 0;
    while (experience >= experienceToNextLevel) {
        level++;
        levelsGained++;
        experience -= experienceToNextLevel;
        
        // Increase XP required for next level (scales with level)
        experienceToNextLevel = Math.round(100 * Math.pow(1.2, level - 1));
    }
    
    // Update player data
    updatePlayerData({
        experience: experience,
        level: level,
        experienceToNextLevel: experienceToNextLevel,
        stats: {
            ...playerData.stats,
            maxHealth: calculateMaxHealth({ ...playerData, level }),
            health: calculateMaxHealth({ ...playerData, level }) // Heal to full on level up
        }
    });
    
    // Show notification if player leveled up
    if (levelsGained > 0) {
        showNotification(`🎉 You gained ${levelsGained} level${levelsGained > 1 ? 's' : ''}! You are now level ${level}.`, 'success');
        
        // Update leaderboard
        updateLeaderboard({ ...playerData, level });
    }
    
    return { levelsGained, newLevel: level };
}

// Add skill experience
function addSkillExperience(skill, amount) {
    const playerData = getPlayerData();
    const skillData = playerData.skills[skill];
    
    if (!skillData) return { levelsGained: 0, newLevel: 0 };
    
    let experience = skillData.experience + amount;
    let level = skillData.level;
    let experienceToNextLevel = skillData.experienceToNextLevel;
    
    // Check if skill leveled up
    let levelsGained = 0;
    while (experience >= experienceToNextLevel) {
        level++;
        levelsGained++;
        experience -= experienceToNextLevel;
        
        // Increase XP required for next level (scales with level)
        experienceToNextLevel = Math.round(50 * Math.pow(1.1, level - 1));
    }
    
    // Update player data
    const updatedSkills = { ...playerData.skills };
    updatedSkills[skill] = {
        level: level,
        experience: experience,
        experienceToNextLevel: experienceToNextLevel
    };
    
    updatePlayerData({ skills: updatedSkills });
    
    // Show notification if skill leveled up
    if (levelsGained > 0) {
        const skillNames = {
            mining: "Mining",
            woodcutting: "Woodcutting",
            fishing: "Fishing"
        };
        
        showNotification(`🎉 Your ${skillNames[skill]} skill increased to level ${level}!`, 'success');
    }
    
    return { levelsGained, newLevel: level };
}

// Add gold to player
function addGold(amount) {
    const playerData = getPlayerData();
    const updatedGold = playerData.gold + amount;
    
    updatePlayerData({ gold: updatedGold });
    
    return updatedGold;
}

// Add item to inventory
function addItemToInventory(item) {
    const playerData = getPlayerData();
    const inventory = [...playerData.inventory];
    
    // Generate a unique ID for the item if it doesn't have one
    if (!item.uniqueId) {
        item.uniqueId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    }
    
    // Add item to inventory
    inventory.push(item);
    
    // Update player data
    updatePlayerData({ inventory: inventory });
    
    // Update counter
    incrementCounter('itemsFound');
    
    return item;
}

// Remove item from inventory
function removeItemFromInventory(itemUniqueId) {
    const playerData = getPlayerData();
    const inventory = playerData.inventory.filter(item => item.uniqueId !== itemUniqueId);
    
    // Update player data
    updatePlayerData({ inventory: inventory });
    
    return inventory;
}

// Equip item
function equipItem(itemUniqueId) {
    const playerData = getPlayerData();
    const item = playerData.inventory.find(item => item.uniqueId === itemUniqueId);
    
    if (!item) return false;
    
    // Check if player meets level requirement
    if (item.levelReq && playerData.level < item.levelReq) {
        showNotification(`You need to be level ${item.levelReq} to equip this item.`, 'error');
        return false;
    }
    
    // Get the equipment slot for this item
    let equipmentSlot = '';
    
    switch (item.type) {
        case 'weapon': equipmentSlot = 'weapon'; break;
        case 'helmet': equipmentSlot = 'helmet'; break;
        case 'chest': equipmentSlot = 'chest'; break;
        case 'hands': equipmentSlot = 'hands'; break;
        case 'legs': equipmentSlot = 'legs'; break;
        case 'feet': equipmentSlot = 'feet'; break;
        case 'shoulders': equipmentSlot = 'shoulders'; break;
        default: return false; // Not an equippable item
    }
    
    // If there's already an item equipped in this slot, move it to inventory
    const currentEquippedItem = playerData.equipment[equipmentSlot];
    const newEquipment = { ...playerData.equipment };
    let newInventory = [...playerData.inventory];
    
    // Remove the item being equipped from inventory
    newInventory = newInventory.filter(invItem => invItem.uniqueId !== itemUniqueId);
    
    // Add previously equipped item to inventory (if any)
    if (currentEquippedItem) {
        newInventory.push(currentEquippedItem);
    }
    
    // Equip the new item
    newEquipment[equipmentSlot] = item;
    
    // Update player data
    const updatedStats = { ...playerData.stats };
    
    // Recalculate stats based on equipment
    if (item.type === 'weapon') {
        // Weapon affects damage
    } else {
        // Armor affects health
        updatedStats.maxHealth = calculateMaxHealth({ 
            ...playerData, 
            equipment: newEquipment 
        });
        
        // Don't reduce current health if max health increased
        if (updatedStats.maxHealth > playerData.stats.maxHealth) {
            updatedStats.health = updatedStats.maxHealth;
        }
    }
    
    // Update player data
    updatePlayerData({
        equipment: newEquipment,
        inventory: newInventory,
        stats: updatedStats
    });
    
    // Show notification
    showNotification(`Equipped ${item.name}.`, 'success');
    
    return true;
}

// Unequip item
function unequipItem(equipmentSlot) {
    const playerData = getPlayerData();
    const equipment = { ...playerData.equipment };
    const item = equipment[equipmentSlot];
    
    if (!item) return false;
    
    // Check if inventory is full (optional feature, can be modified)
    // For now, we'll assume unlimited inventory
    
    // Add equipped item to inventory
    const inventory = [...playerData.inventory, item];
    
    // Remove item from equipment slot
    equipment[equipmentSlot] = null;
    
    // Update player stats
    const updatedStats = { ...playerData.stats };
    
    // Recalculate stats based on equipment
    if (equipmentSlot === 'weapon') {
        // Weapon affects damage
        // Reset to base damage if weapon is unequipped
        updatedStats.damage = { min: 2, max: 4 };
    } else {
        // Armor affects health
        updatedStats.maxHealth = calculateMaxHealth({
            ...playerData,
            equipment: equipment
        });
        
        // Reduce current health if it's more than max health
        if (updatedStats.health > updatedStats.maxHealth) {
            updatedStats.health = updatedStats.maxHealth;
        }
    }
    
    // Update player data
    updatePlayerData({
        equipment: equipment,
        inventory: inventory,
        stats: updatedStats
    });
    
    // Show notification
    showNotification(`Unequipped ${item.name}.`, 'success');
    
    return true;
}

// Increment counter
function incrementCounter(counterName, amount = 1) {
    const playerData = getPlayerData();
    const counters = { ...playerData.counters };
    
    if (counters[counterName] !== undefined) {
        counters[counterName] += amount;
        updatePlayerData({ counters: counters });
    }
    
    return counters[counterName];
}

// Take damage
function takeDamage(amount) {
    const playerData = getPlayerData();
    let health = playerData.stats.health;
    
    health -= amount;
    
    // Update player data
    updatePlayerData({
        stats: {
            ...playerData.stats,
            health: health
        }
    });
    
    // Check if player died
    if (health <= 0) {
        playerDeath();
        return true; // Player died
    }
    
    return false; // Player still alive
}

// Player death
function playerDeath() {
    const playerData = getPlayerData();
    
    // Calculate gold loss (1% of total gold)
    const goldLoss = Math.round(playerData.gold * 0.01);
    let newGold = playerData.gold - goldLoss;
    if (newGold < 0) newGold = 0;
    
    // 1% chance to lose an item
    let inventory = [...playerData.inventory];
    let lostItem = null;
    
    if (inventory.length > 0 && Math.random() < 0.01) {
        // Select random item
        const randomIndex = Math.floor(Math.random() * inventory.length);
        lostItem = inventory[randomIndex];
        
        // Remove item from inventory
        inventory.splice(randomIndex, 1);
    }
    
    // Heal player to 50% of max health
    const healAmount = Math.round(playerData.stats.maxHealth * 0.5);
    
    // Update player data
    updatePlayerData({
        gold: newGold,
        inventory: inventory,
        stats: {
            ...playerData.stats,
            health: healAmount
        }
    });
    
    // Show notification
    let message = `You were defeated! You lost ${goldLoss} gold.`;
    if (lostItem) {
        message += ` You also lost ${lostItem.name}.`;
    }
    
    showNotification(message, 'error');
}

// Heal player
function healPlayer(amount) {
    const playerData = getPlayerData();
    const maxHealth = playerData.stats.maxHealth;
    let newHealth = playerData.stats.health + amount;
    
    // Cap health at max health
    if (newHealth > maxHealth) {
        newHealth = maxHealth;
    }
    
    // Update player data
    updatePlayerData({
        stats: {
            ...playerData.stats,
            health: newHealth
        }
    });
    
    return newHealth;
}