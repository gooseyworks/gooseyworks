
"use strict";

/* =========================================================
   GOOSEY CASINO — COMPLETE GAME SYSTEM
   GooseyWorks
   Fictional currency only: GooseBucks (GB)
   ========================================================= */

const BALANCE_KEY = "gooseyCasinoBalanceV3";
const OLD_BALANCE_KEYS = [
    "gooseyCasinoBalance",
    "gooseyCasinoBalanceV2"
];
const STARTING_BALANCE = 7500;
const REVIVAL_AMOUNT = 500;

let balance = loadBalance();

function loadBalance() {
    try {
        let saved = localStorage.getItem(BALANCE_KEY);

        if (saved === null) {
            for (const key of OLD_BALANCE_KEYS) {
                const old = localStorage.getItem(key);

                if (old !== null && Number.isFinite(Number(old))) {
                    saved = old;
                    break;
                }
            }
        }

        const amount = Number(saved);

        return saved !== null && Number.isFinite(amount) && amount >= 0
            ? Math.floor(amount)
            : STARTING_BALANCE;
    } catch {
        return STARTING_BALANCE;
    }
}

function saveBalance() {
    try {
        localStorage.setItem(BALANCE_KEY, String(balance));
    } catch (error) {
        console.warn("Goosey Casino could not save the balance.", error);
    }
}

function updateBalance() {
    balance = Math.max(0, Math.floor(Number(balance) || 0));

    const display = document.getElementById("balance");

    if (display) {
        display.textContent = balance.toLocaleString() + " GB";
    }

    saveBalance();
    updateRevivalUI();
}

function updateRevivalUI() {
    const panel = document.getElementById("zeroCashRevival");

    if (panel) {
        panel.style.display = balance <= 0 ? "block" : "none";
    }
}

function claimZeroCashRevival() {
    if (balance > 0) {
        alert("You still have GooseBucks!");
        return;
    }

    balance = REVIVAL_AMOUNT;
    updateBalance();

    alert("HONK! You received 500 free GooseBucks!");
}

function placeBet(amount) {
    amount = Math.floor(Number(amount));

    if (!Number.isFinite(amount) || amount < 1) {
        alert("Enter a valid bet!");
        return false;
    }

    if (amount > balance) {
        alert("You don't have enough GooseBucks!");
        return false;
    }

    balance -= amount;
    updateBalance();

    return true;
}

function award(amount) {
    amount = Math.max(0, Math.floor(Number(amount) || 0));
    balance += amount;
    updateBalance();
}

function money(amount) {
    return Math.floor(amount).toLocaleString() + " GB";
}

function getInputBet(id, fallback = 100) {
    const input = document.getElementById(id);

    if (!input) return Math.min(fallback, balance);

    const amount = Math.floor(Number(input.value));

    if (!Number.isFinite(amount) || amount < 1) {
        alert("Enter a bet of at least 1 GB.");
        return null;
    }

    if (amount > balance) {
        alert("Your bet is bigger than your balance!");
        return null;
    }

    return amount;
}

function getRandom(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

/* =========================================================
   MAIN MENU BUTTONS
   ========================================================= */

function startGame() {
    openPoker();
}

function bots() {
    openPoker();
}

function onlineMode() {
    openCasinoMessage(
        "ONLINE MULTIPLAYER",
        "Online multiplayer needs a shared realtime server. " +
        "This static website version does not yet connect players " +
        "over the internet. You can play the local games against bots."
    );
}

function privateRoom() {
    openCasinoMessage(
        "PRIVATE ROOMS",
        "Private rooms need a multiplayer server to create room codes " +
        "and synchronize players. This feature needs a server connection " +
        "before room codes can work between different devices."
    );
}

function howToPlay() {
    openCasinoMessage(
        "HOW TO PLAY",
        "1. Choose a game.\n" +
        "2. Enter your bet in GooseBucks (GB).\n" +
        "3. Play the round and see the result.\n" +
        "4. Your balance updates automatically.\n\n" +
        "GooseBucks are fictional. They cannot be purchased, traded, " +
        "or exchanged for real money."
    );
}

function rules() {
    openCasinoMessage(
        "GOOSEY CASINO RULES",
        "• GooseBucks are fictional game points.\n" +
        "• No real-money purchases or cash-outs.\n" +
        "• Do not exploit bugs or manipulate the balance.\n" +
        "• If your balance reaches zero, claim the free revival.\n" +
        "• Have fun and HONK responsibly!"
    );
}

function leaderboard() {
    openCasinoMessage(
        "LEADERBOARD",
        "The online leaderboard is not connected yet. " +
        "A shared database is required for a real leaderboard. " +
        "Your balance is currently saved in this browser."
    );
}

function comingSoon(game) {
    openCasinoMessage(
        game || "COMING SOON",
        "This game is not available in the current version yet."
    );
}

function backToWebsite() {
    window.location.href = "index.html";
}

/* =========================================================
   GENERAL MESSAGE MODAL
   ========================================================= */

function openCasinoMessage(title, message) {
    let modal = document.getElementById("casinoMessageModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "casinoMessageModal";

        modal.style.cssText =
            "position:fixed;inset:0;background:#000b;" +
            "display:flex;align-items:center;justify-content:center;" +
            "z-index:99999;padding:20px;";

        modal.innerHTML = `
            <div style="
                background:#182238;color:white;padding:25px;
                border-radius:16px;max-width:500px;width:100%;
                text-align:center;box-shadow:0 8px 30px #0008;
                white-space:pre-line;">
                <h2 id="casinoMessageTitle"></h2>
                <p id="casinoMessageText"></p>
                <button onclick="closeCasinoMessage()"
                    style="padding:10px 20px;cursor:pointer;">
                    CLOSE
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    document.getElementById("casinoMessageTitle").textContent = title;
    document.getElementById("casinoMessageText").textContent = message;
    modal.style.display = "flex";
}

function closeCasinoMessage() {
    const modal = document.getElementById("casinoMessageModal");

    if (modal) modal.style.display = "none";
}

/* =========================================================
   CARD DECK
   ========================================================= */

const SUITS = ["♠", "♥", "♦", "♣"];
const RANKS = [
    "2", "3", "4", "5", "6", "7", "8", "9",
    "10", "J", "Q", "K", "A"
];

const RANK_VALUE = {
    "2": 2, "3": 3, "4": 4, "5": 5, "6": 6,
    "7": 7, "8": 8, "9": 9, "10": 10,
    "J": 11, "Q": 12, "K": 13, "A": 14
};

function makeDeck() {
    const deck = [];

    for (const suit of SUITS) {
        for (const rank of RANKS) {
            deck.push({
                suit,
                rank,
                value: RANK_VALUE[rank]
            });
        }
    }

    return shuffle(deck);
}

function drawOne(deck) {
    if (deck.length === 0) {
        deck.push(...shuffle(makeDeck()));
    }

    return deck.pop();
}

function cardText(card) {
    return card ? card.rank + card.suit : "";
}

function renderCard(card, selected = false, onClick = "") {
    const red = card && (card.suit === "♥" || card.suit === "♦");

    return `
        <button ${onClick ? `onclick="${onClick}"` : ""}
            style="
                display:inline-flex;flex-direction:column;
                justify-content:center;align-items:center;
                width:58px;height:82px;margin:4px;
                background:${selected ? "#ffe58a" : "#fff"};
                color:${red ? "#d22" : "#111"};
                border:2px solid ${selected ? "#ffb300" : "#ccc"};
                border-radius:8px;font-size:20px;font-weight:bold;
                cursor:${onClick ? "pointer" : "default"};
                box-shadow:0 2px 5px #0003;">
            <span>${card ? card.rank : ""}</span>
            <span>${card ? card.suit : ""}</span>
        </button>
    `;
}

/* =========================================================
   POKER HAND EVALUATION
   ========================================================= */

function evaluateHand(hand) {
    const values = hand.map(card => card.value).sort((a, b) => b - a);
    const counts = {};

    for (const value of values) {
        counts[value] = (counts[value] || 0) + 1;
    }

    const groups = Object.entries(counts)
        .map(([value, count]) => ({
            value: Number(value),
            count
        }))
        .sort((a, b) => b.count - a.count || b.value - a.value);

    const flush = hand.every(card => card.suit === hand[0].suit);

    let unique = [...new Set(values)].sort((a, b) => b - a);
    let straight = false;
    let straightHigh = unique[0];

    if (unique.length === 5) {
        if (unique[0] - unique[4] === 4) {
            straight = true;
        } else if (unique.join(",") === "14,5,4,3,2") {
            straight = true;
            straightHigh = 5;
        }
    }

    if (straight && flush && straightHigh === 14) {
        return { rank: 9, name: "Royal Flush", values: [14] };
    }

    if (straight && flush) {
        return { rank: 8, name: "Straight Flush", values: [straightHigh] };
    }

    if (groups[0].count === 4) {
        return {
            rank: 7,
            name: "Four of a Kind",
            values: [groups[0].value, groups[1].value]
        };
    }

    if (groups[0].count === 3 && groups[1]?.count === 2) {
        return {
            rank: 6,
            name: "Full House",
            values: [groups[0].value, groups[1].value]
        };
    }

    if (flush) {
        return { rank: 5, name: "Flush", values };
    }

    if (straight) {
        return { rank: 4, name: "Straight", values: [straightHigh] };
    }

    if (groups[0].count === 3) {
        return {
            rank: 3,
            name: "Three of a Kind",
            values: [
                groups[0].value,
                ...groups.slice(1).map(group => group.value).sort((a, b) => b - a)
            ]
        };
    }

    if (groups[0].count === 2 && groups[1]?.count === 2) {
        const pairs = [groups[0].value, groups[1].value].sort((a, b) => b - a);

        return {
            rank: 2,
            name: "Two Pair",
            values: [pairs[0], pairs[1], groups[2].value]
        };
    }

    if (groups[0].count === 2) {
        return {
            rank: 1,
            name: "One Pair",
            values: [
                groups[0].value,
                ...groups.slice(1).map(group => group.value).sort((a, b) => b - a)
            ]
        };
    }

    return { rank: 0, name: "High Card", values };
}

function compareHands(a, b) {
    if (a.rank !== b.rank) return a.rank > b.rank ? 1 : -1;

    const length = Math.max(a.values.length, b.values.length);

    for (let i = 0; i < length; i++) {
        const av = a.values[i] || 0;
        const bv = b.values[i] || 0;

        if (av !== bv) return av > bv ? 1 : -1;
    }

    return 0;
}

/* =========================================================
   5-CARD DRAW POKER
   ========================================================= */

let deck = [];
let playerHand = [];
let botHand = [];
let selectedCards = new Set();
let pokerActive = false;
let pokerDrawn = false;
let pokerBet = 0;

function setPokerStatus(message) {
    const status = document.getElementById("pokerStatus");

    if (status) status.textContent = message;
}

function renderPokerHands() {
    const player = document.getElementById("playerHand");
    const bot = document.getElementById("botHand");

    if (player) {
        player.innerHTML = playerHand.map((card, index) =>
            renderCard(
                card,
                selectedCards.has(index),
                `toggleCard(${index})`
            )
        ).join("");
    }

    if (bot) {
        bot.innerHTML = botHand.map(card => renderCard(card)).join("");
    }
}

function openPoker() {
    const modal = document.getElementById("pokerModal");

    if (!modal) {
        openCasinoMessage(
            "5-CARD DRAW",
            "The poker modal was not found in goosey-casino.html."
        );
        return;
    }

    modal.classList.add("show");
    modal.style.display = "flex";
    pokerActive = false;
    pokerDrawn = false;
    selectedCards.clear();
    setPokerStatus("Place your bet and deal!");
}

function closePoker() {
    const modal = document.getElementById("pokerModal");

    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }

    pokerActive = false;
}

function getBet() {
    return getInputBet("bet", 100);
}

function dealPoker() {
    if (pokerActive) {
        setPokerStatus("Finish your current hand first.");
        return;
    }

    const amount = getBet();

    if (amount === null || !placeBet(amount)) return;

    pokerBet = amount;
    deck = makeDeck();
    playerHand = [];
    botHand = [];
    selectedCards.clear();

    for (let i = 0; i < 5; i++) {
        playerHand.push(drawOne(deck));
        botHand.push(drawOne(deck));
    }

    pokerActive = true;
    pokerDrawn = false;

    const drawButton = document.getElementById("drawButton");

    if (drawButton) {
        drawButton.disabled = false;
        drawButton.textContent = "DRAW SELECTED CARDS";
    }

    renderPokerHands();

    setPokerStatus(
        "Choose up to 3 cards to replace, then press Draw."
    );
}

function toggleCard(index) {
    if (!pokerActive || pokerDrawn) return;

    if (selectedCards.has(index)) {
        selectedCards.delete(index);
    } else {
        if (selectedCards.size >= 3) {
            setPokerStatus("You can replace a maximum of 3 cards.");
            return;
        }

        selectedCards.add(index);
    }

    renderPokerHands();
}

function chooseBotDiscards() {
    const evaluation = evaluateHand(botHand);

    if (evaluation.rank >= 2) return [];

    const counts = {};

    for (const card of botHand) {
        counts[card.value] = (counts[card.value] || 0) + 1;
    }

    const keep = new Set(
        Object.keys(counts)
            .filter(value => counts[value] >= 2)
            .map(Number)
    );

    if (keep.size === 0) {
        const highest = Math.max(...botHand.map(card => card.value));
        keep.add(highest);
    }

    return botHand
        .map((card, index) => ({ card, index }))
        .filter(item => !keep.has(item.card.value))
        .map(item => item.index)
        .slice(0, 3);
}

function replaceSelected(hand, indices, sourceDeck) {
    for (const index of indices) {
        hand[index] = drawOne(sourceDeck);
    }
}

function drawCards() {
    if (!pokerActive || pokerDrawn) return;

    const playerIndices = [...selectedCards];
    const botIndices = chooseBotDiscards();

    replaceSelected(playerHand, playerIndices, deck);
    replaceSelected(botHand, botIndices, deck);

    pokerDrawn = true;
    pokerActive = false;
    selectedCards.clear();

    renderPokerHands();

    const playerResult = evaluateHand(playerHand);
    const botResult = evaluateHand(botHand);
    const result = compareHands(playerResult, botResult);

    let message =
        "You: " + playerResult.name +
        " | Goosey Bot: " + botResult.name + ". ";

    if (result > 0) {
        const multiplier = ({
            0: 0,
            1: 1.5,
            2: 2,
            3: 2.5,
            4: 3,
            5: 4,
            6: 6,
            7: 12,
            8: 25,
            9: 40
        })[playerResult.rank] || 0;

        if (multiplier > 0) {
            const winnings = Math.floor(pokerBet * multiplier);
            award(winnings);
            message += "YOU WIN " + money(winnings) + "!";
        } else {
            message += "You beat the bot, but the hand pays no bonus.";
        }
    } else if (result === 0) {
        award(pokerBet);
        message += "It's a tie! Your bet is returned.";
    } else {
        message += "The Goosey Bot wins!";
    }

    setPokerStatus(message);

    const drawButton = document.getElementById("drawButton");

    if (drawButton) {
        drawButton.disabled = true;
        drawButton.textContent = "HAND COMPLETE";
    }
}

/* =========================================================
   BLACKJACK
   ========================================================= */

let blackjackDeck = [];
let blackjackPlayer = [];
let blackjackDealer = [];
let blackjackActive = false;
let blackjackBetAmount = 0;

function blackjackTotal(hand) {
    let total = 0;
    let aces = 0;

    for (const card of hand) {
        if (card.rank === "A") {
            total += 11;
            aces++;
        } else if (["K", "Q", "J"].includes(card.rank)) {
            total += 10;
        } else {
            total += card.value;
        }
    }

    while (total > 21 && aces > 0) {
        total -= 10;
        aces--;
    }

    return total;
}

function renderBlackjack() {
    const dealer = document.getElementById("dealerBlackjackHand");
    const player = document.getElementById("playerBlackjackHand");
    const dealerTotal = document.getElementById("dealerBlackjackTotal");
    const playerTotal = document.getElementById("playerBlackjackTotal");

    if (dealer) {
        dealer.innerHTML = blackjackDealer.map((card, index) => {
            if (blackjackActive && index === 1) {
                return renderCard({ rank: "?", suit: "?" });
            }

            return renderCard(card);
        }).join("");
    }

    if (player) {
        player.innerHTML = blackjackPlayer.map(card => renderCard(card)).join("");
    }

    if (dealerTotal) {
        dealerTotal.textContent = blackjackActive
            ? "?"
            : blackjackTotal(blackjackDealer);
    }

    if (playerTotal) {
        playerTotal.textContent = blackjackTotal(blackjackPlayer);
    }
}

function blackjackStatus(message) {
    const status = document.getElementById("blackjackStatus");

    if (status) status.textContent = message;
}

function openBlackjack() {
    const modal = document.getElementById("blackjackModal");

    if (!modal) {
        openCasinoMessage("BLACKJACK", "The Blackjack modal is missing.");
        return;
    }

    modal.classList.add("show");
    modal.style.display = "flex";
    blackjackActive = false;
    blackjackStatus("Place a bet and deal!");
}

function closeBlackjack() {
    const modal = document.getElementById("blackjackModal");

    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }

    blackjackActive = false;
}

function dealBlackjack() {
    if (blackjackActive) {
        blackjackStatus("Finish your current hand first.");
        return;
    }

    const amount = getInputBet("blackjackBet", 100);

    if (amount === null || !placeBet(amount)) return;

    blackjackBetAmount = amount;
    blackjackDeck = makeDeck();
    blackjackPlayer = [
        drawOne(blackjackDeck),
        drawOne(blackjackDeck)
    ];
    blackjackDealer = [
        drawOne(blackjackDeck),
        drawOne(blackjackDeck)
    ];

    blackjackActive = true;
    renderBlackjack();

    const hit = document.getElementById("blackjackHitButton");
    const stand = document.getElementById("blackjackStandButton");

    if (hit) hit.disabled = false;
    if (stand) stand.disabled = false;

    if (blackjackTotal(blackjackPlayer) === 21) {
        finishBlackjack();
    } else {
        blackjackStatus("Hit for another card or Stand to finish.");
    }
}

function blackjackHit() {
    if (!blackjackActive) return;

    blackjackPlayer.push(drawOne(blackjackDeck));
    renderBlackjack();

    if (blackjackTotal(blackjackPlayer) > 21) {
        finishBlackjack();
    }
}

function blackjackStand() {
    if (!blackjackActive) return;

    while (blackjackTotal(blackjackDealer) < 17) {
        blackjackDealer.push(drawOne(blackjackDeck));
    }

    finishBlackjack();
}

function finishBlackjack() {
    blackjackActive = false;

    const playerScore = blackjackTotal(blackjackPlayer);
    const dealerScore = blackjackTotal(blackjackDealer);

    const playerNatural =
        blackjackPlayer.length === 2 && playerScore === 21;

    const dealerNatural =
        blackjackDealer.length === 2 && dealerScore === 21;

    let message = "";

    if (playerScore > 21) {
        message = "BUST! You lose.";
    } else if (dealerScore > 21) {
        award(blackjackBetAmount * 2);
        message = "Dealer busts! You win " +
            money(blackjackBetAmount * 2) + ".";
    } else if (playerNatural && !dealerNatural) {
        award(Math.floor(blackjackBetAmount * 2.5));
        message = "BLACKJACK! You win " +
            money(Math.floor(blackjackBetAmount * 2.5)) + ".";
    } else if (playerScore > dealerScore) {
        award(blackjackBetAmount * 2);
        message = "You win " + money(blackjackBetAmount * 2) + "!";
    } else if (playerScore === dealerScore) {
        award(blackjackBetAmount);
        message = "Push! Your bet is returned.";
    } else {
        message = "Dealer wins!";
    }

    renderBlackjack();
    blackjackStatus(
        message + " Your total: " + playerScore +
        ". Dealer total: " + dealerScore + "."
    );

    const hit = document.getElementById("blackjackHitButton");
    const stand = document.getElementById("blackjackStandButton");

    if (hit) hit.disabled = true;
    if (stand) stand.disabled = true;
}

function openArcadeGame(game) {
    if (game === "Texas Holdem" || game === "Texas Hold'em") {
        openTexasHoldem();
        return;
    }

    if (game === "Goosey Slots") return playSlots();
    if (game === "Goosey Wheel") return playWheel();
    if (game === "Coin Flip") return playCoinFlip();
    if (game === "Dice Duel") return playDiceDuel();
    if (game === "Chicken") return openChicken();
    if (game === "Goosey Crash") return openCrash();
    if (game === "Bomb Goose") return openBombGoose();
    if (game === "Goosey Pool") return openGooseyPool();

    openCasinoMessage(game, "This game is not available.");
}

/* =========================================================
   DYNAMIC ARCADE GAME WINDOWS
   ========================================================= */

function getArcadeModal() {
    let modal = document.getElementById("arcadeGameModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "arcadeGameModal";

        modal.style.cssText =
            "position:fixed;inset:0;z-index:99990;background:#000c;" +
            "display:none;align-items:center;justify-content:center;" +
            "padding:15px;overflow:auto;";

        modal.innerHTML = `
            <div style="
                width:100%;max-width:650px;background:#182238;
                color:white;padding:24px;border-radius:16px;
                max-height:90vh;overflow:auto;text-align:center;">
                <h2 id="arcadeTitle">GOOSEY GAME</h2>
                <div id="arcadeContent"></div>
                <p id="arcadeStatus" style="white-space:pre-line;"></p>
                <button onclick="closeArcadeGame()"
                    style="padding:10px 20px;cursor:pointer;">
                    CLOSE GAME
                </button>
            </div>
        `;

        document.body.appendChild(modal);
    }

    return modal;
}

function showArcade(title, content, status = "") {
    const modal = getArcadeModal();

    document.getElementById("arcadeTitle").textContent = title;
    document.getElementById("arcadeContent").innerHTML = content;
    document.getElementById("arcadeStatus").textContent = status;

    modal.style.display = "flex";
}

function setArcadeStatus(message) {
    const status = document.getElementById("arcadeStatus");

    if (status) status.textContent = message;
}

function closeArcadeGame() {
    const modal = document.getElementById("arcadeGameModal");

    if (modal) modal.style.display = "none";

    stopCrashTimer();
}

/* =========================================================
   GOOSEY SLOTS
   ========================================================= */

function playSlots() {
    showArcade(
        "🪙 GOOSEY SLOTS",
        `
        <p>Three reels. Match symbols to win!</p>
        <label>Bet (GB):
            <input id="slotsBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <h1 id="slotReels" style="font-size:55px;">🪿 🍒 ⭐</h1>
        <button onclick="spinSlots()">SPIN!</button>
        `,
        "Match symbols to win. Three geese pay the most!"
    );
}

function spinSlots() {
    const amount = getInputBet("slotsBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const symbols = ["🪿", "🍒", "⭐", "💎", "🍋", "🐸"];
    const reels = [
        symbols[getRandom(0, symbols.length - 1)],
        symbols[getRandom(0, symbols.length - 1)],
        symbols[getRandom(0, symbols.length - 1)]
    ];

    const display = document.getElementById("slotReels");

    if (display) display.textContent = reels.join(" ");

    let multiplier = 0;

    if (reels[0] === reels[1] && reels[1] === reels[2]) {
        multiplier = reels[0] === "🪿" ? 12 : 8;
    } else if (
        reels[0] === reels[1] ||
        reels[1] === reels[2] ||
        reels[0] === reels[2]
    ) {
        multiplier = 2;
    }

    if (multiplier > 0) {
        const winnings = amount * multiplier;
        award(winnings);
        setArcadeStatus(
            "HONK! You won " + money(winnings) +
            " (" + multiplier + "x your bet)!"
        );
    } else {
        setArcadeStatus("No match! You lost " + money(amount) + ".");
    }
}

/* =========================================================
   GOOSEY WHEEL
   ========================================================= */

function playWheel() {
    showArcade(
        "🎡 GOOSEY WHEEL",
        `
        <p>Spin the wheel and see your multiplier.</p>
        <label>Bet (GB):
            <input id="wheelBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <h1 id="wheelResult" style="font-size:55px;">🎡</h1>
        <button onclick="spinWheel()">SPIN THE WHEEL</button>
        `,
        "Possible results: 0x, 0.5x, 1x, 2x, 3x, 5x."
    );
}

function spinWheel() {
    const amount = getInputBet("wheelBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const outcomes = [
        { label: "0x", multiplier: 0, weight: 20 },
        { label: "0.5x", multiplier: 0.5, weight: 20 },
        { label: "1x", multiplier: 1, weight: 25 },
        { label: "2x", multiplier: 2, weight: 20 },
        { label: "3x", multiplier: 3, weight: 10 },
        { label: "5x", multiplier: 5, weight: 5 }
    ];

    let roll = Math.random() * 100;
    let chosen = outcomes[0];

    for (const outcome of outcomes) {
        roll -= outcome.weight;

        if (roll < 0) {
            chosen = outcome;
            break;
        }
    }

    const result = document.getElementById("wheelResult");

    if (result) result.textContent = "🎡 " + chosen.label;

    const winnings = Math.floor(amount * chosen.multiplier);

    if (winnings > 0) award(winnings);

    setArcadeStatus(
        "The wheel landed on " + chosen.label + ". " +
        (winnings > 0
            ? "You received " + money(winnings) + "."
            : "No payout this time.")
    );
}

/* =========================================================
   COIN FLIP
   ========================================================= */

function playCoinFlip() {
    showArcade(
        "🪙 COIN FLIP",
        `
        <p>Choose heads or tails. Correct guesses pay 2x.</p>
        <label>Bet (GB):
            <input id="coinBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p>
            <button onclick="flipCoin('heads')">HEADS</button>
            <button onclick="flipCoin('tails')">TAILS</button>
        </p>
        <h1 id="coinResult">🪙</h1>
        `,
        "Pick carefully!"
    );
}

function flipCoin(choice) {
    const amount = getInputBet("coinBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const result = Math.random() < 0.5 ? "heads" : "tails";
    const display = document.getElementById("coinResult");

    if (display) {
        display.textContent = result === "heads" ? "🪙 HEADS" : "🪙 TAILS";
    }

    if (choice === result) {
        award(amount * 2);
        setArcadeStatus("Correct! You won " + money(amount * 2) + ".");
    } else {
        setArcadeStatus("Wrong! You lost " + money(amount) + ".");
    }
}

/* =========================================================
   DICE DUEL
   ========================================================= */

function playDiceDuel() {
    showArcade(
        "🎲 DICE DUEL",
        `
        <p>Roll two dice against the Goosey Bot.</p>
        <label>Bet (GB):
            <input id="diceBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p><button onclick="rollDiceDuel()">ROLL DICE</button></p>
        <h2 id="diceResult">🎲 🎲</h2>
        `,
        "Highest total wins. A tie returns your bet."
    );
}

function rollDiceDuel() {
    const amount = getInputBet("diceBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const p1 = getRandom(1, 6) + getRandom(1, 6);
    const p2 = getRandom(1, 6) + getRandom(1, 6);

    const display = document.getElementById("diceResult");

    if (display) {
        display.textContent = "YOU: " + p1 + " | BOT: " + p2;
    }

    if (p1 > p2) {
        award(amount * 2);
        setArcadeStatus("You win! " + money(amount * 2) + " returned.");
    } else if (p1 === p2) {
        award(amount);
        setArcadeStatus("Tie! Your bet is returned.");
    } else {
        setArcadeStatus("The bot wins this round.");
    }
}

/* =========================================================
   CHICKEN — CASH OUT BEFORE THE GOOSE CRASHES
   ========================================================= */

let chickenBet = 0;
let chickenMultiplier = 1;
let chickenActive = false;

function openChicken() {
    chickenBet = 0;
    chickenMultiplier = 1;
    chickenActive = false;

    showArcade(
        "🐔 CHICKEN",
        `
        <p>Climb the multiplier. Collect before you crash!</p>
        <label>Bet (GB):
            <input id="chickenBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <h1 id="chickenMultiplier">1.00x</h1>
        <button onclick="startChicken()">START</button>
        <button onclick="riskChicken()">RISK IT!</button>
        <button onclick="cashOutChicken()">COLLECT</button>
        `,
        "Start a round, risk another step, or collect your winnings."
    );
}

function startChicken() {
    if (chickenActive) {
        setArcadeStatus("Your round is already running.");
        return;
    }

    const amount = getInputBet("chickenBet", 100);

    if (amount === null || !placeBet(amount)) return;

    chickenBet = amount;
    chickenMultiplier = 1;
    chickenActive = true;

    updateChickenDisplay();
    setArcadeStatus("Round started! Press RISK IT or COLLECT.");
}

function updateChickenDisplay() {
    const display = document.getElementById("chickenMultiplier");

    if (display) {
        display.textContent = chickenMultiplier.toFixed(2) + "x";
    }
}

function riskChicken() {
    if (!chickenActive) {
        setArcadeStatus("Start a round first.");
        return;
    }

    if (Math.random() < 0.23) {
        chickenActive = false;
        setArcadeStatus("CRASH! You lost " + money(chickenBet) + ".");
        return;
    }

    chickenMultiplier *= 1.35;
    updateChickenDisplay();

    setArcadeStatus(
        "Safe! Your potential payout is " +
        money(chickenBet * chickenMultiplier) + ". Collect now or risk again."
    );
}

function cashOutChicken() {
    if (!chickenActive) {
        setArcadeStatus("There is no active round to collect.");
        return;
    }

    const winnings = Math.floor(chickenBet * chickenMultiplier);

    chickenActive = false;
    award(winnings);

    setArcadeStatus("You collected " + money(winnings) + "!");
}

/* =========================================================
   GOOSEY CRASH
   ========================================================= */

let crashTimer = null;
let crashBet = 0;
let crashMultiplier = 1;
let crashActive = false;
let crashStartTime = 0;
let crashPoint = 0;

function stopCrashTimer() {
    if (crashTimer !== null) {
        clearInterval(crashTimer);
        crashTimer = null;
    }
}

function openCrash() {
    stopCrashTimer();

    crashActive = false;
    crashMultiplier = 1;

    showArcade(
        "📈 GOOSEY CRASH",
        `
        <p>Cash out before the multiplier crashes!</p>
        <label>Bet (GB):
            <input id="crashBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <h1 id="crashMultiplier" style="font-size:48px;">1.00x</h1>
        <button onclick="startCrash()">START ROUND</button>
        <button onclick="cashOutCrash()">CASH OUT</button>
        `,
        "The longer you wait, the higher the risk."
    );
}

function startCrash() {
    if (crashActive) {
        setArcadeStatus("A round is already running.");
        return;
    }

    const amount = getInputBet("crashBet", 100);

    if (amount === null || !placeBet(amount)) return;

    crashBet = amount;
    crashMultiplier = 1;
    crashStartTime = Date.now();

    const r = Math.random();
    crashPoint = r < 0.12
        ? 1.05 + Math.random() * 0.4
        : 1.4 + Math.random() * 5.6;

    crashActive = true;

    stopCrashTimer();

    crashTimer = setInterval(() => {
        if (!crashActive) {
            stopCrashTimer();
            return;
        }

        const elapsed = (Date.now() - crashStartTime) / 1000;
        crashMultiplier = 1 + elapsed * 0.35 + elapsed * elapsed * 0.08;

        const display = document.getElementById("crashMultiplier");

        if (display) {
            display.textContent = crashMultiplier.toFixed(2) + "x";
        }

        if (crashMultiplier >= crashPoint) {
            crashActive = false;
            stopCrashTimer();

            setArcadeStatus(
                "CRASHED at " + crashPoint.toFixed(2) +
                "x! Your bet was lost."
            );
        }
    }, 100);
}


function cashOutCrash() {
    // You can only cash out during an active round.
    if (!crashActive) {
        setArcadeStatus("No active round! Start a new round first.");
        return;
    }

    // End the round BEFORE awarding money, preventing repeat payouts.
    crashActive = false;
    stopCrashTimer();

    const finalMultiplier = crashMultiplier;
    const winnings = Math.floor(crashBet * finalMultiplier);

    // Prevent this round from being paid out again.
    crashBet = 0;
    crashMultiplier = 1;

    const display = document.getElementById("crashMultiplier");
    if (display) {
        display.textContent = finalMultiplier.toFixed(2) + "x";
    }

    award(winnings);

    setArcadeStatus(
        "Cashed out at " + finalMultiplier.toFixed(2) +
        "x! You received " + money(winnings) +
        ". Start a new round to play again."
    );
}

/* =========================================================
   BOMB GOOSE
   ========================================================= */

let bombBet = 0;
let bombActive = false;
let bombSpots = [];
let bombSafePicks = [];
let bombMultiplier = 1;

function openBombGoose() {
    bombActive = false;
    bombSafePicks = [];

    showArcade(
        "💣 BOMB GOOSE",
        `
        <p>Choose safe spots. Avoid the three bombs!</p>
        <label>Bet (GB):
            <input id="bombBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p><button onclick="startBombGoose()">NEW ROUND</button>
        <button onclick="cashOutBombGoose()">COLLECT</button></p>
        <div id="bombBoard"
            style="display:grid;grid-template-columns:repeat(3,70px);
            gap:8px;justify-content:center;margin:15px;"></div>
        `,
        "Find safe squares and collect before hitting a bomb."
    );
}

function startBombGoose() {
    if (bombActive) {
        setArcadeStatus("Finish your current round first.");
        return;
    }

    const amount = getInputBet("bombBet", 100);

    if (amount === null || !placeBet(amount)) return;

    bombBet = amount;
    bombSpots = [];
    bombSafePicks = [];
    bombMultiplier = 1;
    bombActive = true;

    while (bombSpots.length < 3) {
        const spot = getRandom(0, 8);

        if (!bombSpots.includes(spot)) bombSpots.push(spot);
    }

    renderBombBoard();
    setArcadeStatus("Round started. Pick a square!");
}

function renderBombBoard() {
    const board = document.getElementById("bombBoard");

    if (!board) return;

    board.innerHTML = "";

    for (let i = 0; i < 9; i++) {
        const button = document.createElement("button");

        button.textContent = bombSafePicks.includes(i)
            ? "🪿"
            : "❔";

        button.style.cssText =
            "height:65px;width:65px;font-size:24px;cursor:pointer;";

        button.disabled = !bombActive || bombSafePicks.includes(i);
        button.onclick = () => pickBombSpot(i);

        board.appendChild(button);
    }
}

function pickBombSpot(index) {
    if (!bombActive || bombSafePicks.includes(index)) return;

    if (bombSpots.includes(index)) {
        bombActive = false;

        const board = document.getElementById("bombBoard");

        if (board) {
            [...board.children].forEach((button, i) => {
                button.textContent = bombSpots.includes(i) ? "💣" : "🪿";
                button.disabled = true;
            });
        }

        setArcadeStatus("BOOM! You hit a bomb and lost your bet.");
        return;
    }

    bombSafePicks.push(index);
    bombMultiplier *= 1.35;

    renderBombBoard();

    setArcadeStatus(
        "Safe! Current potential payout: " +
        money(bombBet * bombMultiplier) + "."
    );
}

function cashOutBombGoose() {
    if (!bombActive) {
        setArcadeStatus("Start a round first.");
        return;
    }

    if (bombSafePicks.length === 0) {
        setArcadeStatus("Pick at least one safe square before collecting.");
        return;
    }

    bombActive = false;

    const winnings = Math.floor(bombBet * bombMultiplier);

    award(winnings);
    renderBombBoard();

    setArcadeStatus("You collected " + money(winnings) + "!");
}

/* =========================================================
   TEXAS HOLD'EM — SIMPLE BOT SHOWDOWN
   ========================================================= */

let holdemActive = false;

function openTexasHoldem() {
    showArcade(
        "♣ TEXAS HOLD'EM",
        `
        <p>You and the Goosey Bot each get two cards.</p>
        <p>Five community cards are dealt. Best five-card hand wins.</p>
        <label>Bet (GB):
            <input id="holdemBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p><button onclick="dealHoldem()">DEAL HAND</button></p>
        <h3>Your cards</h3>
        <div id="holdemPlayer"></div>
        <h3>Community cards</h3>
        <div id="holdemCommunity"></div>
        <h3>Goosey Bot</h3>
        <div id="holdemBot"></div>
        `,
        "Deal to begin."
    );
}

function combinations(items, size) {
    const result = [];

    function build(start, current) {
        if (current.length === size) {
            result.push([...current]);
            return;
        }

        for (let i = start; i < items.length; i++) {
            current.push(items[i]);
            build(i + 1, current);
            current.pop();
        }
    }

    build(0, []);
    return result;
}

function bestFive(cards) {
    const hands = combinations(cards, 5);
    let best = evaluateHand(hands[0]);

    for (let i = 1; i < hands.length; i++) {
        const result = evaluateHand(hands[i]);

        if (compareHands(result, best) > 0) {
            best = result;
        }
    }

    return best;
}

function dealHoldem() {
    if (holdemActive) {
        setArcadeStatus("This hand is already running.");
        return;
    }

    const amount = getInputBet("holdemBet", 100);

    if (amount === null || !placeBet(amount)) return;

    holdemActive = true;

    const deck = makeDeck();
    const player = [drawOne(deck), drawOne(deck)];
    const bot = [drawOne(deck), drawOne(deck)];
    const community = [
        drawOne(deck),
        drawOne(deck),
        drawOne(deck),
        drawOne(deck),
        drawOne(deck)
    ];

    const playerResult = bestFive([...player, ...community]);
    const botResult = bestFive([...bot, ...community]);
    const result = compareHands(playerResult, botResult);

    const p = document.getElementById("holdemPlayer");
    const b = document.getElementById("holdemBot");
    const c = document.getElementById("holdemCommunity");

    if (p) p.innerHTML = player.map(card => renderCard(card)).join("");
    if (b) b.innerHTML = bot.map(card => renderCard(card)).join("");
    if (c) c.innerHTML = community.map(card => renderCard(card)).join("");

    if (result > 0) {
        award(amount * 2);
        setArcadeStatus(
            "You win with " + playerResult.name +
            "! You received " + money(amount * 2) + "."
        );
    } else if (result === 0) {
        award(amount);
        setArcadeStatus("Tie! Your bet is returned.");
    } else {
        setArcadeStatus(
            "Goosey Bot wins with " + botResult.name + "."
        );
    }

    holdemActive = false;
}

/* =========================================================
   GOOSEY RACING
   ========================================================= */

let raceRunning = false;

function openGooseRace() {
    const modal = document.getElementById("gooseRaceModal");

    if (!modal) {
        showArcade(
            "🏁 GOOSEY RACING",
            `
            <p>Choose your goose and place a bet.</p>
            <label>Bet (GB):
                <input id="raceBet" type="number" min="1" max="${balance}"
                    value="${Math.min(100, balance)}">
            </label>
            <p>
                <label>Your goose:
                    <select id="raceGoose">
                        <option value="0">White Goose</option>
                        <option value="1">Golden Goose</option>
                        <option value="2">Speedy Goose</option>
                    </select>
                </label>
            </p>
            <div id="dynamicRaceTrack" style="font-size:25px;line-height:2;">
                🪿 🏁<br>🦢 🏁<br>🐤 🏁
            </div>
            <button onclick="startDynamicRace()">START RACE</button>
            `,
            "Pick a goose. A winning bet pays 3x."
        );

        return;
    }

    modal.classList.add("show");
    modal.style.display = "flex";

    const status = document.getElementById("gooseRaceStatus");

    if (status) status.textContent = "Place your bets and start the race!";
}

function startRaceButtonClick() {
    startDynamicRace();
}

function startRace() {
    startDynamicRace();
}

function startDynamicRace() {
    if (raceRunning) return;

    const amount = getInputBet("raceBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const chosenInput = document.getElementById("raceGoose");
    const chosen = chosenInput ? Number(chosenInput.value) : 0;

    raceRunning = true;

    const positions = [0, 0, 0];
    const racers = ["🪿", "🦢", "🐤"];
    const track = document.getElementById("dynamicRaceTrack") ||
        document.getElementById("raceTrack");

    let step = 0;

    const timer = setInterval(() => {
        step++;

        for (let i = 0; i < positions.length; i++) {
            positions[i] += getRandom(1, 3);
        }

        if (track) {
            track.innerHTML = positions.map((position, index) => {
                return `
                    <div style="white-space:nowrap;overflow:hidden;">
                        ${racers[index]}
                        <span style="display:inline-block;width:${Math.min(
                            position * 12, 260
                        )}px;"></span> 🏁
                    </div>
                `;
            }).join("");
        }

        if (step >= 8 || Math.max(...positions) >= 18) {
            clearInterval(timer);
            raceRunning = false;

            const winner = positions.indexOf(Math.max(...positions));

            if (winner === chosen) {
                award(amount * 3);
                setRaceStatus(
                    "Your goose won! You received " +
                    money(amount * 3) + "."
                );
            } else {
                setRaceStatus(
                    "Goose " + (winner + 1) + " won! Better luck next race."
                );
            }
        }
    }, 350);
}

function setRaceStatus(message) {
    const status = document.getElementById("gooseRaceStatus");

    if (status) {
        status.textContent = message;
    } else {
        setArcadeStatus(message);
    }
}

/* =========================================================
   GOOSEY POOL — SIMPLE SHOT CHALLENGE
   ========================================================= */

function openGooseyPool() {
    showArcade(
        "🎱 GOOSEY POOL",
        `
        <p>Try to sink the ball into a pocket.</p>
        <label>Bet (GB):
            <input id="poolBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p>Choose your shot strength.</p>
        <input id="poolStrength" type="range" min="1" max="10" value="5"
            oninput="document.getElementById('poolStrengthValue').textContent=this.value">
        <span id="poolStrengthValue">5</span>
        <div style="
            background:#167447;padding:20px;border:6px solid #754321;
            border-radius:15px;margin:15px auto;max-width:420px;">
            <div style="display:flex;justify-content:space-between;">
                <span>⚪</span><span>🕳️</span>
            </div>
            <p>GOOSEY POOL TABLE</p>
        </div>
        <button onclick="takePoolShot()">TAKE SHOT</button>
        `,
        "A good shot can pay 2x or 4x."
    );
}

function takePoolShot() {
    const amount = getInputBet("poolBet", 100);

    if (amount === null || !placeBet(amount)) return;

    const strengthInput = document.getElementById("poolStrength");
    const strength = strengthInput ? Number(strengthInput.value) : 5;

    const distance = Math.abs(strength - 6);
    const chance = Math.max(0.12, 0.7 - distance * 0.08);
    const roll = Math.random();

    if (roll < chance * 0.25) {
        award(amount * 4);
        setArcadeStatus("AMAZING SHOT! You sank it cleanly and won " +
            money(amount * 4) + "!");
    } else if (roll < chance) {
        award(amount * 2);
        setArcadeStatus("Nice shot! You won " + money(amount * 2) + ".");
    } else {
        setArcadeStatus("Scratch! You missed the pocket.");
    }
}

/* =========================================================
   MODAL CLOSE HELPERS
   ========================================================= */

function closeGooseRace() {
    const modal = document.getElementById("gooseRaceModal");

    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }

    raceRunning = false;
}

/* =========================================================
   INITIALIZE
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
    updateBalance();

    // Ensure the revival panel matches the starting balance.
    updateRevivalUI();

    // Make the existing Goosey Race button work if it calls this function.
    window.openGooseRace = openGooseRace;

    // Add an Escape-key shortcut for dynamically generated game windows.
    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            closeCasinoMessage();
            closeArcadeGame();
        }
    });
});

// Update immediately too, in case this script loads after the page.
updateBalance();
