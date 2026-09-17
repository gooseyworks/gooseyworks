// ============================================
// GOOSEY RACE
// ============================================

let raceRunning = false;
let raceTimer = null;
let raceFinished = false;

let positions = [100, 100, 100];
let lanes = [1, 0, 2];

let boostTicks = 0;

const FINISH = 4750;

const PLAYER_SPEED = 4.0;
const BOOST_SPEED = 8.0;

const CPU_MIN_SPEED = 3.4;
const CPU_MAX_SPEED = 5.0;

const LANES = [
    30,
    140,
    250
];

// ============================================
// RANDOM OBSTACLES
// ============================================

let obstacles = [];

const OBSTACLE_TYPES = [
    "🌳",
    "🪨",
    "🪵",
    "🌵",
    "🌲",
    "🪨",
    "🌳",
    "🪵"
];

// ============================================
// GENERATE RANDOM COURSE
// ============================================

function generateObstacles() {

    obstacles = [];

    const track =
        document.getElementById("track");

    if (!track) {
        return;
    }

    // Remove old generated obstacles.

    track
        .querySelectorAll(
            ".race-generated-obstacle"
        )
        .forEach(
            function(element) {
                element.remove();
            }
        );

    let x = 500;

    let previousLane = -1;

    let previousType = "";

    while (
        x < FINISH - 200
    ) {

        // ========================================
        // RANDOM NUMBER OF OBSTACLES IN THIS AREA
        // ========================================

        const groupSize =
            Math.random() < 0.18
                ? 2
                : 1;

        for (
            let g = 0;
            g < groupSize;
            g++
        ) {

            // ====================================
            // RANDOM LANE
            // ====================================

            let lane =
                Math.floor(
                    Math.random() * 3
                );

            // Don't endlessly repeat
            // the same lane.

            if (
                lane === previousLane &&
                Math.random() < 0.75
            ) {

                lane =
                    (lane +
                        1 +
                        Math.floor(
                            Math.random() * 2
                        )
                    ) % 3;
            }

            // ====================================
            // RANDOM LOOK
            // ====================================

            let type;

            do {

                type =
                    OBSTACLE_TYPES[
                        Math.floor(
                            Math.random() *
                            OBSTACLE_TYPES.length
                        )
                    ];

            } while (
                type === previousType &&
                Math.random() < 0.8
            );

            // ====================================
            // RANDOM POSITION
            // ====================================

            const obstacleX =
                x +
                Math.floor(
                    Math.random() * 90
                );

            // ====================================
            // CREATE OBSTACLE DATA
            // ====================================

            const obstacle = {
                x: obstacleX,
                lane: lane,
                type: type
            };

            obstacles.push(
                obstacle
            );

            previousLane =
                lane;

            previousType =
                type;

            // ====================================
            // CREATE VISIBLE OBSTACLE
            // ====================================

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "obstacle race-generated-obstacle";

            element.textContent =
                type;

            element.style.left =
                obstacleX + "px";

            element.style.top =
                LANES[lane] + "px";

            element.style.position =
                "absolute";

            element.style.fontSize =
                "42px";

            element.style.width =
                "55px";

            element.style.height =
                "55px";

            element.style.display =
                "flex";

            element.style.alignItems =
                "center";

            element.style.justifyContent =
                "center";

            element.style.zIndex =
                "10";

            element.style.pointerEvents =
                "none";

            track.appendChild(
                element
            );
        }

        // ========================================
        // RANDOM DISTANCE TO NEXT OBSTACLE
        // ========================================

        x +=
            190 +
            Math.floor(
                Math.random() * 260
            );
    }
}

// ============================================
// RESET
// ============================================

function resetRace() {

    stopRace();

    raceFinished = false;

    boostTicks = 0;

    positions = [
        100,
        100,
        100
    ];

    lanes = [
        1,
        0,
        2
    ];

    generateObstacles();

    moveGoose(
        "goose1",
        positions[0],
        lanes[0]
    );

    moveGoose(
        "goose2",
        positions[1],
        lanes[1]
    );

    moveGoose(
        "goose3",
        positions[2],
        lanes[2]
    );

    setCamera(0);

    const status =
        document.getElementById(
            "status"
        );

    if (status) {
        status.textContent =
            "Press START RACE!";
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
// START
// ============================================

function startRace() {

    if (raceRunning) {
        return;
    }

    resetRace();

    raceRunning = true;

    raceFinished = false;

    const button =
        document.getElementById(
            "startButton"
        );

    if (button) {
        button.disabled = true;
    }

    const status =
        document.getElementById(
            "status"
        );

    if (status) {
        status.textContent =
            "🏁 3... 2... 1... GOOOOOOSE!!!";
    }

    document
        .querySelectorAll(".goose")
        .forEach(
            function(goose) {

                goose.classList.add(
                    "running"
                );
            }
        );

    raceTimer =
        setInterval(
            updateRace,
            50
        );
}

// ============================================
// GAME LOOP
// ============================================

function updateRace() {

    if (!raceRunning) {
        return;
    }

    // ========================================
    // PLAYER
    // ========================================

    let playerSpeed =
        PLAYER_SPEED;

    if (boostTicks > 0) {

        playerSpeed =
            BOOST_SPEED;

        boostTicks--;
    }

    let nextPlayer =
        positions[0] +
        playerSpeed;

    if (
        hitsObstacle(
            nextPlayer,
            lanes[0]
        )
    ) {

        nextPlayer =
            positions[0];

        boostTicks = 0;

        showStatus(
            "💥 BONK! OBSTACLE!"
        );
    }

    positions[0] =
        nextPlayer;

    // ========================================
    // CPU
    // ========================================

    for (
        let i = 1;
        i < 3;
        i++
    ) {

        const cpuSpeed =
            CPU_MIN_SPEED +
            Math.random() *
            (
                CPU_MAX_SPEED -
                CPU_MIN_SPEED
            );

        let next =
            positions[i] +
            cpuSpeed;

        if (
            hitsObstacle(
                next,
                lanes[i]
            )
        ) {

            const newLane =
                findSafeLane(
                    next,
                    lanes[i]
                );

            if (
                newLane !== null
            ) {

                lanes[i] =
                    newLane;

            } else {

                next =
                    positions[i];
            }
        }

        positions[i] =
            next;
    }

    handleGooseCollisions();

    moveGoose(
        "goose1",
        positions[0],
        lanes[0]
    );

    moveGoose(
        "goose2",
        positions[1],
        lanes[1]
    );

    moveGoose(
        "goose3",
        positions[2],
        lanes[2]
    );

    updateCamera();

    if (
        positions[0] >= FINISH ||
        positions[1] >= FINISH ||
        positions[2] >= FINISH
    ) {

        finishRace();
    }
}

// ============================================
// CONTROLS
// ============================================

document.addEventListener(
    "keydown",
    function(event) {

        if (!raceRunning) {
            return;
        }

        if (
            event.code === "Space"
        ) {

            event.preventDefault();

            boostTicks = 12;

            return;
        }

        if (
            event.key.toLowerCase() === "a"
        ) {

            event.preventDefault();

            lanes[0] =
                Math.max(
                    0,
                    lanes[0] - 1
                );

            moveGoose(
                "goose1",
                positions[0],
                lanes[0]
            );

            return;
        }

        if (
            event.key.toLowerCase() === "d"
        ) {

            event.preventDefault();

            lanes[0] =
                Math.min(
                    2,
                    lanes[0] + 1
                );

            moveGoose(
                "goose1",
                positions[0],
                lanes[0]
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

        if (
            Math.abs(
                position -
                obstacle.x
            ) < 55
        ) {

            return true;
        }
    }

    return false;
}

// ============================================
// SAFE LANE
// ============================================

function findSafeLane(
    position,
    currentLane
) {

    const choices = [
        currentLane - 1,
        currentLane + 1
    ];

    if (
        Math.random() < 0.5
    ) {

        choices.reverse();
    }

    for (
        const lane of choices
    ) {

        if (
            lane < 0 ||
            lane > 2
        ) {
            continue;
        }

        if (
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

            if (
                lanes[i] !== lanes[j]
            ) {
                continue;
            }

            if (
                Math.abs(
                    positions[i] -
                    positions[j]
                ) > 55
            ) {
                continue;
            }

            if (i === 0) {

                bumpPlayer(j);

            } else if (j === 0) {

                bumpPlayer(i);

            } else {

                positions[i] =
                    Math.max(
                        100,
                        positions[i] - 25
                    );

                const safe =
                    findSafeLane(
                        positions[i],
                        lanes[i]
                    );

                if (
                    safe !== null
                ) {

                    lanes[i] =
                        safe;
                }
            }
        }
    }
}

// ============================================
// BUMP PLAYER
// ============================================

function bumpPlayer(
    other
) {

    positions[0] =
        Math.max(
            100,
            positions[0] - 30
        );

    const current =
        lanes[0];

    if (
        current === 0
    ) {

        lanes[0] = 1;

    } else if (
        current === 2
    ) {

        lanes[0] = 1;

    } else {

        lanes[0] =
            Math.random() < 0.5
                ? 0
                : 2;
    }

    boostTicks = 0;

    showStatus(
        "💥 GOOSE BUMP!!!"
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
        LANES[lane] + "px";
}

// ============================================
// CAMERA
// ============================================

function updateCamera() {

    const track =
        document.getElementById(
            "track"
        );

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

    const targetX =
        windowElement.clientWidth *
        0.25;

    let cameraX =
        positions[0] -
        targetX;

    const maximum =
        FINISH -
        windowElement.clientWidth;

    cameraX =
        Math.max(
            0,
            Math.min(
                cameraX,
                maximum
            )
        );

    setCamera(cameraX);
}

// ============================================
// SET CAMERA
// ============================================

function setCamera(
    cameraX
) {

    const track =
        document.getElementById(
            "track"
        );

    if (!track) {
        return;
    }

    track.style.transform =
        "translate3d(" +
        (-cameraX) +
        "px, 0, 0)";
}

// ============================================
// STATUS
// ============================================

let statusTimer = null;

function showStatus(
    text
) {

    const status =
        document.getElementById(
            "status"
        );

    if (!status) {
        return;
    }

    status.textContent =
        text;

    clearTimeout(
        statusTimer
    );

    statusTimer =
        setTimeout(
            function() {

                if (raceRunning) {

                    status.textContent =
                        "🏃 KEEP RUNNING!!!";
                }

            },
            700
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

    document
        .querySelectorAll(".goose")
        .forEach(
            function(goose) {

                goose.classList.remove(
                    "running"
                );
            }
        );

    const ranking =
        positions
            .map(
                function(
                    position,
                    index
                ) {

                    return {
                        index:
                            index,

                        position:
                            position
                    };
                }
            )
            .sort(
                function(a, b) {

                    return b.position -
                        a.position;
                }
            );

    const playerPlace =
        ranking.findIndex(
            function(entry) {

                return entry.index === 0;
            }
        ) + 1;

    let result;

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
        document.getElementById(
            "status"
        );

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

    raceRunning = false;

    if (raceTimer) {

        clearInterval(
            raceTimer
        );

        raceTimer = null;
    }
}

// ============================================
// STARTUP
// ============================================

resetRace();
