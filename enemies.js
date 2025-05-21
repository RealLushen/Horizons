// Enemies Definition for Horizons RPG

// Enemy definitions
const ENEMIES = [
    // Level 1-5
    {
        id: 'rat',
        name: 'Giant Rat',
        minLevel: 1,
        maxLevel: 5,
        baseDamage: {
            min: 1,
            max: 3
        },
        baseHealth: 15,
        baseExperience: 10,
        baseGold: 2,
        dropChance: 10, // 10% chance to drop an item
        description: 'A large rat with sharp teeth.',
        emoji: '🐀'
    },
    {
        id: 'spider',
        name: 'Giant Spider',
        minLevel: 1,
        maxLevel: 7,
        baseDamage: {
            min: 2,
            max: 4
        },
        baseHealth: 20,
        baseExperience: 15,
        baseGold: 3,
        dropChance: 12,
        description: 'A large, hairy spider.',
        emoji: '🕷️'
    },
    {
        id: 'slime',
        name: 'Slime',
        minLevel: 1,
        maxLevel: 8,
        baseDamage: {
            min: 1,
            max: 2
        },
        baseHealth: 25,
        baseExperience: 12,
        baseGold: 3,
        dropChance: 15,
        description: 'A gelatinous blob that oozes around.',
        emoji: '🟢'
    },
    
    // Level 5-15
    {
        id: 'goblin',
        name: 'Goblin',
        minLevel: 5,
        maxLevel: 15,
        baseDamage: {
            min: 3,
            max: 6
        },
        baseHealth: 35,
        baseExperience: 25,
        baseGold: 5,
        dropChance: 20,
        description: 'A small, green creature with a mischievous grin.',
        emoji: '👺'
    },
    {
        id: 'wolf',
        name: 'Dire Wolf',
        minLevel: 5,
        maxLevel: 15,
        baseDamage: {
            min: 4,
            max: 7
        },
        baseHealth: 40,
        baseExperience: 30,
        baseGold: 6,
        dropChance: 20,
        description: 'A large, ferocious wolf with glowing eyes.',
        emoji: '🐺'
    },
    {
        id: 'skeleton',
        name: 'Skeleton',
        minLevel: 5,
        maxLevel: 15,
        baseDamage: {
            min: 3,
            max: 8
        },
        baseHealth: 30,
        baseExperience: 28,
        baseGold: 5,
        dropChance: 25,
        description: 'A pile of animated bones.',
        emoji: '💀'
    },
    
    // Level 15-25
    {
        id: 'orc',
        name: 'Orc Warrior',
        minLevel: 15,
        maxLevel: 25,
        baseDamage: {
            min: 6,
            max: 12
        },
        baseHealth: 70,
        baseExperience: 50,
        baseGold: 10,
        dropChance: 30,
        description: 'A muscular, green-skinned warrior with tusks.',
        emoji: '👹'
    },
    {
        id: 'troll',
        name: 'Cave Troll',
        minLevel: 15,
        maxLevel: 25,
        baseDamage: {
            min: 8,
            max: 14
        },
        baseHealth: 90,
        baseExperience: 60,
        baseGold: 12,
        dropChance: 35,
        description: 'A large, lumbering troll with tough skin.',
        emoji: '🧌'
    },
    {
        id: 'ghost',
        name: 'Vengeful Ghost',
        minLevel: 15,
        maxLevel: 25,
        baseDamage: {
            min: 5,
            max: 15
        },
        baseHealth: 60,
        baseExperience: 55,
        baseGold: 11,
        dropChance: 30,
        description: 'A translucent spirit filled with rage.',
        emoji: '👻'
    },
    
    // Level 25-35
    {
        id: 'golem',
        name: 'Stone Golem',
        minLevel: 25,
        maxLevel: 35,
        baseDamage: {
            min: 10,
            max: 20
        },
        baseHealth: 150,
        baseExperience: 100,
        baseGold: 20,
        dropChance: 40,
        description: 'A massive creature made of animated stone.',
        emoji: '🗿'
    },
    {
        id: 'werewolf',
        name: 'Werewolf',
        minLevel: 25,
        maxLevel: 35,
        baseDamage: {
            min: 12,
            max: 18
        },
        baseHealth: 130,
        baseExperience: 95,
        baseGold: 18,
        dropChance: 40,
        description: 'A fearsome hybrid of human and wolf.',
        emoji: '🐺'
    },
    {
        id: 'vampire',
        name: 'Vampire',
        minLevel: 25,
        maxLevel: 35,
        baseDamage: {
            min: 11,
            max: 19
        },
        baseHealth: 120,
        baseExperience: 90,
        baseGold: 19,
        dropChance: 45,
        description: 'A pale creature of the night with a thirst for blood.',
        emoji: '🧛'
    },
    
    // Level 35-50
    {
        id: 'dragon',
        name: 'Young Dragon',
        minLevel: 35,
        maxLevel: 50,
        baseDamage: {
            min: 15,
            max: 30
        },
        baseHealth: 250,
        baseExperience: 200,
        baseGold: 40,
        dropChance: 60,
        description: 'A scaled, fire-breathing creature with wings.',
        emoji: '🐉'
    },
    {
        id: 'demon',
        name: 'Lesser Demon',
        minLevel: 35,
        maxLevel: 50,
        baseDamage: {
            min: 18,
            max: 25
        },
        baseHealth: 220,
        baseExperience: 180,
        baseGold: 35,
        dropChance: 55,
        description: 'A malevolent being from another plane.',
        emoji: '😈'
    },
    {
        id: 'lich',
        name: 'Lich',
        minLevel: 35,
        maxLevel: 50,
        baseDamage: {
            min: 20,
            max: 28
        },
        baseHealth: 200,
        baseExperience: 190,
        baseGold: 38,
        dropChance: 65,
        description: 'An undead sorcerer of immense power.',
        emoji: '🧙‍♂️'
    }
];

// Generate a random enemy based on player level
function generateRandomEnemy(playerLevel) {
    // Filter enemies by level range
    const availableEnemies = ENEMIES.filter(enemy => {
        return playerLevel >= enemy.minLevel && playerLevel <= enemy.maxLevel + 5;
    });
    
    // If no enemies in range, fall back to the lowest level enemies
    if (availableEnemies.length === 0) {
        return generateScaledEnemy(ENEMIES[0], playerLevel);
    }
    
    // Select random enemy from filtered pool
    const baseEnemy = availableEnemies[Math.floor(Math.random() * availableEnemies.length)];
    
    // Scale enemy to player level
    return generateScaledEnemy(baseEnemy, playerLevel);
}

// Generate a scaled enemy based on player level
function generateScaledEnemy(baseEnemy, playerLevel) {
    // Calculate level for the enemy (randomly between -2 and +2 of player level)
    let enemyLevel = playerLevel + getRandomInt(-2, 2);
    
    // Ensure enemy level is within the defined range for this enemy type
    if (enemyLevel < baseEnemy.minLevel) {
        enemyLevel = baseEnemy.minLevel;
    } else if (enemyLevel > baseEnemy.maxLevel) {
        enemyLevel = baseEnemy.maxLevel;
    }
    
    // Base scaling factor based on level difference from enemy's min level
    const levelDiff = enemyLevel - baseEnemy.minLevel;
    const scalingFactor = 1 + (levelDiff * 0.1); // 10% increase per level above min
    
    // Create scaled enemy
    const scaledEnemy = {
        id: baseEnemy.id,
        name: baseEnemy.name,
        level: enemyLevel,
        damage: {
            min: Math.round(baseEnemy.baseDamage.min * scalingFactor),
            max: Math.round(baseEnemy.baseDamage.max * scalingFactor)
        },
        health: Math.round(baseEnemy.baseHealth * scalingFactor),
        maxHealth: Math.round(baseEnemy.baseHealth * scalingFactor), // Track max health for UI
        experience: Math.round(baseEnemy.baseExperience * scalingFactor),
        gold: Math.round(baseEnemy.baseGold * scalingFactor),
        dropChance: baseEnemy.dropChance,
        description: baseEnemy.description,
        emoji: baseEnemy.emoji
    };
    
    return scaledEnemy;
}

// Enemy attacks player
function enemyAttack(enemy) {
    // Generate random damage within enemy's range
    return getRandomInt(enemy.damage.min, enemy.damage.max);
}

// Check if enemy should drop an item
function shouldDropItem(enemy) {
    return Math.random() * 100 < enemy.dropChance;
}

// Get random integer between min and max (inclusive)
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}