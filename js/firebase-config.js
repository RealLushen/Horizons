// Firebase Configuration for Horizons RPG

// Initialize Firebase (you need to replace these values with your own Firebase project config)
const firebaseConfig = {
  apiKey: "AIzaSyCbNCQX3mgQcZaA-ZMielktdKavXU2I3aw",
  authDomain: "horizons-90111.firebaseapp.com",
  projectId: "horizons-90111",
  storageBucket: "horizons-90111.firebasestorage.app",
  messagingSenderId: "1056446946202",
  appId: "1:1056446946202:web:9851a19ccc7b6d91e6b823",
  measurementId: "G-EZ9SB1CGD3"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get a reference to the database service
const database = firebase.database();

// Update leaderboard with player data
function updateLeaderboard(playerData) {
    if (!playerData || !playerData.username) return;
    
    const leaderboardRef = database.ref('leaderboard');
    
    // Get current user reference
    const userRef = leaderboardRef.child(encodeUsername(playerData.username));
    
    // Update user data in leaderboard
    userRef.once('value').then((snapshot) => {
        const existingData = snapshot.val();
        
        // Only update if new level is higher or user doesn't exist
        if (!existingData || playerData.level > existingData.level) {
            userRef.set({
                username: playerData.username,
                avatar: playerData.avatar,
                level: playerData.level,
                timestamp: firebase.database.ServerValue.TIMESTAMP
            });
        }
    });
}

// Get top 5 players from leaderboard
function getLeaderboard(callback) {
    const leaderboardRef = database.ref('leaderboard');
    
    // Get top 5 players by level
    leaderboardRef.orderByChild('level')
        .limitToLast(5)
        .once('value')
        .then((snapshot) => {
            const leaderboardData = [];
            
            // Convert to array and sort
            snapshot.forEach((childSnapshot) => {
                leaderboardData.push(childSnapshot.val());
            });
            
            // Sort by level (highest first)
            leaderboardData.sort((a, b) => b.level - a.level);
            
            callback(leaderboardData);
        })
        .catch((error) => {
            console.error("Error fetching leaderboard: ", error);
            callback([]);
        });
}

// Utility function to encode username for Firebase (Firebase keys cannot contain '.', '#', '$', '[', or ']')
function encodeUsername(username) {
    return username.replace(/[.#$[\]]/g, '_');
}

// Display leaderboard in specified element
function displayLeaderboard(elementId) {
    const leaderboardElement = document.getElementById(elementId);
    if (!leaderboardElement) return;
    
    // Show loading state
    leaderboardElement.innerHTML = '<div class="leaderboard-loading">Loading leaderboard...</div>';
    
    getLeaderboard((leaderboardData) => {
        if (leaderboardData.length === 0) {
            leaderboardElement.innerHTML = '<div class="leaderboard-empty">No players on leaderboard yet!</div>';
            return;
        }
        
        // Create leaderboard HTML
        let html = '<h3 class="leaderboard-title">Top 5 Players</h3>';
        
        leaderboardData.forEach((player, index) => {
            html += `
                <div class="leaderboard-item">
                    <div class="leaderboard-rank">${index + 1}</div>
                    <div class="leaderboard-user">
                        <img src="assets/avatars/${player.avatar}.png" alt="${player.username}" class="leaderboard-avatar">
                        <span class="leaderboard-username">${player.username}</span>
                    </div>
                    <div class="leaderboard-value">Level ${player.level}</div>
                </div>
            `;
        });
        
        leaderboardElement.innerHTML = html;
    });
}