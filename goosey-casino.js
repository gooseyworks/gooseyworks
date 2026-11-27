
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
const REVIVAL_COOLDOWN_MS = 3.5 * 24 * 60 * 60 * 1000;
const REVIVAL_TIME_KEY = "gooseyCasinoLastRevivalV1";
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

    let lastRevival = 0;
    try {
        lastRevival = Number(localStorage.getItem(REVIVAL_TIME_KEY)) || 0;
    } catch (error) {
        console.warn("Could not check the revival cooldown.", error);
    }

    const remaining = REVIVAL_COOLDOWN_MS - (Date.now() - lastRevival);
    if (lastRevival > 0 && remaining > 0) {
        const hours = Math.ceil(remaining / (60 * 60 * 1000));
        alert("Your next 500 GB revival is available in about " + hours + " hour(s).");
        return;
    }

    balance = REVIVAL_AMOUNT;
    updateBalance();

    try {
        localStorage.setItem(REVIVAL_TIME_KEY, String(Date.now()));
    } catch (error) {
        console.warn("Could not save the revival cooldown.", error);
    }

    alert("HONK! You received 500 free GooseBucks! You can revive again in 3.5 days if your balance reaches zero.");
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
    openCasinoGameMenu();
}

function bots() {
    openCasinoGameMenu();
}

function openCasinoGameMenu() {
    showArcade(
        "🪿 CHOOSE A GOOSEY CASINO GAME",
        `
        <p>Choose a game to play. All bets use fictional GooseBucks (GB).</p>
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(145px,1fr));gap:10px;">
            <button onclick="openBlackjack()">🂡 Blackjack</button>
            <button onclick="openPoker()">🃏 5-Card Draw</button>
            <button onclick="openTexasHoldem()">♣ Texas Hold'em</button>
            <button onclick="openGooseRace()">🏁 Goosey Race</button>
            <button onclick="playSlots()">🎰 Goosey Slots</button>
            <button onclick="playWheel()">🎡 Goosey Wheel</button>
            <button onclick="playCoinFlip()">🪙 Coin Flip</button>
            <button onclick="playDiceDuel()">🎲 Dice Duel</button>
            <button onclick="openChicken()">🐔 Chicken</button>
            <button onclick="openBombGoose()">💣 Bomb Goose</button>
            <button onclick="openGooseyPool()">🎱 Goosey Pool</button>
            <button onclick="openStockMarket()">📈 Goosey Market</button>
        </div>`,
        "Select a game above. Your balance is saved in this browser."
    );
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
        "HOW TO PLAY GOOSEY CASINO",
        "1. Press PLAY and choose a game.\n" +
        "2. Enter a bet in GooseBucks (GB); the bet is deducted when the round begins.\n" +
        "3. Blackjack: get close to 21 without busting; hit or stand.\n" +
        "4. 5-Card Draw: select up to three cards to replace.\n" +
        "5. Texas Hold'em: use your two private cards with five community cards; bet, check, or fold through the streets. Four seats are used locally (you plus three bots).\n" +
        "6. Goosey Race: pick a racer and bet before the race starts. Each racer has a different payout.\n" +
        "7. Your balance saves in this browser. Online multiplayer and private rooms need a shared server and are not active yet.\n\n" +
        "GooseBucks are fictional game points. They cannot be purchased, traded, or exchanged for real money."
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
    const arcadeModal = document.getElementById("arcadeGameModal");
    if (arcadeModal) arcadeModal.style.display = "none";

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
    const arcadeModal = document.getElementById("arcadeGameModal");
    if (arcadeModal) arcadeModal.style.display = "none";

    if (!modal) {
        showArcade(
            "🂡 BLACKJACK",
            `
            <p>Beat the dealer without going over 21. Blackjack pays 3:2.</p>
            <label>Bet (GB): <input id="blackjackBet" type="number" min="1" max="${balance}" value="${Math.min(100, balance)}"></label>
            <h3>Dealer <span id="dealerBlackjackTotal">?</span></h3>
            <div id="dealerBlackjackHand"></div>
            <h3>You <span id="playerBlackjackTotal">0</span></h3>
            <div id="playerBlackjackHand"></div>
            <p style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
              <button onclick="dealBlackjack()">DEAL</button>
              <button id="blackjackHitButton" onclick="blackjackHit()" disabled>HIT</button>
              <button id="blackjackStandButton" onclick="blackjackStand()" disabled>STAND</button>
              <button id="blackjackDoubleButton" onclick="blackjackDoubleDown()" disabled>DOUBLE DOWN</button>
            </p>`,
            "Place a bet and deal!"
        );
    } else {
        modal.classList.add("show");
        modal.style.display = "flex";
    }
    blackjackActive = false;
    blackjackPlayer = [];
    blackjackDealer = [];
    renderBlackjack();
    blackjackStatus("Place a bet and deal!");
}

function closeBlackjack() {
    const modal = document.getElementById("blackjackModal");
    if (modal) {
        modal.classList.remove("show");
        modal.style.display = "none";
    }
    blackjackActive = false;
    closeArcadeGame();
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
    const doubleButton = document.getElementById("blackjackDoubleButton");
    if (doubleButton) doubleButton.disabled = balance < blackjackBetAmount;

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
    playDealerBlackjack();
}

function blackjackDoubleDown() {
    if (!blackjackActive || blackjackPlayer.length !== 2) return;
    if (balance < blackjackBetAmount) {
        blackjackStatus("You need enough GB to match your original bet to double down.");
        return;
    }
    if (!placeBet(blackjackBetAmount)) return;
    blackjackBetAmount *= 2;
    blackjackPlayer.push(drawOne(blackjackDeck));
    renderBlackjack();
    if (blackjackTotal(blackjackPlayer) > 21) {
        finishBlackjack();
    } else {
        playDealerBlackjack();
    }
}

function playDealerBlackjack() {
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
    const doubleButton = document.getElementById("blackjackDoubleButton");
    if (doubleButton) doubleButton.disabled = true;
}

function openArcadeGame(game) {
    const name = String(game || "").trim().toLowerCase();
    if (name.includes("texas") || name.includes("hold'em") || name.includes("holdem")) return openTexasHoldem();
    if (name.includes("blackjack")) return openBlackjack();
    if (name.includes("race") || name.includes("racing")) return openGooseRace();
    if (name.includes("5-card") || name.includes("five card") || name.includes("poker")) return openPoker();
    if (name.includes("slots")) return playSlots();
    if (name.includes("wheel")) return playWheel();
    if (name.includes("coin")) return playCoinFlip();
    if (name.includes("dice")) return playDiceDuel();
    if (name.includes("chicken")) return openChicken();
    if (name.includes("crash") || name.includes("market")) return openStockMarket();
    if (name.includes("bomb")) return openBombGoose();
    if (name.includes("pool")) return openGooseyPool();
    openCasinoMessage(game || "GOOSEY CASINO", "This game is not available yet.");
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
        <p>Spin the wheel for prizes, balance boosts, or percentage losses!</p>
        <label>Bet (GB) for multiplier outcomes:
            <input id="wheelBet" type="number" min="1" max="${balance}"
                value="${Math.min(100, balance)}">
        </label>
        <p style="font-size:13px;">Special outcomes can change your whole balance.</p>
        <h1 id="wheelResult" style="font-size:42px;">🎡</h1>
        <button onclick="spinWheel()">SPIN THE WHEEL</button>
        `,
        "Outcomes include multipliers, a random balance from 0–100,000 GB, and losses of 1%, 2%, 3%, 5%, or 10% of your original balance."
    );
}

function spinWheel() {
    const amount = getInputBet("wheelBet", 100);
    if (amount === null) return;

    // Record the balance before the bet so percentage losses use the original amount.
    const originalBalance = balance;
    if (!placeBet(amount)) return;

    const outcomes = [
        { label: "0x — bet lost", type: "multiplier", multiplier: 0, weight: 14 },
        { label: "0.5x", type: "multiplier", multiplier: 0.5, weight: 14 },
        { label: "1x — bet returned", type: "multiplier", multiplier: 1, weight: 18 },
        { label: "2x", type: "multiplier", multiplier: 2, weight: 14 },
        { label: "3x", type: "multiplier", multiplier: 3, weight: 8 },
        { label: "5x JACKPOT", type: "multiplier", multiplier: 5, weight: 4 },
        { label: "RANDOM BALANCE: 0–100,000 GB", type: "randomBalance", weight: 3 },
        { label: "LOSE 1% OF ORIGINAL BALANCE", type: "percentLoss", percent: 1, weight: 5 },
        { label: "LOSE 2% OF ORIGINAL BALANCE", type: "percentLoss", percent: 2, weight: 5 },
        { label: "LOSE 3% OF ORIGINAL BALANCE", type: "percentLoss", percent: 3, weight: 4 },
        { label: "LOSE 5% OF ORIGINAL BALANCE", type: "percentLoss", percent: 5, weight: 4 },
        { label: "LOSE 10% OF ORIGINAL BALANCE", type: "percentLoss", percent: 10, weight: 4 },
        { label: "HONK BONUS +500 GB", type: "bonus", bonus: 500, weight: 3 }
    ];

    let roll = Math.random() * outcomes.reduce((sum, item) => sum + item.weight, 0);
    let chosen = outcomes[outcomes.length - 1];
    for (const outcome of outcomes) {
        roll -= outcome.weight;
        if (roll < 0) {
            chosen = outcome;
            break;
        }
    }

    const result = document.getElementById("wheelResult");
    if (result) result.textContent = "🎡 " + chosen.label;

    if (chosen.type === "multiplier") {
        const winnings = Math.floor(amount * chosen.multiplier);
        if (winnings > 0) award(winnings);
        setArcadeStatus(
            "The wheel landed on " + chosen.label + ". " +
            (winnings > 0 ? "You received " + money(winnings) + "." : "You lost your bet of " + money(amount) + ".")
        );
        return;
    }

    if (chosen.type === "randomBalance") {
        balance = getRandom(0, 100000);
        updateBalance();
        setArcadeStatus("RANDOM BALANCE! Your balance is now " + money(balance) + ".");
        return;
    }

    if (chosen.type === "percentLoss") {
        const loss = Math.floor(originalBalance * chosen.percent / 100);
        balance = Math.max(0, originalBalance - loss);
        updateBalance();
        setArcadeStatus("Oof! The wheel took " + money(loss) + " (" + chosen.percent + "% of your original " + money(originalBalance) + "). Your balance is now " + money(balance) + ".");
        return;
    }

    if (chosen.type === "bonus") {
        award(chosen.bonus);
        setArcadeStatus("HONK BONUS! You received " + money(chosen.bonus) + ".");
    }
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
   TEXAS HOLD'EM — FOUR-PLAYER TABLE WITH BETTING ROUNDS
   Local table: player plus three bots. Online networking is separate.
   ========================================================= */

let holdemActive = false;
let holdemDeck = [];
let holdemPlayers = [];
let holdemCommunity = [];
let holdemStreet = 0;
let holdemPot = 0;
let holdemAnte = 0;
let holdemUserContribution = 0;
let holdemHandOver = false;
const HOLDEM_STREETS = ["Pre-flop", "Flop", "Turn", "River"];

function openTexasHoldem() {
    holdemActive = false;
    holdemHandOver = false;
    showArcade(
        "♣ TEXAS HOLD'EM — 4 PLAYERS",
        `
        <p>Four seats: you and three Goosey bots. Each player gets two private cards. The table reveals the flop (3 cards), turn, and river. Best five-card hand wins the pot.</p>
        <label>Starting bet / ante (GB): <input id="holdemBet" type="number" min="1" max="${balance}" value="${Math.min(100, balance)}"></label>
        <p><button onclick="dealHoldem()">DEAL TABLE</button></p>
        <h3 id="holdemStreetLabel">Waiting for a hand</h3>
        <p>Pot: <strong id="holdemPot">0 GB</strong></p>
        <div id="holdemPlayers" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:8px;text-align:center;"></div>
        <h3>Community cards</h3><div id="holdemCommunity"></div>
        <div id="holdemActions" style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;margin-top:12px;">
          <button id="holdemCheckButton" onclick="holdemCheck()" disabled>CHECK / NEXT</button>
          <button id="holdemBetButton" onclick="holdemBetRaise()" disabled>BET / RAISE</button>
          <button id="holdemFoldButton" onclick="holdemFold()" disabled>FOLD</button>
        </div>
        <p id="holdemRoundInfo">Deal to start. Betting uses fictional GB.</p>
        `,
        "Deal to begin."
    );
}

function combinations(items, size) {
    const result = [];
    function build(start, current) {
        if (current.length === size) { result.push([...current]); return; }
        for (let i = start; i < items.length; i++) {
            current.push(items[i]); build(i + 1, current); current.pop();
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
        if (compareHands(result, best) > 0) best = result;
    }
    return best;
}

function dealHoldem() {
    if (holdemActive) {
        setArcadeStatus("Finish the current hand before dealing again.");
        return;
    }
    const amount = getInputBet("holdemBet", 100);
    if (amount === null || !placeBet(amount)) return;

    holdemAnte = amount;
    holdemPot = amount * 4;
    holdemUserContribution = amount;
    holdemDeck = makeDeck();
    holdemCommunity = [];
    holdemStreet = 0;
    holdemHandOver = false;
    holdemPlayers = [
        { name: "You", cards: [drawOne(holdemDeck), drawOne(holdemDeck)], human: true, folded: false, contribution: amount },
        { name: "Goosey Bot 1", cards: [drawOne(holdemDeck), drawOne(holdemDeck)], human: false, folded: false, contribution: amount },
        { name: "Goosey Bot 2", cards: [drawOne(holdemDeck), drawOne(holdemDeck)], human: false, folded: false, contribution: amount },
        { name: "Goosey Bot 3", cards: [drawOne(holdemDeck), drawOne(holdemDeck)], human: false, folded: false, contribution: amount }
    ];
    holdemActive = true;
    renderHoldemTable(false);
    setHoldemActions(true);
    holdemMessage("Pre-flop: check to reveal the flop, or bet/raise to put more GB into the pot.");
}

function setHoldemActions(enabled) {
    for (const id of ["holdemCheckButton", "holdemBetButton", "holdemFoldButton"]) {
        const button = document.getElementById(id);
        if (button) button.disabled = !enabled;
    }
}

function holdemMessage(message) {
    const node = document.getElementById("holdemRoundInfo");
    if (node) node.textContent = message;
    setArcadeStatus(message);
}

function renderHoldemTable(revealAll) {
    const playersNode = document.getElementById("holdemPlayers");
    const communityNode = document.getElementById("holdemCommunity");
    const potNode = document.getElementById("holdemPot");
    const streetNode = document.getElementById("holdemStreetLabel");
    if (potNode) potNode.textContent = money(holdemPot);
    if (streetNode) streetNode.textContent = holdemHandOver ? "Showdown" : (HOLDEM_STREETS[holdemStreet] || "Showdown");
    if (playersNode) {
        playersNode.innerHTML = holdemPlayers.map((player, index) => {
            const cardsVisible = player.human || revealAll || player.folded;
            const cards = cardsVisible
                ? player.cards.map(card => renderCard(card)).join("")
                : renderCard({rank:"?",suit:"?"}) + renderCard({rank:"?",suit:"?"});
            return `<div style="background:#263b37;padding:8px;border-radius:10px;border:2px solid ${player.human ? '#f6d365' : '#557568'};">
                <strong>${player.name}${player.folded ? " — FOLDED" : ""}</strong><div>${cards}</div>
                <small>In pot: ${money(player.contribution)}</small>
                ${revealAll && !player.folded && holdemCommunity.length === 5 ? `<div><small>${bestFive([...player.cards,...holdemCommunity]).name}</small></div>` : ""}
            </div>`;
        }).join("");
    }
    if (communityNode) communityNode.innerHTML = holdemCommunity.map(card => renderCard(card)).join("");
}

function holdemCheck() {
    if (!holdemActive || holdemHandOver) return;
    if (holdemStreet < 3) {
        revealNextHoldemStreet();
        return;
    }
    finishHoldem();
}

function holdemBetRaise() {
    if (!holdemActive || holdemHandOver) return;
    const cost = Math.max(1, holdemAnte);
    if (balance < cost) {
        holdemMessage("You don't have enough GB for this bet. Check to continue or fold.");
        return;
    }
    if (!placeBet(cost)) return;
    holdemUserContribution += cost;
    holdemPot += cost;
    // Each bot decides whether to call this street's bet. Bots that fold stay out.
    let callers = 0;
    for (let i = 1; i < holdemPlayers.length; i++) {
        const bot = holdemPlayers[i];
        if (bot.folded) continue;
        const strength = evaluateHand(bot.cards).rank;
        const calls = Math.random() < (strength >= 1 ? 0.82 : 0.62);
        if (calls) {
            bot.contribution += cost;
            holdemPot += cost;
            callers++;
        } else {
            bot.folded = true;
        }
    }
    renderHoldemTable(false);
    if (holdemPlayers.slice(1).every(player => player.folded)) {
        holdemHandOver = true;
        holdemActive = false;
        award(holdemPot);
        renderHoldemTable(true);
        setHoldemActions(false);
        holdemMessage("Everyone folded! You win the pot of " + money(holdemPot) + ".");
        return;
    }
    if (holdemStreet < 3) revealNextHoldemStreet("Your bet added " + money(cost) + "; " + callers + " bot(s) called.");
    else finishHoldem("Your river bet added " + money(cost) + "; " + callers + " bot(s) called.");
}

function holdemFold() {
    if (!holdemActive || holdemHandOver) return;
    holdemPlayers[0].folded = true;
    holdemHandOver = true;
    holdemActive = false;
    renderHoldemTable(true);
    setHoldemActions(false);
    holdemMessage("You folded. The pot stays with the remaining bots; your contribution is lost.");
}

function revealNextHoldemStreet(prefix = "") {
    if (!holdemActive || holdemHandOver) return;
    if (holdemStreet === 0) {
        holdemCommunity.push(drawOne(holdemDeck), drawOne(holdemDeck), drawOne(holdemDeck));
        holdemStreet = 1;
    } else if (holdemStreet === 1) {
        holdemCommunity.push(drawOne(holdemDeck));
        holdemStreet = 2;
    } else if (holdemStreet === 2) {
        holdemCommunity.push(drawOne(holdemDeck));
        holdemStreet = 3;
    }
    renderHoldemTable(false);
    if (holdemStreet === 3) {
        holdemMessage((prefix ? prefix + " " : "") + "River is out. Check for showdown, bet/raise, or fold.");
    } else {
        holdemMessage((prefix ? prefix + " " : "") + "" + HOLDEM_STREETS[holdemStreet] + " revealed. Check to continue, bet/raise, or fold.");
    }
}

function finishHoldem(prefix = "") {
    if (!holdemActive || holdemHandOver) return;
    // A check on the river reaches showdown.
    if (holdemCommunity.length < 5) {
        while (holdemCommunity.length < 5) holdemCommunity.push(drawOne(holdemDeck));
    }
    const contenders = holdemPlayers.filter(player => !player.folded);
    const results = contenders.map(player => ({player, result:bestFive([...player.cards,...holdemCommunity])}));
    let best = results[0].result;
    for (const entry of results.slice(1)) if (compareHands(entry.result,best) > 0) best = entry.result;
    const winners = results.filter(entry => compareHands(entry.result,best) === 0);
    const payout = Math.floor(holdemPot / winners.length);
    const userWon = winners.some(entry => entry.player.human);
    holdemHandOver = true;
    holdemActive = false;
    if (userWon) award(payout);
    renderHoldemTable(true);
    setHoldemActions(false);
    const names = winners.map(entry => entry.player.name).join(" and ");
    const resultName = winners[0].result.name;
    holdemMessage((prefix ? prefix + " " : "") + names + " win with " + resultName + ". Pot: " + money(holdemPot) + "." + (userWon ? " Your payout: " + money(payout) + "." : " Your hand lost; better luck next time."));
}

/* =========================================================
   GOOSEY RACING
   ========================================================= */

let raceRunning = false;
let raceTimer = null;

function openGooseRace() {
    const modal = document.getElementById("gooseRaceModal");
    const arcadeModal = document.getElementById("arcadeGameModal");
    if (arcadeModal) arcadeModal.style.display = "none";

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
                        <option value="0">White Goose — 2× payout</option>
                        <option value="1">Golden Goose — 3× payout</option>
                        <option value="2">Speedy Goose — 4× payout</option>
                    </select>
                </label>
            </p>
            <div id="dynamicRaceTrack" style="font-size:25px;line-height:2;">
                🪿 🏁<br>🦢 🏁<br>🐤 🏁
            </div>
            <button onclick="startDynamicRace()">START RACE</button>
            `,
            "Choose a racer, place your bet, and watch the race. Payouts: White 2×, Golden 3×, Speedy 4× (total return, including your bet)."
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
    const racers = ["🪿 White Goose", "🦢 Golden Goose", "🐤 Speedy Goose"];
    const baseSpeeds = [2.2, 1.9, 2.5];
    const payouts = [2, 3, 4];
    const track = document.getElementById("dynamicRaceTrack") ||
        document.getElementById("raceTrack");

    let step = 0;

    raceTimer = setInterval(() => {
        step++;

        for (let i = 0; i < positions.length; i++) {
            positions[i] += Math.max(1, Math.round(baseSpeeds[i] + getRandom(-1, 2)));
        }

        if (track) {
            track.innerHTML = positions.map((position, index) => {
                return `
                    <div style="white-space:nowrap;overflow:hidden;background:#e8f5e9;color:#17351e;padding:4px;margin:3px 0;border-radius:6px;">
                        <strong>${racers[index]}</strong>
                        <span style="display:inline-block;width:${Math.min(position * 8, 240)}px;"></span> 🏁
                    </div>
                `;
            }).join("");
        }

        if (step >= 8 || Math.max(...positions) >= 18) {
            clearInterval(raceTimer);
            raceTimer = null;
            raceRunning = false;

            const winner = positions.indexOf(Math.max(...positions));

            if (winner === chosen) {
                const winnings = amount * payouts[chosen];
                award(winnings);
                setRaceStatus(
                    racers[winner] + " won! Your " + payouts[chosen] + "× payout is " +
                    money(winnings) + ". Your original bet is included in the payout."
                );
            } else {
                setRaceStatus(
                    racers[winner] + " won. Your bet was lost; try another race!"
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
   GOOSEY POOL — PHYSICS-BASED 8-BALL POOL
   Local two-player mode; multiplayer networking comes later.
   ========================================================= */

const POOL_W = 900;
const POOL_H = 450;
const POOL_RADIUS = 10;
const POOL_POCKET_RADIUS = 23;

let poolCanvas = null;
let poolCtx = null;
let poolBalls = [];
let poolAnimation = null;
let poolRunning = false;
let poolAiming = false;
let poolAimPoint = null;
let poolShotInProgress = false;
let poolBallInHand = false;
let poolCurrentPlayer = 1;
let poolGroups = { 1: null, 2: null };
let poolPocketedThisShot = [];
let poolFoulThisShot = false;
let poolWinner = null;
let poolMessage = "";
let poolLastTime = 0;

const POOL_POCKETS = [
    { x: 20, y: 20 },
    { x: POOL_W / 2, y: 18 },
    { x: POOL_W - 20, y: 20 },
    { x: 20, y: POOL_H - 20 },
    { x: POOL_W / 2, y: POOL_H - 18 },
    { x: POOL_W - 20, y: POOL_H - 20 }
];

function openGooseyPool() {
    stopPoolGame();

    poolRunning = true;
    poolAiming = false;
    poolShotInProgress = false;
    poolBallInHand = false;
    poolCurrentPlayer = 1;
    poolGroups = { 1: null, 2: null };
    poolPocketedThisShot = [];
    poolFoulThisShot = false;
    poolWinner = null;
    poolMessage = "Player 1 breaks! Drag from the cue ball toward your shot, then release.";
    poolLastTime = 0;

    showArcade(
        "🎱 GOOSEY POOL — 8-BALL",
        `
        <p style="margin:4px 0 10px;">
            A real pool-style game with aiming, ball collisions, cushions,
            six pockets, solids, stripes and the 8-ball.
        </p>

        <div style="
            background:#102d20;
            border:2px solid #d4af37;
            border-radius:10px;
            padding:8px;
            margin-bottom:10px;
            text-align:left;">
            <strong id="poolTurn">Player 1's turn</strong>
            <div id="poolGroups" style="margin-top:5px;font-size:13px;">
                Player 1: unassigned · Player 2: unassigned
            </div>
        </div>

        <canvas id="gooseyPoolCanvas"
            width="900" height="450"
            style="
                display:block;
                width:100%;
                height:auto;
                border:4px solid #754321;
                border-radius:8px;
                background:#146b43;
                touch-action:none;
                cursor:crosshair;">
        </canvas>

        <p id="poolInstructions" style="
            white-space:pre-line;
            min-height:45px;
            background:#102d20;
            border-radius:8px;
            padding:10px;
            font-size:13px;">
        </p>

        <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
            <button onclick="resetGooseyPool()">🔄 NEW GAME</button>
            <button onclick="closeArcadeGame()">← BACK TO CASINO</button>
        </div>

        <p style="font-size:12px;opacity:.75;">
            Local two-player mode. Both players take turns on this device.
            Online play will be added when the multiplayer backend is ready.
        </p>
        `,
        poolMessage
    );

    poolCanvas = document.getElementById("gooseyPoolCanvas");
    poolCtx = poolCanvas.getContext("2d");

    createPoolBalls();
    attachPoolControls();
    renderPoolInfo();
    drawPoolTable();

    poolAnimation = requestAnimationFrame(poolFrame);
}

function stopPoolGame() {
    poolRunning = false;
    poolAiming = false;

    if (poolAnimation !== null) {
        cancelAnimationFrame(poolAnimation);
        poolAnimation = null;
    }
}

function resetGooseyPool() {
    stopPoolGame();
    openGooseyPool();
}

function createPoolBalls() {
    poolBalls = [];

    // Cue ball.
    poolBalls.push({
        id: 0,
        x: 235,
        y: POOL_H / 2,
        vx: 0,
        vy: 0,
        radius: POOL_RADIUS,
        type: "cue",
        pocketed: false
    });

    // Standard 8-ball rack.
    const rack = [
        [1, "solid"], [9, "stripe"], [2, "solid"],
        [10, "stripe"], [8, "eight"], [3, "solid"],
        [11, "stripe"], [4, "solid"], [12, "stripe"],
        [5, "solid"], [13, "stripe"], [6, "solid"],
        [14, "stripe"], [7, "solid"], [15, "stripe"]
    ];

    const startX = 640;
    const startY = POOL_H / 2;
    const spacing = POOL_RADIUS * 2 + 1;

    let index = 0;

    for (let row = 0; row < 5; row++) {
        for (let col = 0; col <= row; col++) {
            const [id, type] = rack[index++];

            poolBalls.push({
                id,
                x: startX + row * spacing * 0.88,
                y: startY + (col - row / 2) * spacing,
                vx: 0,
                vy: 0,
                radius: POOL_RADIUS,
                type,
                pocketed: false
            });
        }
    }
}

function attachPoolControls() {
    if (!poolCanvas) return;

    poolCanvas.onpointerdown = event => {
        if (!poolRunning || poolWinner || poolShotInProgress) return;

        const point = getPoolPointer(event);

        if (poolBallInHand) {
            const cue = poolBalls.find(ball => ball.type === "cue");

            if (!cue || !isInsidePool(point.x, point.y, cue.radius)) return;
            if (poolBalls.some(ball =>
                !ball.pocketed &&
                ball !== cue &&
                Math.hypot(ball.x - point.x, ball.y - point.y) <
                    ball.radius + cue.radius + 2
            )) return;

            cue.x = point.x;
            cue.y = point.y;
            cue.vx = 0;
            cue.vy = 0;
            cue.pocketed = false;

            poolBallInHand = false;
            poolMessage = "Cue ball placed. Aim your shot!";
            drawPoolTable();
            renderPoolInfo();
            return;
        }

        const cue = poolBalls.find(ball =>
            ball.type === "cue" && !ball.pocketed
        );

        if (!cue) return;

        poolAiming = true;
        poolAimPoint = point;

        poolCanvas.setPointerCapture(event.pointerId);
        drawPoolTable();
    };

    poolCanvas.onpointermove = event => {
        if (!poolAiming || !poolRunning) return;

        poolAimPoint = getPoolPointer(event);
        drawPoolTable();
    };

    poolCanvas.onpointerup = event => {
        if (!poolAiming || !poolRunning) return;

        poolAimPoint = getPoolPointer(event);
        poolAiming = false;

        shootPoolCue();
    };

    poolCanvas.onpointercancel = () => {
        poolAiming = false;
        poolAimPoint = null;
        drawPoolTable();
    };
}

function getPoolPointer(event) {
    const rect = poolCanvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) * POOL_W / rect.width,
        y: (event.clientY - rect.top) * POOL_H / rect.height
    };
}

function isInsidePool(x, y, radius = 0) {
    return x >= radius + 12 &&
        x <= POOL_W - radius - 12 &&
        y >= radius + 12 &&
        y <= POOL_H - radius - 12;
}

function shootPoolCue() {
    const cue = poolBalls.find(ball =>
        ball.type === "cue" && !ball.pocketed
    );

    if (!cue || !poolAimPoint || poolWinner || poolBallInHand) return;

    const dx = poolAimPoint.x - cue.x;
    const dy = poolAimPoint.y - cue.y;
    const distance = Math.hypot(dx, dy);

    poolAimPoint = null;

    if (distance < 12) {
        drawPoolTable();
        return;
    }

    // Pull farther from the cue ball for a stronger shot.
    const power = Math.min(950, distance * 8);

    cue.vx = dx / distance * power;
    cue.vy = dy / distance * power;

    poolShotInProgress = true;
    poolPocketedThisShot = [];
    poolFoulThisShot = false;
    poolMessage = "Player " + poolCurrentPlayer + " takes the shot!";
    renderPoolInfo();
    drawPoolTable();
}

function poolFrame(time) {
    if (!poolRunning) return;

    if (poolCanvas &&
        document.getElementById("arcadeGameModal")?.style.display === "none") {
        stopPoolGame();
        return;
    }

    const delta = poolLastTime ? Math.min((time - poolLastTime) / 16.67, 2) : 1;
    poolLastTime = time;

    if (poolShotInProgress) {
        for (let step = 0; step < Math.ceil(delta); step++) {
            updatePoolPhysics();
        }

        if (poolBallsAreStopped()) {
            finishPoolShot();
        }
    }

    drawPoolTable();
    poolAnimation = requestAnimationFrame(poolFrame);
}

function updatePoolPhysics() {
    for (const ball of poolBalls) {
        if (ball.pocketed) continue;

        ball.x += ball.vx / 60;
        ball.y += ball.vy / 60;

        // Rolling friction.
        ball.vx *= 0.988;
        ball.vy *= 0.988;

        if (Math.abs(ball.vx) < 0.08) ball.vx = 0;
        if (Math.abs(ball.vy) < 0.08) ball.vy = 0;

        // Cushion collisions.
        const left = 13 + ball.radius;
        const right = POOL_W - 13 - ball.radius;
        const top = 13 + ball.radius;
        const bottom = POOL_H - 13 - ball.radius;

        if (ball.x < left) {
            ball.x = left;
            ball.vx = Math.abs(ball.vx) * 0.82;
        } else if (ball.x > right) {
            ball.x = right;
            ball.vx = -Math.abs(ball.vx) * 0.82;
        }

        if (ball.y < top) {
            ball.y = top;
            ball.vy = Math.abs(ball.vy) * 0.82;
        } else if (ball.y > bottom) {
            ball.y = bottom;
            ball.vy = -Math.abs(ball.vy) * 0.82;
        }

        // Pocket detection.
        for (const pocket of POOL_POCKETS) {
            if (Math.hypot(ball.x - pocket.x, ball.y - pocket.y) <
                POOL_POCKET_RADIUS) {
                pocketPoolBall(ball);
                break;
            }
        }
    }

    // Ball-to-ball collisions.
    for (let i = 0; i < poolBalls.length; i++) {
        const a = poolBalls[i];
        if (a.pocketed) continue;

        for (let j = i + 1; j < poolBalls.length; j++) {
            const b = poolBalls[j];
            if (b.pocketed) continue;

            let dx = b.x - a.x;
            let dy = b.y - a.y;
            let distance = Math.hypot(dx, dy);
            const minDistance = a.radius + b.radius;

            if (distance >= minDistance) continue;

            if (distance === 0) {
                dx = 0.01;
                distance = 0.01;
            }

            const nx = dx / distance;
            const ny = dy / distance;
            const overlap = minDistance - distance;

            // Separate overlapping balls.
            a.x -= nx * overlap / 2;
            a.y -= ny * overlap / 2;
            b.x += nx * overlap / 2;
            b.y += ny * overlap / 2;

            // Elastic collision along the line between ball centers.
            const relativeVelocity =
                (a.vx - b.vx) * nx + (a.vy - b.vy) * ny;

            if (relativeVelocity > 0) {
                a.vx -= relativeVelocity * nx;
                a.vy -= relativeVelocity * ny;
                b.vx += relativeVelocity * nx;
                b.vy += relativeVelocity * ny;
            }
        }
    }
}

function pocketPoolBall(ball) {
    if (ball.pocketed) return;

    ball.pocketed = true;
    ball.vx = 0;
    ball.vy = 0;

    if (ball.type === "cue") {
        poolFoulThisShot = true;
        poolMessage = "FOUL! The cue ball was pocketed.";
        return;
    }

    poolPocketedThisShot.push(ball);
}

function poolBallsAreStopped() {
    return poolBalls.every(ball =>
        ball.pocketed ||
        (Math.abs(ball.vx) < 0.35 && Math.abs(ball.vy) < 0.35)
    );
}

function poolRemaining(group) {
    return poolBalls.filter(ball =>
        !ball.pocketed && ball.type === group
    ).length;
}

function finishPoolShot() {
    poolShotInProgress = false;

    const eightBallPocketed = poolPocketedThisShot.some(ball =>
        ball.type === "eight"
    );

    const cue = poolBalls.find(ball => ball.type === "cue");

    if (eightBallPocketed) {
        const group = poolGroups[poolCurrentPlayer];
        const cleared = group && poolRemaining(group) === 0;

        poolWinner = cleared && !poolFoulThisShot
            ? poolCurrentPlayer
            : 3 - poolCurrentPlayer;

        poolMessage = poolWinner === poolCurrentPlayer
            ? "🎉 PLAYER " + poolWinner + " WINS! The 8-ball was pocketed legally!"
            : "❌ PLAYER " + poolCurrentPlayer +
              " loses! The 8-ball was pocketed too early or on a foul.";

        renderPoolInfo();
        return;
    }

    if (poolFoulThisShot) {
        if (cue) {
            cue.pocketed = false;
            cue.x = 235;
            cue.y = POOL_H / 2;
            cue.vx = 0;
            cue.vy = 0;
        }

        poolCurrentPlayer = 3 - poolCurrentPlayer;
        poolBallInHand = true;
        poolMessage =
            "Foul! Player " + poolCurrentPlayer +
            " gets ball in hand. Click an empty spot on the table to place the cue ball.";
        renderPoolInfo();
        return;
    }

    // Assign solids or stripes when the first object ball is pocketed.
    if (!poolGroups[1] && !poolGroups[2]) {
        const first = poolPocketedThisShot.find(ball =>
            ball.type === "solid" || ball.type === "stripe"
        );

        if (first) {
            poolGroups[poolCurrentPlayer] = first.type;
            poolGroups[3 - poolCurrentPlayer] =
                first.type === "solid" ? "stripe" : "solid";
        }
    }

    const group = poolGroups[poolCurrentPlayer];
    const pocketedOwnBall = group && poolPocketedThisShot.some(ball =>
        ball.type === group
    );

    if (pocketedOwnBall) {
        poolMessage =
            "Nice shot, Player " + poolCurrentPlayer +
            "! You pocketed one of your balls. Shoot again.";
    } else {
        poolCurrentPlayer = 3 - poolCurrentPlayer;
        poolMessage =
            "Turn over. Player " + poolCurrentPlayer + ", take your shot!";
    }

    poolPocketedThisShot = [];
    renderPoolInfo();
}

function drawPoolTable() {
    if (!poolCtx || !poolCanvas) return;

    const ctx = poolCtx;

    // Table surface.
    ctx.clearRect(0, 0, POOL_W, POOL_H);
    ctx.fillStyle = "#754321";
    ctx.fillRect(0, 0, POOL_W, POOL_H);

    ctx.fillStyle = "#0b5836";
    ctx.fillRect(12, 12, POOL_W - 24, POOL_H - 24);

    ctx.fillStyle = "#197747";
    ctx.fillRect(25, 25, POOL_W - 50, POOL_H - 50);

    // Table diamonds.
    ctx.fillStyle = "#f0d7a0";

    for (let x = 100; x < POOL_W - 50; x += 100) {
        ctx.beginPath();
        ctx.moveTo(x, 5);
        ctx.lineTo(x + 5, 12);
        ctx.lineTo(x, 19);
        ctx.lineTo(x - 5, 12);
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(x, POOL_H - 5);
        ctx.lineTo(x + 5, POOL_H - 12);
        ctx.lineTo(x, POOL_H - 19);
        ctx.lineTo(x - 5, POOL_H - 12);
        ctx.fill();
    }

    // Six pockets.
    for (const pocket of POOL_POCKETS) {
        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, POOL_POCKET_RADIUS, 0, Math.PI * 2);
        ctx.fillStyle = "#050505";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pocket.x, pocket.y, POOL_POCKET_RADIUS - 4, 0, Math.PI * 2);
        ctx.fillStyle = "#161616";
        ctx.fill();
    }

    // Balls.
    for (const ball of poolBalls) {
        if (ball.pocketed) continue;
        drawPoolBall(ctx, ball);
    }

    // Aim guide.
    const cue = poolBalls.find(ball =>
        ball.type === "cue" && !ball.pocketed
    );

    if (poolAiming && cue && poolAimPoint) {
        const dx = poolAimPoint.x - cue.x;
        const dy = poolAimPoint.y - cue.y;
        const length = Math.hypot(dx, dy);

        if (length > 0) {
            const ux = dx / length;
            const uy = dy / length;

            ctx.save();
            ctx.setLineDash([8, 7]);
            ctx.strokeStyle = "#fff9b0";
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(cue.x, cue.y);
            ctx.lineTo(
                cue.x + ux * Math.min(length * 2, 250),
                cue.y + uy * Math.min(length * 2, 250)
            );
            ctx.stroke();
            ctx.restore();

            // Cue stick.
            ctx.strokeStyle = "#d2a36b";
            ctx.lineWidth = 5;
            ctx.beginPath();
            ctx.moveTo(
                cue.x - ux * (POOL_RADIUS + 10),
                cue.y - uy * (POOL_RADIUS + 10)
            );
            ctx.lineTo(
                cue.x - ux * Math.min(length * 0.65 + 45, 130),
                cue.y - uy * Math.min(length * 0.65 + 45, 130)
            );
            ctx.stroke();
        }
    }

    // Ball-in-hand instruction.
    if (poolBallInHand) {
        ctx.fillStyle = "#ffffff";
        ctx.font = "bold 19px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PLACE THE CUE BALL", POOL_W / 2, 42);
    }

    // Winner overlay.
    if (poolWinner) {
        ctx.fillStyle = "#000b";
        ctx.fillRect(150, 165, POOL_W - 300, 110);
        ctx.fillStyle = "#f3d36a";
        ctx.font = "bold 30px Arial";
        ctx.textAlign = "center";
        ctx.fillText("PLAYER " + poolWinner + " WINS!", POOL_W / 2, 210);
        ctx.fillStyle = "white";
        ctx.font = "16px Arial";
        ctx.fillText("Press NEW GAME to play again", POOL_W / 2, 245);
    }
}

function drawPoolBall(ctx, ball) {
    const x = ball.x;
    const y = ball.y;
    const r = ball.radius;

    ctx.save();

    ctx.beginPath();
    ctx.arc(x + 2, y + 3, r, 0, Math.PI * 2);
    ctx.fillStyle = "#0005";
    ctx.fill();

    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);

    if (ball.type === "cue") {
        ctx.fillStyle = "#fff";
    } else if (ball.type === "eight") {
        ctx.fillStyle = "#101010";
    } else {
        const colors = {
            1: "#f5d342", 2: "#315bd8", 3: "#d83a36",
            4: "#8148ba", 5: "#ef8c24", 6: "#29965b",
            7: "#813d29", 9: "#f5d342", 10: "#315bd8",
            11: "#d83a36", 12: "#8148ba", 13: "#ef8c24",
            14: "#29965b", 15: "#813d29"
        };

        ctx.fillStyle = colors[ball.id] || "#ddd";
    }

    ctx.fill();

    if (ball.type === "stripe") {
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, r - 1, 0, Math.PI * 2);
        ctx.clip();

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(x - r, y - r * 0.42, r * 2, r * 0.84);
        ctx.restore();
    }

    ctx.beginPath();
    ctx.arc(x - 3, y - 3, r * 0.27, 0, Math.PI * 2);
    ctx.fillStyle = "#ffffff";
    ctx.fill();

    if (ball.type !== "cue") {
        ctx.beginPath();
        ctx.arc(x, y, r * 0.48, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();

        ctx.fillStyle = "#111";
        ctx.font = "bold 9px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(ball.type === "eight" ? "8" : String(ball.id), x, y);
    }

    ctx.restore();
}

function renderPoolInfo() {
    const turn = document.getElementById("poolTurn");
    const groups = document.getElementById("poolGroups");
    const instructions = document.getElementById("poolInstructions");

    if (turn) {
        turn.textContent = poolWinner
            ? "Player " + poolWinner + " wins!"
            : "Player " + poolCurrentPlayer + "'s turn";
    }

    if (groups) {
        const label = group => {
            if (!group) return "unassigned";
            return group === "solid" ? "solids" : "stripes";
        };

        groups.textContent =
            "Player 1: " + label(poolGroups[1]) +
            " · Player 2: " + label(poolGroups[2]);
    }

    if (instructions) {
        instructions.textContent = poolMessage;
    }

    setArcadeStatus(poolMessage);
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
    if (raceTimer) {
        clearInterval(raceTimer);
        raceTimer = null;
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

/* =========================================================
   GOOSEYWORKS UNIVERSAL STOCK MARKET — CLEAN VERSION
   Simulated prices, persistent portfolio, market statistics.
   ========================================================= */

const STOCK_DB_KEY = "gooseyStockMarketCleanV2";

const STOCKS = {
    GWORKS:  { name: "GooseyWorks",          initial: 100,  sector: "GooseyWorks" },
    ANGY:    { name: "AnGyCat-Animation",    initial: 65,   sector: "GooseyWorks" },
    ACA:     { name: "ACAngyCap",            initial: 40,   sector: "GooseyWorks" },
    SP500:   { name: "S&P 500 Tracker",      initial: 550,  sector: "Index tracker" },
    NASDAQ:  { name: "Nasdaq-100 Tracker",   initial: 480,  sector: "Index tracker" },
    AAPL:    { name: "Apple",               initial: 230,  sector: "Company tracker" },
    MSFT:    { name: "Microsoft",           initial: 500,  sector: "Company tracker" }
};

let marketData = {};
let portfolio = {};
let selectedTicker = "GWORKS";
let marketTimer = null;
let marketLastMessage = "Welcome to the GooseyWorks stock market!";
let marketLastTick = Date.now();

function initializeMarket() {
    let saved = null;

    try {
        saved = JSON.parse(localStorage.getItem(STOCK_DB_KEY));
    } catch {
        saved = null;
    }

    for (const [ticker, stock] of Object.entries(STOCKS)) {
        const previous = saved?.market?.[ticker];

        marketData[ticker] = previous &&
            Number.isFinite(previous.price) &&
            previous.price > 0
            ? {
                price: previous.price,
                open: previous.open || previous.price,
                high: previous.high || previous.price,
                low: previous.low || previous.price,
                previousClose: previous.previousClose || previous.price,
                volume: previous.volume || 0,
                change: previous.change || 0,
                changePercent: previous.changePercent || 0
            }
            : {
                price: stock.initial,
                open: stock.initial,
                high: stock.initial,
                low: stock.initial,
                previousClose: stock.initial,
                volume: 0,
                change: 0,
                changePercent: 0
            };

        const savedShares = Number(saved?.portfolio?.[ticker] || 0);

        portfolio[ticker] = {
            shares: Number.isSafeInteger(savedShares) && savedShares >= 0
                ? savedShares : 0,
            costBasis: Math.max(0, Number(saved?.portfolio?.[ticker + "_cost"]) || 0)
        };
    }
}

function saveMarket() {
    const data = {
        market: marketData,
        portfolio: {}
    };

    for (const ticker of Object.keys(STOCKS)) {
        data.portfolio[ticker] = portfolio[ticker].shares;
        data.portfolio[ticker + "_cost"] = portfolio[ticker].costBasis;
    }

    try {
        localStorage.setItem(STOCK_DB_KEY, JSON.stringify(data));
    } catch (error) {
        console.warn("Could not save stock market.", error);
    }
}

function gb(amount) {
    return Math.floor(amount).toLocaleString() + " GB";
}

function stockPrice(amount) {
    return amount.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }) + " GB";
}

function signedNumber(amount, decimals = 2) {
    return (amount > 0 ? "+" : "") +
        amount.toLocaleString(undefined, {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals
        });
}

function marketChangeColor(amount) {
    return amount > 0 ? "#65f59b" : amount < 0 ? "#ff7777" : "#ffffff";
}

function openStockMarket() {
    stopStockMarketTimer();

    showArcade(
        "📈 GOOSEYWORKS UNIVERSAL STOCK MARKET",
        `
        <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:10px;margin:12px 0;">
            <div style="background:#26344e;padding:12px;border-radius:10px;">
                <small>AVAILABLE CASH</small>
                <h3 id="marketCash">0 GB</h3>
            </div>
            <div style="background:#26344e;padding:12px;border-radius:10px;">
                <small>PORTFOLIO VALUE</small>
                <h3 id="marketPortfolioValue">0 GB</h3>
            </div>
            <div style="background:#26344e;padding:12px;border-radius:10px;">
                <small>TOTAL WEALTH</small>
                <h3 id="marketTotalWealth">0 GB</h3>
            </div>
        </div>

        <p style="font-size:12px;opacity:.8;">
            Simulated game market · Prices update every 5 seconds
        </p>

        <label for="marketTicker">Choose a market:</label>
        <select id="marketTicker" onchange="selectMarketTicker(this.value)"
            style="width:100%;padding:10px;margin:8px 0 15px;">
            ${Object.entries(STOCKS).map(([ticker, stock]) => `
                <option value="${ticker}" ${ticker === selectedTicker ? "selected" : ""}>
                    ${stock.name} (${ticker})
                </option>
            `).join("")}
        </select>

        <div style="background:#26344e;border-radius:12px;padding:16px;text-align:left;margin-bottom:14px;">
            <h2 id="marketStockName" style="margin-top:0;">GooseyWorks</h2>
            <div style="font-size:34px;font-weight:bold;" id="marketCurrentPrice">100.00 GB</div>
            <div id="marketChange" style="font-size:18px;margin:6px 0;">+0.00 GB (+0.00%)</div>

            <div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:18px;">
                <div><small>OPEN</small><div id="marketOpen">100 GB</div></div>
                <div><small>PREVIOUS CLOSE</small><div id="marketPreviousClose">100 GB</div></div>
                <div><small>DAY HIGH</small><div id="marketHigh">100 GB</div></div>
                <div><small>DAY LOW</small><div id="marketLow">100 GB</div></div>
                <div><small>VOLUME</small><div id="marketVolume">0 shares</div></div>
                <div><small>YOUR SHARES</small><div id="marketOwned">0</div></div>
            </div>
        </div>

        <div style="background:#26344e;border-radius:12px;padding:16px;margin-bottom:14px;text-align:left;">
            <h3 style="margin-top:0;">Your Position</h3>
            <p>Current value: <strong id="marketPositionValue">0 GB</strong></p>
            <p>Invested cost: <strong id="marketCostBasis">0 GB</strong></p>
            <p>Unrealized profit/loss: <strong id="marketProfitLoss">0 GB</strong></p>

            <label for="marketShareCount">Shares to trade:</label>
            <input id="marketShareCount" type="number" min="1" step="1" value="1"
                oninput="renderStockMarket()"
                style="display:block;width:100%;padding:10px;margin:8px 0;">

            <p>Estimated purchase cost: <strong id="marketOrderCost">0 GB</strong></p>

            <div style="display:flex;flex-wrap:wrap;gap:8px;">
                <button onclick="buyMarketShares()">BUY SHARES</button>
                <button onclick="sellMarketShares()">SELL SHARES</button>
                <button onclick="sellAllMarketShares()">SELL ALL</button>
            </div>
        </div>

        <h3>📊 Current Market Watch</h3>
        <div id="marketWatch" style="text-align:left;"></div>

        <p style="font-size:12px;opacity:.8;">
            This is a fictional game market. Real-world tickers are simulated
            trackers, not live quotes or actual investments.
        </p>
        `,
        marketLastMessage
    );

    renderStockMarket();

    marketTimer = setInterval(() => {
        if (document.getElementById("arcadeGameModal")?.style.display !== "none") {
            tickStockMarket();
        }
    }, 5000);
}

function stopStockMarketTimer() {
    if (marketTimer !== null) {
        clearInterval(marketTimer);
        marketTimer = null;
    }
}

function selectMarketTicker(ticker) {
    if (!STOCKS[ticker]) return;

    selectedTicker = ticker;
    renderStockMarket();
}

function calculatePortfolioValue() {
    return Object.keys(STOCKS).reduce((total, ticker) => {
        return total + marketData[ticker].price * portfolio[ticker].shares;
    }, 0);
}

function renderStockMarket() {
    const data = marketData[selectedTicker];
    const stock = STOCKS[selectedTicker];
    const holding = portfolio[selectedTicker];
    if (!data || !stock || !holding) return;

    const portfolioValue = calculatePortfolioValue();
    const positionValue = data.price * holding.shares;
    const profitLoss = positionValue - holding.costBasis;

    const put = (id, value) => {
        const element = document.getElementById(id);
        if (element) element.textContent = value;
    };

    put("marketCash", gb(balance));
    put("marketPortfolioValue", gb(portfolioValue));
    put("marketTotalWealth", gb(balance + portfolioValue));
    put("marketStockName", stock.name + " (" + selectedTicker + ")");
    put("marketCurrentPrice", stockPrice(data.price));
    put("marketOpen", stockPrice(data.open));
    put("marketPreviousClose", stockPrice(data.previousClose));
    put("marketHigh", stockPrice(data.high));
    put("marketLow", stockPrice(data.low));
    put("marketVolume", data.volume.toLocaleString() + " shares");
    put("marketOwned", holding.shares.toLocaleString());
    put("marketPositionValue", gb(positionValue));
    put("marketCostBasis", gb(holding.costBasis));
    put("marketProfitLoss", (profitLoss >= 0 ? "+" : "") + gb(profitLoss));

    const changeElement = document.getElementById("marketChange");
    if (changeElement) {
        changeElement.textContent =
            signedNumber(data.change) + " GB (" +
            signedNumber(data.changePercent) + "%)";
        changeElement.style.color = marketChangeColor(data.change);
    }

    const profitElement = document.getElementById("marketProfitLoss");
    if (profitElement) profitElement.style.color = marketChangeColor(profitLoss);

    const input = document.getElementById("marketShareCount");
    const shares = input ? Math.floor(Number(input.value)) : 1;
    const validShares = Number.isSafeInteger(shares) && shares > 0 ? shares : 0;

    put("marketOrderCost", gb(Math.ceil(data.price * validShares)));

    const watch = document.getElementById("marketWatch");
    if (watch) {
        watch.innerHTML = Object.entries(STOCKS).map(([ticker, item]) => {
            const row = marketData[ticker];
            const owned = portfolio[ticker].shares;

            return `
                <button onclick="selectMarketTicker('${ticker}')"
                    style="
                        display:flex;justify-content:space-between;align-items:center;
                        gap:10px;width:100%;padding:11px;margin:5px 0;
                        border-radius:8px;cursor:pointer;text-align:left;
                        background:${ticker === selectedTicker ? "#36517a" : "#26344e"};
                        color:white;border:1px solid #536785;">
                    <span>
                        <strong>${item.name}</strong><br>
                        <small>${ticker} · ${owned.toLocaleString()} shares owned</small>
                    </span>
                    <span style="text-align:right;">
                        <strong>${stockPrice(row.price)}</strong><br>
                        <small style="color:${marketChangeColor(row.change)}">
                            ${signedNumber(row.changePercent)}%
                        </small>
                    </span>
                </button>
            `;
        }).join("");
    }
}

function tickStockMarket() {
    for (const ticker of Object.keys(STOCKS)) {
        const data = marketData[ticker];

        // Random simulated price movement, generally small.
        const percentMove = (Math.random() - 0.49) * 0.025;
        const newPrice = Math.max(
            0.01,
            Math.round(data.price * (1 + percentMove) * 100) / 100
        );

        data.price = newPrice;
        data.high = Math.max(data.high, newPrice);
        data.low = Math.min(data.low, newPrice);
        data.change = Math.round((newPrice - data.previousClose) * 100) / 100;
        data.changePercent = data.previousClose
            ? (data.change / data.previousClose) * 100
            : 0;

        data.volume += getRandom(10, 500);
    }

    marketLastTick = Date.now();
    saveMarket();
    renderStockMarket();
}

function getMarketTradeShares() {
    const input = document.getElementById("marketShareCount");
    const shares = input ? Number(input.value) : 1;

    if (!Number.isSafeInteger(shares) || shares < 1) {
        marketLastMessage = "Enter a positive whole number of shares.";
        setArcadeStatus(marketLastMessage);
        return null;
    }

    return shares;
}

function buyMarketShares() {
    const shares = getMarketTradeShares();
    if (shares === null) return;

    const ticker = selectedTicker;
    const cost = Math.ceil(marketData[ticker].price * shares);
    const holding = portfolio[ticker];

    if (!Number.isSafeInteger(cost) || cost < 1 || cost > balance) {
        marketLastMessage = "Not enough GooseBucks for that purchase.";
        setArcadeStatus(marketLastMessage);
        return;
    }

    const newShareCount = holding.shares + shares;

    if (!Number.isSafeInteger(newShareCount)) {
        marketLastMessage = "That order is too large.";
        setArcadeStatus(marketLastMessage);
        return;
    }

    // Charge cash and record the shares in one transaction.
    balance -= cost;
    holding.shares = newShareCount;
    holding.costBasis += cost;

    saveMarket();
    updateBalance();

    marketLastMessage =
        "Bought " + shares + " " + ticker + " share(s) for " + gb(cost) + ".";

    setArcadeStatus(marketLastMessage);
    renderStockMarket();
}

function sellMarketShares() {
    const shares = getMarketTradeShares();
    if (shares === null) return;

    const ticker = selectedTicker;
    const holding = portfolio[ticker];

    if (shares > holding.shares) {
        marketLastMessage =
            "You only own " + holding.shares + " share(s) of " + ticker + ".";
        setArcadeStatus(marketLastMessage);
        return;
    }

    const proceeds = Math.floor(marketData[ticker].price * shares);
    const costRemoved = holding.shares > 0
        ? holding.costBasis * (shares / holding.shares)
        : 0;

    // Remove shares before paying out the sale.
    holding.shares -= shares;
    holding.costBasis = Math.max(0, holding.costBasis - costRemoved);
    balance += proceeds;

    saveMarket();
    updateBalance();

    marketLastMessage =
        "Sold " + shares + " " + ticker + " share(s) for " + gb(proceeds) + ".";

    setArcadeStatus(marketLastMessage);
    renderStockMarket();
}

function sellAllMarketShares() {
    const ticker = selectedTicker;
    const holding = portfolio[ticker];

    if (holding.shares < 1) {
        marketLastMessage = "You don't own any shares of " + ticker + ".";
        setArcadeStatus(marketLastMessage);
        return;
    }

    const shares = holding.shares;
    const proceeds = Math.floor(marketData[ticker].price * shares);

    // Sell the entire position exactly once.
    holding.shares = 0;
    holding.costBasis = 0;
    balance += proceeds;

    saveMarket();
    updateBalance();

    marketLastMessage =
        "Sold all " + shares + " " + ticker + " share(s) for " + gb(proceeds) + ".";

    setArcadeStatus(marketLastMessage);
    renderStockMarket();
}

// Initialize saved prices and holdings once.
initializeMarket();

// Stop timers when the dynamic arcade window closes.
function closeArcadeGame() {
    const modal = document.getElementById("arcadeGameModal");
    if (modal) modal.style.display = "none";
    stopCrashTimer();
    stopStockMarketTimer();
    if (typeof stopPoolGame === "function") stopPoolGame();
    if (raceTimer) {
        clearInterval(raceTimer);
        raceTimer = null;
        raceRunning = false;
    }
}


// Refresh the saved balance display after the page and its elements are ready.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", updateBalance, { once: true });
} else {
    updateBalance();
}
