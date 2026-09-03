// ============================================
// GOOSEY CASINO
// ============================================
const STARTING_BALANCE = 7500;
const BALANCE_KEY = "gooseyCasinoBalanceV3";

function loadBalance() {
    try {
        const saved = localStorage.getItem(BALANCE_KEY);

        if (saved !== null) {
            const value = Number(saved);

            if (Number.isFinite(value) && value >= 0) {
                return value;
            }
        }

        localStorage.setItem(
            BALANCE_KEY,
            String(STARTING_BALANCE)
        );

        return STARTING_BALANCE;

    } catch (error) {
        return STARTING_BALANCE;
    }
}

let balance = loadBalance();

function saveBalance() {
    try {
        localStorage.setItem(
            BALANCE_KEY,
            String(balance)
        );
    } catch (error) {
        console.error("Could not save GooseBucks.");
    }
}

function updateBalance() {
    const element = document.getElementById("balance");

    if (element) {
        element.textContent =
            balance.toLocaleString() + " GB";
    }

    saveBalance();
}
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
// ============================================
// MENU BUTTONS
// ============================================

function startGame() {
    openPoker();
}

function bots() {
    openPoker();
}

function onlineMode() {

    alert(
        "🌎 ONLINE\n\n" +
        "Online multiplayer is coming soon!"
    );

}

function privateRoom() {

    alert(
        "🔒 PRIVATE ROOM\n\n" +
        "Private rooms are coming soon!"
    );

}

function howToPlay() {

    alert(
        "🎓 HOW TO PLAY\n\n" +
        "5-Card Draw:\n" +
        "1. Choose your bet.\n" +
        "2. Deal five cards.\n" +
        "3. Click cards to discard.\n" +
        "4. Draw replacements.\n" +
        "5. Beat Goosey Bot!"
    );

}

function rules() {

    alert(
        "📖 GOOSEY CASINO RULES\n\n" +
        "• GooseBucks are fictional only.\n" +
        "• No real-money purchases.\n" +
        "• No cashing out.\n" +
        "• No real-money trading.\n" +
        "• Don't cheat.\n\n" +
        "Have fun! 🪿"
    );

}

function leaderboard() {

    alert(
        "🏆 LEADERBOARD\n\n" +
        "Coming soon!"
    );

}

function comingSoon(game) {

    alert(
        "🪿 " + game + "\n\n" +
        "Coming soon!"
    );

}

function backToWebsite() {

    window.location.href = "index.html";

}

// ============================================
// DECK
// ============================================

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

    for (
        let i = array.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [array[i], array[j]] =
        [array[j], array[i]];

    }

    return array;

}

function drawOne() {

    return deck.pop();

}

// ============================================
// 5-CARD DRAW
// ============================================

function openPoker() {

    const modal =
        document.getElementById("pokerModal");

    if (!modal) {

        console.error(
            "pokerModal not found!"
        );

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
        document.getElementById(
            "drawButton"
        );

    if (drawButton) {
        drawButton.disabled = true;
    }

}

function closePoker() {

    const modal =
        document.getElementById(
            "pokerModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }

    pokerActive = false;

}

function getBet() {

    const input =
        document.getElementById("bet");

    let bet =
        Number(
            input
                ? input.value
                : 100
        );

    if (!Number.isFinite(bet)) {
        bet = 100;
    }

    bet =
        Math.floor(bet / 10) * 10;

    bet =
        Math.max(
            10,
            Math.min(1000, bet)
        );

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

    deck =
        shuffle(makeDeck());

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
        document.getElementById(
            "drawButton"
        );

    if (drawButton) {
        drawButton.disabled = false;
    }

    renderPokerHands(false);

    setPokerStatus(
        "Pick up to 3 cards to discard, then press DRAW SELECTED!"
    );

}

function renderPokerHands(showBot) {

    const playerElement =
        document.getElementById(
            "playerHand"
        );

    const botElement =
        document.getElementById(
            "botHand"
        );

    if (
        !playerElement ||
        !botElement
    ) {
        return;
    }

    playerElement.innerHTML = "";

    playerHand.forEach(
        function(card, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "card" +
                (
                    card.suit === "♥" ||
                    card.suit === "♦"
                        ? " red"
                        : ""
                );

            div.textContent =
                card.name + card.suit;

            if (
                pokerActive &&
                !pokerDrawn
            ) {

                if (
                    selectedCards.has(
                        index
                    )
                ) {

                    div.classList.add(
                        "selected"
                    );

                }

                div.onclick =
                    function() {
                        toggleCard(index);
                    };

            }

            playerElement.appendChild(
                div
            );

        }
    );

    botElement.innerHTML = "";

    botHand.forEach(
        function(card) {

            const div =
                document.createElement(
                    "div"
                );

            div.className = "card";

            if (showBot) {

                div.textContent =
                    card.name + card.suit;

                if (
                    card.suit === "♥" ||
                    card.suit === "♦"
                ) {

                    div.classList.add(
                        "red"
                    );

                }

            } else {

                div.textContent = "🂠";

            }

            botElement.appendChild(
                div
            );

        }
    );

}

function setPokerStatus(text) {

    const element =
        document.getElementById(
            "pokerStatus"
        );

    if (element) {
        element.textContent = text;
    }

}

function toggleCard(index) {

    if (
        !pokerActive ||
        pokerDrawn
    ) {
        return;
    }

    if (
        selectedCards.has(index)
    ) {

        selectedCards.delete(index);

    } else {

        if (
            selectedCards.size < 3
        ) {

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

    hand.forEach(
        function(card) {

            counts[card.value] =
                (
                    counts[card.value] ||
                    0
                ) + 1;

        }
    );

    const keep = new Set();

    hand.forEach(
        function(card) {

            if (
                counts[card.value] >= 2
            ) {

                keep.add(
                    card.value
                );

            }

        }
    );

    const candidates =
        hand
            .map(
                function(card, index) {

                    return {
                        index: index,
                        value: card.value,
                        keep:
                            keep.has(
                                card.value
                            )
                    };

                }
            )
            .filter(
                function(card) {
                    return !card.keep;
                }
            )
            .sort(
                function(a, b) {
                    return a.value - b.value;
                }
            );

    return candidates
        .slice(0, 3)
        .map(
            function(card) {
                return card.index;
            }
        );

}

function drawCards() {

    if (
        !pokerActive ||
        pokerDrawn
    ) {
        return;
    }

    const playerDiscards =
        Array.from(selectedCards);

    const botDiscards =
        chooseBotDiscards(
            botHand
        );

    playerDiscards.forEach(
        function(index) {

            playerHand[index] =
                drawOne();

        }
    );

    botDiscards.forEach(
        function(index) {

            botHand[index] =
                drawOne();

        }
    );

    pokerDrawn = true;
    pokerActive = false;

    const drawButton =
        document.getElementById(
            "drawButton"
        );

    if (drawButton) {
        drawButton.disabled = true;
    }

    renderPokerHands(true);

    finishPoker();

}

// ============================================
// POKER HAND EVALUATION
// ============================================

function evaluateHand(hand) {

    const values =
        hand
            .map(
                function(card) {
                    return card.value;
                }
            )
            .sort(
                function(a, b) {
                    return b - a;
                }
            );

    const counts = {};

    values.forEach(
        function(value) {

            counts[value] =
                (
                    counts[value] ||
                    0
                ) + 1;

        }
    );

    const groups =
        Object.values(counts)
            .sort(
                function(a, b) {
                    return b - a;
                }
            );

    const flush =
        hand.every(
            function(card) {
                return (
                    card.suit ===
                    hand[0].suit
                );
            }
        );

    let straight = false;

    const unique =
        [...new Set(values)];

    if (unique.length === 5) {

        if (
            unique[0] -
            unique[4] === 4
        ) {

            straight = true;

        }

        if (
            unique.join(",") ===
            "14,5,4,3,2"
        ) {

            straight = true;

        }

    }

    if (
        straight &&
        flush
    ) {

        return {
            rank: 8,
            name: "Straight Flush"
        };

    }

    if (groups[0] === 4) {

        return {
            rank: 7,
            name: "Four of a Kind"
        };

    }

    if (
        groups[0] === 3 &&
        groups[1] === 2
    ) {

        return {
            rank: 6,
            name: "Full House"
        };

    }

    if (flush) {

        return {
            rank: 5,
            name: "Flush"
        };

    }

    if (straight) {

        return {
            rank: 4,
            name: "Straight"
        };

    }

    if (groups[0] === 3) {

        return {
            rank: 3,
            name: "Three of a Kind"
        };

    }

    if (
        groups[0] === 2 &&
        groups[1] === 2
    ) {

        return {
            rank: 2,
            name: "Two Pair"
        };

    }

    if (groups[0] === 2) {

        return {
            rank: 1,
            name: "One Pair"
        };

    }

    return {
        rank: 0,
        name: "High Card"
    };

}

function finishPoker() {

    const player =
        evaluateHand(
            playerHand
        );

    const bot =
        evaluateHand(
            botHand
        );

    const bet = getBet();

    let message =
        "You: " +
        player.name +
        " | Goosey Bot: " +
        bot.name +
        ". ";

    if (
        player.rank >
        bot.rank
    ) {

        balance += bet * 2;

        message +=
            "🏆 YOU WIN!";

    } else if (
        player.rank ===
        bot.rank
    ) {

        balance += bet;

        message +=
            "🤝 TIE! Your bet is returned.";

    } else {

        message +=
            "🪿 GOOSEY BOT WINS!";

    }

    updateBalance();

    setPokerStatus(message);

}
// ============================================
// BLACKJACK
// ============================================

let blackjackDeck = [];
let blackjackPlayerHand = [];
let blackjackDealerHand = [];
let blackjackActive = false;

function openBlackjack() {

    const modal =
        document.getElementById("blackjackModal");

    if (!modal) {
        console.error("blackjackModal not found!");
        return;
    }

    modal.classList.add("show");

    blackjackActive = false;
    blackjackPlayerHand = [];
    blackjackDealerHand = [];

    renderBlackjack();

    setBlackjackStatus(
        "Set your bet and deal!"
    );

    const hitButton =
        document.getElementById(
            "blackjackHitButton"
        );

    const standButton =
        document.getElementById(
            "blackjackStandButton"
        );

    if (hitButton) {
        hitButton.disabled = true;
    }

    if (standButton) {
        standButton.disabled = true;
    }

}

function closeBlackjack() {

    const modal =
        document.getElementById(
            "blackjackModal"
        );

    if (modal) {
        modal.classList.remove("show");
    }

    blackjackActive = false;

}

function getBlackjackBet() {

    const input =
        document.getElementById(
            "blackjackBet"
        );

    let bet =
        Number(
            input
                ? input.value
                : 100
        );

    if (!Number.isFinite(bet)) {
        bet = 100;
    }

    bet =
        Math.floor(bet / 10) * 10;

    bet =
        Math.max(
            10,
            Math.min(
                1000,
                bet
            )
        );

    if (input) {
        input.value = bet;
    }

    return bet;

}

function makeBlackjackDeck() {

    return shuffle(makeDeck());

}

function blackjackDrawOne() {

    return blackjackDeck.pop();

}

function blackjackCardValue(card) {

    if (card.value >= 10) {
        return 10;
    }

    if (card.value === 14) {
        return 11;
    }

    return card.value;

}

function getBlackjackTotal(hand) {

    let total = 0;
    let aces = 0;

    hand.forEach(function(card) {

        total += blackjackCardValue(card);

        if (card.value === 14) {
            aces++;
        }

    });

    while (
        total > 21 &&
        aces > 0
    ) {

        total -= 10;
        aces--;

    }

    return total;

}

function isBlackjack(hand) {

    return (
        hand.length === 2 &&
        getBlackjackTotal(hand) === 21
    );

}

function renderBlackjack(showDealerCards) {

    const playerElement =
        document.getElementById(
            "playerBlackjackHand"
        );

    const dealerElement =
        document.getElementById(
            "dealerBlackjackHand"
        );

    const playerTotalElement =
        document.getElementById(
            "playerBlackjackTotal"
        );

    const dealerTotalElement =
        document.getElementById(
            "dealerBlackjackTotal"
        );

    if (
        !playerElement ||
        !dealerElement
    ) {
        return;
    }

    playerElement.innerHTML = "";

    blackjackPlayerHand.forEach(
        function(card) {

            const div =
                document.createElement(
                    "div"
                );

            div.className =
                "card" +
                (
                    card.suit === "♥" ||
                    card.suit === "♦"
                        ? " red"
                        : ""
                );

            div.textContent =
                card.name + card.suit;

            playerElement.appendChild(
                div
            );

        }
    );

    dealerElement.innerHTML = "";

    blackjackDealerHand.forEach(
        function(card, index) {

            const div =
                document.createElement(
                    "div"
                );

            div.className = "card";

            if (
                !showDealerCards &&
                index === 1
            ) {

                div.textContent = "🂠";

            } else {

                div.textContent =
                    card.name + card.suit;

                if (
                    card.suit === "♥" ||
                    card.suit === "♦"
                ) {

                    div.classList.add(
                        "red"
                    );

                }

            }

            dealerElement.appendChild(
                div
            );

        }
    );

    if (playerTotalElement) {

        if (blackjackPlayerHand.length > 0) {

            playerTotalElement.textContent =
                "Total: " +
                getBlackjackTotal(
                    blackjackPlayerHand
                );

        } else {

            playerTotalElement.textContent = "";

        }

    }

    if (dealerTotalElement) {

        if (blackjackDealerHand.length === 0) {

            dealerTotalElement.textContent = "";

        } else if (showDealerCards) {

            dealerTotalElement.textContent =
                "Total: " +
                getBlackjackTotal(
                    blackjackDealerHand
                );

        } else {

            dealerTotalElement.textContent =
                "One card hidden";

        }

    }

}

function setBlackjackStatus(text) {

    const element =
        document.getElementById(
            "blackjackStatus"
        );

    if (element) {
        element.textContent = text;
    }

}

function dealBlackjack() {

    const bet = getBlackjackBet();

    if (bet > balance) {

        setBlackjackStatus(
            "❌ You don't have enough GooseBucks!"
        );

        return;

    }

    balance -= bet;
    updateBalance();

    blackjackDeck =
        makeBlackjackDeck();

    blackjackPlayerHand = [
        blackjackDrawOne(),
        blackjackDrawOne()
    ];

    blackjackDealerHand = [
        blackjackDrawOne(),
        blackjackDrawOne()
    ];

    blackjackActive = true;

    const hitButton =
        document.getElementById(
            "blackjackHitButton"
        );

    const standButton =
        document.getElementById(
            "blackjackStandButton"
        );

    if (hitButton) {
        hitButton.disabled = false;
    }

    if (standButton) {
        standButton.disabled = false;
    }

    renderBlackjack(false);

    const playerBlackjack =
        isBlackjack(
            blackjackPlayerHand
        );

    const dealerBlackjack =
        isBlackjack(
            blackjackDealerHand
        );

    if (
        playerBlackjack ||
        dealerBlackjack
    ) {

        blackjackActive = false;

        if (hitButton) {
            hitButton.disabled = true;
        }

        if (standButton) {
            standButton.disabled = true;
        }

        renderBlackjack(true);

        if (
            playerBlackjack &&
            dealerBlackjack
        ) {

            balance += bet;

            updateBalance();

            setBlackjackStatus(
                "🤝 BOTH HAVE BLACKJACK! PUSH!"
            );

        } else if (playerBlackjack) {

            balance += bet * 2.5;

            updateBalance();

            setBlackjackStatus(
                "🎉 BLACKJACK! YOU WIN 3:2!"
            );

        } else {

            setBlackjackStatus(
                "🪿 DEALER HAS BLACKJACK!"
            );

        }

        return;
    }

    setBlackjackStatus(
        "👀 Your move! HIT or STAND?"
    );

}

function hitBlackjack() {

    if (!blackjackActive) {
        return;
    }

    blackjackPlayerHand.push(
        blackjackDrawOne()
    );

    const total =
        getBlackjackTotal(
            blackjackPlayerHand
        );

    renderBlackjack(false);

    if (total > 21) {

        blackjackActive = false;

        const hitButton =
            document.getElementById(
                "blackjackHitButton"
            );

        const standButton =
            document.getElementById(
                "blackjackStandButton"
            );

        if (hitButton) {
            hitButton.disabled = true;
        }

        if (standButton) {
            standButton.disabled = true;
        }

        setBlackjackStatus(
            "💥 BUST! You went over 21!"
        );

        return;

    }

    if (total === 21) {

        setBlackjackStatus(
            "21! ✋ STAND!"
        );

        return;

    }

    setBlackjackStatus(
        "You have " +
        total +
        ". HIT or STAND?"
    );

}

function standBlackjack() {

    if (!blackjackActive) {
        return;
    }

    const hitButton =
        document.getElementById(
            "blackjackHitButton"
        );

    const standButton =
        document.getElementById(
            "blackjackStandButton"
        );

    if (hitButton) {
        hitButton.disabled = true;
    }

    if (standButton) {
        standButton.disabled = true;
    }

    while (
        getBlackjackTotal(
            blackjackDealerHand
        ) < 17
    ) {

        blackjackDealerHand.push(
            blackjackDrawOne()
        );

    }

    blackjackActive = false;

    renderBlackjack(true);

    finishBlackjack();

}

function finishBlackjack() {

    const bet =
        getBlackjackBet();

    const playerTotal =
        getBlackjackTotal(
            blackjackPlayerHand
        );

    const dealerTotal =
        getBlackjackTotal(
            blackjackDealerHand
        );

    let message = "";

    if (dealerTotal > 21) {

        balance += bet * 2;

        message =
            "💥 Dealer busts! YOU WIN!";

    } else if (
        playerTotal >
        dealerTotal
    ) {

        balance += bet * 2;

        message =
            "🏆 YOU WIN! " +
            playerTotal +
            " beats " +
            dealerTotal +
            ".";

    } else if (
        playerTotal ===
        dealerTotal
    ) {

        balance += bet;

        message =
            "🤝 PUSH! Both have " +
            playerTotal +
            ".";

    } else {

        message =
            "🪿 DEALER WINS! " +
            dealerTotal +
            " beats " +
            playerTotal +
            ".";

    }

    updateBalance();

    setBlackjackStatus(
        message
    );

}
// ============================================
// START
// ============================================

updateBalance();
