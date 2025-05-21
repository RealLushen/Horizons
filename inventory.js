// Inventory management for Horizons RPG

// Initialize Inventory page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the inventory page
    if (!document.querySelector('.inventory-container')) return;
    
    // Update player info in header
    updatePlayerInfoHeader();
    
    // Setup event listeners
    initInventoryEvents();
    
    // Load inventory items
    loadInventoryItems();
});

// Initialize inventory event listeners
function initInventoryEvents() {
    // Item filter select
    const filterSelect = document.getElementById('itemFilterSelect');
    if (filterSelect) {
        filterSelect.addEventListener('change', function() {
            loadInventoryItems(this.value);
        });
    }
    
    // Modal close button
    const modalCloseBtn = document.querySelector('.modal-close');
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', function() {
            closeItemPreviewModal();
        });
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('itemPreviewModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeItemPreviewModal();
            }
        });
    }
    
    // Event delegation for inventory list actions
    const inventoryList = document.getElementById('inventoryList');
    if (inventoryList) {
        inventoryList.addEventListener('click', function(event) {
            // Handle item card clicks
            if (event.target.classList.contains('item-card')) {
                openItemPreviewModal(event.target.getAttribute('data-item-id'));
            }
            
            // Handle action button clicks
            if (event.target.classList.contains('btn-equip')) {
                equipInventoryItem(event.target.getAttribute('data-item-id'));
            } else if (event.target.classList.contains('btn-sell')) {
                sellInventoryItem(event.target.getAttribute('data-item-id'));
            } else if (event.target.classList.contains('btn-trash')) {
                trashInventoryItem(event.target.getAttribute('data-item-id'));
            }
        });
    }
}

// Load inventory items
function loadInventoryItems(filter = 'all') {
    const playerData = getPlayerData();
    const inventoryList = document.getElementById('inventoryList');
    
    if (!inventoryList) return;
    
    // Clear inventory list
    inventoryList.innerHTML = '';
    
    // Check if inventory is empty
    if (!playerData.inventory || playerData.inventory.length === 0) {
        inventoryList.innerHTML = '<div class="inventory-empty">Your inventory is empty.</div>';
        return;
    }
    
    // Filter items
    let filteredItems = [...playerData.inventory];
    
    if (filter !== 'all') {
        if (filter === 'armor') {
            // Filter all armor types
            filteredItems = filteredItems.filter(item => {
                return item.type === ITEM_TYPE.HELMET || 
                       item.type === ITEM_TYPE.CHEST || 
                       item.type === ITEM_TYPE.HANDS || 
                       item.type === ITEM_TYPE.LEGS || 
                       item.type === ITEM_TYPE.FEET || 
                       item.type === ITEM_TYPE.SHOULDERS;
            });
        } else {
            // Filter by specific type
            filteredItems = filteredItems.filter(item => item.type === filter);
        }
    }
    
    // Check if filtered list is empty
    if (filteredItems.length === 0) {
        inventoryList.innerHTML = `<div class="inventory-empty">You don't have any ${filter} items.</div>`;
        return;
    }
    
    // Sort items by type, then rarity, then name
    filteredItems.sort((a, b) => {
        // First sort by type
        if (a.type !== b.type) {
            // Custom type order: weapons, armor, materials, junk
            const typeOrder = {
                [ITEM_TYPE.WEAPON]: 1,
                [ITEM_TYPE.HELMET]: 2,
                [ITEM_TYPE.CHEST]: 3,
                [ITEM_TYPE.HANDS]: 4,
                [ITEM_TYPE.LEGS]: 5,
                [ITEM_TYPE.FEET]: 6,
                [ITEM_TYPE.SHOULDERS]: 7,
                [ITEM_TYPE.MATERIAL]: 8,
                [ITEM_TYPE.JUNK]: 9
            };
            return typeOrder[a.type] - typeOrder[b.type];
        }
        
        // Then sort by rarity (higher rarity first)
        const rarityOrder = {
            [RARITY.LEGENDARY]: 1,
            [RARITY.EPIC]: 2,
            [RARITY.RARE]: 3,
            [RARITY.UNCOMMON]: 4,
            [RARITY.NORMAL]: 5,
            [RARITY.TRASH]: 6
        };
        
        if (a.rarity !== b.rarity) {
            return rarityOrder[a.rarity] - rarityOrder[b.rarity];
        }
        
        // Finally sort by name
        return a.name.localeCompare(b.name);
    });
    
    // Generate HTML for each item
    filteredItems.forEach(item => {
        const itemHtml = createItemCardHtml(item);
        inventoryList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Create HTML for an item card
function createItemCardHtml(item) {
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
    // Determine item type icon
    let itemTypeIcon = item.emoji || '📦';
    
    // Determine which action buttons to show
    const isEquippable = item.type === ITEM_TYPE.WEAPON || 
                         item.type === ITEM_TYPE.HELMET || 
                         item.type === ITEM_TYPE.CHEST || 
                         item.type === ITEM_TYPE.HANDS || 
                         item.type === ITEM_TYPE.LEGS || 
                         item.type === ITEM_TYPE.FEET || 
                         item.type === ITEM_TYPE.SHOULDERS;
    
    // Create item card HTML
    return `
        <div class="item-card" data-item-id="${item.uniqueId}">
            <div class="item-icon">${itemTypeIcon}</div>
            <div class="item-details">
                <div class="item-name ${rarityClass}">${rarityEmoji} ${item.name}</div>
                <div class="item-stats">
                    ${item.type === ITEM_TYPE.WEAPON ? 
                        `<span class="item-damage">DMG: ${item.damageMin}-${item.damageMax}</span>` : 
                        item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL ? 
                        `<span class="item-health">HP: +${item.health}</span>` : ''}
                    <span class="item-value">Value: ${item.value}g</span>
                    ${item.levelReq ? `<span class="item-level-req">Lvl Req: ${item.levelReq}</span>` : ''}
                </div>
            </div>
            <div class="item-actions">
                ${isEquippable ? `<button class="btn btn-sm btn-primary btn-equip" data-item-id="${item.uniqueId}">Equip</button>` : ''}
                <button class="btn btn-sm btn-secondary btn-sell" data-item-id="${item.uniqueId}">Sell</button>
                <button class="btn btn-sm btn-danger btn-trash" data-item-id="${item.uniqueId}">Trash</button>
            </div>
        </div>
    `;
}

// Open item preview modal
function openItemPreviewModal(itemId) {
    const playerData = getPlayerData();
    const item = playerData.inventory.find(i => i.uniqueId === itemId);
    
    if (!item) return;
    
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
    // Determine if player meets level requirement
    const meetsLevelReq = !item.levelReq || playerData.level >= item.levelReq;
    
    // Create modal content
    const modalContent = `
        <div class="item-preview-header">
            <div class="item-preview-icon">${item.emoji || '📦'}</div>
            <div class="item-preview-title">
                <h3 class="${rarityClass}">${rarityEmoji} ${item.name}</h3>
                <div class="item-preview-type">${getItemTypeName(item.type)}</div>
            </div>
        </div>
        <div class="item-preview-description">
            ${item.description || 'No description available.'}
        </div>
        <div class="item-preview-stats">
            ${item.type === ITEM_TYPE.WEAPON ? 
                `<div class="preview-stat">
                    <span class="stat-label">Damage:</span>
                    <span class="stat-value">${item.damageMin}-${item.damageMax}</span>
                </div>` : 
                item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL ? 
                `<div class="preview-stat">
                    <span class="stat-label">Health:</span>
                    <span class="stat-value">+${item.health}</span>
                </div>` : ''}
            
            <div class="preview-stat">
                <span class="stat-label">Value:</span>
                <span class="stat-value">${item.value} gold</span>
            </div>
            
            ${item.levelReq ? 
                `<div class="preview-stat">
                    <span class="stat-label">Required Level:</span>
                    <span class="stat-value ${meetsLevelReq ? '' : 'stat-negative'}">${item.levelReq}</span>
                </div>` : ''}
            
            <div class="preview-stat">
                <span class="stat-label">Rarity:</span>
                <span class="stat-value ${rarityClass}">${capitalizeFirstLetter(item.rarity)}</span>
            </div>
        </div>
        <div class="item-preview-actions">
            ${item.type === ITEM_TYPE.WEAPON || 
              item.type === ITEM_TYPE.HELMET || 
              item.type === ITEM_TYPE.CHEST || 
              item.type === ITEM_TYPE.HANDS || 
              item.type === ITEM_TYPE.LEGS || 
              item.type === ITEM_TYPE.FEET || 
              item.type === ITEM_TYPE.SHOULDERS ? 
                `<button class="btn btn-primary ${meetsLevelReq ? '' : 'disabled'}" onclick="equipInventoryItem('${item.uniqueId}')">Equip</button>` : ''}
            <button class="btn btn-secondary" onclick="sellInventoryItem('${item.uniqueId}')">Sell for ${item.value} gold</button>
            <button class="btn btn-danger" onclick="trashInventoryItem('${item.uniqueId}')">Trash</button>
        </div>
    `;
    
    // Update modal content
    document.getElementById('itemPreviewContent').innerHTML = modalContent;
    
    // Show modal
    document.getElementById('itemPreviewModal').classList.add('show');
}

// Close item preview modal
function closeItemPreviewModal() {
    document.getElementById('itemPreviewModal').classList.remove('show');
}

// Equip an item from inventory
function equipInventoryItem(itemId) {
    const result = equipItem(itemId);
    
    if (result) {
        showNotification(`Item equipped successfully!`, 'success');
        closeItemPreviewModal();
        loadInventoryItems(document.getElementById('itemFilterSelect').value);
    }
}

// Sell an item from inventory
function sellInventoryItem(itemId) {
    const playerData = getPlayerData();
    const item = playerData.inventory.find(i => i.uniqueId === itemId);
    
    if (!item) return;
    
    // Add gold to player
    addGold(item.value);
    
    // Remove item from inventory
    removeItemFromInventory(itemId);
    
    // Show notification
    showNotification(`Sold ${item.name} for ${item.value} gold!`, 'success');
    
    // Close modal if open
    closeItemPreviewModal();
    
    // Reload inventory items
    loadInventoryItems(document.getElementById('itemFilterSelect').value);
    
    // Update player info in header
    updatePlayerInfoHeader();
}

// Trash an item from inventory
function trashInventoryItem(itemId) {
    const playerData = getPlayerData();
    const item = playerData.inventory.find(i => i.uniqueId === itemId);
    
    if (!item) return;
    
    // Remove item from inventory
    removeItemFromInventory(itemId);
    
    // Show notification
    showNotification(`${item.name} removed from inventory.`, 'info');
    
    // Close modal if open
    closeItemPreviewModal();
    
    // Reload inventory items
    loadInventoryItems(document.getElementById('itemFilterSelect').value);
}

// Update player info in header
function updatePlayerInfoHeader() {
    const playerData = getPlayerData();
    
    document.getElementById('playerGold').textContent = `${playerData.gold}g`;
    document.getElementById('playerLevel').textContent = `Lvl ${playerData.level}`;
}

// Get item type name
function getItemTypeName(type) {
    switch (type) {
        case ITEM_TYPE.WEAPON: return 'Weapon';
        case ITEM_TYPE.HELMET: return 'Helmet';
        case ITEM_TYPE.CHEST: return 'Chest';
        case ITEM_TYPE.HANDS: return 'Hands';
        case ITEM_TYPE.LEGS: return 'Legs';
        case ITEM_TYPE.FEET: return 'Feet';
        case ITEM_TYPE.SHOULDERS: return 'Shoulders';
        case ITEM_TYPE.JUNK: return 'Junk';
        case ITEM_TYPE.MATERIAL: return 'Material';
        default: return 'Item';
    }
}

// Capitalize first letter
function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}