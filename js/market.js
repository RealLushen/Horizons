// Market functionality for Horizons RPG

// Initialize Market page
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the market page
    if (!document.querySelector('.market-container')) return;
    
    // Update player info in header
    updatePlayerInfoHeader();
    
    // Setup event listeners
    initMarketEvents();
    
    // Load sell tab items by default
    loadSellItems();
    
    // Generate market items for buy tab
    generateMarketItems();
});

// Initialize market event listeners
function initMarketEvents() {
    // Tab switching
    const marketTabs = document.querySelectorAll('.market-tab');
    marketTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            // Remove active class from all tabs
            marketTabs.forEach(t => t.classList.remove('active'));
            
            // Add active class to clicked tab
            this.classList.add('active');
            
            // Hide all tab content
            document.querySelectorAll('.market-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const tabId = this.getAttribute('data-tab');
            if (tabId === 'sell') {
                document.getElementById('sellTabContent').classList.add('active');
                loadSellItems();
            } else if (tabId === 'buy') {
                document.getElementById('buyTabContent').classList.add('active');
                loadBuyItems();
            }
        });
    });
    
    // Sell filter select
    const sellFilterSelect = document.getElementById('sellItemFilterSelect');
    if (sellFilterSelect) {
        sellFilterSelect.addEventListener('change', function() {
            loadSellItems(this.value);
        });
    }
    
    // Buy filter select
    const buyFilterSelect = document.getElementById('buyItemFilterSelect');
    if (buyFilterSelect) {
        buyFilterSelect.addEventListener('change', function() {
            loadBuyItems(this.value);
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
    
    // Event delegation for sell items list
    const sellItemList = document.getElementById('sellItemList');
    if (sellItemList) {
        sellItemList.addEventListener('click', function(event) {
            // Handle item card clicks
            if (event.target.closest('.market-item-card')) {
                const itemCard = event.target.closest('.market-item-card');
                openSellItemPreviewModal(itemCard.getAttribute('data-item-id'));
            }
            
            // Handle sell button clicks
            if (event.target.classList.contains('btn-sell')) {
                sellInventoryItem(event.target.getAttribute('data-item-id'));
            }
        });
    }
    
    // Event delegation for buy items list
    const buyItemList = document.getElementById('buyItemList');
    if (buyItemList) {
        buyItemList.addEventListener('click', function(event) {
            // Handle item card clicks
            if (event.target.closest('.market-item-card')) {
                const itemCard = event.target.closest('.market-item-card');
                openBuyItemPreviewModal(itemCard.getAttribute('data-item-id'));
            }
            
            // Handle buy button clicks
            if (event.target.classList.contains('btn-buy')) {
                buyMarketItem(event.target.getAttribute('data-item-id'));
            }
        });
    }
}

// Load items for sell tab
function loadSellItems(filter = 'all') {
    const playerData = getPlayerData();
    const sellItemList = document.getElementById('sellItemList');
    
    if (!sellItemList) return;
    
    // Clear item list
    sellItemList.innerHTML = '';
    
    // Check if inventory is empty
    if (!playerData.inventory || playerData.inventory.length === 0) {
        sellItemList.innerHTML = '<div class="inventory-empty">You don\'t have any items to sell.</div>';
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
        sellItemList.innerHTML = `<div class="inventory-empty">You don't have any ${filter} items to sell.</div>`;
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
        const itemHtml = createSellItemCardHtml(item);
        sellItemList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Create HTML for a sell item card
function createSellItemCardHtml(item) {
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
    // Create item card HTML
    return `
        <div class="market-item-card" data-item-id="${item.uniqueId}">
            <div class="market-item-icon">${item.emoji || '📦'}</div>
            <div class="market-item-details">
                <div class="market-item-name ${rarityClass}">${rarityEmoji} ${item.name}</div>
                <div class="market-item-stats">
                    ${item.type === ITEM_TYPE.WEAPON ? 
                        `<span class="item-damage">DMG: ${item.damageMin}-${item.damageMax}</span>` : 
                        item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL ? 
                        `<span class="item-health">HP: +${item.health}</span>` : ''}
                    ${item.levelReq ? `<span class="item-level-req">Lvl Req: ${item.levelReq}</span>` : ''}
                </div>
            </div>
            <div class="market-item-price">
                <span class="market-price-value">${item.value}g</span>
                <button class="btn btn-sm btn-primary btn-sell" data-item-id="${item.uniqueId}">Sell</button>
            </div>
        </div>
    `;
}

// Generate market items for buy tab
function generateMarketItems() {
    // Check if market items already exist in session storage
    let marketItems = sessionStorage.getItem('market_items');
    
    if (marketItems) {
        marketItems = JSON.parse(marketItems);
        
        // Check if market needs to be refreshed (every hour)
        const lastRefresh = sessionStorage.getItem('market_last_refresh');
        const now = Date.now();
        
        if (lastRefresh && (now - lastRefresh) < 3600000) {
            // Market doesn't need to be refreshed yet
            return;
        }
    }
    
    // Generate new market items
    const playerData = getPlayerData();
    marketItems = [];
    
    // Generate weapons (5-10 items)
    const weaponCount = getRandomInt(5, 10);
    for (let i = 0; i < weaponCount; i++) {
        // Generate weapon up to 5 levels higher than player
        const maxLevel = playerData.level + 5;
        const weaponLevel = getRandomInt(Math.max(1, playerData.level - 5), maxLevel);
        
        // Get random weapon from defined weapons
        const baseWeapon = WEAPONS[getRandomInt(0, WEAPONS.length - 1)];
        
        // Determine rarity (better chances for higher rarities in market)
        const rarityRoll = Math.random() * 100;
        let rarity;
        
        if (rarityRoll < 30) {
            rarity = RARITY.NORMAL;
        } else if (rarityRoll < 60) {
            rarity = RARITY.UNCOMMON;
        } else if (rarityRoll < 85) {
            rarity = RARITY.RARE;
        } else if (rarityRoll < 97) {
            rarity = RARITY.EPIC;
        } else {
            rarity = RARITY.LEGENDARY;
        }
        
        // Create weapon with market price (higher than sell value)
        const weapon = createItemWithRarity({ ...baseWeapon }, rarity, weaponLevel);
        weapon.marketId = 'market_' + Date.now() + '_' + i;
        
        // Market price is 50% higher than sell value
        weapon.marketPrice = Math.round(weapon.value * 1.5);
        
        marketItems.push(weapon);
    }
    
    // Generate armor (10-15 items, mix of different armor types)
    const armorCount = getRandomInt(10, 15);
    for (let i = 0; i < armorCount; i++) {
        // Generate armor up to 5 levels higher than player
        const maxLevel = playerData.level + 5;
        const armorLevel = getRandomInt(Math.max(1, playerData.level - 5), maxLevel);
        
        // Get random armor from defined armor
        const baseArmor = ARMOR[getRandomInt(0, ARMOR.length - 1)];
        
        // Determine rarity (better chances for higher rarities in market)
        const rarityRoll = Math.random() * 100;
        let rarity;
        
        if (rarityRoll < 30) {
            rarity = RARITY.NORMAL;
        } else if (rarityRoll < 60) {
            rarity = RARITY.UNCOMMON;
        } else if (rarityRoll < 85) {
            rarity = RARITY.RARE;
        } else if (rarityRoll < 97) {
            rarity = RARITY.EPIC;
        } else {
            rarity = RARITY.LEGENDARY;
        }
        
        // Create armor with market price (higher than sell value)
        const armor = createItemWithRarity({ ...baseArmor }, rarity, armorLevel);
        armor.marketId = 'market_' + Date.now() + '_' + (i + weaponCount);
        
        // Market price is 50% higher than sell value
        armor.marketPrice = Math.round(armor.value * 1.5);
        
        marketItems.push(armor);
    }
    
    // Generate materials (5-10 items)
    const materialCount = getRandomInt(5, 10);
    for (let i = 0; i < materialCount; i++) {
        // Get random material from defined materials
        const baseMaterial = MATERIALS[getRandomInt(0, MATERIALS.length - 1)];
        
        // Create material with market price
        const material = { ...baseMaterial };
        material.marketId = 'market_' + Date.now() + '_' + (i + weaponCount + armorCount);
        
        // Assign a unique ID
        material.uniqueId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
        
        // Materials always have normal rarity
        material.rarity = RARITY.NORMAL;
        
        // Market price is double the base value
        material.value = material.baseValue;
        material.marketPrice = material.baseValue * 2;
        
        marketItems.push(material);
    }
    
    // Save market items to session storage
    sessionStorage.setItem('market_items', JSON.stringify(marketItems));
    sessionStorage.setItem('market_last_refresh', Date.now().toString());
}

// Load items for buy tab
function loadBuyItems(filter = 'all') {
    // Generate market items if not already generated
    generateMarketItems();
    
    // Get market items from session storage
    let marketItems = sessionStorage.getItem('market_items');
    if (!marketItems) {
        // This shouldn't happen, but just in case
        generateMarketItems();
        marketItems = sessionStorage.getItem('market_items');
    }
    
    marketItems = JSON.parse(marketItems);
    
    const buyItemList = document.getElementById('buyItemList');
    
    if (!buyItemList) return;
    
    // Clear item list
    buyItemList.innerHTML = '';
    
    // Check if market is empty
    if (!marketItems || marketItems.length === 0) {
        buyItemList.innerHTML = `
            <div class="market-refresh-message">
                <p>No items for sale at the moment.</p>
                <p>The market inventory refreshes every hour. Check back later!</p>
            </div>
        `;
        return;
    }
    
    // Filter items
    let filteredItems = [...marketItems];
    
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
        buyItemList.innerHTML = `<div class="market-empty">No ${filter} items available for purchase.</div>`;
        return;
    }
    
    // Sort items by type, then rarity, then name
    filteredItems.sort((a, b) => {
        // First sort by type
        if (a.type !== b.type) {
            // Custom type order: weapons, armor, materials
            const typeOrder = {
                [ITEM_TYPE.WEAPON]: 1,
                [ITEM_TYPE.HELMET]: 2,
                [ITEM_TYPE.CHEST]: 3,
                [ITEM_TYPE.HANDS]: 4,
                [ITEM_TYPE.LEGS]: 5,
                [ITEM_TYPE.FEET]: 6,
                [ITEM_TYPE.SHOULDERS]: 7,
                [ITEM_TYPE.MATERIAL]: 8
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
        const itemHtml = createBuyItemCardHtml(item);
        buyItemList.insertAdjacentHTML('beforeend', itemHtml);
    });
}

// Create HTML for a buy item card
function createBuyItemCardHtml(item) {
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
    // Get player data to check if player can afford
    const playerData = getPlayerData();
    const canAfford = playerData.gold >= item.marketPrice;
    
    // Check if player meets level requirement
    const meetsLevelReq = !item.levelReq || playerData.level >= item.levelReq;
    
    // Create item card HTML
    return `
        <div class="market-item-card" data-item-id="${item.marketId}">
            <div class="market-item-icon">${item.emoji || '📦'}</div>
            <div class="market-item-details">
                <div class="market-item-name ${rarityClass}">${rarityEmoji} ${item.name}</div>
                <div class="market-item-stats">
                    ${item.type === ITEM_TYPE.WEAPON ? 
                        `<span class="item-damage">DMG: ${item.damageMin}-${item.damageMax}</span>` : 
                        item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL ? 
                        `<span class="item-health">HP: +${item.health}</span>` : ''}
                    ${item.levelReq ? `<span class="item-level-req ${meetsLevelReq ? '' : 'stat-negative'}">Lvl Req: ${item.levelReq}</span>` : ''}
                </div>
            </div>
            <div class="market-item-price">
                <span class="market-price-value ${canAfford ? '' : 'price-cant-afford'}">${item.marketPrice}g</span>
                <button class="btn btn-sm btn-primary btn-buy ${(canAfford && meetsLevelReq) ? '' : 'disabled'}" 
                        data-item-id="${item.marketId}">Buy</button>
            </div>
        </div>
    `;
}

// Open item preview modal for selling
function openSellItemPreviewModal(itemId) {
    const playerData = getPlayerData();
    const item = playerData.inventory.find(i => i.uniqueId === itemId);
    
    if (!item) return;
    
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
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
                    <span class="stat-value">${item.levelReq}</span>
                </div>` : ''}
            
            <div class="preview-stat">
                <span class="stat-label">Rarity:</span>
                <span class="stat-value ${rarityClass}">${capitalizeFirstLetter(item.rarity)}</span>
            </div>
        </div>
        <div class="item-preview-actions">
            <button class="btn btn-primary" onclick="sellInventoryItem('${item.uniqueId}')">Sell for ${item.value} gold</button>
        </div>
    `;
    
    // Update modal content
    document.getElementById('itemPreviewContent').innerHTML = modalContent;
    
    // Show modal
    document.getElementById('itemPreviewModal').classList.add('show');
}

// Open item preview modal for buying
function openBuyItemPreviewModal(marketId) {
    // Get market items from session storage
    const marketItems = JSON.parse(sessionStorage.getItem('market_items'));
    const item = marketItems.find(i => i.marketId === marketId);
    
    if (!item) return;
    
    // Get player data to check if player can afford
    const playerData = getPlayerData();
    const canAfford = playerData.gold >= item.marketPrice;
    
    // Check if player meets level requirement
    const meetsLevelReq = !item.levelReq || playerData.level >= item.levelReq;
    
    // Get rarity color class
    const rarityClass = getRarityColorClass(item.rarity);
    const rarityEmoji = getRarityEmoji(item.rarity);
    
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
                <span class="stat-label">Price:</span>
                <span class="stat-value ${canAfford ? '' : 'stat-negative'}">${item.marketPrice} gold</span>
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
            <button class="btn btn-primary ${(canAfford && meetsLevelReq) ? '' : 'disabled'}" 
                    onclick="buyMarketItem('${item.marketId}')">
                Buy for ${item.marketPrice} gold
            </button>
            ${!canAfford ? `<p class="error-message">You don't have enough gold!</p>` : ''}
            ${!meetsLevelReq ? `<p class="error-message">You don't meet the level requirement!</p>` : ''}
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
    
    // Reload sell items
    loadSellItems(document.getElementById('sellItemFilterSelect').value);
    
    // Update player info in header
    updatePlayerInfoHeader();
}

// Buy an item from market
function buyMarketItem(marketId) {
    // Get player data
    const playerData = getPlayerData();
    
    // Get market items from session storage
    const marketItems = JSON.parse(sessionStorage.getItem('market_items'));
    const itemIndex = marketItems.findIndex(i => i.marketId === marketId);
    
    if (itemIndex === -1) return;
    
    const item = marketItems[itemIndex];
    
    // Check if player can afford
    if (playerData.gold < item.marketPrice) {
        showNotification(`You don't have enough gold to buy this item!`, 'error');
        return;
    }
    
    // Check if player meets level requirement
    if (item.levelReq && playerData.level < item.levelReq) {
        showNotification(`You need to be level ${item.levelReq} to buy this item!`, 'error');
        return;
    }
    
    // Subtract gold from player
    addGold(-item.marketPrice);
    
    // Add item to inventory (convert market item to inventory item)
    const inventoryItem = { ...item };
    delete inventoryItem.marketId;
    delete inventoryItem.marketPrice;
    
    // Generate a new unique ID for the inventory item
    inventoryItem.uniqueId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    addItemToInventory(inventoryItem);
    
    // Remove item from market
    marketItems.splice(itemIndex, 1);
    sessionStorage.setItem('market_items', JSON.stringify(marketItems));
    
    // Show notification
    showNotification(`Bought ${item.name} for ${item.marketPrice} gold!`, 'success');
    
    // Close modal if open
    closeItemPreviewModal();
    
    // Reload buy items
    loadBuyItems(document.getElementById('buyItemFilterSelect').value);
    
    // Update player info in header
    updatePlayerInfoHeader();
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