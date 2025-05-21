// Character page functionality for Horizons RPG

// Initialize Character page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the character page
    if (!document.querySelector('.character-container')) return;
    
    // Setup event listeners
    initCharacterEvents();
    
    // Load character data
    loadCharacterData();
});

// Initialize character event listeners
function initCharacterEvents() {
    // Modal close button
    const modalCloseBtn = document.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeEquipmentModal();
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('equipmentModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeEquipmentModal();
            }
        });
    }
    
    // Equipment slot clicks
    const equipmentSlots = document.querySelectorAll('.equipment-slot');
    equipmentSlots.forEach(slot => {
        slot.addEventListener('click', function() {
            const slotName = this.getAttribute('data-slot');
            openEquipmentModal(slotName);
        });
    });
}

// Load character data
function loadCharacterData() {
    const playerData = getPlayerData();
    
    // Basic character info
    document.getElementById('characterName').textContent = playerData.username;
    document.getElementById('characterLevel').textContent = playerData.level;
    document.getElementById('characterAvatar').src = `assets/avatars/${playerData.avatar}.png`;
    
    // Level progress
    document.getElementById('levelProgress').textContent = `${playerData.experience}/${playerData.experienceToNextLevel}`;
    const levelProgressPercentage = (playerData.experience / playerData.experienceToNextLevel) * 100;
    document.getElementById('levelProgressBar').style.width = `${levelProgressPercentage}%`;
    
    // Combat stats
    document.getElementById('statHealth').textContent = `${playerData.stats.health}/${playerData.stats.maxHealth}`;
    const damageRange = calculateDamageRange(playerData);
    document.getElementById('statDamage').textContent = `${damageRange.min}-${damageRange.max}`;
    
    // Gathering skills
    document.getElementById('miningLevel').textContent = playerData.skills.mining.level;
    const miningProgressPercentage = (playerData.skills.mining.experience / playerData.skills.mining.experienceToNextLevel) * 100;
    document.getElementById('miningProgressBar').style.width = `${miningProgressPercentage}%`;
    
    document.getElementById('woodcuttingLevel').textContent = playerData.skills.woodcutting.level;
    const woodcuttingProgressPercentage = (playerData.skills.woodcutting.experience / playerData.skills.woodcutting.experienceToNextLevel) * 100;
    document.getElementById('woodcuttingProgressBar').style.width = `${woodcuttingProgressPercentage}%`;
    
    document.getElementById('fishingLevel').textContent = playerData.skills.fishing.level;
    const fishingProgressPercentage = (playerData.skills.fishing.experience / playerData.skills.fishing.experienceToNextLevel) * 100;
    document.getElementById('fishingProgressBar').style.width = `${fishingProgressPercentage}%`;
    
    // Equipment
    loadEquipment(playerData.equipment);
    
    // Adventure statistics
    document.getElementById('stepsCount').textContent = playerData.counters.stepsCount;
    document.getElementById('monstersKilled').textContent = playerData.counters.monstersKilled;
    document.getElementById('mineralsGathered').textContent = playerData.counters.mineralsGathered;
    document.getElementById('treesGathered').textContent = playerData.counters.treesGathered;
    document.getElementById('lakesGathered').textContent = playerData.counters.lakesGathered;
    document.getElementById('itemsFound').textContent = playerData.counters.itemsFound;
    
    // Player info in header
    document.getElementById('playerGold').textContent = `${playerData.gold}g`;
    document.getElementById('playerLevel').textContent = `Lvl ${playerData.level}`;
}

// Load equipment data
function loadEquipment(equipment) {
    // Equipment slots
    const slots = ['helmet', 'shoulders', 'chest', 'hands', 'legs', 'feet', 'weapon'];
    
    // Update each equipment slot
    slots.forEach(slot => {
        const slotElement = document.getElementById(`${slot}Slot`);
        
        if (!slotElement) return;
        
        // Check if slot has an item
        if (equipment[slot]) {
            const item = equipment[slot];
            const rarityClass = getRarityColorClass(item.rarity);
            
            slotElement.innerHTML = `
                <div class="equipped-item ${rarityClass}">
                    <div class="equipped-item-icon">${item.emoji || '📦'}</div>
                    <div class="equipped-item-name">${item.name}</div>
                </div>
            `;
        } else {
            // Empty slot
            slotElement.innerHTML = `<div class="empty-slot">Empty</div>`;
        }
    });
}

// Open equipment modal
function openEquipmentModal(slotName) {
    const playerData = getPlayerData();
    const equippedItem = playerData.equipment[slotName];
    
    // Determine slot type (for filtering available items)
    let slotType;
    switch (slotName) {
        case 'helmet': slotType = ITEM_TYPE.HELMET; break;
        case 'shoulders': slotType = ITEM_TYPE.SHOULDERS; break;
        case 'chest': slotType = ITEM_TYPE.CHEST; break;
        case 'hands': slotType = ITEM_TYPE.HANDS; break;
        case 'legs': slotType = ITEM_TYPE.LEGS; break;
        case 'feet': slotType = ITEM_TYPE.FEET; break;
        case 'weapon': slotType = ITEM_TYPE.WEAPON; break;
        default: return;
    }
    
    // Filter inventory for items that can be equipped in this slot
    const availableItems = playerData.inventory.filter(item => item.type === slotType);
    
    // Create modal content
    let modalContent = `
        <div class="equipment-modal-header">
            <h3>${capitalizeFirstLetter(slotName)} Slot</h3>
        </div>
    `;
    
    // Add currently equipped item (if any)
    if (equippedItem) {
        const rarityClass = getRarityColorClass(equippedItem.rarity);
        const rarityEmoji = getRarityEmoji(equippedItem.rarity);
        
        modalContent += `
            <div class="currently-equipped">
                <h4>Currently Equipped</h4>
                <div class="equipped-item-details">
                    <div class="equipped-item-icon">${equippedItem.emoji || '📦'}</div>
                    <div class="equipped-item-info">
                        <div class="equipped-item-name ${rarityClass}">${rarityEmoji} ${equippedItem.name}</div>
                        <div class="equipped-item-stats">
                            ${equippedItem.type === ITEM_TYPE.WEAPON ? 
                                `<span>Damage: ${equippedItem.damageMin}-${equippedItem.damageMax}</span>` : 
                                `<span>Health: +${equippedItem.health}</span>`}
                        </div>
                    </div>
                    <button class="btn btn-danger btn-sm" onclick="unequipItem('${slotName}')">Unequip</button>
                </div>
            </div>
        `;
    }
    
    // Add available items from inventory
    if (availableItems.length > 0) {
        modalContent += `
            <div class="available-equipment">
                <h4>Available ${capitalizeFirstLetter(slotName)}s</h4>
                <div class="available-items-list">
        `;
        
        availableItems.forEach(item => {
            const rarityClass = getRarityColorClass(item.rarity);
            const rarityEmoji = getRarityEmoji(item.rarity);
            const meetsLevelReq = !item.levelReq || playerData.level >= item.levelReq;
            
            modalContent += `
                <div class="available-item ${!meetsLevelReq ? 'item-unavailable' : ''}">
                    <div class="available-item-icon">${item.emoji || '📦'}</div>
                    <div class="available-item-info">
                        <div class="available-item-name ${rarityClass}">${rarityEmoji} ${item.name}</div>
                        <div class="available-item-stats">
                            ${item.type === ITEM_TYPE.WEAPON ? 
                                `<span>Damage: ${item.damageMin}-${item.damageMax}</span>` : 
                                `<span>Health: +${item.health}</span>`}
                            ${item.levelReq ? `<span class="${meetsLevelReq ? '' : 'stat-negative'}">Required Level: ${item.levelReq}</span>` : ''}
                        </div>
                    </div>
                    <button class="btn btn-primary btn-sm ${meetsLevelReq ? '' : 'disabled'}" 
                            onclick="equipItemFromModal('${item.uniqueId}')">
                        Equip
                    </button>
                </div>
            `;
        });
        
        modalContent += `
                </div>
            </div>
        `;
    } else {
        modalContent += `
            <div class="no-items-available">
                <p>You don't have any ${slotName}s in your inventory.</p>
                <p>Find more items through adventuring or visit the market to buy some!</p>
            </div>
        `;
    }
    
    // Update modal content
    document.getElementById('equipmentPreviewContent').innerHTML = modalContent;
    
    // Show modal
    document.getElementById('equipmentModal').classList.add('show');
}

// Close equipment modal
function closeEquipmentModal() {
    document.getElementById('equipmentModal').classList.remove('show');
}

// Equip item from modal
function equipItemFromModal(itemId) {
    const result = equipItem(itemId);
    
    if (result) {
        // Reload character data
        loadCharacterData();
        
        // Close modal
        closeEquipmentModal();
        
        // Show notification
        showNotification('Item equipped successfully!', 'success');
    }
}

// Unequip item
function unequipItem(slotName) {
    const result = unequipItem(slotName);
    
    if (result) {
        // Reload character data
        loadCharacterData();
        
        // Close modal
        closeEquipmentModal();
        
        // Show notification
        showNotification('Item unequipped successfully!', 'success');
    }
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}