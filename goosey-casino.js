// ============================================================
// GOOSEY CASINO — MAIN GAME CODE
// GooseBucks are fictional game currency only.
// ============================================================

"use strict";

const BALANCE_KEY = "gooseyCasinoBalanceV3";

let balance = Number(localStorage.getItem(BALANCE_KEY));
if (!Number.isFinite(balance) || balance < 0) balance = 7500;

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

// ============================================================
// BALANCE AND MENU
// ============================================================

function updateBalance() {
    const el = document.getElementById("balance");
    if (el) el.textContent = balance.toLocaleString() + " GB";

    localStorage.setItem(BALANCE_KEY, String(balance));
    updateRevivalUI();
}

function updateRevivalUI() {
    const box = document.getElementById("zeroCashRevival");
    if (box) box.style.display = balance <= 0 ? "block" : "none";
}

function claimZeroCashRevival() {
    if (balance > 0) return;

    balance = 500;
    updateBalance();
    alert("🪿 You received 500 free GooseBucks!");
}

function startGame() {
    openPoker();
}

function bots() {
    openPoker();
}

function onlineMode() {
    alert("🌎 ONLINE\n\nOnline multiplayer is planned for a future Goosey Casino update!");
}

function privateRoom() {
    alert("🔒 PRIVATE ROOM\n\nPrivate rooms are planned for a future Goosey Casino update!");
}

function howToPlay() {
    alert("🎓 HOW TO PLAY\n\nChoose a game, set your fictional GooseBucks bet, and play!\n\nGooseBucks have no cash value.");
}

function rules() {
    alert("📖 GOOSEY CASINO RULES\n\n• GooseBucks are virtual only.\n• No real-money purchases.\n• No cashing out.\n• No real-money trading.\n• No cheating or exploiting bugs.\n• Keep multiplayer chat friendly.\n\nHave fun! 🪿");
}

function leaderboard() {
    alert("🏆 LEADERBOARD\n\nThe leaderboard is planned for a future Goosey Casino update!");
}

function comingSoon(game) {
    alert("🪿 " + game + "\n\nThis game is coming soon!");
}

function backToWebsite() {
    window.location.href = "index.html";
}

// ============================================================
// 5-CARD DRAW
// ============================================================

function makeDeck() {
    const result = [];

    for (const suit of suits) {
        for (const rank of ranks) {
            result.push({
                suit,
                name: rank.name,
                value: rank.value
            });
        }
    }

    return result;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
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

    div.className = "card" +
        ((card.suit === "♥" || card.suit === "♦") ? " red" : "");

    div.textContent = cardText(card);

    if (clickable) {
        if (selectedCards.has(index)) {
            div.classList.add("selected");
        }

        div.onclick = () => toggleCard(index);
    }

    return div;
}

function renderPokerHands(showBot) {
    const playerEl = document.getElementById("playerHand");
    const botEl = document.getElementById("botHand");

    if (!playerEl || !botEl) return;

    playerEl.innerHTML = "";

    playerHand.forEach((card, i) => {
        playerEl.appendChild(
            renderCard(card, i, pokerActive && !pokerDrawn)
        );
    });

    botEl.innerHTML = "";

    botHand.forEach(card => {
        const div = document.createElement("div");

        div.className = "card" +
            ((card.suit === "♥" || card.suit === "♦") ? " red" : "");

        div.textContent = showBot ? cardText(card) : "🂠";
        botEl.appendChild(div);
    });
}

function setPokerStatus(text) {
    const el = document.getElementById("pokerStatus");
    if (el) el.textContent = text;
}

function openPoker() {
    const modal = document.getElementById("pokerModal");
    if (!modal) return;

    modal.classList.add("show");
    pokerActive = false;
    pokerDrawn = false;
    selectedCards.clear();

    renderPokerHands(false);
    setPokerStatus("Set your bet and deal a hand!");

    const drawButton = document.getElementById("drawButton");
    if (drawButton) drawButton.disabled = true;
}

function closePoker() {
    const modal = document.getElementById("pokerModal");
    if (modal) modal.classList.remove("show");

    pokerActive = false;
}

function getBet() {
    const input = document.getElementById("bet");

    let bet = Number(input ? input.value : 100);

    if (!Number.isFinite(bet)) bet = 100;

    bet = Math.floor(bet / 10) * 10;
    bet = Math.max(10, Math.min(1000, bet));

    if (input) input.value = bet;

    return bet;
}

function dealPoker() {
    const bet = getBet();

    if (bet > balance) {
        setPokerStatus("❌ You don't have enough GooseBucks for that bet.");
        return;
    }

    balance -= bet;
    updateBalance();

    deck = shuffle(makeDeck());

    playerHand = [
        drawOne(), drawOne(), drawOne(), drawOne(), drawOne()
    ];

    botHand = [
        drawOne(), drawOne(), drawOne(), drawOne(), drawOne()
    ];

    selectedCards.clear();
    pokerActive = true;
    pokerDrawn = false;

    const drawButton = document.getElementById("drawButton");
    if (drawButton) drawButton.disabled = false;

    renderPokerHands(false);

    setPokerStatus(
        "Select up to 3 cards to discard, then press DRAW SELECTED. Your bet is in play."
    );
}

function toggleCard(index) {
    if (!pokerActive || pokerDrawn) return;

    if (selectedCards.has(index)) {
        selectedCards.delete(index);
    } else if (selectedCards.size < 3) {
        selectedCards.add(index);
    } else {
        setPokerStatus("You can discard at most 3 cards.");
    }

    renderPokerHands(false);
}

function chooseBotDiscards(hand) {
    const counts = {};

    hand.forEach(card => {
        counts[card.value] = (counts[card.value] || 0) + 1;
    });

    const keepValues = new Set(
        Object.keys(counts)
            .filter(value => counts[value] >= 2)
            .map(Number)
    );

    const scored = hand.map((card, i) => ({
        i,
        keep: keepValues.has(card.value),
        value: card.value
    }));

    return scored
        .filter(card => !card.keep)
        .sort((a, b) => a.value - b.value)
        .slice(0, 3)
        .map(card => card.i);
}

function replaceSelected(hand, indexes) {
    indexes.forEach(i => {
        hand[i] = drawOne();
    });
}

function drawCards() {
    if (!pokerActive || pokerDrawn) return;

    const playerDiscards = [...selectedCards];
    const botDiscards = chooseBotDiscards(botHand);

    replaceSelected(playerHand, playerDiscards);
    replaceSelected(botHand, botDiscards);

    pokerDrawn = true;
    pokerActive = false;

    const drawButton = document.getElementById("drawButton");
    if (drawButton) drawButton.disabled = true;

    renderPokerHands(true);
    resolvePoker(getBet());
}

function evaluateHand(hand) {
    const values = hand
        .map(card => card.value)
        .sort((a, b) => b - a);

    const counts = {};

    values.forEach(value => {
        counts[value] = (counts[value] || 0) + 1;
    });

    const groups = Object.entries(counts)
        .map(([value, count]) => ({
            value: Number(value),
            count
        }))
        .sort((a, b) => b.count - a.count || b.value - a.value);

    const unique = [...new Set(values)].sort((a, b) => b - a);

    let straightHigh = null;

    if (unique.includes(14)) unique.push(1);

    for (let i = 0; i <= unique.length - 5; i++) {
        if (unique[i] - unique[i + 4] === 4) {
            straightHigh = unique[i];
            break;
        }
    }

    const flush = hand.every(card => card.suit === hand[0].suit);

    if (flush && straightHigh) {
        return { rank: 8, name: "Straight Flush", values: [straightHigh] };
    }

    if (groups[0].count === 4) {
        return {
            rank: 7,
            name: "Four of a Kind",
            values: [groups[0].value, groups[1].value]
        };
    }

    if (groups[0].count === 3 && groups[1] && groups[1].count === 2) {
        return {
            rank: 6,
            name: "Full House",
            values
