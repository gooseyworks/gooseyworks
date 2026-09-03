// ============================================
// GOOSEY RACE
// ============================================

let gooseRaceRunning = false;
let gooseRaceTimer = null;

let racePositions = [10, 10, 10];
let playerBoost = 0;
let raceFinished = false;

// ============================================
// OPEN / CLOSE
// ============================================

function openGooseRace() {

    resetRace();

}

function resetRace() {

    stopRace();

    racePositions = [10, 10, 10];
    playerBoost = 0;
    raceFinished = false;

    moveGoose("goose1", 10);
    moveGoose("goose2", 10);
    moveGoose("goose3", 10);

    const button =
        document.getElementById("startButton");

    if (button) {
        button.disabled = false;
    }

    const status =
        document.getElementById("status");

    if (status) {
        status.textContent =
            "Press START RACE!";
    }

}

// ============================================
// START
// ============================================

function startRace() {

    if (gooseRaceRunning) {
        return;
    }

    gooseRaceRunning = true;
    raceFinished = false;
    playerBoost = 0;

    const button =
        document.getElementById("startButton");

    if (button) {
        button.disabled = true;
    }

    const status =
        document.getElementById("status");

    if (status) {
        status.textContent =
            "🏁 3... 2... 1... GOOOOOOSE!!!";
    }

    const playerGoose =
        document.getElementById("goose1");

    if (playerGoose) {
        playerGoose.classList.add("running");
    }

    const cpu1 =
        document.getElementById("goose2");

    const cpu2 =
        document.getElementById("goose3");

    if (cpu1) {
        cpu1.classList.add("running");
    }

    if (cpu2) {
        cpu2.classList.add("running");
    }

    gooseRaceTimer =
        setInterval(function() {

            // ============================================
            // PLAYER GOOSE
            // ============================================

            let playerSpeed =
                2.2 + Math.random() * 1.5;

            if (playerBoost > 0) {

                playerSpeed += 6;

                playerBoost--;

            }

            racePositions[0] += playerSpeed;

            // ============================================
            // CPU GEESE
            // ============================================

            racePositions[1] +=
                2.3 + Math.random() * 5;

            racePositions[2] +=
                2.3 + Math.random() * 5;

            moveGoose(
                "goose1",
                racePositions[0]
            );

            moveGoose(
                "goose2",
                racePositions[1]
            );

            moveGoose(
                "goose3",
                racePositions[2]
            );

            // ============================================
            // CHECK FINISH
            // ============================================

            if (
                racePositions[0] >= 100 ||
                racePositions[1] >= 100 ||
                racePositions[2] >= 100
            ) {

                finishRace();

            }

        }, 100);

}

// ============================================
// PLAYER CONTROL
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (
            event.code === "Space" &&
            gooseRaceRunning
        ) {

            event.preventDefault();

            // Give Goosey a boost.
            playerBoost = Math.min(
                playerBoost + 5,
                12
            );

        }

    }
);

// ============================================
// MOVE GOOSE
// ============================================

function moveGoose(id, progress) {

    const track =
        document.getElementById("track");

    const goose =
        document.getElementById(id);

    if (!track || !goose) {
        return;
    }

    const maxX =
        track.clientWidth -
        goose.offsetWidth -
        55;

    const newX =
        10 +
        (Math.min(progress, 100) / 100) *
        (maxX - 10);

    goose.style.left =
        newX + "px";

}

// ============================================
// FINISH
// ============================================

function finishRace() {

    if (raceFinished) {
        return;
    }

    raceFinished = true;
    stopRace();

    const geese = [
        document.getElementById("goose1"),
        document.getElementById("goose2"),
        document.getElementById("goose3")
    ];

    geese.forEach(function(goose) {

        if (goose) {
            goose.classList.remove("running");
        }

    });

    const ranking =
        racePositions
            .map(function(position, index) {

                return {
                    index: index,
                    position: position
                };

            })
            .sort(function(a, b) {

                return b.position - a.position;

            });

    const playerPlace =
        ranking.findIndex(function(entry) {

            return entry.index === 0;

        }) + 1;

    let result = "";

    if (playerPlace === 1) {

        result =
            "🥇 GOOSEY WINS!!!";

    } else if (playerPlace === 2) {

        result =
            "🥈 GOOSEY FINISHED 2ND!";

    } else {

        result =
            "🥉 GOOSEY FINISHED 3RD!";

    }

    const status =
        document.getElementById("status");

    if (status) {
        status.textContent = result;
    }

    const button =
        document.getElementById("startButton");

    if (button) {
        button.disabled = false;
    }

}

// ============================================
// STOP
// ============================================

function stopRace() {

    gooseRaceRunning = false;

    if (gooseRaceTimer) {

        clearInterval(gooseRaceTimer);
        gooseRaceTimer = null;

    }

}
