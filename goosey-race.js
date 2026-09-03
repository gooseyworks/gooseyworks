// ============================================
// GOOSEY RACE
// ============================================

let gooseRaceRunning = false;
let gooseRaceTimer = null;
let raceFinished = false;

let racePositions = [100, 100, 100];
let raceLanes = [1, 0, 2];

// Player boost energy.
// Goosey always runs automatically.
let playerBoost = 0;

const RACE_FINISH = 4750;

const PLAYER_SPEED = 1.15;
const PLAYER_BOOST_SPEED = 3.4;

const CPU_MIN_SPEED = 0.9;
const CPU_MAX_SPEED = 1.8;

// Lane vertical positions
const LANE_TOPS = [
    30,
    140,
    250
];

// ============================================
// OBSTACLES
// ============================================

const obstacles = [
    { position: 550, lane: 1 },
    { position: 850, lane: 0 },
    { position: 1150, lane: 2 },

    { position: 1450, lane: 1 },
    { position: 1750, lane: 2 },
    { position: 2050, lane: 0 },

    { position: 2350, lane: 1 },
    { position: 2650, lane: 0 },
    { position: 2950, lane: 2 },

    { position: 3300, lane: 1 },
    { position: 3600, lane: 2 },
    { position: 3900, lane: 0 },

    { position: 4200, lane: 1 }
];

// ============================================
// RESET
// ============================================

function resetRace() {

    stopRace();

    raceFinished = false;

    racePositions = [
        100,
        100,
        100
    ];

    // Player = center lane
    // CPU 1 = left lane
    // CPU 2 = right lane
    raceLanes = [
        1,
        0,
        2
    ];

    playerBoost = 0;

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

    // ALWAYS reset first.
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
        setInterval(
            updateRace,
            100
        );
}

// ============================================
// GAME LOOP
// ============================================

function updateRace() {

    if (!gooseRaceRunning) {
        return;
    }

    // ========================================
    // PLAYER AUTO-RUN
    // ========================================

    let playerSpeed =
        PLAYER_SPEED;

    // SPACE only makes the player faster.
    if (playerBoost > 0) {

        playerSpeed =
            PLAYER_BOOST_SPEED;

        playerBoost--;

    }

    let nextPlayerPosition =
        racePositions[0] +
        playerSpeed;

    // Obstacle blocks player.
    if (
        hitsObstacle(
            nextPlayerPosition,
            raceLanes[0]
        )
    ) {

        nextPlayerPosition =
            racePositions[0];

        playerBoost = 0;

        showTemporaryStatus(
            "💥 BONK! YOU HIT AN OBSTACLE!"
        );
    }

    racePositions[0] =
        nextPlayerPosition;

    // ========================================
    // CPU AUTO-RUN
    // ========================================

    for (
        let i = 1;
        i < 3;
        i++
    ) {

        let cpuSpeed =
            CPU_MIN_SPEED +
            Math.random() *
            (
                CPU_MAX_SPEED -
                CPU_MIN_SPEED
            );

        let nextPosition =
            racePositions[i] +
            cpuSpeed;

        // CPU gets blocked too.
        if (
            hitsObstacle(
                nextPosition,
                raceLanes[i]
            )
        ) {

            const safeLane =
                findSafeLane(
                    nextPosition,
                    raceLanes[i]
                );

            if (
                safeLane !== null
            ) {

                raceLanes[i] =
                    safeLane;

            } else {

                nextPosition =
                    racePositions[i];

            }
        }

        racePositions[i] =
            nextPosition;
    }

    // ========================================
    // GOOSE COLLISIONS
    // ========================================

    handleGooseCollisions();

    // ========================================
    // DRAW
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

    // Camera follows PLAYER.
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
                    12
                );

            return;
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

            return;
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
// OBSTACLE COLLISION
// ============================================

function hitsObstacle(
    position,
    lane
) {

    for (
        const obstacle of obstacles
    ) {

        if (
            obstacle.lane !== lane
        ) {
            continue;
        }

        const distance =
            Math.abs(
                position -
                obstacle.position
            );

        if (
            distance < 70
        ) {
            return true;
        }
    }

    return false;
}

// ============================================
// CPU LANE CHANGING
// ============================================

function findSafeLane(
    position,
    currentLane
) {

    const possibleLanes = [
        currentLane - 1,
        currentLane + 1
    ];

    // Randomize direction.
    possibleLanes.sort(
        function() {
            return Math.random() - 0.5;
        }
    );

    for (
        const lane of possibleLanes
    ) {

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
// GOOSE VS GOOSE
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

            // Must be in the same lane.
            if (
                raceLanes[i] !==
                raceLanes[j]
            ) {
                continue;
            }

            const distance =
                Math.abs(
                    racePositions[i] -
                    racePositions[j]
                );

            if (
                distance >= 65
            ) {
                continue;
            }

            // PLAYER COLLISION

            if (i === 0) {

                bumpPlayer(j);

            } else if (j === 0) {

                bumpPlayer(i);

            }

            // CPU VS CPU

            if (
                i !== 0 &&
                j !== 0
            ) {

                const safeLane =
                    findSafeLane(
                        racePositions[i],
                        raceLanes[i]
                    );

                if (
                    safeLane !== null
                ) {

                    raceLanes[i] =
                        safeLane;

                }

                racePositions[i] =
                    Math.max(
                        100,
                        racePositions[i] - 25
                    );
            }
        }
    }
}

// ============================================
// PLAYER BUMP
// ============================================

function bumpPlayer(
    otherGooseIndex
) {

    const distance =
        Math.abs(
            racePositions[0] -
            racePositions[otherGooseIndex]
        );

    if (
        distance >= 65
    ) {
        return;
    }

    racePositions[0] =
        Math.max(
            100,
            racePositions[0] - 40
        );

    const currentLane =
        raceLanes[0];

    // Knock sideways.
    if (
        currentLane === 0
    ) {

        raceLanes[0] = 1;

    } else if (
        currentLane === 2
    ) {

        raceLanes[0] = 1;

    } else {

        raceLanes[0] =
            Math.random() < 0.5
                ? 0
                : 2;
    }

    playerBoost = 0;

    showTemporaryStatus(
        "💥 GOOSE BUMP!!! YOU GOT KNOCKED!"
    );
}

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

    // Goosey stays roughly here onscreen.
    const targetScreenX = 220;

    let cameraX =
        racePositions[0] -
        targetScreenX;

    const maxCameraX =
        RACE_FINISH -
        trackWindow.clientWidth;

    cameraX =
        Math.max(
            0,
            Math.min(
                cameraX,
                maxCameraX
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
// STATUS
// ============================================

let statusTimeout = null;

function showTemporaryStatus(
    text
) {

    const status =
        document.getElementById("status");

    if (!status) {
        return;
    }

    status.textContent =
        text;

    clearTimeout(
        statusTimeout
    );

    statusTimeout =
        setTimeout(
            function() {

                if (
                    gooseRaceRunning
                ) {

                    status.textContent =
                        "🏃 KEEP RUNNING!!!";
                }

            },
            900
        );
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
            goose.classList.remove(
                "running"
            );
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

                return (
                    b.position -
                    a.position
                );

            });

    const playerPlace =
        ranking.findIndex(
            function(entry) {

                return (
                    entry.index === 0
                );

            }
        ) + 1;

    let result = "";

    if (
        playerPlace === 1
    ) {

        result =
            "🥇 GOOSEY WINS!!!";

    } else if (
        playerPlace === 2
    ) {

        result =
            "🥈 GOOSEY FINISHED 2ND!";

    } else {

        result =
            "🥉 GOOSEY FINISHED 3RD!";

    }

    const username =
        localStorage.getItem(
            "gooseyWorksUsername"
        );

    if (username) {

        result +=
            " 👤 " +
            username;

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

    gooseRaceRunning =
        false;

    if (gooseRaceTimer) {

        clearInterval(
            gooseRaceTimer
        );

        gooseRaceTimer = null;
    }

}

// ============================================
// STARTUP
// ============================================

resetRace();
