
/* ============================================
   GOOSEY CASINO ARCADE ENGINE
   Nine new games; shared GooseBucks balance.
   Multiplayer is reserved for a future update.
   ============================================ */

let arcade = null;

const arcadeSymbols = ["🪿", "🪙", "⭐", "🍒", "💎", "7️⃣"];

function openArcadeGame(name) {
    if (name === "Goose Racing") return;

    let modal = document.getElementById("arcadeModal");

    if (!modal) {
        modal = document.createElement("div");
        modal.id = "arcadeModal";
        modal.className = "modal";
        modal.innerHTML = `
            <div class="panel" id="arcadePanel">
                <button class="close" onclick="closeArcadeGame()">✕ CLOSE</button>
                <div id="arcadeContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    arcade = {
        game: name,
        phase: "ready",
        bet: 100,
        data: {},
        message: "Choose your bet and start!"
    };

    modal.classList.add("show");
    renderArcade();
}

function closeArcadeGame() {
    const modal = document.getElementById("arcadeModal");
    if (modal) modal.classList.remove("show");
    arcade = null;
}

function arcadeMoney(amount) {
    return Math.floor(amount).toLocaleString() + " GB";
}

function arcadeBet() {
    const input = document.getElementById("arcadeBet");
    let value = Number(input ? input.value : 100);

    if (!Number.isFinite(value)) value = 100;

    value = Math.floor(value / 10) * 10;
    value = Math.max(10, Math.min(1000, value));

    if (value > balance) {
        value = Math.floor(balance / 10) * 10;
    }

    if (input) input.value = value;
    return value;
}

function arcadeStart() {
    if (!arcade) return;

    const bet = arcadeBet();

    if (bet < 10 || bet > balance) {
        arcade.message = "❌ You need at least 10 GB to play.";
        renderArcade();
        return;
    }

    arcade.bet = bet;
    balance -= bet;
    updateBalance();

    arcade.phase = "playing";
    arcade.data = {};
    arcade.message = "Good luck!";

    const game = arcade.game;

    if (game === "Texas Holdem") {
        const deck = shuffle(makeDeck());
        arcade.data.player = [deck.pop(), deck.pop()];
        arcade.data.bot = [deck.pop(), deck.pop()];
        arcade.data.community = [
            deck.pop(), deck.pop(), deck.pop(),
            deck.pop(), deck.pop()
        ];
        arcade.data.deck = deck;
        arcade.message = "Your two cards are dealt. Reveal the community cards at showdown!";
    }

    if (game === "Goosey Slots") {
        arcadeSpinSlots();
        return;
    }

    if (game === "Goosey Wheel") {
        arcadeSpinWheel();
        return;
    }

    if (game === "Coin Flip") {
        arcade.message = "Choose heads or tails!";
    }

    if (game === "Dice Duel") {
        arcade.data.player = 1 + Math.floor(Math.random() * 6);
        arcade.data.bot = 1 + Math.floor(Math.random() * 6);
        arcadeResolveDice();
        return;
    }

    if (game === "Chicken") {
        arcade.data.steps = 0;
        arcade.data.multiplier = 1;
        arcade.data.bombed = false;
        arcade.message = "The path is clear... for now. Advance or cash out!";
    }

    if (game === "Goosey Crash") {
        arcade.data.multiplier = 1;
        arcade.data.crashAt = 1.1 + Math.random() * 5.9;
        arcade.message = "Advance the multiplier, then cash out before the crash!";
    }

    if (game === "Bomb Goose") {
        arcade.data.bomb = Math.floor(Math.random() * 9);
        arcade.data.revealed = [];
        arcade.data.multiplier = 1;
        arcade.message = "Pick safe tiles and avoid the hidden bomb!";
    }

    if (game === "Goosey Pool") {
        arcade.data.playerScore = 0;
        arcade.data.botScore = 0;
        arcade.data.shots = 0;
        arcade.message = "Aim your shot and choose its power!";
    }

    renderArcade();
}

function arcadeSettle(payout, message) {
    if (!arcade) return;

    payout = Math.max(0, Math.floor(payout));
    balance += payout;
    updateBalance();

    arcade.phase = "done";
    arcade.message = message + " Payout: " + arcadeMoney(payout) + ".";
    renderArcade();
}

function arcadeSpinSlots() {
    const symbols = [
        arcadeSymbols[Math.floor(Math.random() * arcadeSymbols.length)],
        arcadeSymbols[Math.floor(Math.random() * arcadeSymbols.length)],
        arcadeSymbols[Math.floor(Math.random() * arcadeSymbols.length)]
    ];

    arcade.data.symbols = symbols;

    let multiplier = 0;

    if (symbols[0] === symbols[1] && symbols[1] === symbols[2]) {
        multiplier = symbols[0] === "7️⃣" ? 10 : 5;
    } else if (
        symbols[0] === symbols[1] ||
        symbols[1] === symbols[2] ||
        symbols[0] === symbols[2]
    ) {
        multiplier = 2;
    }

    arcade.data.multiplier = multiplier;

    if (multiplier > 0) {
        arcadeSettle(
            arcade.bet * multiplier,
            "🎰 " + symbols.join(" ") + " — YOU WIN!"
        );
    } else {
        arcadeSettle(0, "🎰 " + symbols.join(" ") + " — No match this time!");
    }
}

function arcadeSpinWheel() {
    const prizes = [
        { label: "Nothing", multiplier: 0 },
        { label: "Half your bet", multiplier: 0.5 },
        { label: "Your bet back", multiplier: 1 },
        { label: "Double!", multiplier: 2 },
        { label: "Triple!", multiplier: 3 },
        { label: "JACKPOT!", multiplier: 10 }
    ];

    const prize = prizes[Math.floor(Math.random() * prizes.length)];
    arcade.data.prize = prize;

    arcadeSettle(
        arcade.bet * prize.multiplier,
        "🎡 " + prize.label
    );
}

function arcadeResolveDice() {
    const p = arcade.data.player;
    const b = arcade.data.bot;

    if (p > b) {
        arcadeSettle(arcade.bet * 2, "🎲 You rolled " + p + "; Goosey Bot rolled " + b + ". You win!");
    } else if (p === b) {
        arcadeSettle(arcade.bet, "🎲 Both rolled " + p + ". It's a tie!");
    } else {
        arcadeSettle(0, "🎲 You rolled " + p + "; Goosey Bot rolled " + b + ". Bot wins!");
    }
}

function arcadeAction(action, value) {
    if (!arcade || arcade.phase !== "playing") return;

    const game = arcade.game;

    if (game === "Coin Flip") {
        const result = Math.random() < 0.5 ? "Heads" : "Tails";

        if (value === result) {
            arcadeSettle(arcade.bet * 2, "🪙 It landed " + result + "! Correct guess!");
        } else {
            arcadeSettle(0, "🪙 It landed " + result + ". Better luck next time!");
        }
        return;
    }

    if (game === "Texas Holdem" && action === "showdown") {
        const player = arcadeBestPokerHand(
            arcade.data.player.concat(arcade.data.community)
        );
        const bot = arcadeBestPokerHand(
            arcade.data.bot.concat(arcade.data.community)
        );

        const playerScore = player.score;
        const botScore = bot.score;

        const community = arcade.data.community
            .map(c => c.name + c.suit)
            .join(" ");

        const handText =
            "Community: " + community +
            " | You: " + player.name +
            " | Bot: " + bot.name + ". ";

        if (playerScore > botScore) {
            arcadeSettle(arcade.bet * 2, handText + "🏆 You win!");
        } else if (playerScore === botScore) {
            arcadeSettle(arcade.bet, handText + "🤝 Tie!");
        } else {
            arcadeSettle(0, handText + "🪿 Bot wins!");
        }
        return;
    }

    if (game === "Chicken") {
        if (action === "cashout") {
            arcadeSettle(
                arcade.bet * arcade.data.multiplier,
                "🐔 You cashed out at " + arcade.data.multiplier.toFixed(2) + "x!"
            );
            return;
        }

        if (action === "advance") {
            if (Math.random() < Math.min(0.18 + arcade.data.steps * 0.07, 0.75)) {
                arcade.data.bombed = true;
                arcadeSettle(0, "💥 BOOM! The chicken got caught!");
                return;
            }

            arcade.data.steps++;
            arcade.data.multiplier = 1 + arcade.data.steps * 0.5;
            arcade.message = "🐔 Safe! Current multiplier: " +
                arcade.data.multiplier.toFixed(2) + "x. Keep going or cash out!";
            renderArcade();
            return;
        }
    }

    if (game === "Goosey Crash") {
        if (action === "cashout") {
            arcadeSettle(
                arcade.bet * arcade.data.multiplier,
                "📈 Cashed out at " + arcade.data.multiplier.toFixed(2) + "x!"
            );
            return;
        }

        if (action === "advance") {
            arcade.data.multiplier += 0.2 + Math.random() * 0.5;

            if (arcade.data.multiplier >= arcade.data.crashAt) {
                arcadeSettle(0, "💥 CRASH! The multiplier exploded before you cashed out!");
                return;
            }

            arcade.message = "📈 Multiplier: " +
                arcade.data.multiplier.toFixed(2) + "x. Cash out or advance!";
            renderArcade();
            return;
        }
    }

    if (game === "Bomb Goose") {
        if (action === "cashout") {
            arcadeSettle(
                arcade.bet * arcade.data.multiplier,
                "🪿 You escaped with " + arcade.data.multiplier.toFixed(2) + "x!"
            );
            return;
        }

        if (action === "tile") {
            const index = Number(value);

            if (arcade.data.revealed.includes(index)) return;

            if (index === arcade.data.bomb) {
                arcade.data.revealed.push(index);
                arcadeSettle(0, "💣 BOOM! You found the bomb!");
                return;
            }

            arcade.data.revealed.push(index);
            arcade.data.multiplier += 0.25;
            arcade.message = "✨ Safe tile! Multiplier: " +
                arcade.data.multiplier.toFixed(2) + "x. Keep going or cash out!";
            renderArcade();
            return;
        }
    }

    if (game === "Goosey Pool" && action === "shoot") {
        const angle = Number(document.getElementById("poolAngle").value);
        const power = Number(document.getElementById("poolPower").value);

        const accuracy = Math.max(
            0,
            100 - Math.abs(angle - 45) * 1.2 - Math.abs(power - 60) * 0.6
                + (Math.random() * 25 - 12)
        );

        const points = accuracy > 75 ? 2 : accuracy > 45 ? 1 : 0;

        arcade.data.playerScore += points;
        arcade.data.botScore += Math.random() < 0.55 ? 1 : 0;
        arcade.data.shots++;

        if (arcade.data.shots >= 3) {
            if (arcade.data.playerScore > arcade.data.botScore) {
                arcadeSettle(
                    arcade.bet * 2,
                    "🎱 You won " + arcade.data.playerScore +
                    " to " + arcade.data.botScore + "!"
                );
            } else if (arcade.data.playerScore === arcade.data.botScore) {
                arcadeSettle(
                    arcade.bet,
                    "🎱 The match is tied " + arcade.data.playerScore +
                    " to " + arcade.data.botScore + "!"
                );
            } else {
                arcadeSettle(
                    0,
                    "🎱 Goosey Bot wins " + arcade.data.botScore +
                    " to " + arcade.data.playerScore + "!"
                );
            }
            return;
        }

        arcade.message = "🎱 Your score: " + arcade.data.playerScore +
            " | Bot: " + arcade.data.botScore +
            " | Shot " + arcade.data.shots + " of 3.";
        renderArcade();
    }
}

/* Best five-card hand from seven cards.
   First version compares hand categories. */

function arcadeBestPokerHand(cards) {
    let bestRank = -1;
    let bestName = "High Card";

    for (let a = 0; a < cards.length - 4; a++) {
        for (let b = a + 1; b < cards.length - 3; b++) {
            for (let c = b + 1; c < cards.length - 2; c++) {
                for (let d = c + 1; d < cards.length - 1; d++) {
                    for (let e = d + 1; e < cards.length; e++) {
                        const result = evaluateHand([
                            cards[a], cards[b], cards[c], cards[d], cards[e]
                        ]);

                        if (result.rank > bestRank) {
                            bestRank = result.rank;
                            bestName = result.name;
                        }
                    }
                }
            }
        }
    }

    return { score: bestRank, name: bestName };
}

function renderArcade() {
    if (!arcade) return;

    const content = document.getElementById("arcadeContent");
    if (!content) return;

    const game = arcade.game;
    const d = arcade.data;

    let html = `
        <h2>🪿 ${game}</h2>
        <p class="small">Your balance: ${arcadeMoney(balance)}</p>
    `;

    if (arcade.phase === "ready") {
        html += `
            <p>Choose your wager to begin.</p>
            <div class="bet-row">
                <label>
                    Bet:
                    <input id="arcadeBet" type="number"
                        min="10" max="1000" step="10" value="100">
                </label>
            </div>
            <div class="game-controls">
                <button class="play" onclick="arcadeStart()">▶ START GAME</button>
            </div>
        `;
    } else if (game === "Coin Flip" && arcade.phase === "playing") {
        html += `
            <h3>🪙 Heads or Tails?</h3>
            <div class="game-controls">
                <button class="normal" onclick="arcadeAction('flip','Heads')">🙂 HEADS</button>
                <button class="normal" onclick="arcadeAction('flip','Tails')">🪙 TAILS</button>
            </div>
        `;
    } else if (game === "Texas Holdem" && arcade.phase === "playing") {
        html += `
            <h3>Your hole cards</h3>
            <div class="table">
                ${d.player.map(c => `<div class="card">${c.name}${c.suit}</div>`).join("")}
            </div>
            <p>Goosey Bot has two hidden cards.</p>
            <h3>Community cards</h3>
            <p>Reveal all five cards to see who wins.</p>
            <div class="game-controls">
                <button class="play" onclick="arcadeAction('showdown')">🃏 REVEAL & SHOWDOWN</button>
            </div>
        `;
    } else if (game === "Chicken" && arcade.phase === "playing") {
        html += `
            <h3>🐔 Path multiplier: ${d.multiplier.toFixed(2)}x</h3>
            <p>Safe steps: ${d.steps}</p>
            <div class="game-controls">
                <button class="normal" onclick="arcadeAction('advance')">➡️ ADVANCE</button>
                <button class="play" onclick="arcadeAction('cashout')">💰 CASH OUT</button>
            </div>
        `;
    } else if (game === "Goosey Crash" && arcade.phase === "playing") {
        html += `
            <h3 style="font-size:38px">📈 ${d.multiplier.toFixed(2)}x</h3>
            <div class="game-controls">
                <button class="normal" onclick="arcadeAction('advance')">📈 ADVANCE</button>
                <button class="play" onclick="arcadeAction('cashout')">💰 CASH OUT</button>
            </div>
        `;
    } else if (game === "Bomb Goose" && arcade.phase === "playing") {
        html += `
            <h3>💣 Pick a tile!</h3>
            <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;max-width:330px;margin:20px auto">
                ${Array.from({length:9}, (_,i) => {
                    const revealed = d.revealed.includes(i);
                    const isBomb = revealed && i === d.bomb;
                    return `<button class="normal"
                        ${revealed ? "disabled" : ""}
                        onclick="arcadeAction('tile',${i})">
                        ${revealed ? (isBomb ? "💣" : "🪿") : "❔"}
                    </button>`;
                }).join("")}
            </div>
            <p>Multiplier: ${d.multiplier.toFixed(2)}x</p>
            <button class="play" onclick="arcadeAction('cashout')">💰 CASH OUT</button>
        `;
    } else if (game === "Goosey Pool" && arcade.phase === "playing") {
        html += `
            <h3>🎱 Shot ${d.shots + 1} of 3</h3>
            <p>Player ${d.playerScore} — Bot ${d.botScore}</p>
            <label>Angle: <input id="poolAngle" type="range" min="0" max="90" value="45"></label>
            <br>
            <label>Power: <input id="poolPower" type="range" min="10" max="100" value="60"></label>
            <div class="game-controls">
                <button class="play" onclick="arcadeAction('shoot')">🎱 SHOOT</button>
            </div>
        `;
    } else if (arcade.phase === "playing") {
        html += `<p>Game in progress!</p>`;
    }

    html += `<div class="status" style="margin-top:15px">${arcade.message}</div>`;

    if (arcade.phase === "done") {
        html += `
            <div class="game-controls">
                <button class="play" onclick="openArcadeGame('${game}')">🔁 PLAY AGAIN</button>
                <button class="bot-back" onclick="closeArcadeGame()">← BACK TO CASINO</button>
            </div>
        `;
    } else if (arcade.phase === "playing" && ![
        "Coin Flip", "Texas Holdem", "Chicken",
        "Goosey Crash", "Bomb Goose", "Goosey Pool"
    ].includes(game)) {
        html += `<button class="bot-back" onclick="closeArcadeGame()">CLOSE</button>`;
    }

    content.innerHTML = html;
}
