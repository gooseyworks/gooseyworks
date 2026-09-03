// ============================================
// GOOSEY RACE
// ============================================

let gooseRaceRunning = false;
let gooseRaceTimer = null;

let racePositions = [80, 80, 80];
let raceLanes = [0, 1, 2];

let playerBoost = 0;
let raceFinished = false;

const RACE_FINISH = 4750;

const LANE_TOPS = [
    30,
    140,
    250
];


// ============================================
// START
// ============================================

function startRace() {

    if (gooseRaceRunning) {
        return;
    }

    resetRace();

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
            "🏁 3... 2... 1... GOOOOOOOOSE!!!";
    }

    const geese = [
        "goose1",
        "goose2",
        "goose3"
    ];

    geese.forEach(function(id) {

        const goose =
            document.getElementById(id);

        if (goose) {
            goose.classList.add("running");
        }

    });

    gooseRaceTimer =
        setInterval(updateRace, 80);

}


// ============================================
// RESET
// ============================================

function resetRace() {

    stopRace();

    racePositions = [
        80,
        80,
        80
    ];

    raceLanes = [
        0,
        1,
        2
    ];

    playerBoost = 0;
    raceFinished = false;

    moveGoose(
        "goose1",
        racePositions[0],
        raceLanes[0]
    );

    moveGoose(
        "goose2",
        racePositions[1],
        raceLanes[1]
    );

    moveGoose(
        "goose3",
        racePositions[2],
        raceLanes[2]
    );

    centerCamera();

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
// GAME LOOP
// ============================================

function updateRace() {

    if (!gooseRaceRunning) {
        return;
    }

    // ========================================
    // PLAYER
    // ========================================

    let playerSpeed =
        3 +
        Math.random() * 1.5;

    if (playerBoost > 0) {

        playerSpeed += 7;

        playerBoost--;

    }

    racePositions[0] += playerSpeed;


    // ========================================
    // CPU
    // ========================================

    racePositions[1] +=
        3 +
        Math.random() * 4;

    racePositions[2] +=
        3 +
        Math.random() * 4;


    // ========================================
    // MOVE
    // ========================================

    moveGoose(
        "goose1",
        racePositions[0],
        raceLanes[0]
    );

    moveGoose(
        "goose2",
        racePositions[1],
        raceLanes[1]
    );

    moveGoose(
        "goose3",
        racePositions[2],
        raceLanes[2]
    );


    // ========================================
    // CAMERA
    // ========================================

    updateCamera();


    // ========================================
    // FINISH
    // ========================================

    if (
        racePositions[0] >= RACE_FINISH ||
        racePositions[1] >= RACE_FINISH ||
        racePositions[2] >= RACE_FINISH
    ) {

        finishRace();

    }

}


// ============================================
// PLAYER CONTROLS
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!gooseRaceRunning) {
            return;
        }


        // SPACE = BOOST

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            playerBoost =
                Math.min(
                    playerBoost + 4,
                    15
                );

        }


        // A = LEFT

        if (
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            raceLanes[0] =
                Math.max(
                    0,
                    raceLanes[0] - 1
                );

            moveGoose(
                "goose1",
                racePositions[0],
                raceLanes[0]
            );

        }


        // D = RIGHT

        if (
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            raceLanes[0] =
                Math.min(
                    2,
                    raceLanes[0] + 1
                );

            moveGoose(
                "goose1",
                racePositions[0],
                raceLanes[0]
            );

        }

    }
);


// ============================================
// MOVE GOOSE
// ============================================

function moveGoose(
    id,
    position,
    lane
) {

    const goose =
        document.getElementById(id);

    if (!goose) {
        return;
    }

    goose.style.left =
        position + "px";

    goose.style.top =
        LANE_TOPS[lane] + "px";

}


// ============================================
// CAMERA
// ============================================

function updateCamera() {

    const track =
        document.getElementById("track");

    const windowElement =
        document.getElementById(
            "trackWindow"
        );

    if (
        !track ||
        !windowElement
    ) {
        return;
    }

    const cameraX =
        Math.max(
            0,
            Math.min(
                racePositions[0] - 180,
                RACE_FINISH -
                windowElement.clientWidth
            )
        );

    track.style.transform =
        "translateX(-" +
        cameraX +
        "px)";

}

function centerCamera() {

    const track =
        document.getElementById("track");

    if (track) {
        track.style.transform =
            "translateX(0)";
    }

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
            .map(function(
                position,
                index
            ) {

                return {
                    index: index,
                    position: position
                };

            })
            .sort(function(a, b) {

                return b.position -
                       a.position;

            });


    const playerPlace =
        ranking.findIndex(
            function(entry) {

                return entry.index === 0;

            }
        ) + 1;


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

        status.textContent =
            result +
            " 🪿";

    }


    const button =
        document.getElementById(
            "startButton"
        );

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

        clearInterval(
            gooseRaceTimer
        );

        gooseRaceTimer = null;

    }

}
