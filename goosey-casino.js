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
// ============================================
// 5-CARD DRAW ENGINE
// ============================================

let deck = [];
let playerHand = [];
let botHand = [];
let selectedCards = new Set();

let pokerActive = false;
let pokerDrawn = false;

const suits = ["♠", "♥", "♦", "♣"];

const ranks = [
    { name: "2", value: 2 },
    { name: "3", value: 3 },
    { name: "4", value: 4 },
    { name: "5", value: 5 },
    { name: "6", value: 6 },
    { name: "7", value: 7 },
    { name: "8", value: 8 },
    { name: "9", value: 9 },
    { name: "10", value: 10 },
    { name: "J", value: 11 },
    { name: "Q", value: 12 },
    { name: "K", value: 13 },
    { name: "A", value: 14 }
];

function makeDeck() {

    const newDeck = [];

    for (const suit of suits) {

        for (const rank of ranks) {

            newDeck.push({
                suit: suit,
                name: rank.name,
                value: rank.value
            });

        }

    }

    return newDeck;
}

function shuffle(array) {

    for (let i = array.length - 1; i > 0; i--) {

        const j = Math.floor(Math.random() * (i + 1));

        [array[i], array[j]] =
        [array[j], array[i]];

    }

    return array;
}

function drawOne() {

    return deck.pop();

}

function cardText(card) {

    return card.name + card.suit;

}

function renderCard(card, index, clickable) {

    const div = document.createElement("div");

    div.className =
        "card" +
        ((card.suit === "♥" || card.suit === "♦")
            ? " red"
            : "");

    div.textContent = cardText(card);

    if (clickable) {

        if (selectedCards.has(index)) {

            div.classList.add("selected");

        }

        div.onclick = function () {

            toggleCard(index);

        };

    }

    return div;

}

function renderPokerHands(showBot) {

    const playerElement =
        document.getElementById("playerHand");

    const botElement =
        document.getElementById("botHand");

    if (!playerElement || !botElement) {
        return;
    }

    playerElement.innerHTML = "";

    playerHand.forEach(function(card, index) {

        playerElement.appendChild(
            renderCard(
                card,
                index,
                pokerActive && !pokerDrawn
            )
        );

    });

    botElement.innerHTML = "";

    botHand.forEach(function(card) {

        const div = document.createElement("div");

        div.className =
            "card" +
            ((card.suit === "♥" || card.suit === "♦")
                ? " red"
                : "");

        if (showBot) {

            div.textContent = cardText(card);

        } else {

            div.textContent = "🂠";

        }

        botElement.appendChild(div);

    });

}

function setPokerStatus(text) {

    const element =
        document.getElementById("pokerStatus");

    if (element) {

        element.textContent = text;

    }

}

function openPoker() {

    const modal =
        document.getElementById("pokerModal");

    if (!modal) {
        return;
    }

    modal.classList.add("show");

    pokerActive = false;
    pokerDrawn = false;

    selectedCards.clear();

    renderPokerHands(false);

    setPokerStatus(
        "Set your bet and deal a hand!"
    );

    const drawButton =
        document.getElementById("drawButton");

    if (drawButton) {

        drawButton.disabled = true;

    }

}

function closePoker() {

    const modal =
        document.getElementById("pokerModal");

    if (modal) {

        modal.classList.remove("show");

    }

    pokerActive = false;

}

function getBet() {

    const input =
        document.getElementById("bet");

    let bet =
        Number(input ? input.value : 100);

    if (!Number.isFinite(bet)) {

        bet = 100;

    }

    bet =
        Math.floor(bet / 10) * 10;

    bet =
        Math.max(10, Math.min(1000, bet));

    if (input) {

        input.value = bet;

    }

    return bet;

}

function dealPoker() {

    const bet = getBet();

    if (bet > balance) {

        setPokerStatus(
            "❌ You don't have enough GooseBucks!"
        );

        return;

    }

    balance -= bet;

    updateBalance();

    deck = shuffle(makeDeck());

    playerHand = [
        drawOne(),
        drawOne(),
        drawOne(),
        drawOne(),
        drawOne()
    ];

    botHand = [
        drawOne(),
        drawOne(),
        drawOne(),
        drawOne(),
        drawOne()
    ];

    selectedCards.clear();

    pokerActive = true;
    pokerDrawn = false;

    const drawButton =
        document.getElementById("drawButton");

    if (drawButton) {

        drawButton.disabled = false;

    }

    renderPokerHands(false);

    setPokerStatus(
        "Select up to 3 cards to discard, then DRAW SELECTED!"
    );

}

function toggleCard(index) {

    if (!pokerActive || pokerDrawn) {
        return;
    }

    if (selectedCards.has(index)) {

        selectedCards.delete(index);

    } else {

        if (selectedCards.size < 3) {

            selectedCards.add(index);

        } else {

            setPokerStatus(
                "You can discard at most 3 cards!"
            );

        }

    }

    renderPokerHands(false);

}

function chooseBotDiscards(hand) {

    const counts = {};

    hand.forEach(function(card) {

        counts[card.value] =
            (counts[card.value] || 0) + 1;

    });

    const keepValues =
        new Set(
            Object.keys(counts)
                .filter(function(value) {
                    return counts[value] >= 2;
                })
                .map(Number)
        );

    const candidates =
        hand.map(function(card, index) {

            return {
                index: index,
                keep: keepValues.has(card.value),
                value: card.value
            };

        });

    return candidates
        .filter(function(card) {
            return !card.keep;
        })
        .sort(function(a, b) {
            return a.value - b.value;
        })
        .slice(0, 3)
        .map(function(card) {
            return card.index;
        });

}

function replaceSelected(hand, indexes) {

    indexes.forEach(function(index) {

        hand[index] = drawOne();

    });

}

function drawCards() {

    if (!pokerActive || pokerDrawn) {
        return;
    }

    const playerDiscards =
        Array.from(selectedCards);

    const botDiscards =
        chooseBotDiscards(botHand);

    replaceSelected(
        playerHand,
        playerDiscards
    );

    replaceSelected(
        botHand,
        botDiscards
    );

    pokerDrawn = true;
    pokerActive = false;

    const drawButton =
        document.getElementById("drawButton");

    if (drawButton) {

        drawButton.disabled = true;

    }

    renderPokerHands(true);

    resolvePoker(getBet());

}
