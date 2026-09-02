// ============================================
// GOOSEY CASINO - MAIN JAVASCRIPT
// ============================================

// GooseBucks
let balance = 7500;

// Update the balance shown on screen
function updateBalance() {
    const balanceElement = document.getElementById("balance");

    if (balanceElement) {
        balanceElement.textContent =
            balance.toLocaleString() + " GB";
    }
}

// ============================================
// MAIN MENU
// ============================================

function startGame() {
    openPoker();
}

function onlineMode() {
    alert(
        "🌎 ONLINE\n\n" +
        "Online multiplayer is coming soon!\n\n" +
        "For now, play against Goosey Bot."
    );
}

function privateRoom() {
    alert(
        "🔒 PRIVATE ROOM\n\n" +
        "Private rooms are coming soon!\n\n" +
        "Soon you'll be able to create a room and invite your friends."
    );
}

function bots() {
    openPoker();
}

function howToPlay() {
    alert(
        "🎓 HOW TO PLAY\n\n" +
        "Choose a game from the casino menu.\n\n" +
        "🃏 5-Card Draw\n" +
        "Get 5 cards, choose cards to discard, " +
        "then draw replacements.\n\n" +
        "The player with the better poker hand wins!"
    );
}

function rules() {
    alert(
        "📖 GOOSEY CASINO RULES\n\n" +
        "• GooseBucks are fictional game currency only.\n" +
        "• GooseBucks cannot be purchased.\n" +
        "• GooseBucks cannot be cashed out.\n" +
        "• GooseBucks cannot be traded for real-world value.\n" +
        "• Don't cheat or exploit bugs.\n" +
        "• Keep multiplayer chat friendly.\n\n" +
        "Have fun! 🪿"
    );
}

function leaderboard() {
    alert(
        "🏆 LEADERBOARD\n\n" +
        "The leaderboard system is coming soon!"
    );
}

function comingSoon(game) {
    alert(
        "🪿 " + game + "\n\n" +
        "This game is coming soon!"
    );
}

function backToWebsite() {
    window.location.href = "index.html";
}


// ============================================
// 5-CARD DRAW MENU
// ============================================

function openPoker() {
    const modal = document.getElementById("pokerModal");

    if (modal) {
        modal.classList.add("show");
    }
}

function closePoker() {
    const modal = document.getElementById("pokerModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// Start with the correct balance
updateBalance();
