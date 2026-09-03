// ============================================
// GOOSEY RACE
// ============================================

let gooseRaceRunning = false;
let gooseRaceTimer = null;

let racePositions = [80, 80, 80];
let raceLanes = [1, 0, 2];

let playerBoost = 0;
let raceFinished = false;

const RACE_FINISH = 4750;

const LANE_TOPS = [
    30,
    140,
    250
];

// Obstacles on the track.
// position = distance along track
// lane = lane number
const obstacles = [
    { position: 650, lane: 1 },
    { position: 950, lane: 0 },
    { position: 1250, lane: 2 },

    { position: 1650, lane: 0 },
    { position: 2050, lane: 1 },
    { position: 2450, lane: 2 },

    { position: 2900, lane: 1 },
    { position: 3350, lane: 0 },
    { position: 3800, lane: 2 }
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

    [
        "goose1",
        "goose2",
        "goose3"
    ].forEach(function(id) {

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

    // Player starts in center lane.
    // CPU geese start in different lanes.
    raceLanes = [
        1,
        0,
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
    // PLAYER MOVEMENT
    // ========================================

    let playerSpeed =
        3 +
        Math.random() * 1.5;

    if (playerBoost > 0) {

        playerSpeed += 7;
        playerBoost--;

    }

    let desiredPlayerPosition =
        racePositions[0] + playerSpeed;

    // ========================================
    // OBSTACLE COLLISION
    // ========================================

    if (
        hitsObstacle(
            desiredPlayerPosition,
            raceLanes[0]
        )
    ) {

        desiredPlayerPosition =
            racePositions[0];

        playerBoost = 0;

        showTemporaryStatus(
            "💥 BONK! OBSTACLE!"
        );
    }

    racePositions[0] =
        desiredPlayerPosition;

    // ========================================
    // CPU MOVEMENT
    // ========================================

    for (let i = 1; i < 3; i++) {

        let cpuSpeed =
            3 +
            Math.random() * 4;

        let desired =
            racePositions[i] +
            cpuSpeed;

        // CPU geese avoid obstacles too.
        if (
            hitsObstacle(
                desired,
                raceLanes[i]
            )
        ) {

            // Try another lane.
            const newLane =
                findSafeLane(
                    desired,
                    raceLanes[i]
                );

            if (newLane !== null) {
                raceLanes[i] = newLane;
            } else {
                desired =
                    racePositions[i];
            }
        }

        racePositions[i] =
            desired;
    }

    // ========================================
    // GOOSE VS GOOSE COLLISIONS
    // ========================================

    handleGooseCollisions();

    // ========================================
    // MOVE EVERYTHING
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
// OBSTACLE COLLISION
// ============================================

function hitsObstacle(position, lane) {

    for (const obstacle of obstacles) {

        const distance =
            Math.abs(
                position -
                obstacle.position
            );

        if (
            obstacle.lane === lane &&
            distance < 70
        ) {

            return true;
        }
    }

    return false;
}

function findSafeLane(
    position,
    currentLane
) {

    const possibleLanes = [
        currentLane - 1,
        currentLane + 1,
        currentLane - 2,
        currentLane + 2
    ];

    for (const lane of possibleLanes) {

        if (
            lane >= 0 &&
            lane <= 2 &&
            !hitsObstacle(
                position,
                lane
            )
        ) {

            return lane;
        }
    }

    return null;
}

// ============================================
// GOOSE COLLISIONS
// ============================================

function handleGooseCollisions() {

    for (
        let i = 0;
        i < 3;
        i++
    ) {

        for (
            let j = i + 1;
            j < 3;
            j++
        ) {

            const sameLane =
                raceLanes[i] === raceLanes[j];

            const close =
                Math.abs(
                    racePositions[i] -
                    racePositions[j]
                ) < 65;

            if (
                sameLane &&
                close
            ) {

                // Player gets bumped.
                if (i === 0) {

                    bumpPlayer(
                        racePositions[j]
                    );

                } else if (j === 0) {

                    bumpPlayer(
                        racePositions[i]
                    );

                }

                // CPU geese bump each other.
                if (
                    i !== 0 &&
                    j !== 0
                ) {

                    if (
                        raceLanes[i] <
                        2
                    ) {

                        raceLanes[i]++;

                    } else {

                        raceLanes[i]--;

                    }

                }
            }
        }
    }
}

function bumpPlayer(otherPosition) {

    // Only a real collision when
    // the other goose is close enough.
    if (
        Math.abs(
            racePositions[0] -
            otherPosition
        ) > 65
    ) {
        return;
    }

    // Push Goosey forward or backward
    // and into another lane.
    racePositions[0] -= 25;

    const oldLane =
        raceLanes[0];

    if (oldLane === 0) {

        raceLanes[0] = 1;

    } else if (oldLane === 2) {

        raceLanes[0] = 1;

    } else {

        // Center lane randomly gets
        // knocked left or right.
        raceLanes[0] =
            Math.random() < 0.5
                ? 0
                : 2;
    }

    playerBoost = 0;

    showTemporaryStatus(
        "💥 GOOSE BUMP!!!"
    );
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

    const trackWindow =
        document.getElementById(
            "trackWindow"
        );

    if (
        !track ||
        !trackWindow
    ) {
        return;
    }

    const cameraX =
        Math.max(
            0,
            Math.min(
                racePositions[0] - 180,
                RACE_FINISH -
                trackWindow.clientWidth
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
// STATUS MESSAGE
// ============================================

let statusTimeout = null;

function showTemporaryStatus(text) {

    const status =
        document.getElementById("status");

    if (!status) {
        return;
    }

    status.textContent = text;

    clearTimeout(statusTimeout);

    statusTimeout =
        setTimeout(function() {

            if (gooseRaceRunning) {

                status.textContent =
                    "🏃 KEEP RUNNING!!!";

            }

        }, 700);
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

    [
        "goose1",
        "goose2",
        "goose3"
    ].forEach(function(id) {

        const goose =
            document.getElementById(id);

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
            result;
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
