let gooseRaceRunning = false;
let gooseRaceTimer = null;

function startRace() {

    if (gooseRaceRunning) {
        return;
    }

    gooseRaceRunning = true;

    const button =
        document.getElementById("startButton");

    const status =
        document.getElementById("status");

    if (button) {
        button.disabled = true;
    }

    if (status) {
        status.textContent =
            "🏁 3... 2... 1... GOOOOOOOOSE!!!";
    }

    const geese = [
        document.getElementById("goose1"),
        document.getElementById("goose2"),
        document.getElementById("goose3")
    ];

    geese.forEach(function(goose) {

        if (goose) {
            goose.classList.add("running");
            goose.style.left = "10px";
        }

    });

    let positions = [10, 10, 10];

    gooseRaceTimer = setInterval(function() {

        for (
            let i = 0;
            i < positions.length;
            i++
        ) {

            // Each goose gets a slightly different speed.
            const speed =
                2 +
                Math.random() * 6;

            positions[i] += speed;

        }

        moveGoose("goose1", positions[0]);
        moveGoose("goose2", positions[1]);
        moveGoose("goose3", positions[2]);

        if (
            positions[0] >= 85 ||
            positions[1] >= 85 ||
            positions[2] >= 85
        ) {

            finishRace(positions);

        }

    }, 100);
}

function moveGoose(id, position) {

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
        (position / 85) *
        (maxX - 10);

    goose.style.left =
        Math.min(maxX, newX) + "px";
}

function finishRace(positions) {

    clearInterval(gooseRaceTimer);
    gooseRaceTimer = null;
    gooseRaceRunning = false;

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
        positions
            .map(function(position, index) {
                return {
                    index: index,
                    position: position
                };
            })
            .sort(function(a, b) {
                return b.position - a.position;
            });

    const winner =
        ranking[0].index;

    const second =
        ranking[1].index;

    const third =
        ranking[2].index;

    let result = "";

    if (winner === 0) {
        result = "🥇 GOOSEY 1 WINS!!!";
    } else if (winner === 1) {
        result = "🥇 GOOSEY 2 WINS!!!";
    } else {
        result = "🥇 GOOSEY 3 WINS!!!";
    }

    result +=
        " 🥈 Goose " +
        (second + 1) +
        " | 🥉 Goose " +
        (third + 1);

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
