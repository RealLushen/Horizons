// Items Definition for Horizons RPG

// Rarity definitions
const RARITY = {
    TRASH: 'trash',
    NORMAL: 'normal',
    UNCOMMON: 'uncommon',
    RARE: 'rare',
    EPIC: 'epic',
    LEGENDARY: 'legendary'
};

// Rarity multiplier for item value
const RARITY_VALUE_MULTIPLIER = {
    [RARITY.TRASH]: 0.5,
    [RARITY.NORMAL]: 1,
    [RARITY.UNCOMMON]: 2,
    [RARITY.RARE]: 4,
    [RARITY.EPIC]: 8,
    [RARITY.LEGENDARY]: 16
};

// Rarity colors (for UI)
const RARITY_COLORS = {
    [RARITY.TRASH]: 'rarity-trash',
    [RARITY.NORMAL]: 'rarity-normal',
    [RARITY.UNCOMMON]: 'rarity-uncommon',
    [RARITY.RARE]: 'rarity-rare',
    [RARITY.EPIC]: 'rarity-epic',
    [RARITY.LEGENDARY]: 'rarity-legendary'
};

// Rarity emoji prefixes
const RARITY_EMOJI = {
    [RARITY.TRASH]: '🗑️',
    [RARITY.NORMAL]: '⚪',
    [RARITY.UNCOMMON]: '🟢',
    [RARITY.RARE]: '🔵',
    [RARITY.EPIC]: '🟣',
    [RARITY.LEGENDARY]: '🟠'
};

// Item type definitions
const ITEM_TYPE = {
    WEAPON: 'weapon',
    HELMET: 'helmet',
    CHEST: 'chest',
    HANDS: 'hands',
    LEGS: 'legs',
    FEET: 'feet',
    SHOULDERS: 'shoulders',
    JUNK: 'junk',
    MATERIAL: 'material'
};

// Material type definitions
const MATERIAL_TYPE = {
    ORE: 'ore',
    WOOD: 'wood',
    FISH: 'fish'
};

// Weapon definitions
const WEAPONS = [
    {
        id: 'wooden_sword',
        name: 'Wooden Sword',
        type: ITEM_TYPE.WEAPON,
        damageMin: 3,
        damageMax: 5,
        baseValue: 10,
        levelReq: 1,
        description: 'A simple wooden sword.',
        emoji: '🗡️'
    },
    {
        id: 'stone_axe',
        name: 'Stone Axe',
        type: ITEM_TYPE.WEAPON,
        damageMin: 4,
        damageMax: 7,
        baseValue: 25,
        levelReq: 3,
        description: 'A sturdy stone axe.',
        emoji: '🪓'
    },
    {
        id: 'iron_mace',
        name: 'Iron Mace',
        type: ITEM_TYPE.WEAPON,
        damageMin: 6,
        damageMax: 10,
        baseValue: 50,
        levelReq: 5,
        description: 'A heavy iron mace.',
        emoji: '🔨'
    },
    {
        id: 'steel_sword',
        name: 'Steel Sword',
        type: ITEM_TYPE.WEAPON,
        damageMin: 8,
        damageMax: 12,
        baseValue: 100,
        levelReq: 10,
        description: 'A sharpened steel sword.',
        emoji: '⚔️'
    },
    {
        id: 'silver_dagger',
        name: 'Silver Dagger',
        type: ITEM_TYPE.WEAPON,
        damageMin: 10,
        damageMax: 15,
        baseValue: 200,
        levelReq: 15,
        description: 'A quick silver dagger.',
        emoji: '🗡️'
    },
    {
        id: 'golden_hammer',
        name: 'Golden Hammer',
        type: ITEM_TYPE.WEAPON,
        damageMin: 12,
        damageMax: 18,
        baseValue: 350,
        levelReq: 20,
        description: 'A shining golden hammer.',
        emoji: '🔨'
    },
    {
        id: 'obsidian_axe',
        name: 'Obsidian Axe',
        type: ITEM_TYPE.WEAPON,
        damageMin: 15,
        damageMax: 22,
        baseValue: 500,
        levelReq: 25,
        description: 'A razor-sharp obsidian axe.',
        emoji: '🪓'
    },
    {
        id: 'diamond_sword',
        name: 'Diamond Sword',
        type: ITEM_TYPE.WEAPON,
        damageMin: 18,
        damageMax: 25,
        baseValue: 750,
        levelReq: 30,
        description: 'A brilliant diamond sword.',
        emoji: '⚔️'
    },
    {
        id: 'flame_blade',
        name: 'Flame Blade',
        type: ITEM_TYPE.WEAPON,
        damageMin: 20,
        damageMax: 30,
        baseValue: 1000,
        levelReq: 35,
        description: 'A sword engulfed in magical flames.',
        emoji: '🔥'
    },
    {
        id: 'dragon_slayer',
        name: 'Dragon Slayer',
        type: ITEM_TYPE.WEAPON,
        damageMin: 25,
        damageMax: 35,
        baseValue: 1500,
        levelReq: 40,
        description: 'A legendary weapon forged for dragon hunting.',
        emoji: '🐉'
    }
];

// Armor definitions
const ARMOR = [
    // Helmets
    {
        id: 'leather_cap',
        name: 'Leather Cap',
        type: ITEM_TYPE.HELMET,
        health: 5,
        baseValue: 15,
        levelReq: 1,
        description: 'A simple leather cap.',
        emoji: '🧢'
    },
    {
        id: 'iron_helmet',
        name: 'Iron Helmet',
        type: ITEM_TYPE.HELMET,
        health: 10,
        baseValue: 40,
        levelReq: 5,
        description: 'A sturdy iron helmet.',
        emoji: '⛑️'
    },
    {
        id: 'steel_helmet',
        name: 'Steel Helmet',
        type: ITEM_TYPE.HELMET,
        health: 20,
        baseValue: 100,
        levelReq: 15,
        description: 'A well-crafted steel helmet.',
        emoji: '🪖'
    },
    {
        id: 'golden_crown',
        name: 'Golden Crown',
        type: ITEM_TYPE.HELMET,
        health: 30,
        baseValue: 250,
        levelReq: 25,
        description: 'A regal golden crown.',
        emoji: '👑'
    },
    {
        id: 'dragon_helm',
        name: 'Dragon Helm',
        type: ITEM_TYPE.HELMET,
        health: 50,
        baseValue: 500,
        levelReq: 40,
        description: 'A helmet forged from dragon scales.',
        emoji: '🐲'
    },
    
    // Chest
    {
        id: 'leather_tunic',
        name: 'Leather Tunic',
        type: ITEM_TYPE.CHEST,
        health: 10,
        baseValue: 20,
        levelReq: 1,
        description: 'A basic leather tunic.',
        emoji: '👕'
    },
    {
        id: 'iron_chestplate',
        name: 'Iron Chestplate',
        type: ITEM_TYPE.CHEST,
        health: 20,
        baseValue: 60,
        levelReq: 5,
        description: 'A sturdy iron chestplate.',
        emoji: '🦺'
    },
    {
        id: 'steel_breastplate',
        name: 'Steel Breastplate',
        type: ITEM_TYPE.CHEST,
        health: 40,
        baseValue: 150,
        levelReq: 15,
        description: 'A well-crafted steel breastplate.',
        emoji: '👚'
    },
    {
        id: 'golden_armor',
        name: 'Golden Armor',
        type: ITEM_TYPE.CHEST,
        health: 60,
        baseValue: 350,
        levelReq: 25,
        description: 'A shining golden armor.',
        emoji: '🥼'
    },
    {
        id: 'dragon_scale_mail',
        name: 'Dragon Scale Mail',
        type: ITEM_TYPE.CHEST,
        health: 100,
        baseValue: 700,
        levelReq: 40,
        description: 'Armor crafted from dragon scales.',
        emoji: '🧥'
    },
    
    // Hands
    {
        id: 'leather_gloves',
        name: 'Leather Gloves',
        type: ITEM_TYPE.HANDS,
        health: 3,
        baseValue: 10,
        levelReq: 1,
        description: 'Simple leather gloves.',
        emoji: '🧤'
    },
    {
        id: 'iron_gauntlets',
        name: 'Iron Gauntlets',
        type: ITEM_TYPE.HANDS,
        health: 6,
        baseValue: 30,
        levelReq: 5,
        description: 'Sturdy iron gauntlets.',
        emoji: '🧤'
    },
    {
        id: 'steel_gauntlets',
        name: 'Steel Gauntlets',
        type: ITEM_TYPE.HANDS,
        health: 12,
        baseValue: 80,
        levelReq: 15,
        description: 'Well-crafted steel gauntlets.',
        emoji: '🧤'
    },
    {
        id: 'golden_gloves',
        name: 'Golden Gloves',
        type: ITEM_TYPE.HANDS,
        health: 18,
        baseValue: 200,
        levelReq: 25,
        description: 'Shining golden gloves.',
        emoji: '🧤'
    },
    {
        id: 'dragon_claws',
        name: 'Dragon Claws',
        type: ITEM_TYPE.HANDS,
        health: 30,
        baseValue: 400,
        levelReq: 40,
        description: 'Gauntlets crafted in the shape of dragon claws.',
        emoji: '🧤'
    },
    
    // Legs
    {
        id: 'leather_pants',
        name: 'Leather Pants',
        type: ITEM_TYPE.LEGS,
        health: 7,
        baseValue: 15,
        levelReq: 1,
        description: 'Simple leather pants.',
        emoji: '👖'
    },
    {
        id: 'iron_leggings',
        name: 'Iron Leggings',
        type: ITEM_TYPE.LEGS,
        health: 15,
        baseValue: 45,
        levelReq: 5,
        description: 'Sturdy iron leggings.',
        emoji: '👖'
    },
    {
        id: 'steel_greaves',
        name: 'Steel Greaves',
        type: ITEM_TYPE.LEGS,
        health: 30,
        baseValue: 120,
        levelReq: 15,
        description: 'Well-crafted steel greaves.',
        emoji: '👖'
    },
    {
        id: 'golden_leggings',
        name: 'Golden Leggings',
        type: ITEM_TYPE.LEGS,
        health: 45,
        baseValue: 300,
        levelReq: 25,
        description: 'Shining golden leggings.',
        emoji: '👖'
    },
    {
        id: 'dragon_scale_greaves',
        name: 'Dragon Scale Greaves',
        type: ITEM_TYPE.LEGS,
        health: 75,
        baseValue: 600,
        levelReq: 40,
        description: 'Leggings crafted from dragon scales.',
        emoji: '👖'
    },
    
    // Feet
    {
        id: 'leather_boots',
        name: 'Leather Boots',
        type: ITEM_TYPE.FEET,
        health: 4,
        baseValue: 12,
        levelReq: 1,
        description: 'Simple leather boots.',
        emoji: '👢'
    },
    {
        id: 'iron_boots',
        name: 'Iron Boots',
        type: ITEM_TYPE.FEET,
        health: 8,
        baseValue: 35,
        levelReq: 5,
        description: 'Sturdy iron boots.',
        emoji: '👢'
    },
    {
        id: 'steel_sabatons',
        name: 'Steel Sabatons',
        type: ITEM_TYPE.FEET,
        health: 15,
        baseValue: 90,
        levelReq: 15,
        description: 'Well-crafted steel sabatons.',
        emoji: '👢'
    },
    {
        id: 'golden_boots',
        name: 'Golden Boots',
        type: ITEM_TYPE.FEET,
        health: 25,
        baseValue: 225,
        levelReq: 25,
        description: 'Shining golden boots.',
        emoji: '👢'
    },
    {
        id: 'dragon_scale_boots',
        name: 'Dragon Scale Boots',
        type: ITEM_TYPE.FEET,
        health: 40,
        baseValue: 450,
        levelReq: 40,
        description: 'Boots crafted from dragon scales.',
        emoji: '👢'
    },
    
    // Shoulders
    {
        id: 'leather_shoulderpads',
        name: 'Leather Shoulderpads',
        type: ITEM_TYPE.SHOULDERS,
        health: 3,
        baseValue: 10,
        levelReq: 1,
        description: 'Simple leather shoulderpads.',
        emoji: '👘'
    },
    {
        id: 'iron_pauldrons',
        name: 'Iron Pauldrons',
        type: ITEM_TYPE.SHOULDERS,
        health: 6,
        baseValue: 30,
        levelReq: 5,
        description: 'Sturdy iron pauldrons.',
        emoji: '👘'
    },
    {
        id: 'steel_spaulders',
        name: 'Steel Spaulders',
        type: ITEM_TYPE.SHOULDERS,
        health: 12,
        baseValue: 80,
        levelReq: 15,
        description: 'Well-crafted steel spaulders.',
        emoji: '👘'
    },
    {
        id: 'golden_pauldrons',
        name: 'Golden Pauldrons',
        type: ITEM_TYPE.SHOULDERS,
        health: 18,
        baseValue: 200,
        levelReq: 25,
        description: 'Shining golden pauldrons.',
        emoji: '👘'
    },
    {
        id: 'dragon_scale_pauldrons',
        name: 'Dragon Scale Pauldrons',
        type: ITEM_TYPE.SHOULDERS,
        health: 30,
        baseValue: 400,
        levelReq: 40,
        description: 'Shoulderpads crafted from dragon scales.',
        emoji: '👘'
    }
];

// Junk/Trash items
const JUNK_ITEMS = [
    {
        id: 'broken_sword',
        name: 'Broken Sword',
        type: ITEM_TYPE.JUNK,
        baseValue: 3,
        description: 'A broken sword. Only good for scrapping.',
        emoji: '🗡️'
    },
    {
        id: 'cracked_helmet',
        name: 'Cracked Helmet',
        type: ITEM_TYPE.JUNK,
        baseValue: 2,
        description: 'A helmet with a large crack in it.',
        emoji: '⛑️'
    },
    {
        id: 'tattered_cloth',
        name: 'Tattered Cloth',
        type: ITEM_TYPE.JUNK,
        baseValue: 1,
        description: 'A piece of tattered cloth.',
        emoji: '🧵'
    },
    {
        id: 'bent_coin',
        name: 'Bent Coin',
        type: ITEM_TYPE.JUNK,
        baseValue: 1,
        description: 'A bent and unusable coin.',
        emoji: '💰'
    },
    {
        id: 'rusty_nail',
        name: 'Rusty Nail',
        type: ITEM_TYPE.JUNK,
        baseValue: 1,
        description: 'A rusty old nail.',
        emoji: '📌'
    },
    {
        id: 'bone_fragment',
        name: 'Bone Fragment',
        type: ITEM_TYPE.JUNK,
        baseValue: 2,
        description: 'A fragment of bone.',
        emoji: '🦴'
    },
    {
        id: 'torn_map',
        name: 'Torn Map',
        type: ITEM_TYPE.JUNK,
        baseValue: 3,
        description: 'A torn and illegible map.',
        emoji: '🗺️'
    },
    {
        id: 'cracked_gem',
        name: 'Cracked Gem',
        type: ITEM_TYPE.JUNK,
        baseValue: 5,
        description: 'A cracked gem with little value.',
        emoji: '💎'
    },
    {
        id: 'monster_tooth',
        name: 'Monster Tooth',
        type: ITEM_TYPE.JUNK,
        baseValue: 4,
        description: 'A tooth from some creature.',
        emoji: '🦷'
    },
    {
        id: 'empty_bottle',
        name: 'Empty Bottle',
        type: ITEM_TYPE.JUNK,
        baseValue: 2,
        description: 'An empty glass bottle.',
        emoji: '🍾'
    }
];

// Materials
const MATERIALS = [
    // Ore
    {
        id: 'copper_ore',
        name: 'Copper Ore',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.ORE,
        baseValue: 5,
        description: 'A piece of copper ore.',
        emoji: '🪨'
    },
    {
        id: 'iron_ore',
        name: 'Iron Ore',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.ORE,
        baseValue: 10,
        description: 'A piece of iron ore.',
        emoji: '⛏️'
    },
    {
        id: 'silver_ore',
        name: 'Silver Ore',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.ORE,
        baseValue: 20,
        description: 'A piece of silver ore.',
        emoji: '⛏️'
    },
    {
        id: 'gold_ore',
        name: 'Gold Ore',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.ORE,
        baseValue: 30,
        description: 'A piece of gold ore.',
        emoji: '⛏️'
    },
    {
        id: 'mithril_ore',
        name: 'Mithril Ore',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.ORE,
        baseValue: 50,
        description: 'A rare piece of mithril ore.',
        emoji: '⛏️'
    },
    
    // Wood
    {
        id: 'oak_wood',
        name: 'Oak Wood',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.WOOD,
        baseValue: 5,
        description: 'A plank of oak wood.',
        emoji: '🪵'
    },
    {
        id: 'maple_wood',
        name: 'Maple Wood',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.WOOD,
        baseValue: 10,
        description: 'A plank of maple wood.',
        emoji: '🪵'
    },
    {
        id: 'willow_wood',
        name: 'Willow Wood',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.WOOD,
        baseValue: 20,
        description: 'A plank of willow wood.',
        emoji: '🪵'
    },
    {
        id: 'yew_wood',
        name: 'Yew Wood',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.WOOD,
        baseValue: 30,
        description: 'A plank of yew wood.',
        emoji: '🪵'
    },
    {
        id: 'magic_wood',
        name: 'Magic Wood',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.WOOD,
        baseValue: 50,
        description: 'A plank of enchanted wood.',
        emoji: '🪵'
    },
    
    // Fish
    {
        id: 'small_fish',
        name: 'Small Fish',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.FISH,
        baseValue: 5,
        description: 'A small fish.',
        emoji: '🐟'
    },
    {
        id: 'trout',
        name: 'Trout',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.FISH,
        baseValue: 10,
        description: 'A trout.',
        emoji: '🐠'
    },
    {
        id: 'salmon',
        name: 'Salmon',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.FISH,
        baseValue: 20,
        description: 'A salmon.',
        emoji: '🐟'
    },
    {
        id: 'swordfish',
        name: 'Swordfish',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.FISH,
        baseValue: 30,
        description: 'A swordfish.',
        emoji: '🐡'
    },
    {
        id: 'golden_fish',
        name: 'Golden Fish',
        type: ITEM_TYPE.MATERIAL,
        materialType: MATERIAL_TYPE.FISH,
        baseValue: 50,
        description: 'A rare golden fish.',
        emoji: '🐠'
    }
];

// Combine all items into a single array for easy access
const ALL_ITEMS = [
    ...WEAPONS,
    ...ARMOR,
    ...JUNK_ITEMS,
    ...MATERIALS
];

// Encounter chances (percentages) - adjust these as needed
const ENCOUNTER_CHANCES = {
    ENEMY: 30,      // 30% chance to encounter an enemy
    MINERAL: 15,    // 15% chance to encounter a mineral
    TREE: 15,       // 15% chance to encounter a tree
    LAKE: 15,       // 15% chance to encounter a lake
    ITEM: 10,       // 10% chance to find an item
    NOTHING: 15     // 15% chance to find nothing
};

// Generate a random item based on player level
function generateRandomItem(playerLevel) {
    // Determine item type (weapon, armor, junk)
    const itemTypeRoll = Math.random() * 100;
    let itemPool;
    
    if (itemTypeRoll < 30) {
        // 30% chance for weapon
        itemPool = WEAPONS;
    } else if (itemTypeRoll < 80) {
        // 50% chance for armor
        itemPool = ARMOR;
    } else {
        // 20% chance for junk
        itemPool = JUNK_ITEMS;
        // Junk items are always trash rarity
        return generateJunkItem();
    }
    
    // Filter items by level requirement
    const availableItems = itemPool.filter(item => {
        // Allow items up to 5 levels higher than player
        return (!item.levelReq || item.levelReq <= playerLevel + 5);
    });
    
    if (availableItems.length === 0) {
        // Fallback to junk item if no suitable items found
        return generateJunkItem();
    }
    
    // Select random item from filtered pool
    const baseItem = availableItems[Math.floor(Math.random() * availableItems.length)];
    
    // Determine rarity
    const rarityRoll = Math.random() * 100;
    let rarity;
    
    if (rarityRoll < 40) {
        rarity = RARITY.NORMAL;
    } else if (rarityRoll < 70) {
        rarity = RARITY.UNCOMMON;
    } else if (rarityRoll < 90) {
        rarity = RARITY.RARE;
    } else if (rarityRoll < 98) {
        rarity = RARITY.EPIC;
    } else {
        rarity = RARITY.LEGENDARY;
    }
    
    // Create item with adjusted stats based on rarity
    return createItemWithRarity(baseItem, rarity, playerLevel);
}

// Generate a junk item (always trash rarity)
function generateJunkItem() {
    const baseItem = JUNK_ITEMS[Math.floor(Math.random() * JUNK_ITEMS.length)];
    return createItemWithRarity(baseItem, RARITY.TRASH);
}

// Create an item with specified rarity
function createItemWithRarity(baseItem, rarity, playerLevel = 1) {
    const rarityMultiplier = RARITY_VALUE_MULTIPLIER[rarity];
    const levelMultiplier = 1 + ((playerLevel - 1) * 0.1);
    
    // Create a copy of the base item
    const item = { ...baseItem };
    
    // Add unique ID
    item.uniqueId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    // Set rarity
    item.rarity = rarity;
    
    // Calculate value based on rarity and level
    item.value = Math.round(item.baseValue * rarityMultiplier * levelMultiplier);
    
    // Adjust stats based on rarity for equipment
    if (item.type === ITEM_TYPE.WEAPON) {
        item.damageMin = Math.round(item.damageMin * rarityMultiplier);
        item.damageMax = Math.round(item.damageMax * rarityMultiplier);
    } else if (item.type !== ITEM_TYPE.JUNK && item.type !== ITEM_TYPE.MATERIAL) {
        // Armor
        item.health = Math.round(item.health * rarityMultiplier);
    }
    
    // Add rarity prefix to name for non-trash items
    if (rarity !== RARITY.TRASH && rarity !== RARITY.NORMAL) {
        const rarityPrefixes = {
            [RARITY.UNCOMMON]: 'Fine',
            [RARITY.RARE]: 'Superior',
            [RARITY.EPIC]: 'Exquisite',
            [RARITY.LEGENDARY]: 'Legendary'
        };
        
        item.name = `${rarityPrefixes[rarity]} ${item.name}`;
    }
    
    return item;
}

// Generate a material based on type and player skill level
function generateMaterial(materialType, skillLevel = 1) {
    const availableMaterials = MATERIALS.filter(material => material.materialType === materialType);
    
    // Determine which materials can be found based on skill level
    let possibleMaterials;
    if (skillLevel < 5) {
        // Only the most basic material at low levels
        possibleMaterials = [availableMaterials[0]];
    } else if (skillLevel < 15) {
        // First two tiers of materials
        possibleMaterials = availableMaterials.slice(0, 2);
    } else if (skillLevel < 30) {
        // First three tiers of materials
        possibleMaterials = availableMaterials.slice(0, 3);
    } else if (skillLevel < 50) {
        // First four tiers of materials
        possibleMaterials = availableMaterials.slice(0, 4);
    } else {
        // All materials available
        possibleMaterials = availableMaterials;
    }
    
    // Random material from possible ones
    const baseItem = possibleMaterials[Math.floor(Math.random() * possibleMaterials.length)];
    
    // Create a copy with unique ID
    const material = { ...baseItem };
    material.uniqueId = 'item_' + Date.now() + '_' + Math.floor(Math.random() * 1000);
    
    return material;
}

// Get item by ID
function getItemById(itemId) {
    return ALL_ITEMS.find(item => item.id === itemId);
}

// Get rarity color class
function getRarityColorClass(rarity) {
    return RARITY_COLORS[rarity] || RARITY_COLORS[RARITY.NORMAL];
}

// Get rarity emoji
function getRarityEmoji(rarity) {
    return RARITY_EMOJI[rarity] || RARITY_EMOJI[RARITY.NORMAL];
}