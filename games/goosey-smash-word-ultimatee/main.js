kaplay({
    width: 800,
    height: 450,
    background: [135, 206, 235],

    root: document.getElementById("game"),
});
setGravity(1800);
// ==================================================
// LOAD SPRITES
// ==================================================

loadSprite("AnGy-CaT", "assets/sprites/AnGy-CaT.png");
loadSprite("Angy-Cap", "assets/sprites/Angy-Cap.png");
loadSprite("G", "assets/sprites/G.png");
loadSprite("Penguy", "assets/sprites/Penguy.png");
loadSprite("hero", "assets/sprites/hero.png", {
    sliceX: 6,
    sliceY: 1,

    anims: {
        idle: {
            from: 0,
            to: 3,
            loop: true,
            speed: 12,
        },
    },
});

loadSprite("Greg", "assets/sprites/Greg.png");

loadSprite("P1", "assets/sprites/P1.png", {
    sliceX: 4,
    sliceY: 1,

    anims: {
        idle: {
            from: 0,
            to: 1,
            loop: true,
            speed: 8,
        },
    },
});
loadSprite("mark", "assets/sprites/mark.png");
loadSprite("Chat", "assets/sprites/chat.png");
// ==================================================
// CONSTANTS
// ==================================================

let SPEED = 300;
let GOOSEY_SPEED = 350;
let PENGUY_SPEED = 300;
const PENGUY_SLIDE_FRICTION = 0.97;
const PENGUY_KNOCKBACK_FRICTION = 0.985;

// 💥 NORMAL KNOCKBACK
const KNOCKBACK_FRICTION = 0.90;
const KNOCKBACK_STOP = 20;
// RED
let RED_SPEED = 225;
const RED_PUNCH_DAMAGE = 15;
const RED_PUNCH_KNOCKBACK = 750;
const RED_UPPERCUT_DAMAGE = 20;
const RED_UPPERCUT_KNOCKBACK = 500;

// BLUE
let BLUE_SPEED = 500;
const BLUE_PUNCH_DAMAGE = 7;
const BLUE_PUNCH_KNOCKBACK = 350;
const BLUE_UPPERCUT_DAMAGE = 12;
const BLUE_UPPERCUT_KNOCKBACK = 250;

const JUMP_FORCE = 700;

const START_DAMAGE = 0;
const START_STOCKS = 3;

// Greg
const GREG_PUNCH_KNOCKBACK = 650;
const GREG_UPPERCUT_KNOCKBACK = 450;
const GREG_ATTACK_COOLDOWN = 0.45;

// Goosey
const GOOSEY_PUNCH_KNOCKBACK = 600;
const GOOSEY_UPPERCUT_KNOCKBACK = 400;

// AnGy-CaT
const CAT_MOD_TIME = 5;
const CAT_NORMAL_SCALE = 0.5;
const CAT_MOD_SCALE = 0.25;

// Angy Cap
const ANGY_CAP_DAMAGE = 10;
const ANGY_CAP_KNOCKBACK = 1800;
// ==================================================
// 🗺️ MAPS
// ==================================================

const MAP_GRASSLAND = 0;
const MAP_PARKOUR = 1;
const MAP_PARKOUR_NIGHTMARE = 2;
const MAP_GRAVITY_CHAOS = 3;
const MAP_PARKOUR_GRAVITY = 4;
// 🙂 MARK DIMENSION WORLD
let markWorldActive = false;
let timeScale = 1;
let markIceWorld = false;
// 🧊 ICE WORLD
const ICE_ACCELERATION = 900;
const ICE_MAX_SPEED = 600;
const ICE_FRICTION = 0.98;
// ==================================================
// 🪿 GOOSEY PERSISTENT POWERS
// ==================================================

let gooseyPowersP1 = [];
let gooseyPowersP2 = [];
// ==================================================
// 🎬 TITLE SCREEN
// ==================================================

scene("title", () => {

    // ==================================================
    // 🌌 BACKGROUND
    // ==================================================

    add([
        rect(800, 450),
        pos(0, 0),
        color(70, 120, 190),
        z(0),
    ]);

    // ==================================================
    // ⭐ STARS
    // ==================================================

    for (let i = 0; i < 80; i++) {

        add([
            circle(
                Math.random() * 3 + 1
            ),
            pos(
                Math.random() * 800,
                Math.random() * 450
            ),
            color(255, 255, 255),
            opacity(
                Math.random() * 0.8 + 0.2
            ),
            z(1),
        ]);
    }

    // ==================================================
    // 💥 TITLE
    // ==================================================

    const title1 = add([
        text("GOOSEY SMASH"),
        pos(400, 65),
        anchor("center"),
        scale(2),
        color(255, 255, 255),
        z(100),
    ]);

    const title2 = add([
        text("WORLD ULTIMATE"),
        pos(400, 125),
        anchor("center"),
        scale(1.5),
        color(255, 220, 0),
        z(100),
    ]);

    add([
        text("THIS IS PROBABLY A BAD IDEA"),
        pos(400, 165),
        anchor("center"),
        scale(0.65),
        z(100),
    ]);

    // ==================================================
    // 🌀 SPECIAL ANIMATION SYSTEM
    // ==================================================

    const specialNames = [
        "GOOSEY",
        "GHOSTY",
        "GREG",
        "PENGUY",
        "ANGYCAT",
        "ANGYCAP",
        "CHAT",
        "MARK",
    ];

    let currentSpecial = null;
    let specialTimer = 0;

    const specialObjects = [];

    // ==================================================
    // 🪿 FLYING CHARACTERS
    // ==================================================

    const flyingCharacters = [];

    function addFlyingCharacter(
        spriteName,
        x,
        y,
        scaleAmount,
        spinSpeed,
        flipSpeed,
        zLayer
    ) {

        const fighter = add([
            sprite(spriteName),
            pos(x, y),
            scale(scaleAmount),
            anchor("center"),
            z(zLayer),

            {
                baseScale: scaleAmount,

                vx:
                    (
                        Math.random() * 160 +
                        70
                    ) *
                    (
                        Math.random() < 0.5
                            ? -1
                            : 1
                    ),

                vy:
                    (
                        Math.random() * 140 +
                        60
                    ) *
                    (
                        Math.random() < 0.5
                            ? -1
                            : 1
                    ),

                spinSpeed: spinSpeed,
                flipSpeed: flipSpeed,

                directionTimer: 0,
            },
        ]);

        flyingCharacters.push(
            fighter
        );

        return fighter;
    }

    // ==================================================
    // 👻 GHOSTY
    // ==================================================

    addFlyingCharacter(
        "G",
        680,
        230,
        6,
        -220,
        4,
        10
    );

    // ==================================================
    // 🥊 GREG
    // ==================================================

    addFlyingCharacter(
        "Greg",
        230,
        330,
        3.2,
        300,
        6,
        10
    );

    // ==================================================
    // 🐧 PENGUY
    // ==================================================

    addFlyingCharacter(
        "Penguy",
        580,
        340,
        0.35,
        -340,
        7,
        10
    );

    // ==================================================
    // 🐱 ANGY-CAT
    // ==================================================

    addFlyingCharacter(
        "AnGy-CaT",
        90,
        390,
        0.8,
        280,
        5,
        10
    );

    // ==================================================
    // 😡 ANGY CAP
    // ==================================================

    addFlyingCharacter(
        "Angy-Cap",
        710,
        390,
        0.55,
        -300,
        6,
        10
    );

    // ==================================================
    // 🙂 MARK
    // ==================================================

    addFlyingCharacter(
        "mark",
        310,
        210,
        1.2,
        420,
        4,
        10
    );

    // ==================================================
    // 💬 CHAT
    // ==================================================

    const chatFighter =
        addFlyingCharacter(
            "Chat",
            500,
            210,
            0.02,
            -500,
            8,
            10
        );

    chatFighter.chatZoomTime = 0;

    // ==================================================
    // 🪿 GOOSEY
    // TOP CHARACTER LAYER
    // ==================================================

    const gooseyFighter =
        addFlyingCharacter(
            "hero",
            120,
            240,
            3.5,
            260,
            5,
            40
        );

    // ==================================================
    // 🧹 CLEAR SPECIAL
    // ==================================================

    function clearSpecialAnimation() {

        for (
            const object of
            specialObjects
        ) {

            if (
                object &&
                object.exists()
            ) {

                destroy(object);
            }
        }

        specialObjects.length = 0;
    }

    // ==================================================
    // 🎬 START SPECIAL
    // ==================================================

    function startSpecialAnimation() {

        clearSpecialAnimation();

        let nextSpecial;

        do {

            nextSpecial =
                Math.floor(
                    Math.random() *
                    specialNames.length
                );

        } while (
            specialNames[nextSpecial] ===
            currentSpecial
        );

        currentSpecial =
            specialNames[nextSpecial];

        specialTimer = 0;

        // ==================================================
        // 🪿 GOOSEY HACKER
        // ==================================================

        if (
            currentSpecial ===
            "GOOSEY"
        ) {

            specialObjects.push(
                add([
                    text(
                        "GOOSEY HACK MODE"
                    ),
                    pos(400, 205),
                    anchor("center"),
                    scale(1.2),
                    color(
                        70,
                        255,
                        100
                    ),
                    z(45),
                ])
            );

            const codeLines = [
                "0101010101",
                "GOOSEY.exe",
                "hack();",
                "CHAOS",
                "SPECIAL.exe",
                "RANDOM POWER",
                "SYSTEM OVERRIDE",
                "if (smash)",
                "GOOSEY!",
                "while(true)",
                "COPY POWER",
                "ACCESS GRANTED",
                "GOOSEY_SMASH",
                "player.damage += 100;",
            ];

            for (
                let i = 0;
                i < 50;
                i++
            ) {

                specialObjects.push(
                    add([
                        text(
                            codeLines[
                                Math.floor(
                                    Math.random() *
                                    codeLines.length
                                )
                            ]
                        ),
                        pos(
                            Math.random() * 760 + 20,
                            Math.random() * 230 + 175
                        ),
                        scale(
                            Math.random() * 0.35 +
                            0.3
                        ),
                        color(
                            70,
                            255,
                            100
                        ),
                        opacity(
                            Math.random() * 0.5 +
                            0.35
                        ),
                        z(42),

                        {
                            pulse:
                                Math.random() * 10,
                            drift:
                                Math.random() * 20 - 10,
                        },
                    ])
                );
            }
        }

        // ==================================================
        // 👻 GHOSTY
        // ==================================================

        else if (
            currentSpecial ===
            "GHOSTY"
        ) {

            const ghost = add([
                sprite("G"),
                pos(400, 255),
                anchor("center"),
                scale(12),
                opacity(0),
                z(35),

                {
                    ghostTime: 0,
                },
            ]);

            specialObjects.push(
                ghost
            );
        }

        // ==================================================
        // 🥊 GREG
        // ==================================================

        else if (
            currentSpecial ===
            "GREG"
        ) {

            // LEFT ARM
            const leftArm = add([
                rect(600, 45),
                pos(150, 235),
                color(
                    255,
                    210,
                    160
                ),
                opacity(1),
                anchor("center"),
                z(35),

                {
                    armSpeed: 500,
                },
            ]);

            // RIGHT ARM
            const rightArm = add([
                rect(600, 45),
                pos(650, 305),
                color(
                    255,
                    210,
                    160
                ),
                opacity(1),
                anchor("center"),
                z(35),

                {
                    armSpeed: -500,
                },
            ]);

            // HANDS
            const leftHand = add([
                circle(38),
                pos(
                    450,
                    235
                ),
                color(
                    255,
                    210,
                    160
                ),
                anchor("center"),
                z(36),

                {
                    handSpeed: 500,
                },
            ]);

            const rightHand = add([
                circle(38),
                pos(
                    350,
                    305
                ),
                color(
                    255,
                    210,
                    160
                ),
                anchor("center"),
                z(36),

                {
                    handSpeed: -500,
                },
            ]);

            specialObjects.push(
                leftArm,
                rightArm,
                leftHand,
                rightHand
            );
        }

        // ==================================================
        // 🐧 PENGUY
        // ==================================================

        else if (
            currentSpecial ===
            "PENGUY"
        ) {

            specialObjects.push(
                add([
                    rect(800, 450),
                    pos(0, 0),
                    color(
                        180,
                        240,
                        255
                    ),
                    opacity(0.5),
                    z(4),
                ])
            );

            for (
                let i = 0;
                i < 35;
                i++
            ) {

                specialObjects.push(
                    add([
                        text("❄"),
                        pos(
                            Math.random() * 800,
                            Math.random() * 450
                        ),
                        scale(
                            Math.random() *
                            1.2 +
                            0.4
                        ),
                        opacity(0.8),
                        z(25),
                    ])
                );
            }
        }

        // ==================================================
        // 🐱 CAT MOD
        // ==================================================

        else if (
            currentSpecial ===
            "ANGYCAT"
        ) {

            for (
                let i = 0;
                i < 25;
                i++
            ) {

                specialObjects.push(
                    add([
                        sprite(
                            "AnGy-CaT"
                        ),
                        pos(
                            Math.random() * 800,
                            Math.random() * 450
                        ),
                        scale(
                            Math.random() *
                            0.55 +
                            0.25
                        ),
                        anchor("center"),
                        z(30),

                        {
                            spin:
                                Math.random() * 5,
                        },
                    ])
                );
            }
        }

        // ==================================================
        // 😡 ANGY CAP
        // ==================================================

        else if (
            currentSpecial ===
            "ANGYCAP"
        ) {

            for (
                let i = 0;
                i < 35;
                i++
            ) {

                specialObjects.push(
                    add([
                        text(":3"),
                        pos(
                            Math.random() * 800,
                            Math.random() * 450
                        ),
                        scale(
                            Math.random() * 1 +
                            0.5
                        ),
                        anchor("center"),
                        z(30),
                    ])
                );
            }
        }

        // ==================================================
        // 💬 CHAT
        // ==================================================

        else if (
            currentSpecial ===
            "CHAT"
        ) {

            specialObjects.push(
                add([
                    text(
                        "CHAT CHAOS!!!"
                    ),
                    pos(400, 205),
                    anchor("center"),
                    scale(1.4),
                    z(35),
                ])
            );

            for (
                let i = 0;
                i < 35;
                i++
            ) {

                const moves = [
                    "🔥",
                    "⚡",
                    "🧲",
                    "🧊",
                    "🪨",
                    "❄",
                    "💥",
                ];

                specialObjects.push(
                    add([
                        text(
                            moves[
                                Math.floor(
                                    Math.random() *
                                    moves.length
                                )
                            ]
                        ),
                        pos(
                            Math.random() * 800,
                            Math.random() * 450
                        ),
                        scale(
                            Math.random() * 1 +
                            0.5
                        ),
                        z(30),
                    ])
                );
            }
        }
// ==================================================
// 🙂 MARK DIMENSION
// ==================================================

else if (
    currentSpecial ===
    "MARK"
) {

    // 🌑 VERY DARK DIMENSION BACKGROUND
    specialObjects.push(
        add([
            rect(800, 450),
            pos(0, 0),
            color(
                5,
                0,
                15
            ),
            opacity(0.85),
            z(2),
        ])
    );

    // 🌀 PORTAL RINGS
    for (
        let i = 0;
        i < 8;
        i++
    ) {

        specialObjects.push(
            add([
                circle(20),
                pos(400, 255),
                color(
                    150,
                    0,
                    255
                ),
                opacity(0.8),
                anchor("center"),
                z(4),

                {
                    ringTime:
                        i * 0.25,
                },
            ])
        );
    }
}
    }
    startSpecialAnimation();

    // ==================================================
    // 🌀 MAIN UPDATE
    // ==================================================

    onUpdate(() => {

        // ==================================================
        // 🪿 CHARACTER MOVEMENT
        // ==================================================

        for (
            const fighter of
            flyingCharacters
        ) {

            fighter.pos.x +=
                fighter.vx *
                dt();

            fighter.pos.y +=
                fighter.vy *
                dt();

            fighter.directionTimer +=
                dt();

            if (
                fighter.directionTimer >
                1.5 +
                Math.random() * 1.5
            ) {

                fighter.directionTimer = 0;

                fighter.vx =
                    (
                        Math.random() * 160 +
                        70
                    ) *
                    (
                        Math.random() < 0.5
                            ? -1
                            : 1
                    );

                fighter.vy =
                    (
                        Math.random() * 140 +
                        60
                    ) *
                    (
                        Math.random() < 0.5
                            ? -1
                            : 1
                    );
            }

            if (
                fighter.pos.x < 45
            ) {

                fighter.pos.x = 45;

                fighter.vx =
                    Math.abs(
                        fighter.vx
                    );
            }

            if (
                fighter.pos.x > 755
            ) {

                fighter.pos.x = 755;

                fighter.vx =
                    -Math.abs(
                        fighter.vx
                    );
            }

            if (
                fighter.pos.y < 190
            ) {

                fighter.pos.y = 190;

                fighter.vy =
                    Math.abs(
                        fighter.vy
                    );
            }

            if (
                fighter.pos.y > 390
            ) {

                fighter.pos.y = 390;

                fighter.vy =
                    -Math.abs(
                        fighter.vy
                    );
            }

            fighter.angle +=
                fighter.spinSpeed *
                dt();

            const flip =
                Math.sin(
                    time() *
                    fighter.flipSpeed
                );

            fighter.scaleTo(
                vec2(
                    fighter.baseScale *
                    (
                        flip * 0.8 +
                        1
                    ),
                    fighter.baseScale
                )
            );

            // CHAT ZOOM
            if (
                fighter ===
                chatFighter
            ) {

                chatFighter.chatZoomTime +=
                    dt();

                const zoom =
                    0.02 +
                    (
                        (
                            Math.sin(
                                chatFighter.chatZoomTime *
                                2
                            ) + 1
                        ) / 2
                    ) * 0.25;

                fighter.scaleTo(
                    vec2(
                        zoom,
                        zoom
                    )
                );
            }
        }

        // ==================================================
        // 🎢 TITLE BOUNCE
        // ==================================================

        title1.pos.y =
            65 +
            Math.sin(
                time() * 3
            ) * 5;

        title2.pos.y =
            125 +
            Math.sin(
                time() * 3
            ) * 5;

        // ==================================================
        // ⏱️ SPECIAL TIMER
        // ==================================================

        specialTimer +=
            dt();

        if (
            specialTimer >=
            7
        ) {

            startSpecialAnimation();
        }

        // ==================================================
        // 🪿 GOOSEY HACKER
        // ==================================================

        if (
            currentSpecial ===
            "GOOSEY"
        ) {

            for (
                const code of
                specialObjects
            ) {

                if (
                    code &&
                    code.exists() &&
                    code.pulse !==
                    undefined
                ) {

                    code.pulse +=
                        dt();

                    code.pos.x +=
                        code.drift *
                        dt();

                    code.pos.y +=
                        12 *
                        dt();

                    if (
                        code.pos.y >
                        445
                    ) {

                        code.pos.y =
                            175;
                    }

                    code.opacity =
                        0.3 +
                        (
                            (
                                Math.sin(
                                    code.pulse * 5
                                ) + 1
                            ) / 2
                        ) * 0.6;
                }
            }
        }

        // ==================================================
        // 👻 GHOSTY
        // ==================================================

        if (
            currentSpecial ===
            "GHOSTY"
        ) {

            const ghost =
                specialObjects[0];

            if (
                ghost &&
                ghost.exists()
            ) {

                ghost.ghostTime +=
                    dt();

                ghost.opacity =
                    (
                        Math.sin(
                            ghost.ghostTime * 2
                        ) + 1
                    ) / 2;
            }
        }

        // ==================================================
        // 🥊 GREG — GUARANTEED VISIBLE
        // ==================================================

        if (
            currentSpecial ===
            "GREG"
        ) {

            const leftArm =
                specialObjects[0];

            const rightArm =
                specialObjects[1];

            const leftHand =
                specialObjects[2];

            const rightHand =
                specialObjects[3];

            // LEFT GROUP
            if (
                leftArm &&
                leftArm.exists()
            ) {

                leftArm.pos.x +=
                    leftArm.armSpeed *
                    dt();

                if (
                    leftArm.pos.x >
                    900
                ) {

                    leftArm.pos.x =
                        -300;
                }
            }

            if (
                leftHand &&
                leftHand.exists()
            ) {

                leftHand.pos.x +=
                    leftHand.handSpeed *
                    dt();

                if (
                    leftHand.pos.x >
                    1200
                ) {

                    leftHand.pos.x =
                        -300;
                }
            }

            // RIGHT GROUP
            if (
                rightArm &&
                rightArm.exists()
            ) {

                rightArm.pos.x +=
                    rightArm.armSpeed *
                    dt();

                if (
                    rightArm.pos.x <
                    -100
                ) {

                    rightArm.pos.x =
                        900;
                }
            }

            if (
                rightHand &&
                rightHand.exists()
            ) {

                rightHand.pos.x +=
                    rightHand.handSpeed *
                    dt();

                if (
                    rightHand.pos.x <
                    -200
                ) {

                    rightHand.pos.x =
                        1000;
                }
            }
        }

        // ==================================================
        // 🐱 CAT MOD
        // ==================================================

        if (
            currentSpecial ===
            "ANGYCAT"
        ) {

            for (
                const cat of
                specialObjects
            ) {

                if (
                    cat &&
                    cat.exists() &&
                    cat.spin !==
                    undefined
                ) {

                    cat.angle +=
                        cat.spin *
                        dt();
                }
            }
        }

        // ==================================================
        // 😡 ANGY CAP
        // ==================================================

        if (
            currentSpecial ===
            "ANGYCAP"
        ) {

            for (
                const face of
                specialObjects
            ) {

                if (
                    face &&
                    face.exists()
                ) {

                    face.angle =
                        Math.sin(
                            time() * 4
                        ) * 30;
                }
            }
        }

        // ==================================================
        // 💬 CHAT
        // ==================================================

        if (
            currentSpecial ===
            "CHAT"
        ) {

            for (
                const object of
                specialObjects
            ) {

                if (
                    object &&
                    object.exists()
                ) {

                    object.angle +=
                        120 *
                        dt();
                }
            }
        }

        // ==================================================
        // 🙂 MARK PORTAL
        // ==================================================

        if (
            currentSpecial ===
            "MARK"
        ) {

            for (
                const ring of
                specialObjects
            ) {

                if (
                    ring &&
                    ring.exists() &&
                    ring.ringTime !==
                    undefined
                ) {

                    ring.ringTime +=
                        dt();

                    ring.radius =
                        20 +
                        (
                            ring.ringTime *
                            180
                        ) % 500;

                    ring.opacity =
                        0.75;
                }
            }
        }

        // ==================================================
        // 🪿 KEEP GOOSEY ON TOP
        // ==================================================

        if (
            gooseyFighter &&
            gooseyFighter.exists()
        ) {

            gooseyFighter.z =
                40;
        }
    });

    // ==================================================
    // 🎮 START TEXT
    // ==================================================

    const startText = add([
        text(
            "PRESS ENTER TO SMASH"
        ),
        pos(400, 405),
        anchor("center"),
        scale(0.9),
        z(100),
    ]);

    onUpdate(() => {

        startText.scaleTo(
            0.9 +
            Math.sin(
                time() * 5
            ) * 0.08
        );
    });

    // ==================================================
    // ENTER
    // ==================================================

    onKeyPress("enter", () => {

        go("playerSelect");
    });
});
// ==================================================
// 🎮 PLAYER SCENE
// ==================================================

scene("playerSelect", () => {

    // ==================================================
    // 🌌 BACKGROUND
    // ==================================================

    add([
        rect(800, 450),
        pos(0, 0),
        color(70, 120, 190),
    ]);

    // ==================================================
    // ⭐ STARS
    // ==================================================

    for (let i = 0; i < 60; i++) {

        add([
            circle(
                Math.random() * 3 + 1
            ),
            pos(
                Math.random() * 800,
                Math.random() * 450
            ),
            color(255, 255, 255),
            opacity(
                Math.random() * 0.7 + 0.2
            ),
        ]);
    }

    // ==================================================
    // 💥 TITLE
    // ==================================================

    add([
        text("GOOSEY SMASH"),
        pos(400, 60),
        anchor("center"),
        scale(2),
        color(255, 255, 255),
        z(20),
    ]);

    add([
        text("WORLD ULTIMATE"),
        pos(400, 115),
        anchor("center"),
        scale(1.4),
        color(255, 220, 0),
        z(20),
    ]);

    add([
        text("HOW DO YOU WANT TO PLAY?"),
        pos(400, 170),
        anchor("center"),
        scale(0.85),
        z(20),
    ]);

    // ==================================================
    // 🧍 SINGLE PLAYER BOX
    // ==================================================

    add([
        rect(260, 120),
        pos(70, 230),
        color(40, 180, 80),
        z(5),
    ]);

    add([
        text("SINGLE PLAYER"),
        pos(200, 275),
        anchor("center"),
        scale(1.1),
        z(10),
    ]);

    add([
        text("FIGHT A CPU"),
        pos(200, 315),
        anchor("center"),
        scale(0.6),
        z(10),
    ]);

    // ==================================================
    // 👥 MULTIPLAYER BOX
    // ==================================================

    add([
        rect(260, 120),
        pos(470, 230),
        color(60, 110, 220),
        z(5),
    ]);

    add([
        text("MULTIPLAYER"),
        pos(600, 275),
        anchor("center"),
        scale(1.1),
        z(10),
    ]);

    add([
        text("P1 VS P2"),
        pos(600, 315),
        anchor("center"),
        scale(0.6),
        z(10),
    ]);

    // ==================================================
    // 🪿 SINGLE PLAYER CHARACTERS
    // ==================================================

    const goosey = add([
        sprite("hero", {
            anim: "idle",
        }),
        pos(90, 385),
        scale(1.3),
        anchor("center"),
        z(15),
    ]);

    const cpu = add([
        text("🤖"),
        pos(310, 385),
        anchor("center"),
        scale(1.6),
        z(15),
    ]);

    // ==================================================
    // 👥 MULTIPLAYER CHARACTERS
    // ==================================================

    const p1 = add([
        sprite("P1", {
            anim: "idle",
        }),
        pos(490, 385),
        scale(2),
        anchor("center"),
        z(15),
    ]);

    const p2 = add([
        sprite("P1", {
            anim: "idle",
        }),
        pos(710, 385),
        scale(2),
        anchor("center"),
        color(0, 255, 255),
        z(15),
    ]);

    // ==================================================
    // 🎯 POINTER CURSOR
    // ==================================================

    let choice = 0;

    const cursor = add([
        sprite("P1", {
            anim: "idle",
        }),
        pos(90, 220),
        scale(2),
        anchor("center"),
        z(30),
    ]);

    function updateCursor() {

        if (choice === 0) {

            cursor.pos =
                vec2(90, 220);

        } else {

            cursor.pos =
                vec2(490, 220);
        }
    }

    updateCursor();

    // ==================================================
    // ◀️ LEFT
    // ==================================================

    onKeyPress("left", () => {

        choice = 0;

        updateCursor();
    });

    // ==================================================
    // ▶️ RIGHT
    // ==================================================

    onKeyPress("right", () => {

        choice = 1;

        updateCursor();
    });

    // ==================================================
    // 🪿 / 🤖 ANIMATION
    // ==================================================

    onUpdate(() => {

        goosey.angle =
            Math.sin(
                time() * 4
            ) * 15;

        goosey.pos.y =
            385 +
            Math.sin(
                time() * 5
            ) * 8;

        cpu.angle =
            Math.sin(
                time() * 5
            ) * 12;

        cpu.pos.y =
            385 +
            Math.sin(
                time() * 6
            ) * 8;

        p1.angle =
            Math.sin(
                time() * 4
            ) * 10;

        p2.angle =
            Math.sin(
                time() * 4 + 1
            ) * 10;
    });
// ==================================================
// ✅ ENTER
// ==================================================

onKeyPress("enter", () => {

    if (choice === 0) {

        // SINGLE PLAYER
        window.singlePlayerMode = true;

        go("cpuSelect");

    } else {

        // MULTIPLAYER
        window.singlePlayerMode = false;

        go("characterSelect");
    }
});
    // ==================================================
    // 📝 INSTRUCTIONS
    // ==================================================

    add([
        text(
            "LEFT / RIGHT = CHOOSE     ENTER = SELECT"
        ),
        pos(400, 425),
        anchor("center"),
        scale(0.55),
        z(20),
    ]);
});
// ==================================================
// 🤖 CPU LEVEL SELECT
// ==================================================

scene("cpuSelect", () => {

    // ==================================================
    // 🌌 BACKGROUND
    // ==================================================

    add([
        rect(800, 450),
        pos(0, 0),
        color(50, 80, 150),
    ]);

    // ==================================================
    // ⭐ STARS
    // ==================================================

    for (let i = 0; i < 60; i++) {

        add([
            circle(
                Math.random() * 3 + 1
            ),
            pos(
                Math.random() * 800,
                Math.random() * 450
            ),
            color(255, 255, 255),
            opacity(
                Math.random() * 0.7 + 0.2
            ),
        ]);
    }

    // ==================================================
    // 🤖 TITLE
    // ==================================================

    add([
        text("CHOOSE CPU LEVEL"),
        pos(400, 65),
        anchor("center"),
        scale(1.8),
        color(255, 255, 255),
        z(20),
    ]);

    add([
        text("HOW SMART SHOULD THE BOT BE?"),
        pos(400, 115),
        anchor("center"),
        scale(0.65),
        color(255, 220, 0),
        z(20),
    ]);

    // ==================================================
    // 🟢 EASY
    // ==================================================

    add([
        rect(280, 60),
        pos(260, 145),
        color(60, 200, 90),
        z(5),
    ]);

    add([
        text("EASY"),
        pos(400, 175),
        anchor("center"),
        scale(1.1),
        z(10),
    ]);

    // ==================================================
    // 🟡 MEDIUM
    // ==================================================

    add([
        rect(280, 60),
        pos(260, 225),
        color(220, 190, 40),
        z(5),
    ]);

    add([
        text("MEDIUM"),
        pos(400, 255),
        anchor("center"),
        scale(1.1),
        z(10),
    ]);

    // ==================================================
    // 🔴 HARD
    // ==================================================

    add([
        rect(280, 60),
        pos(260, 305),
        color(210, 70, 70),
        z(5),
    ]);

    add([
        text("HARD"),
        pos(400, 335),
        anchor("center"),
        scale(1.1),
        z(10),
    ]);

    // ==================================================
    // 📝 DESCRIPTIONS
    // ==================================================

    add([
        text("Random movement + basic attacks"),
        pos(400, 200),
        anchor("center"),
        scale(0.45),
        z(10),
    ]);

    add([
        text("Understands the fight + uses specials"),
        pos(400, 280),
        anchor("center"),
        scale(0.45),
        z(10),
    ]);

    add([
        text("Advanced game logic"),
        pos(400, 360),
        anchor("center"),
        scale(0.45),
        z(10),
    ]);

    // ==================================================
    // 🎯 POINTER SPRITE
    // ==================================================

    let difficulty = 0;

    const selector = add([
        sprite("P1", {
            anim: "idle",
        }),
        pos(205, 175),
        anchor("center"),
        scale(1.7),
        z(30),
    ]);

    function updateSelector() {

        if (difficulty === 0) {

            selector.pos =
                vec2(205, 175);

        } else if (difficulty === 1) {

            selector.pos =
                vec2(205, 255);

        } else {

            selector.pos =
                vec2(205, 335);
        }
    }

    updateSelector();

    // ==================================================
    // ⬆️ UP
    // ==================================================

    onKeyPress("up", () => {

        difficulty--;

        if (difficulty < 0) {
            difficulty = 2;
        }

        updateSelector();
    });

    // ==================================================
    // ⬇️ DOWN
    // ==================================================

    onKeyPress("down", () => {

        difficulty++;

        if (difficulty > 2) {
            difficulty = 0;
        }

        updateSelector();
    });

    // ==================================================
    // ✅ ENTER
    // ==================================================

    onKeyPress("enter", () => {

        if (difficulty === 0) {

            window.cpuDifficulty =
                "EASY";

        } else if (difficulty === 1) {

            window.cpuDifficulty =
                "MEDIUM";

        } else {

            window.cpuDifficulty =
                "HARD";
        }

        go("characterSelect");
    });

    // ==================================================
    // 🤖 FUN CPU ANIMATION
    // ==================================================

    onUpdate(() => {

        selector.angle =
            Math.sin(
                time() * 5
            ) * 10;
    });

    // ==================================================
    // 📝 CONTROLS
    // ==================================================

    add([
        text(
            "UP / DOWN = CHOOSE     ENTER = SELECT"
        ),
        pos(400, 420),
        anchor("center"),
        scale(0.55),
        z(20),
    ]);
});
// ==================================================
// 🎮 CHARACTER SELECT
// ==================================================

scene("characterSelect", () => {

    // Reset gravity whenever we enter character select.
    // This prevents Mark's Void World from carrying over.
    setGravity(1800);

    // ==================================================
    // 🎮 PLAYER DATA
    // ==================================================

    let player1Category = 0;
    let player2Category = 1;

    let player1Special = 0;
    let player2Special = 0;

    let player1Ready = false;
    let player2Ready = false;

    const categories = [
        "RED",
        "BLUE",
        "SPECIAL",
    ];

    const specialCharacters = [
        "GOOSEY",
        "GHOSTY",
        "GREG",
        "ANGY-CAT",
        "ANGY-CAP",
        "PENGUY",
        "mark",
        "CHAT",
    ];

    // ==================================================
    // 🤖 CPU MODE?
    // ==================================================

    const singlePlayer =
        window.singlePlayerMode === true;

    // ==================================================
    // 📝 TITLE
    // ==================================================

    add([
        text("CHOOSE YOUR FIGHTER"),
        pos(400, 35),
        anchor("center"),
        scale(1.5),
    ]);

    // ==================================================
    // 🔴 RED
    // ==================================================

    add([
        rect(100, 100),
        pos(100, 130),
        color(255, 0, 0),
    ]);

    add([
        text("RED"),
        pos(150, 250),
        anchor("center"),
    ]);

    // ==================================================
    // 🔵 BLUE
    // ==================================================

    add([
        rect(100, 100),
        pos(350, 130),
        color(0, 0, 255),
    ]);

    add([
        text("BLUE"),
        pos(400, 250),
        anchor("center"),
    ]);

    // ==================================================
    // 🟡 SPECIAL
    // ==================================================

    add([
        rect(100, 100),
        pos(600, 130),
        color(255, 200, 0),
    ]);

    add([
        text("SPECIAL"),
        pos(650, 250),
        anchor("center"),
    ]);

    // ==================================================
    // 🎯 P1 POINTER
    // ==================================================

    const player1Cursor = add([
        sprite("P1", {
            anim: "idle",
        }),
        scale(3),
        pos(90, 145),
        anchor("center"),
        z(20),
    ]);

    // ==================================================
    // 🎯 P2 POINTER
    // ==================================================

    const player2Cursor = add([
        sprite("P1", {
            anim: "idle",
        }),
        scale(3),
        pos(90, 215),
        anchor("center"),
        z(20),
        color(0, 255, 255),
    ]);

    // In single-player mode, make P2 pointer look like CPU.
    if (singlePlayer) {

        player2Cursor.color =
            rgb(255, 80, 80);
    }

    // ==================================================
    // 🎯 CURSOR POSITIONS
    // ==================================================

    function updatePlayer1Cursor() {

        if (player1Category === 0) {

            player1Cursor.pos =
                vec2(90, 145);

        } else if (
            player1Category === 1
        ) {

            player1Cursor.pos =
                vec2(340, 145);

        } else {

            player1Cursor.pos =
                vec2(590, 145);
        }
    }

    function updatePlayer2Cursor() {

        if (player2Category === 0) {

            player2Cursor.pos =
                vec2(90, 215);

        } else if (
            player2Category === 1
        ) {

            player2Cursor.pos =
                vec2(340, 215);

        } else {

            player2Cursor.pos =
                vec2(590, 215);
        }
    }

    // ==================================================
    // 📝 PLAYER TEXT
    // ==================================================

    const player1Text = add([
        text(""),
        pos(200, 300),
        anchor("center"),
        scale(0.8),
    ]);

    const player2Text = add([
        text(""),
        pos(600, 300),
        anchor("center"),
        scale(0.8),
    ]);

    const player1SpecialText = add([
        text(""),
        pos(200, 350),
        anchor("center"),
        scale(0.8),
    ]);

    const player2SpecialText = add([
        text(""),
        pos(600, 350),
        anchor("center"),
        scale(0.8),
    ]);

    // ==================================================
    // 📝 UPDATE P1
    // ==================================================

    function updatePlayer1() {

        updatePlayer1Cursor();

        if (player1Ready) {

            player1Text.text =
                "PLAYER 1 READY!";

        } else {

            player1Text.text =
                "PLAYER 1: " +
                categories[
                    player1Category
                ];
        }

        if (
            player1Category === 2
        ) {

            player1SpecialText.text =
                "SPECIAL: " +
                specialCharacters[
                    player1Special
                ];

        } else {

            player1SpecialText.text =
                "";
        }
    }

    // ==================================================
    // 📝 UPDATE P2
    // ==================================================

    function updatePlayer2() {

        updatePlayer2Cursor();

        if (
            singlePlayer
        ) {

            player2Text.text =
                player2Ready
                    ? "CPU READY!"
                    : "CPU";

        } else if (
            player2Ready
        ) {

            player2Text.text =
                "PLAYER 2 READY!";

        } else {

            player2Text.text =
                "PLAYER 2: " +
                categories[
                    player2Category
                ];
        }

        if (
            player2Category === 2
        ) {

            player2SpecialText.text =
                "SPECIAL: " +
                specialCharacters[
                    player2Special
                ];

        } else {

            player2SpecialText.text =
                "";
        }
    }

    updatePlayer1();
    updatePlayer2();

    // ==================================================
    // ⬅️ P1 LEFT
    // ==================================================

    onKeyPress("left", () => {

        if (player1Ready) {
            return;
        }

        player1Category--;

        if (
            player1Category < 0
        ) {

            player1Category =
                2;
        }

        if (
            player1Category === 2
        ) {

            player1Special =
                Math.floor(
                    Math.random() *
                    specialCharacters.length
                );
        }

        updatePlayer1();
    });

    // ==================================================
    // ➡️ P1 RIGHT
    // ==================================================

    onKeyPress("right", () => {

        if (player1Ready) {
            return;
        }

        player1Category++;

        if (
            player1Category > 2
        ) {

            player1Category =
                0;
        }

        if (
            player1Category === 2
        ) {

            player1Special =
                Math.floor(
                    Math.random() *
                    specialCharacters.length
                );
        }

        updatePlayer1();
    });

    // ==================================================
    // ⬅️ P2 LEFT
    // ==================================================

    onKeyPress("a", () => {

        if (
            singlePlayer ||
            player2Ready
        ) {
            return;
        }

        player2Category--;

        if (
            player2Category < 0
        ) {

            player2Category =
                2;
        }

        if (
            player2Category === 2
        ) {

            player2Special =
                Math.floor(
                    Math.random() *
                    specialCharacters.length
                );
        }

        updatePlayer2();
    });

    // ==================================================
    // ➡️ P2 RIGHT
    // ==================================================

    onKeyPress("d", () => {

        if (
            singlePlayer ||
            player2Ready
        ) {
            return;
        }

        player2Category++;

        if (
            player2Category > 2
        ) {

            player2Category =
                0;
        }

        if (
            player2Category === 2
        ) {

            player2Special =
                Math.floor(
                    Math.random() *
                    specialCharacters.length
                );
        }

        updatePlayer2();
    });

    // ==================================================
    // 🤖 CPU RANDOM CHARACTER
    // ==================================================

    function chooseCPUCharacter() {

        // ----------------------------------------------
        // Randomly choose RED or BLUE
        // ----------------------------------------------

        const categoryChoice =
            Math.floor(
                Math.random() * 3
            );

        player2Category =
            categoryChoice;

        // ----------------------------------------------
        // If SPECIAL, randomly choose one
        // ----------------------------------------------

        if (
            player2Category === 2
        ) {

            player2Special =
                Math.floor(
                    Math.random() *
                    specialCharacters.length
                );
        }

        // ----------------------------------------------
        // Make sure CPU is not exactly
        // the same character as P1.
        // ----------------------------------------------

        let cpuName;

        if (
            player2Category === 0
        ) {

            cpuName = "RED";

        } else if (
            player2Category === 1
        ) {

            cpuName = "BLUE";

        } else {

            cpuName =
                specialCharacters[
                    player2Special
                ];
        }

        let player1Name;

        if (
            player1Category === 0
        ) {

            player1Name =
                "RED";

        } else if (
            player1Category === 1
        ) {

            player1Name =
                "BLUE";

        } else {

            player1Name =
                specialCharacters[
                    player1Special
                ];
        }

        // Try again if they match.
        while (
            cpuName === player1Name
        ) {

            player2Category =
                Math.floor(
                    Math.random() * 3
                );

            if (
                player2Category === 2
            ) {

                player2Special =
                    Math.floor(
                        Math.random() *
                        specialCharacters.length
                    );

                cpuName =
                    specialCharacters[
                        player2Special
                    ];

            } else if (
                player2Category === 0
            ) {

                cpuName =
                    "RED";

            } else {

                cpuName =
                    "BLUE";
            }
        }

        player2Ready = true;

        player2Cursor.color =
            rgb(255, 255, 0);

        updatePlayer2();
    }

    // ==================================================
    // ✅ P1 ENTER
    // ==================================================

    onKeyPress("enter", () => {

        if (player1Ready) {
            return;
        }

        player1Ready = true;

        player1Cursor.color =
            rgb(0, 255, 0);

        // ==============================================
        // 🤖 SINGLE PLAYER
        // ==============================================

        if (
            singlePlayer
        ) {

            chooseCPUCharacter();

            wait(0.5, () => {

                go("fight", {

                    player1Category:
                        player1Category,

                    player2Category:
                        player2Category,

                    player1Special:
                        player1Special,

                    player2Special:
                        player2Special,
                });
            });

            return;
        }

        updatePlayer1();
        checkReady();
    });

    // ==================================================
    // ✅ P2 ENTER — MULTIPLAYER
    // ==================================================

    window.addEventListener(
        "keydown",
        (event) => {

            if (
                event.code !==
                "ShiftLeft"
            ) {
                return;
            }

            if (
                singlePlayer ||
                player2Ready
            ) {
                return;
            }

            player2Ready = true;

            player2Cursor.color =
                rgb(0, 255, 0);

            updatePlayer2();

            checkReady();
        }
    );

    // ==================================================
    // ✅ READY CHECK
    // ==================================================

    function checkReady() {

        if (
            player1Ready &&
            player2Ready
        ) {

            wait(0.5, () => {

                go("fight", {

                    player1Category:
                        player1Category,

                    player2Category:
                        player2Category,

                    player1Special:
                        player1Special,

                    player2Special:
                        player2Special,
                });
            });
        }
    }
});
// ==================================================
// FIGHT
// ==================================================

scene("fight", (data) => {
        // 🎲 RANDOM MAP
    const currentMap =
        Math.floor(Math.random() * 5);
    let player;

    if (data.player1Category === 0) {

        player = add([
            rect(60, 60),
            pos(200, 200),
            color(255, 0, 0),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "RED",
            },

            "player",
        ]);

    } else if (data.player1Category === 1) {

        player = add([
            rect(60, 60),
            pos(200, 200),
            color(0, 0, 255),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "BLUE",
            },

            "player",
        ]);

    } else if (data.player1Special === 0) {

        player = add([
            sprite("hero", {
                anim: "idle",
            }),
            pos(200, 200),
            scale(3),
            area(),
            body(),
{
    facing: 1,
    facingUp: false,
    knockbackActive: false,
    knockbackX: 0,
    damage: START_DAMAGE,
    stocks: START_STOCKS,
    respawning: false,
    frozen: false,
    specialUsed: false,
    invincible: false,
    gregCooldown: false,
    catMod: false,

    gooseyPowers: gooseyPowersP1,

    hasCopiedPower: false,
    hasRedPower: gooseyPowersP1.includes(0),
    hasBluePower: gooseyPowersP1.includes(1),
    hasGhostyPower: gooseyPowersP1.includes(2),
    hasGregPower: gooseyPowersP1.includes(3),
    hasCatPower: gooseyPowersP1.includes(4),
    hasAngyCapPower: gooseyPowersP1.includes(5),
    hasPenguyPower: gooseyPowersP1.includes(6),
    hasMarkPower: gooseyPowersP1.includes(7),
    hasChatPower: gooseyPowersP1.includes(8),

    fighter: "GOOSEY",
},

            "player",
        ]);

    } else if (data.player1Special === 1) {

        player = add([
            sprite("G"),
            pos(200, 200),
            scale(5),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "GHOSTY",
            },

            "player",
        ]);

    } else if (data.player1Special === 2) {

        player = add([
            sprite("Greg"),
            pos(200, 200),
            scale(3),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "GREG",
            },

            "player",
        ]);

    } else if (data.player1Special === 3) {

        player = add([
            sprite("AnGy-CaT"),
            pos(200, 200),
            scale(CAT_NORMAL_SCALE),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "ANGY-CAT",
            },

            "player",
        ]);
        } else if (data.player1Special === 5) {

    player = add([
        sprite("Penguy"),
        pos(200, 200),
        scale(0.3),
        area(),
        body(),

        {
            facing: 1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
            invincible: false,
            gregCooldown: false,
            catMod: false,
            fighter: "PENGUY",
        },

        "player",
    ]);
    } else if (data.player1Special === 6) {

    player = add([
        sprite("mark"),
        pos(200, 200),
        scale(1.5),
        area(),
        body(),

        {
            facing: 1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
            invincible: false,
            gregCooldown: false,
            catMod: false,
            fighter: "MARK",
        },

        "player",
    ]);
    } else if (data.player1Special === 7) {

    player = add([
        sprite("Chat"),
        pos(200, 200),
        scale(0.07),
        area(),
        body(),

        {
            facing: 1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
invincible: false,
gregCooldown: false,
catMod: false,

// 🎲 CHAT RANDOMIZER
chatPower: null,

fighter: "CHAT",
        },

        "player",
    ]);
} else {
        player = add([
            sprite("Angy-Cap"),
            pos(200, 200),
            scale(0.5),
            area(),
            body(),

            {
                facing: 1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "ANGY-CAP",
            },

            "player",
        ]);
    }

    let player2;

    if (data.player2Category === 0) {

        player2 = add([
            rect(60, 60),
            pos(550, 200),
            color(255, 0, 0),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "RED",
            },

            "player2",
        ]);

    } else if (data.player2Category === 1) {

        player2 = add([
            rect(60, 60),
            pos(550, 200),
            color(0, 0, 255),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "BLUE",
            },

            "player2",
        ]);

    } else if (data.player2Special === 0) {

        player2 = add([
            sprite("hero", {
                anim: "idle",
            }),
            pos(550, 200),
            scale(3),
            area(),
            body(),
{
    facing: -1,
    facingUp: false,
    knockbackActive: false,
    knockbackX: 0,
    damage: START_DAMAGE,
    stocks: START_STOCKS,
    respawning: false,
    frozen: false,
    specialUsed: false,
    invincible: false,
    gregCooldown: false,
    catMod: false,

    gooseyPowers: gooseyPowersP2,

    hasCopiedPower: false,
    hasRedPower: gooseyPowersP2.includes(0),
    hasBluePower: gooseyPowersP2.includes(1),
    hasGhostyPower: gooseyPowersP2.includes(2),
    hasGregPower: gooseyPowersP2.includes(3),
    hasCatPower: gooseyPowersP2.includes(4),
    hasAngyCapPower: gooseyPowersP2.includes(5),
    hasPenguyPower: gooseyPowersP2.includes(6),
    hasMarkPower: gooseyPowersP2.includes(7),
    hasChatPower: gooseyPowersP2.includes(8),

    fighter: "GOOSEY",
},

            "player2",
        ]);

    } else if (data.player2Special === 1) {

        player2 = add([
            sprite("G"),
            pos(550, 200),
            scale(5),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "GHOSTY",
            },

            "player2",
        ]);

    } else if (data.player2Special === 2) {

        player2 = add([
            sprite("Greg"),
            pos(550, 200),
            scale(3),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "GREG",
            },

            "player2",
        ]);

    } else if (data.player2Special === 3) {

        player2 = add([
            sprite("AnGy-CaT"),
            pos(550, 200),
            scale(CAT_NORMAL_SCALE),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "ANGY-CAT",
            },

            "player2",
        ]);
        } else if (data.player2Special === 5) {

    player2 = add([
        sprite("Penguy"),
        pos(550, 200),
        scale(0.3),
        area(),
        body(),

        {
            facing: -1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
            invincible: false,
            gregCooldown: false,
            catMod: false,
            fighter: "PENGUY",
        },

        "player2",
    ]);
    } else if (data.player2Special === 6) {

    player2 = add([
        sprite("mark"),
        pos(550, 200),
        scale(1.5),
        area(),
        body(),

        {
            facing: -1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
            invincible: false,
            gregCooldown: false,
            catMod: false,
            fighter: "MARK",
        },

        "player2",
    ]);
    } else if (data.player2Special === 7) {

    player2 = add([
        sprite("Chat"),
        pos(550, 200),
        scale(0.07),
        area(),
        body(),

        {
            facing: -1,
            facingUp: false,
            knockbackActive: false,
            knockbackX: 0,
            damage: START_DAMAGE,
            stocks: START_STOCKS,
            respawning: false,
            frozen: false,
            specialUsed: false,
invincible: false,
gregCooldown: false,
catMod: false,

// 🎲 CHAT RANDOMIZER
chatPower: null,

fighter: "CHAT",
        },

        "player2",
    ]);
} else {
        player2 = add([
            sprite("Angy-Cap"),
            pos(550, 200),
            scale(0.5),
            area(),
            body(),

            {
                facing: -1,
                facingUp: false,
                knockbackActive: false,
                knockbackX: 0,
                damage: START_DAMAGE,
                stocks: START_STOCKS,
                respawning: false,
                frozen: false,
                specialUsed: false,
                invincible: false,
                gregCooldown: false,
                catMod: false,
                fighter: "ANGY-CAP",
            },

            "player2",
        ]);
    }
// ==================================================
// 🤖 CPU CONTROLLER
// ==================================================

let cpuActionTimer = 0;

const CPU_EASY_COOLDOWN = 0.75;
const CPU_MEDIUM_COOLDOWN = 0.45;
const CPU_HARD_COOLDOWN = 0.25;

// ==================================================
// 🎯 FACE PLAYER
// ==================================================

function cpuFaceOpponent() {

    if (player.pos.x > player2.pos.x) {
        player2.facing = 1;
    } else {
        player2.facing = -1;
    }
}
// ==================================================
// 🛟 CPU RECOVERY
// ==================================================

function cpuRecovery() {

    if (
        player2.respawning ||
        player2.frozen
    ) {
        return;
    }

    // Stay alive by steering back toward the stage.
    // DO NOT jump near the blast zone.
    if (
        player2.pos.y > 300 &&
        (
            player2.pos.x < 120 ||
            player2.pos.x > 680
        )
    ) {

        if (
            player2.pos.x < 400
        ) {

            player2.facing = 1;

        } else {

            player2.facing = -1;
        }

        if (
            !player2.isGrounded()
        ) {

            player2.vel.x =
                player2.facing * 400;
        }
    }
}
// ==================================================
// ⚔️ CPU NORMAL ATTACK
// ==================================================

function cpuAttack() {

    if (
        player2.respawning ||
        player2.frozen ||
        player2.invincible
    ) {
        return;
    }

    cpuFaceOpponent();

    const attack = add([
        rect(90, 45),
        pos(
            player2.pos.x +
            player2.facing * 65,
            player2.pos.y
        ),
        color(255, 255, 0),
        opacity(0.5),
        area(),
        lifespan(0.12, {
            fade: 0.05,
        }),
    ]);

    if (
        !player.invincible &&
        Math.abs(
            attack.pos.x - player.pos.x
        ) < 90 &&
        Math.abs(
            attack.pos.y - player.pos.y
        ) < 60
    ) {

        player.damage += 10;

        player.knockbackActive = true;

        player.knockbackX =
            (
                500 +
                player.damage * 10
            ) *
            player2.facing;

        player.vel.x =
            player.knockbackX;

        player.vel.y = -250;
    }
}

// ==================================================
// 🤖 CPU SPECIAL
// MEDIUM + HARD ONLY
// ==================================================

function cpuSpecial() {

    if (
        player2.respawning ||
        player2.frozen ||
        player2.specialUsed
    ) {
        return;
    }

    // GOOSEY
    if (player2.fighter === "GOOSEY") {

        player2.specialUsed = true;

        gooseyGetPower(
            player2,
            player,
            2
        );

        wait(
            GOOSEY_SPECIAL_COOLDOWN,
            () => {
                player2.specialUsed = false;
            }
        );

        return;
    }

    // GHOSTY
    if (player2.fighter === "GHOSTY") {

        player2.specialUsed = true;
        player2.invincible = true;

        specialStatus.text =
            "CPU GHOSTY: INVINCIBLE!";

        wait(2, () => {

            player2.invincible = false;
            player2.specialUsed = false;
            specialStatus.text = "";
        });

        return;
    }

    // ANGY-CAT
    if (player2.fighter === "ANGY-CAT") {

        player2.specialUsed = true;
        player2.catMod = true;

        player2.scaleTo(CAT_MOD_SCALE);

        specialStatus.text =
            "CPU ANGY-CAT: CAT MOD!!!";

        wait(
            CAT_MOD_TIME,
            () => {

                player2.catMod = false;

                player2.scaleTo(
                    CAT_NORMAL_SCALE
                );

                player2.specialUsed = false;
                specialStatus.text = "";
            }
        );

        return;
    }

    // MARK
    if (player2.fighter === "MARK") {

        player2.specialUsed = true;

        markDimensionShift();

        wait(3, () => {
            player2.specialUsed = false;
        });

        return;
    }

    // CHAT
    if (player2.fighter === "CHAT") {

        activateChatSpecial(
            player2,
            player
        );

        return;
    }

    // Other fighters:
    // use their normal attack for now.
    cpuAttack();
}

// ==================================================
// 🟢 EASY CPU
// ❌ NEVER USES SPECIALS
// ==================================================

function cpuEasyAction() {

    const distance =
        player.pos.x -
        player2.pos.x;

    const action =
        Math.floor(
            Math.random() * 5
        );

    // MOVE TOWARD
    if (action === 0) {

        if (distance > 0) {

            player2.move(SPEED, 0);
            player2.facing = 1;

        } else {

            player2.move(-SPEED, 0);
            player2.facing = -1;
        }
    }

    // MOVE AWAY
    else if (action === 1) {

        if (distance > 0) {

            player2.move(-SPEED, 0);
            player2.facing = -1;

        } else {

            player2.move(SPEED, 0);
            player2.facing = 1;
        }
    }

    // JUMP
    else if (action === 2) {

        if (player2.isGrounded()) {
            player2.jump(JUMP_FORCE);
        }
    }

    // ATTACK
    else if (action === 3) {

        cpuAttack();
    }

    // DO NOTHING
    else {

        // Easy CPU brain = absolutely nothing.
    }
}

// ==================================================
// 🟡 MEDIUM CPU
// ✅ CAN USE SPECIAL
// ==================================================

function cpuMediumAction() {

    const distance =
        Math.abs(
            player.pos.x -
            player2.pos.x
        );

    cpuFaceOpponent();
    cpuRecovery();

    if (distance < 140) {

        cpuAttack();

        if (Math.random() < 0.35) {
            cpuSpecial();
        }

        return;
    }

    if (player.pos.x > player2.pos.x) {

        player2.move(SPEED, 0);
        player2.facing = 1;

    } else {

        player2.move(-SPEED, 0);
        player2.facing = -1;
    }

    if (
        Math.random() < 0.18 &&
        player2.isGrounded()
    ) {

        player2.jump(JUMP_FORCE);
    }

    if (Math.random() < 0.12) {
        cpuSpecial();
    }
}

// ==================================================
// 🔴 HARD CPU
// ✅ CAN USE SPECIAL
// ==================================================

function cpuHardAction() {

    const dx =
        player.pos.x -
        player2.pos.x;

    const distance =
        Math.abs(dx);

    cpuFaceOpponent();
    cpuRecovery();

    // Very close
    if (distance < 110) {

        cpuAttack();

        if (Math.random() < 0.55) {
            cpuSpecial();
        }

        return;
    }

    // Medium distance
    if (distance < 260) {

        if (dx > 0) {

            player2.move(
                BLUE_SPEED,
                0
            );

            player2.facing = 1;

        } else {

            player2.move(
                -BLUE_SPEED,
                0
            );

            player2.facing = -1;
        }

        if (
            Math.random() < 0.3 &&
            player2.isGrounded()
        ) {

            player2.jump(JUMP_FORCE);
        }

        if (Math.random() < 0.3) {
            cpuSpecial();
        }

        return;
    }

    // Far away
    if (dx > 0) {

        player2.move(
            BLUE_SPEED,
            0
        );

        player2.facing = 1;

    } else {

        player2.move(
            -BLUE_SPEED,
            0
        );

        player2.facing = -1;
    }

    if (
        Math.random() < 0.2 &&
        player2.isGrounded()
    ) {

        player2.jump(JUMP_FORCE);
    }
}

// ==================================================
// 🤖 CPU UPDATE
// ==================================================

onUpdate(() => {

    // Only CPU matches use this.
    if (
        window.singlePlayerMode !== true
    ) {
        return;
    }

    if (
        !window.cpuDifficulty
    ) {
        return;
    }

    if (
        player2.respawning ||
        player2.frozen
    ) {
        return;
    }

    cpuActionTimer += dt();

    let cooldown =
        CPU_EASY_COOLDOWN;

    if (
        window.cpuDifficulty === "MEDIUM"
    ) {

        cooldown =
            CPU_MEDIUM_COOLDOWN;

    } else if (
        window.cpuDifficulty === "HARD"
    ) {

        cooldown =
            CPU_HARD_COOLDOWN;
    }

    if (
        cpuActionTimer >= cooldown
    ) {

        cpuActionTimer = 0;

        if (
            window.cpuDifficulty === "EASY"
        ) {

            // 🚫 NO SPECIALS HERE
            cpuEasyAction();

        } else if (
            window.cpuDifficulty === "MEDIUM"
        ) {

            cpuMediumAction();

        } else if (
            window.cpuDifficulty === "HARD"
        ) {

            cpuHardAction();
        }
    }

    cpuRecovery();
});
        // ==================================================
    // 🗺️ MAP
    // ==================================================

    if (currentMap === MAP_GRASSLAND) {

        // 🌱 GRASSLAND
        add([
            rect(700, 50),
            pos(25, 350),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

    } else if (currentMap === MAP_PARKOUR) {

        // 🏃 PARKOUR MAYHEM

        // Bottom platform
        add([
            rect(220, 35),
            pos(25, 350),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        // Low middle platform
        add([
            rect(140, 25),
            pos(280, 300),
            color(0, 200, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        // High middle platform
        add([
            rect(120, 25),
            pos(480, 230),
            color(0, 180, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        // Right platform
        add([
            rect(150, 25),
            pos(625, 310),
            color(0, 220, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        // Top platform
        add([
            rect(100, 25),
            pos(350, 150),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);
    }
     else if (currentMap === MAP_PARKOUR_NIGHTMARE) {

    // 💀 PARKOUR NIGHTMARE
    // ONLY TWO SPAWN PLATFORMS!
    // HUGE GAP IN THE MIDDLE!
    // P1 SPAWN PLATFORM
    add([
        rect(110, 25),
        pos(145, 250),
        color(100, 255, 100),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // P2 SPAWN PLATFORM
    add([
        rect(110, 25),
        pos(545, 250),
        color(100, 255, 100),
        area(),
        body({
            isStatic: true,
        }),
    ]);
}
else if (currentMap === MAP_GRAVITY_CHAOS) {

    // 🌀 GRAVITY CHAOS

    // Bottom platform
    add([
        rect(220, 30),
        pos(25, 350),
        color(150, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Top platform
    add([
        rect(220, 30),
        pos(555, 70),
        color(150, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Left wall
    add([
        rect(30, 180),
        pos(25, 170),
        color(180, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Right wall
    add([
        rect(30, 180),
        pos(745, 170),
        color(180, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Middle platform
    add([
        rect(180, 25),
        pos(310, 220),
        color(200, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);
    
}
else if (currentMap === MAP_PARKOUR_GRAVITY) {

    // ==================================================
    // 🌀🏃 PARKOUR GRAVITY MAYHEM
    // ==================================================

    // P1 START
    add([
        rect(130, 25),
        pos(40, 340),
        color(0, 255, 100),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // P2 START
    add([
        rect(130, 25),
        pos(630, 340),
        color(0, 255, 100),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // ==================================================
    // LOWER PARKOUR
    // ==================================================

    // Moving horizontal platform
    const movingPlatform = add([
        rect(120, 25),
        pos(340, 280),
        color(255, 200, 0),
        area(),
        body({
            isStatic: true,
        }),
        {
            moveDirection: 1,
        },
    ]);

    // Center platform
    add([
        rect(90, 20),
        pos(355, 220),
        color(200, 0, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // ==================================================
    // ⬆️ UPPER PARKOUR
    // ==================================================

    // Upper-left platform
    add([
        rect(110, 22),
        pos(120, 150),
        color(0, 200, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Upper-right platform
    add([
        rect(110, 22),
        pos(570, 150),
        color(0, 200, 255),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Top-left platform
    add([
        rect(100, 20),
        pos(250, 80),
        color(255, 100, 0),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // Top-right platform
    add([
        rect(100, 20),
        pos(450, 80),
        color(255, 100, 0),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // VERY TOP platform
    add([
        rect(140, 20),
        pos(330, 30),
        color(255, 0, 200),
        area(),
        body({
            isStatic: true,
        }),
    ]);

    // ==================================================
    // ⬇️ VERTICAL MOVING PLATFORM
    // ==================================================

    const verticalPlatform = add([
        rect(100, 25),
        pos(350, 150),
        color(255, 100, 0),
        area(),
        body({
            isStatic: true,
        }),
        {
            moveDirection: 1,
        },
    ]);

    // ==================================================
    // 🔄 MOVEMENT
    // ==================================================

    onUpdate(() => {

        // Horizontal platform
        movingPlatform.move(
            160 * movingPlatform.moveDirection,
            0
        );

        if (movingPlatform.pos.x > 640) {
            movingPlatform.moveDirection = -1;
        }

        if (movingPlatform.pos.x < 40) {
            movingPlatform.moveDirection = 1;
        }

        // Vertical platform
        verticalPlatform.move(
            0,
            120 * verticalPlatform.moveDirection
        );

        if (verticalPlatform.pos.y > 280) {
            verticalPlatform.moveDirection = -1;
        }

        if (verticalPlatform.pos.y < 100) {
            verticalPlatform.moveDirection = 1;
        }
    });
}
// ==================================================
// 🌀 GRAVITY CHAOS
// ==================================================

if (currentMap === MAP_GRAVITY_CHAOS) {

    let gravityDirection = 0;

    const gravityPower = 1800;

    function changeGravity() {

        gravityDirection =
            Math.floor(Math.random() * 4);

        if (gravityDirection === 0) {

            // 🔽 DOWN
            setGravity(gravityPower);

        } else if (gravityDirection === 1) {

            // 🔼 UP
            setGravity(-gravityPower);

        } else if (gravityDirection === 2) {

            // ⬅️ LEFT
            setGravity(0);

            player.vel.x -= 1200;
            player2.vel.x -= 1200;

        } else {

            // ➡️ RIGHT
            setGravity(0);

            player.vel.x += 1200;
            player2.vel.x += 1200;
        }
    }

    changeGravity();

    loop(3, () => {

        changeGravity();

    });
}
// ==================================================
// 🌀 PARKOUR GRAVITY MAYHEM
// ==================================================

if (currentMap === MAP_PARKOUR_GRAVITY) {

    const gravityPower = 1800;

    function changeParkourGravity() {

        const direction =
            Math.floor(Math.random() * 4);

        if (direction === 0) {

            // ⬇️ DOWN
            setGravity(gravityPower);

        } else if (direction === 1) {

            // ⬆️ UP
            setGravity(-gravityPower);

        } else if (direction === 2) {

            // ⬅️➡️ SIDEWAYS CHAOS
            setGravity(0);

        } else {

            // 🌀 ZERO GRAVITY
            setGravity(0);
        }
    }

    changeParkourGravity();

    loop(2.5, () => {

        changeParkourGravity();

    });
}
    // ==================================================
    // HUD
    // ==================================================

    const playerPercent = add([
        text("0%"),
        pos(200, 120),
        scale(1.5),
    ]);

    const player2Percent = add([
        text("0%"),
        pos(550, 120),
        scale(1.5),
    ]);

    const playerStocks = add([
        text("❤️❤️❤️"),
        pos(20, 20),
        scale(1.2),
    ]);

    const player2Stocks = add([
        text("❤️❤️❤️"),
        pos(600, 20),
        scale(1.2),
    ]);

    const specialStatus = add([
        text(""),
        pos(400, 70),
        anchor("center"),
        scale(0.8),
    ]);

    onUpdate(() => {

        playerPercent.pos =
            vec2(
                player.pos.x,
                player.pos.y - 80
            );

        player2Percent.pos =
            vec2(
                player2.pos.x,
                player2.pos.y - 80
            );

        playerPercent.text =
            Math.floor(player.damage) + "%";

        player2Percent.text =
            Math.floor(player2.damage) + "%";

        playerStocks.text =
            "❤️".repeat(player.stocks);

        player2Stocks.text =
            "❤️".repeat(player2.stocks);
    });
// ==================================================
// PENGUY SUPER-SLIPPERY MOVEMENT
// ==================================================

const PENGUY_ACCELERATION = 1600;
const PENGUY_MAX_SPEED = 600;

const PENGUY_GROUND_FRICTION = 0.96;
const PENGUY_AIR_FRICTION = 0.985;

const PENGUY_AIR_CONTROL = 900;

// P1 LEFT
onKeyDown("left", () => {

    if (
        player.knockbackActive ||
        player.respawning ||
        player.frozen
    ) {
        return;
    }

    if (player.fighter === "PENGUY") {

        player.vel.x -=
            PENGUY_ACCELERATION * dt();

        if (player.vel.x < -PENGUY_MAX_SPEED) {
            player.vel.x = -PENGUY_MAX_SPEED;
        }

        player.facing = -1;
        return;
    }

    if (markIceWorld) {

        player.vel.x -= ICE_ACCELERATION * dt();

        if (player.vel.x < -ICE_MAX_SPEED) {
            player.vel.x = -ICE_MAX_SPEED;
        }

    } else if (player.fighter === "GOOSEY") {

        player.move(-GOOSEY_SPEED, 0);

    } else if (player.fighter === "RED") {

        player.move(-RED_SPEED, 0);

    } else if (player.fighter === "BLUE") {

        player.move(-BLUE_SPEED, 0);

    } else {

        player.move(-SPEED, 0);
    }

    player.facing = -1;
});

// P1 RIGHT
onKeyDown("right", () => {

    if (
        player.knockbackActive ||
        player.respawning ||
        player.frozen
    ) {
        return;
    }

    if (player.fighter === "PENGUY") {

        player.vel.x +=
            PENGUY_ACCELERATION * dt();

        if (player.vel.x > PENGUY_MAX_SPEED) {
            player.vel.x = PENGUY_MAX_SPEED;
        }

        player.facing = 1;
        return;
    }

    if (markIceWorld) {

        player.vel.x += ICE_ACCELERATION * dt();

        if (player.vel.x > ICE_MAX_SPEED) {
            player.vel.x = ICE_MAX_SPEED;
        }

    } else if (player.fighter === "GOOSEY") {

        player.move(GOOSEY_SPEED, 0);

    } else if (player.fighter === "RED") {

        player.move(RED_SPEED, 0);

    } else if (player.fighter === "BLUE") {

        player.move(BLUE_SPEED, 0);

    } else {

        player.move(SPEED, 0);
    }

    player.facing = 1;
});

// P1 JUMP
onKeyPress("up", () => {

    if (
        player.respawning ||
        player.frozen
    ) {
        return;
    }

    player.facingUp = true;

    if (player.isGrounded()) {
        player.jump(JUMP_FORCE);
    }

    wait(0.5, () => {
        player.facingUp = false;
    });
});

// P2 LEFT
onKeyDown("a", () => {

    if (
        player2.knockbackActive ||
        player2.respawning ||
        player2.frozen
    ) {
        return;
    }

    if (player2.fighter === "PENGUY") {

        player2.vel.x -=
            PENGUY_ACCELERATION * dt();

        if (player2.vel.x < -PENGUY_MAX_SPEED) {
            player2.vel.x = -PENGUY_MAX_SPEED;
        }

        player2.facing = -1;
        return;
    }

    if (markIceWorld) {

        player2.vel.x -= ICE_ACCELERATION * dt();

        if (player2.vel.x < -ICE_MAX_SPEED) {
            player2.vel.x = -ICE_MAX_SPEED;
        }

    } else if (player2.fighter === "GOOSEY") {

        player2.move(-GOOSEY_SPEED, 0);

    } else if (player2.fighter === "RED") {

        player2.move(-RED_SPEED, 0);

    } else if (player2.fighter === "BLUE") {

        player2.move(-BLUE_SPEED, 0);

    } else {

        player2.move(-SPEED, 0);
    }

    player2.facing = -1;
});

// P2 RIGHT
onKeyDown("d", () => {

    if (
        player2.knockbackActive ||
        player2.respawning ||
        player2.frozen
    ) {
        return;
    }

    if (player2.fighter === "PENGUY") {

        player2.vel.x +=
            PENGUY_ACCELERATION * dt();

        if (player2.vel.x > PENGUY_MAX_SPEED) {
            player2.vel.x = PENGUY_MAX_SPEED;
        }

        player2.facing = 1;
        return;
    }

    if (markIceWorld) {

        player2.vel.x += ICE_ACCELERATION * dt();

        if (player2.vel.x > ICE_MAX_SPEED) {
            player2.vel.x = ICE_MAX_SPEED;
        }

    } else if (player2.fighter === "GOOSEY") {

        player2.move(GOOSEY_SPEED, 0);

    } else if (player2.fighter === "RED") {

        player2.move(RED_SPEED, 0);

    } else if (player2.fighter === "BLUE") {

        player2.move(BLUE_SPEED, 0);

    } else {

        player2.move(SPEED, 0);
    }

    player2.facing = 1;
});

// P2 JUMP
onKeyPress("w", () => {

    if (
        player2.respawning ||
        player2.frozen
    ) {
        return;
    }

    player2.facingUp = true;

    if (player2.isGrounded()) {
        player2.jump(JUMP_FORCE);
    }

    wait(0.5, () => {
        player2.facingUp = false;
    });
});

// ==================================================
// 🐧 PENGUY FRICTION + AIR CONTROL
// ==================================================

onUpdate(() => {

    // ==============================================
    // P1 PENGUY
    // ==============================================

    if (
        player.fighter === "PENGUY" &&
        !player.knockbackActive &&
        !player.respawning &&
        !player.frozen
    ) {

        if (player.isGrounded()) {

            player.vel.x *= PENGUY_GROUND_FRICTION;

        } else {

            player.vel.x *= PENGUY_AIR_FRICTION;

            if (isKeyDown("left")) {
                player.vel.x -=
                    PENGUY_AIR_CONTROL * dt();
            }

            if (isKeyDown("right")) {
                player.vel.x +=
                    PENGUY_AIR_CONTROL * dt();
            }

            if (player.vel.x > PENGUY_MAX_SPEED) {
                player.vel.x = PENGUY_MAX_SPEED;
            }

            if (player.vel.x < -PENGUY_MAX_SPEED) {
                player.vel.x = -PENGUY_MAX_SPEED;
            }
        }
    }

    // ==============================================
    // P2 PENGUY
    // ==============================================

    if (
        player2.fighter === "PENGUY" &&
        !player2.knockbackActive &&
        !player2.respawning &&
        !player2.frozen
    ) {

        if (player2.isGrounded()) {

            player2.vel.x *= PENGUY_GROUND_FRICTION;

        } else {

            player2.vel.x *= PENGUY_AIR_FRICTION;

            if (isKeyDown("a")) {
                player2.vel.x -=
                    PENGUY_AIR_CONTROL * dt();
            }

            if (isKeyDown("d")) {
                player2.vel.x +=
                    PENGUY_AIR_CONTROL * dt();
            }

            if (player2.vel.x > PENGUY_MAX_SPEED) {
                player2.vel.x = PENGUY_MAX_SPEED;
            }

            if (player2.vel.x < -PENGUY_MAX_SPEED) {
                player2.vel.x = -PENGUY_MAX_SPEED;
            }
        }
    }

    // ==================================================
    // 🧲 CHAT MAGNET
    // ==================================================

    if (
        player.fighter === "CHAT" &&
        player.chatPower === 0 &&
        !player.respawning
    ) {

        const dx = player.pos.x - player2.pos.x;

        if (Math.abs(dx) < 250) {

            player2.vel.x +=
                dx * 2 * dt();
        }
    }

    if (
        player2.fighter === "CHAT" &&
        player2.chatPower === 0 &&
        !player2.respawning
    ) {

        const dx = player2.pos.x - player.pos.x;

        if (Math.abs(dx) < 250) {

            player.vel.x +=
                dx * 2 * dt();
        }
    }

    // ==================================================
    // 🟢 CHAT BOUNCY
    // ==================================================

    if (
        player.fighter === "CHAT" &&
        player.chatPower === 1 &&
        player.isGrounded()
    ) {

        if (Math.abs(player.vel.y) < 10) {
            player.jump(900);
        }
    }

    if (
        player2.fighter === "CHAT" &&
        player2.chatPower === 1 &&
        player2.isGrounded()
    ) {

        if (Math.abs(player2.vel.y) < 10) {
            player2.jump(900);
        }
    }

    // ==================================================
    // 🧊 CHAT ICE TRAIL
    // ==================================================

    if (
        player.fighter === "CHAT" &&
        player.chatPower === 3 &&
        !player.respawning
    ) {

        add([
            rect(35, 8),
            pos(
                player.pos.x,
                player.pos.y + 30
            ),
            color(150, 230, 255),
            opacity(0.7),
            lifespan(0.5, {
                fade: 0.4,
            }),
        ]);
    }

    if (
        player2.fighter === "CHAT" &&
        player2.chatPower === 3 &&
        !player2.respawning
    ) {

        add([
            rect(35, 8),
            pos(
                player2.pos.x,
                player2.pos.y + 30
            ),
            color(150, 230, 255),
            opacity(0.7),
            lifespan(0.5, {
                fade: 0.4,
            }),
        ]);
    }
    // ==================================================
    // 💥 KNOCKBACK
    // ==================================================

    if (player.knockbackActive) {

        // 🪨 CHAT ROCK SOLID = 10% KNOCKBACK
        if (
            player.fighter === "CHAT" &&
            player.chatPower === 2
        ) {

            player.vel.x =
                player.knockbackX * 0.1;

        } else {

            player.vel.x =
                player.knockbackX;

            if (player.fighter === "PENGUY") {

                player.knockbackX *=
                    PENGUY_KNOCKBACK_FRICTION;

            } else {

                player.knockbackX *=
                    KNOCKBACK_FRICTION;
            }
        }

        if (
            Math.abs(player.knockbackX) <
            KNOCKBACK_STOP
        ) {

            player.knockbackX = 0;
            player.knockbackActive = false;
            player.vel.x = 0;
        }
    }

    if (player2.knockbackActive) {

        // 🪨 CHAT ROCK SOLID = 10% KNOCKBACK
        if (
            player2.fighter === "CHAT" &&
            player2.chatPower === 2
        ) {

            player2.vel.x =
                player2.knockbackX * 0.1;

        } else {

            player2.vel.x =
                player2.knockbackX;

            if (player2.fighter === "PENGUY") {

                player2.knockbackX *=
                    PENGUY_KNOCKBACK_FRICTION;

            } else {

                player2.knockbackX *=
                    KNOCKBACK_FRICTION;
            }
        }

        if (
            Math.abs(player2.knockbackX) <
            KNOCKBACK_STOP
        ) {

            player2.knockbackX = 0;
            player2.knockbackActive = false;
            player2.vel.x = 0;
        }
    }
});

// ==================================================
// P1 ATTACK
// ==================================================
window.addEventListener("keydown", (event) => {

    if (event.code !== "ShiftRight") {
        return;
    }

    if (
        player.respawning ||
        player.frozen ||
        player.invincible
    ) {
        return;
    }
// ==================================================
// 🔥 CHAT FIREBALL — P1
// ==================================================

if (
    player.fighter === "CHAT" &&
    player.chatPower === 4
) {

    // Lock direction when fired
    const fireballDirection = player.facing;

    const fireball = add([
        circle(15),
        pos(
            player.pos.x +
            fireballDirection * 55,
            player.pos.y
        ),
        anchor("center"),
        color(255, 80, 0),
        opacity(1),
        area(),
        {
            speed: 750,
            hit: false,
        },
        lifespan(1.5, {
            fade: 0.3,
        }),
    ]);

    // 🔥 MOVE + HIT DETECTION
    fireball.onUpdate(() => {

        fireball.move(
            fireball.speed *
            fireballDirection,
            0
        );

        // 💥 HIT PLAYER 2
        if (
            !fireball.hit &&
            !player2.invincible &&
            Math.abs(fireball.pos.x - player2.pos.x) < 40 &&
            Math.abs(fireball.pos.y - player2.pos.y) < 50
        ) {

            fireball.hit = true;

            // 💥 DAMAGE
            player2.damage += 20;

            // 🪨 ROCK SOLID
            if (
                player2.fighter === "CHAT" &&
                player2.chatPower === 2
            ) {

                player2.knockbackActive = true;

                player2.knockbackX =
                    700 *
                    fireballDirection *
                    0.1;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -40;

            } else {

                player2.knockbackActive = true;

                player2.knockbackX =
                    700 *
                    fireballDirection;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -400;
            }

            // 🔥 FIREBALL IMPACT
            shake(8);

            destroy(fireball);
        }
    });

    // 🔥 Fireball replaces normal attack
    return;
}
    // ==================================================
    // GREG
    // ==================================================

    if (player.fighter === "GREG") {

        if (player.gregCooldown) {
            return;
        }

        player.gregCooldown = true;

        wait(GREG_ATTACK_COOLDOWN, () => {
            player.gregCooldown = false;
        });

        if (player.facingUp) {

            const attack = add([
                rect(65, 160),
                pos(
                    player.pos.x +
                    player.facing * 45,
                    player.pos.y - 80
                ),
                color(255, 0, 0),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player2.invincible &&
                Math.abs(
                    attack.pos.x -
                    player2.pos.x
                ) < 80 &&
                Math.abs(
                    attack.pos.y -
                    player2.pos.y
                ) < 120
            ) {

                player2.damage += 15;
                player2.knockbackActive = true;

                player2.knockbackX =
                    (GREG_UPPERCUT_KNOCKBACK +
                    player2.damage * 6) *
                    player.facing;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -700;
            }

        } else {

            const attack = add([
                rect(180, 45),
                pos(
                    player.pos.x +
                    player.facing * 90,
                    player.pos.y
                ),
                color(255, 255, 0),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player2.invincible &&
                Math.abs(
                    attack.pos.x -
                    player2.pos.x
                ) < 130 &&
                Math.abs(
                    attack.pos.y -
                    player2.pos.y
                ) < 60
            ) {

                player2.damage += 10;
                player2.knockbackActive = true;

                player2.knockbackX =
                    (GREG_PUNCH_KNOCKBACK +
                    player2.damage * 6) *
                    player.facing;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -250;
            }
        }

        return;
    }

    // ==================================================
    // ANGY-CAT
    // ==================================================

    if (player.fighter === "ANGY-CAT") {

        if (player.facingUp) {

            const attackSize =
                player.catMod ? 160 : 80;

            const attack = add([
                rect(
                    attackSize,
                    attackSize
                ),
                pos(
                    player.pos.x +
                    player.facing *
                    (player.catMod ? 90 : 50),

                    player.pos.y -
                    (player.catMod ? 60 : 40)
                ),
                color(255, 150, 0),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player2.invincible &&
                Math.abs(
                    attack.pos.x -
                    player2.pos.x
                ) <
                (player.catMod ? 130 : 70) &&

                Math.abs(
                    attack.pos.y -
                    player2.pos.y
                ) <
                (player.catMod ? 130 : 75)
            ) {

                player2.damage += 15;
                player2.knockbackActive = true;

                player2.knockbackX =
                    (400 +
                    player2.damage * 10) *
                    player.facing;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -700;
            }

            return;
        }

        const attackWidth =
            player.catMod ? 220 : 100;

        const attackHeight =
            player.catMod ? 55 : 40;

        const attackDistance =
            player.catMod ? 110 : 55;

        const attack = add([
            rect(
                attackWidth,
                attackHeight
            ),
            pos(
                player.pos.x +
                player.facing *
                attackDistance,

                player.pos.y
            ),
            color(255, 150, 0),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        const hitDistance =
            player.catMod ? 180 : 85;

        const hitHeight =
            player.catMod ? 70 : 50;

        if (
            !player2.invincible &&
            Math.abs(
                attack.pos.x -
                player2.pos.x
            ) < hitDistance &&
            Math.abs(
                attack.pos.y -
                player2.pos.y
            ) < hitHeight
        ) {

            player2.damage +=
                player.catMod ? 15 : 10;

            player2.knockbackActive = true;

            player2.knockbackX =
                (550 +
                player2.damage * 10) *
                player.facing;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y =
                player.catMod
                ? -400
                : -300;
        }

        return;
    }

    // ==================================================
    // ANGY-CAP
    // ==================================================

    if (player.fighter === "ANGY-CAP") {

        if (player.facingUp) {

            const attack = add([
                rect(50, 100),
                pos(
                    player.pos.x +
                    player.facing * 45,
                    player.pos.y - 55
                ),
                color(150, 100, 50),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player2.invincible &&
                Math.abs(
                    attack.pos.x -
                    player2.pos.x
                ) < 35 &&
                Math.abs(
                    attack.pos.y -
                    player2.pos.y
                ) < 70
            ) {

                player2.damage += 15;
                player2.knockbackActive = true;

                player2.knockbackX =
                    (900 +
                    player2.damage * 15) *
                    player.facing;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y = -700;
            }

            return;
        }

        const attack = add([
            rect(75, 25),
            pos(
                player.pos.x +
                player.facing * 35,
                player.pos.y
            ),
            color(150, 100, 50),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        if (
            !player2.invincible &&
            Math.abs(
                attack.pos.x -
                player2.pos.x
            ) < 55 &&
            Math.abs(
                attack.pos.y -
                player2.pos.y
            ) < 45
        ) {

            player2.damage +=
                ANGY_CAP_DAMAGE;

            player2.knockbackActive = true;

            player2.knockbackX =
                ANGY_CAP_KNOCKBACK *
                player.facing;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y = -300;
        }

        return;
    }

    // ==================================================
    // GENERAL UPPERCUT
    // ==================================================

    if (player.facingUp) {

        const attack = add([
            rect(45, 90),
            pos(
                player.pos.x +
                player.facing * 45,
                player.pos.y - 55
            ),
            color(255, 0, 0),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        if (
            !player2.invincible &&
            Math.abs(
                attack.pos.x -
                player2.pos.x
            ) < 70 &&
            Math.abs(
                attack.pos.y -
                player2.pos.y
            ) < 90
        ) {

            player2.damage +=
                player.fighter === "RED"
                ? RED_UPPERCUT_DAMAGE
                : player.fighter === "BLUE"
                ? BLUE_UPPERCUT_DAMAGE
                : 15;

            player2.knockbackActive = true;

            let knockback;
if (
    player2.fighter === "GOOSEY" &&
    player2.hasRedPower
) {

    knockback =
        RED_UPPERCUT_KNOCKBACK;

} else if (player2.fighter === "GOOSEY") {

    knockback =
        GOOSEY_UPPERCUT_KNOCKBACK;

} else if (player2.fighter === "RED") {
                knockback =
                    RED_UPPERCUT_KNOCKBACK;
            } else if (player.fighter === "BLUE") {
                knockback =
                    BLUE_UPPERCUT_KNOCKBACK;
            } else {
                knockback = 300;
            }

            player2.knockbackX =
                (knockback +
                player2.damage * 10) *
                player.facing;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y = -700;
        }

        return;
    }

    // ==================================================
    // GENERAL PUNCH
    // ==================================================

    const attack = add([
        rect(90, 45),
        pos(
            player.pos.x +
            player.facing * 65,
            player.pos.y
        ),
        color(255, 255, 0),
        opacity(0.6),
        area(),
        lifespan(0.12, {
            fade: 0.05,
        }),
    ]);

    if (
        !player2.invincible &&
        Math.abs(
            attack.pos.x -
            player2.pos.x
        ) < 90 &&
        Math.abs(
            attack.pos.y -
            player2.pos.y
        ) < 60
    ) {
player2.damage +=
    player.fighter === "GOOSEY" &&
    player.hasRedPower
        ? RED_PUNCH_DAMAGE
        : player.fighter === "RED"
        ? RED_PUNCH_DAMAGE
        : player.fighter === "BLUE"
        ? BLUE_PUNCH_DAMAGE
        : 10;
        player2.knockbackActive = true;

        let knockback;

        if (player.fighter === "GOOSEY") {
            knockback =
                GOOSEY_PUNCH_KNOCKBACK;
        } else if (player.fighter === "RED") {
            knockback =
                RED_PUNCH_KNOCKBACK;
        } else if (player.fighter === "BLUE") {
            knockback =
                BLUE_PUNCH_KNOCKBACK;
        } else {
            knockback = 500;
        }

        player2.knockbackX =
            (knockback +
            player2.damage * 10) *
            player.facing;

        player2.vel.x =
            player2.knockbackX;

        player2.vel.y = -250;
    }
});

// ==================================================
// P2 ATTACK
// ==================================================

onKeyPress("f", () => {

    if (
        player2.respawning ||
        player2.frozen ||
        player2.invincible
    ) {
        return;
    }
// ==================================================
// 🔥 CHAT FIREBALL — P2
// ==================================================

if (
    player2.fighter === "CHAT" &&
    player2.chatPower === 4
) {

    // Lock direction when fired
    const fireballDirection = player2.facing;

    const fireball = add([
        circle(15),
        pos(
            player2.pos.x +
            fireballDirection * 55,
            player2.pos.y
        ),
        anchor("center"),
        color(255, 80, 0),
        opacity(1),
        area(),
        {
            speed: 750,
            hit: false,
        },
        lifespan(1.5, {
            fade: 0.3,
        }),
    ]);

    // 🔥 MOVE + HIT DETECTION
    fireball.onUpdate(() => {

        fireball.move(
            fireball.speed *
            fireballDirection,
            0
        );

        // 💥 HIT PLAYER 1
        if (
            !fireball.hit &&
            !player.invincible &&
            Math.abs(fireball.pos.x - player.pos.x) < 40 &&
            Math.abs(fireball.pos.y - player.pos.y) < 50
        ) {

            fireball.hit = true;

            // 💥 DAMAGE
            player.damage += 20;

            // 🪨 ROCK SOLID
            if (
                player.fighter === "CHAT" &&
                player.chatPower === 2
            ) {

                player.knockbackActive = true;

                player.knockbackX =
                    700 *
                    fireballDirection *
                    0.1;

                player.vel.x =
                    player.knockbackX;

                player.vel.y = -40;

            } else {

                player.knockbackActive = true;

                player.knockbackX =
                    700 *
                    fireballDirection;

                player.vel.x =
                    player.knockbackX;

                player.vel.y = -400;
            }

            // 🔥 FIREBALL IMPACT
            shake(8);

            destroy(fireball);
        }
    });

    // 🔥 Fireball replaces normal attack
    return;
}
    // ==================================================
    // GREG
    // ==================================================

    if (player2.fighter === "GREG") {

        if (player2.gregCooldown) {
            return;
        }

        player2.gregCooldown = true;

        wait(GREG_ATTACK_COOLDOWN, () => {
            player2.gregCooldown = false;
        });

        if (player2.facingUp) {

            const attack = add([
                rect(65, 160),
                pos(
                    player2.pos.x +
                    player2.facing * 45,
                    player2.pos.y - 85
                ),
                color(255, 100, 100),
                opacity(0.6),
                area(),
                lifespan(0.15, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player.invincible &&
                Math.abs(
                    attack.pos.x -
                    player.pos.x
                ) < 90 &&
                Math.abs(
                    attack.pos.y -
                    player.pos.y
                ) < 130
            ) {

                player.damage += 15;
                player.knockbackActive = true;

                player.knockbackX =
                    (GREG_UPPERCUT_KNOCKBACK +
                    player.damage * 6) *
                    player2.facing;

                player.vel.x =
                    player.knockbackX;

                player.vel.y = -750;
            }

            return;
        }

        const attack = add([
            rect(180, 45),
            pos(
                player2.pos.x +
                player2.facing * 110,
                player2.pos.y
            ),
            color(255, 150, 0),
            opacity(0.6),
            area(),
            lifespan(0.15, {
                fade: 0.05,
            }),
        ]);

        if (
            !player.invincible &&
            Math.abs(
                attack.pos.x -
                player.pos.x
            ) < 170 &&
            Math.abs(
                attack.pos.y -
                player.pos.y
            ) < 60
        ) {

            player.damage += 10;
            player.knockbackActive = true;

            player.knockbackX =
                (GREG_PUNCH_KNOCKBACK +
                player.damage * 6) *
                player2.facing;

            player.vel.x =
                player2.knockbackX;

            player.vel.y = -300;
        }

        return;
    }

    // ==================================================
    // ANGY-CAT
    // ==================================================

    if (player2.fighter === "ANGY-CAT") {

        if (player2.facingUp) {

            const attackSize =
                player2.catMod ? 160 : 80;

            const attack = add([
                rect(
                    attackSize,
                    attackSize
                ),
                pos(
                    player2.pos.x +
                    player2.facing *
                    (player2.catMod ? 90 : 50),

                    player2.pos.y -
                    (player2.catMod ? 60 : 40)
                ),
                color(255, 150, 0),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player.invincible &&
                Math.abs(
                    attack.pos.x -
                    player.pos.x
                ) <
                (player2.catMod ? 130 : 70) &&

                Math.abs(
                    attack.pos.y -
                    player.pos.y
                ) <
                (player2.catMod ? 130 : 75)
            ) {

                player.damage += 15;
                player.knockbackActive = true;

                player.knockbackX =
                    (400 +
                    player.damage * 10) *
                    player2.facing;

                player.vel.x =
                    player.knockbackX;

                player.vel.y = -700;
            }

            return;
        }

        const attack = add([
            rect(100, 40),
            pos(
                player2.pos.x +
                player2.facing * 55,
                player2.pos.y
            ),
            color(255, 150, 0),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        if (
            !player.invincible &&
            Math.abs(
                attack.pos.x -
                player.pos.x
            ) < 85 &&
            Math.abs(
                attack.pos.y -
                player.pos.y
            ) < 50
        ) {

            player.damage += 10;
            player.knockbackActive = true;

            player.knockbackX =
                (550 +
                player.damage * 10) *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y = -300;
        }

        return;
    }

    // ==================================================
    // ANGY-CAP
    // ==================================================

    if (player2.fighter === "ANGY-CAP") {

        if (player2.facingUp) {

            const attack = add([
                rect(50, 100),
                pos(
                    player2.pos.x +
                    player2.facing * 45,
                    player2.pos.y - 55
                ),
                color(150, 100, 50),
                opacity(0.6),
                area(),
                lifespan(0.12, {
                    fade: 0.05,
                }),
            ]);

            if (
                !player.invincible &&
                Math.abs(
                    attack.pos.x -
                    player.pos.x
                ) < 35 &&
                Math.abs(
                    attack.pos.y -
                    player.pos.y
                ) < 70
            ) {

                player.damage += 15;
                player.knockbackActive = true;

                player.knockbackX =
                    (900 +
                    player.damage * 15) *
                    player2.facing;

                player.vel.x =
                    player.knockbackX;

                player.vel.y = -700;
            }

            return;
        }

        const attack = add([
            rect(75, 25),
            pos(
                player2.pos.x +
                player2.facing * 35,
                player2.pos.y
            ),
            color(150, 100, 50),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        if (
            !player.invincible &&
            Math.abs(
                attack.pos.x -
                player.pos.x
            ) < 55 &&
            Math.abs(
                attack.pos.y -
                player.pos.y
            ) < 45
        ) {

            player.damage +=
                ANGY_CAP_DAMAGE;

            player.knockbackActive = true;

            player.knockbackX =
                ANGY_CAP_KNOCKBACK *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y = -300;
        }

        return;
    }

    // ==================================================
    // GENERAL UPPERCUT
    // ==================================================

    if (player2.facingUp) {

        const attack = add([
            rect(45, 90),
            pos(
                player2.pos.x +
                player2.facing * 45,
                player2.pos.y - 55
            ),
            color(255, 0, 0),
            opacity(0.6),
            area(),
            lifespan(0.12, {
                fade: 0.05,
            }),
        ]);

        if (
            !player.invincible &&
            Math.abs(
                attack.pos.x -
                player.pos.x
            ) < 70 &&
            Math.abs(
                attack.pos.y -
                player.pos.y
            ) < 90
        ) {

            player.damage +=
                player2.fighter === "RED"
                ? RED_UPPERCUT_DAMAGE
                : player2.fighter === "BLUE"
                ? BLUE_UPPERCUT_DAMAGE
                : 15;

            player.knockbackActive = true;

            let knockback;
if (
    player2.fighter === "GOOSEY" &&
    player2.hasRedPower
) {

    knockback =
        RED_UPPERCUT_KNOCKBACK;

} else if (player2.fighter === "GOOSEY") {

    knockback =
        GOOSEY_UPPERCUT_KNOCKBACK;

} else if (player2.fighter === "RED") {
                knockback =
                    RED_UPPERCUT_KNOCKBACK;
            } else if (player2.fighter === "BLUE") {
                knockback =
                    BLUE_UPPERCUT_KNOCKBACK;
            } else {
                knockback = 300;
            }

            player.knockbackX =
                (knockback +
                player.damage * 10) *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y = -700;
        }

        return;
    }

    // ==================================================
    // GENERAL PUNCH
    // ==================================================

    const attack = add([
        rect(90, 45),
        pos(
            player2.pos.x +
            player2.facing * 65,
            player2.pos.y
        ),
        color(255, 255, 0),
        opacity(0.6),
        area(),
        lifespan(0.12, {
            fade: 0.05,
        }),
    ]);

    if (
        !player.invincible &&
        Math.abs(
            attack.pos.x -
            player.pos.x
        ) < 90 &&
        Math.abs(
            attack.pos.y -
            player.pos.y
        ) < 60
    ) {
player.damage +=
    player2.fighter === "GOOSEY" &&
    player2.hasRedPower
        ? RED_PUNCH_DAMAGE
        : player2.fighter === "RED"
        ? RED_PUNCH_DAMAGE
        : player2.fighter === "BLUE"
        ? BLUE_PUNCH_DAMAGE
        : 10;
        player.knockbackActive = true;

        let knockback;
if (
    player2.fighter === "GOOSEY" &&
    player2.hasRedPower
) {

    knockback =
        RED_PUNCH_KNOCKBACK;

} else if (player2.fighter === "GOOSEY") {

    knockback =
        GOOSEY_PUNCH_KNOCKBACK;

} else if (player2.fighter === "RED") {
            knockback =
                RED_PUNCH_KNOCKBACK;
        } else if (player2.fighter === "BLUE") {
            knockback =
                BLUE_PUNCH_KNOCKBACK;
        } else {
            knockback = 500;
        }

        player.knockbackX =
            (knockback +
            player.damage * 10) *
            player2.facing;

        player.vel.x =
            player.knockbackX;

        player.vel.y = -250;
    }
});
// ==================================================
// 🪿 GOOSEY SPECIAL SYSTEM
// ==================================================

const GOOSEY_SPECIAL_COOLDOWN = 3;
const GOOSEY_GREG_COOLDOWN = 1;

// ==================================================
// 🪿 CHAT POWERS GOOSEY CAN USE
// ==================================================

const GOOSEY_CHAT_POWERS = [
    "MAGNET",
    "BOUNCY",
    "ROCK_SOLID",
    "ICE_TRAIL",
    "FIREBALL",
    "FREEZE",
    "LIGHTNING",
];

// ==================================================
// 🪿 APPLY / RESTORE GOOSEY POWER
// ==================================================

function setupGooseyPower(goosey) {

    if (!goosey.gooseyPowers) {
        goosey.gooseyPowers = [];
    }

    if (!goosey.hasRedPower) {
        goosey.hasRedPower =
            goosey.gooseyPowers.includes(0);
    }

    if (!goosey.hasBluePower) {
        goosey.hasBluePower =
            goosey.gooseyPowers.includes(1);
    }

    if (!goosey.hasGhostyPower) {
        goosey.hasGhostyPower =
            goosey.gooseyPowers.includes(2);
    }

    if (!goosey.hasGregPower) {
        goosey.hasGregPower =
            goosey.gooseyPowers.includes(3);
    }

    if (!goosey.hasCatPower) {
        goosey.hasCatPower =
            goosey.gooseyPowers.includes(4);
    }

    if (!goosey.hasAngyCapPower) {
        goosey.hasAngyCapPower =
            goosey.gooseyPowers.includes(5);
    }

    if (!goosey.hasPenguyPower) {
        goosey.hasPenguyPower =
            goosey.gooseyPowers.includes(6);
    }

    if (!goosey.hasMarkPower) {
        goosey.hasMarkPower =
            goosey.gooseyPowers.includes(7);
    }

    if (!goosey.hasChatPower) {
        goosey.hasChatPower =
            goosey.gooseyPowers.includes(8);
    }

    // ==============================================
    // 🔴 RED
    // ==============================================

    if (goosey.hasRedPower) {

        goosey.gooseySpeed =
            RED_SPEED;
    }

    // ==============================================
    // 🔵 BLUE
    // ==============================================

    if (goosey.hasBluePower) {

        goosey.gooseySpeed =
            BLUE_SPEED;
    }

    // ==============================================
    // DEFAULT GOOSEY SPEED
    // ==============================================

    if (!goosey.hasRedPower &&
        !goosey.hasBluePower) {

        goosey.gooseySpeed =
            GOOSEY_SPEED;
    }

    // ==============================================
    // 🐱 CAT MOD
    // ==============================================

    if (goosey.hasCatPower) {

        goosey.catMod = true;

        goosey.scaleTo(
            CAT_MOD_SCALE
        );
    }
}

// ==================================================
// 🪿 GIVE GOOSEY A POWER
// ==================================================

function gooseyGetPower(
    goosey,
    opponent,
    playerNumber
) {

    if (
        goosey.fighter !==
        "GOOSEY" ||
        goosey.respawning
    ) {
        return;
    }

    const randomPower =
        Math.floor(
            Math.random() * 12
        );

    // ==================================================
    // ❄️ GOOSEY FREEZE
    // ==================================================

    if (randomPower === 0) {

        opponent.frozen = true;

        specialStatus.text =
            `GOOSEY P${playerNumber}: FREEZE!`;

        wait(10, () => {

            opponent.frozen = false;
        });

        wait(2, () => {

            specialStatus.text = "";
        });

        return;
    }

    // ==================================================
    // 💯 GOOSEY +100 DAMAGE
    // ==================================================

    if (randomPower === 1) {

        opponent.damage += 100;

        specialStatus.text =
            `GOOSEY P${playerNumber}: +100% DAMAGE!`;

        wait(2, () => {

            specialStatus.text = "";
        });

        return;
    }

    // ==================================================
    // 💥 GOOSEY SUPER KNOCKBACK
    // ==================================================

    if (randomPower === 2) {

        opponent.knockbackActive =
            true;

        opponent.knockbackX =
            1400 *
            goosey.facing;

        opponent.vel.x =
            opponent.knockbackX;

        opponent.vel.y = -600;

        specialStatus.text =
            `GOOSEY P${playerNumber}: SUPER KNOCKBACK!`;

        wait(2, () => {

            specialStatus.text = "";
        });

        return;
    }

    // ==================================================
    // 🪿 CHARACTER POWER
    // ==================================================

    if (!goosey.gooseyPowers) {
        goosey.gooseyPowers = [];
    }

    const copiedPower =
        randomPower - 3;

    // Don't copy the same character twice.
    if (
        goosey.gooseyPowers.includes(
            copiedPower
        )
    ) {

        specialStatus.text =
            `GOOSEY P${playerNumber}: ALREADY HAS THAT POWER!`;

        wait(1.5, () => {

            specialStatus.text = "";
        });

        return;
    }

    goosey.gooseyPowers.push(
        copiedPower
    );

    goosey.hasCopiedPower =
        true;

    // ==================================================
    // 🔴 RED
    // ==================================================

    if (copiedPower === 0) {

        goosey.hasRedPower =
            true;

        goosey.gooseySpeed =
            RED_SPEED;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED RED!`;
    }

    // ==================================================
    // 🔵 BLUE
    // ==================================================

    else if (copiedPower === 1) {

        goosey.hasBluePower =
            true;

        goosey.gooseySpeed =
            BLUE_SPEED;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED BLUE!`;
    }

    // ==================================================
    // 👻 GHOSTY
    // ==================================================

    else if (copiedPower === 2) {

        goosey.hasGhostyPower =
            true;

        goosey.invincible =
            true;

        goosey.ghostyActive =
            true;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED GHOSTY!`;

        wait(3, () => {

            goosey.invincible =
                false;

            goosey.ghostyActive =
                false;
        });
    }

    // ==================================================
    // 🥊 GREG
    // ==================================================

    else if (copiedPower === 3) {

        goosey.hasGregPower =
            true;

        goosey.gregCooldown =
            false;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED GREG!`;
    }

    // ==================================================
    // 🐱 ANGY-CAT
    // ==================================================

    else if (copiedPower === 4) {

        goosey.hasCatPower =
            true;

        goosey.catMod =
            true;

        goosey.scaleTo(
            CAT_MOD_SCALE
        );

        specialStatus.text =
            `GOOSEY P${playerNumber}: CAT MOD!!!`;
    }

    // ==================================================
    // 😡 ANGY-CAP
    // ==================================================

    else if (copiedPower === 5) {

        goosey.hasAngyCapPower =
            true;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED ANGY-CAP!`;
    }

    // ==================================================
    // 🐧 PENGUY
    // ==================================================

    else if (copiedPower === 6) {

        goosey.hasPenguyPower =
            true;

        specialStatus.text =
            `GOOSEY P${playerNumber}: SUPER SLIPPERY!`;
    }

    // ==================================================
    // 🙂 MARK
    // ==================================================

    else if (copiedPower === 7) {

        goosey.hasMarkPower =
            true;

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED MARK!`;

        wait(0.4, () => {

            markDimensionShift();
        });
    }

    // ==================================================
    // 💬 CHAT
    // ==================================================

    else if (copiedPower === 8) {

        goosey.hasChatPower =
            true;

        if (!goosey.gooseyChatPowers) {

            goosey.gooseyChatPowers =
                [
                    "MAGNET",
                    "BOUNCY",
                    "ROCK_SOLID",
                    "ICE_TRAIL",
                    "FIREBALL",
                    "FREEZE",
                    "LIGHTNING",
                ];
        }

        specialStatus.text =
            `GOOSEY P${playerNumber}: COPIED CHAT!`;

        wait(0.5, () => {

            specialStatus.text =
                `GOOSEY P${playerNumber}: CHAT POWERS UNLOCKED!`;
        });
    }

    wait(2, () => {

        specialStatus.text = "";
    });
}

// ==================================================
// 👻 GHOSTY COPY EFFECT
// ==================================================

onUpdate(() => {

    if (
        player.fighter === "GOOSEY" &&
        player.hasGhostyPower &&
        player.ghostyActive
    ) {

        player.invincible = true;
    }

    if (
        player2.fighter === "GOOSEY" &&
        player2.hasGhostyPower &&
        player2.ghostyActive
    ) {

        player2.invincible = true;
    }
});

// ==================================================
// 🐧 GOOSEY PENGUY PHYSICS
// ==================================================

onUpdate(() => {

    if (
        player.fighter === "GOOSEY" &&
        player.hasPenguyPower &&
        !player.knockbackActive &&
        !player.respawning &&
        !player.frozen
    ) {

        player.vel.x *=
            PENGUY_GROUND_FRICTION;

        if (
            player.vel.x >
            PENGUY_MAX_SPEED
        ) {

            player.vel.x =
                PENGUY_MAX_SPEED;
        }

        if (
            player.vel.x <
            -PENGUY_MAX_SPEED
        ) {

            player.vel.x =
                -PENGUY_MAX_SPEED;
        }
    }

    if (
        player2.fighter === "GOOSEY" &&
        player2.hasPenguyPower &&
        !player2.knockbackActive &&
        !player2.respawning &&
        !player2.frozen
    ) {

        player2.vel.x *=
            PENGUY_GROUND_FRICTION;

        if (
            player2.vel.x >
            PENGUY_MAX_SPEED
        ) {

            player2.vel.x =
                PENGUY_MAX_SPEED;
        }

        if (
            player2.vel.x <
            -PENGUY_MAX_SPEED
        ) {

            player2.vel.x =
                -PENGUY_MAX_SPEED;
        }
    }
});

// ==================================================
// 🥊 GOOSEY GREG POWER
// ==================================================

function gooseyGregAttack(
    goosey,
    opponent
) {

    if (
        !goosey.hasGregPower ||
        goosey.gregCooldown
    ) {
        return false;
    }

    goosey.gregCooldown =
        true;

    wait(
        GOOSEY_GREG_COOLDOWN,
        () => {

            goosey.gregCooldown =
                false;
        }
    );

    const attack = add([
        rect(180, 45),
        pos(
            goosey.pos.x +
            goosey.facing * 110,
            goosey.pos.y
        ),
        color(255, 150, 0),
        opacity(0.6),
        area(),
        lifespan(
            0.15,
            {
                fade: 0.05,
            }
        ),
    ]);

    if (
        !opponent.invincible &&
        Math.abs(
            attack.pos.x -
            opponent.pos.x
        ) < 170 &&
        Math.abs(
            attack.pos.y -
            opponent.pos.y
        ) < 60
    ) {

        opponent.damage += 10;

        opponent.knockbackActive =
            true;

        opponent.knockbackX =
            (
                GREG_PUNCH_KNOCKBACK +
                opponent.damage * 6
            ) *
            goosey.facing;

        opponent.vel.x =
            opponent.knockbackX;

        opponent.vel.y = -250;
    }

    return true;
}

// ==================================================
// 💥 GOOSEY ANGY-CAP POWER
// ==================================================

function gooseyAngyCapAttack(
    goosey,
    opponent
) {

    if (!goosey.hasAngyCapPower) {
        return false;
    }

    const attack = add([
        rect(120, 30),
        pos(
            goosey.pos.x +
            goosey.facing * 90,
            goosey.pos.y
        ),
        color(150, 100, 50),
        opacity(0.6),
        area(),
        lifespan(
            0.12,
            {
                fade: 0.05,
            }
        ),
    ]);

    if (
        !opponent.invincible &&
        Math.abs(
            attack.pos.x -
            opponent.pos.x
        ) < 100 &&
        Math.abs(
            attack.pos.y -
            opponent.pos.y
        ) < 50
    ) {

        opponent.damage +=
            ANGY_CAP_DAMAGE;

        opponent.knockbackActive =
            true;

        opponent.knockbackX =
            ANGY_CAP_KNOCKBACK *
            goosey.facing;

        opponent.vel.x =
            opponent.knockbackX;

        opponent.vel.y = -300;
    }

    return true;
}

// ==================================================
// 💬 GOOSEY CHAT RANDOMIZER
// ==================================================

function gooseyChatRandomMove(
    goosey,
    opponent
) {

    if (!goosey.hasChatPower) {
        return;
    }

    const randomChat =
        Math.floor(
            Math.random() *
            GOOSEY_CHAT_POWERS.length
        );

    const power =
        GOOSEY_CHAT_POWERS[randomChat];

    // ==================================================
    // 🧲 MAGNET
    // ==================================================

    if (power === "MAGNET") {

        specialStatus.text =
            "GOOSEY CHAT: 🧲 MAGNET!";

        opponent.vel.x +=
            (
                goosey.pos.x -
                opponent.pos.x
            ) *
            2 *
            dt();
    }

    // ==================================================
    // 🟢 BOUNCY
    // ==================================================

    else if (power === "BOUNCY") {

        specialStatus.text =
            "GOOSEY CHAT: 🟢 BOUNCY!";

        goosey.vel.y = -900;
    }

    // ==================================================
    // 🪨 ROCK SOLID
    // ==================================================

    else if (power === "ROCK_SOLID") {

        specialStatus.text =
            "GOOSEY CHAT: 🪨 ROCK SOLID!";

        goosey.knockbackActive =
            false;

        goosey.knockbackX = 0;

        goosey.vel.x = 0;
    }

    // ==================================================
    // 🧊 ICE TRAIL
    // ==================================================

    else if (power === "ICE_TRAIL") {

        specialStatus.text =
            "GOOSEY CHAT: 🧊 ICE TRAIL!";

        add([
            rect(35, 8),
            pos(
                goosey.pos.x,
                goosey.pos.y + 30
            ),
            color(
                150,
                230,
                255
            ),
            opacity(0.7),
            lifespan(
                0.5,
                {
                    fade: 0.4,
                }
            ),
        ]);
    }

    // ==================================================
    // 🔥 FIREBALL
    // ==================================================

    else if (power === "FIREBALL") {

        specialStatus.text =
            "GOOSEY CHAT: 🔥 FIREBALL!";

        const direction =
            goosey.facing;

        const fireball = add([
            circle(15),
            pos(
                goosey.pos.x +
                direction * 55,
                goosey.pos.y
            ),
            anchor("center"),
            color(
                255,
                80,
                0
            ),
            area(),
            {
                speed: 750,
                hit: false,
            },
            opacity(0.7),
            lifespan(
                1.5,
                {
                    fade: 0.3,
                }
            ),
        ]);

        fireball.onUpdate(() => {

            fireball.move(
                fireball.speed *
                direction,
                0
            );

            if (
                !fireball.hit &&
                !opponent.invincible &&
                Math.abs(
                    fireball.pos.x -
                    opponent.pos.x
                ) < 40 &&
                Math.abs(
                    fireball.pos.y -
                    opponent.pos.y
                ) < 50
            ) {

                fireball.hit = true;

                opponent.damage += 20;

                opponent.knockbackActive =
                    true;

                opponent.knockbackX =
                    700 * direction;

                opponent.vel.x =
                    opponent.knockbackX;

                opponent.vel.y = -400;

                shake(8);

                destroy(fireball);
            }
        });
    }

    // ==================================================
    // ❄️ FREEZE
    // ==================================================

    else if (power === "FREEZE") {

        specialStatus.text =
            "GOOSEY CHAT: ❄️ FREEZE!";

        opponent.frozen =
            true;

        wait(3, () => {

            opponent.frozen =
                false;
        });
    }

    // ==================================================
    // ⚡ LIGHTNING
    // ==================================================

    else if (
        power ===
        "LIGHTNING"
    ) {

        specialStatus.text =
            "GOOSEY CHAT: ⚡ LIGHTNING!";

        opponent.damage +=
            200;

        opponent.knockbackActive =
            true;

        opponent.knockbackX =
            1100 *
            goosey.facing;

        opponent.vel.x =
            opponent.knockbackX;

        opponent.vel.y = -800;

        shake(30);
    }

    wait(2, () => {

        specialStatus.text = "";
    });
}

// ==================================================
// 🪿 GOOSEY P1 SPECIAL
// ==================================================

onKeyPress("enter", () => {

    if (
        player.fighter !== "GOOSEY" ||
        player.respawning ||
        player.specialUsed
    ) {
        return;
    }

    player.specialUsed = true;

    gooseyGetPower(
        player,
        player2,
        1
    );

    wait(
        GOOSEY_SPECIAL_COOLDOWN,
        () => {

            player.specialUsed =
                false;
        }
    );
});

// ==================================================
// 🪿 GOOSEY P2 SPECIAL
// ==================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code !==
            "ShiftLeft"
        ) {
            return;
        }

        if (
            player2.fighter !==
            "GOOSEY" ||
            player2.respawning ||
            player2.specialUsed
        ) {
            return;
        }

        player2.specialUsed =
            true;

        gooseyGetPower(
            player2,
            player,
            2
        );

        wait(
            GOOSEY_SPECIAL_COOLDOWN,
            () => {

                player2.specialUsed =
                    false;
            }
        );
    }
);

// ==================================================
// 🪿 GOOSEY ATTACK HOOKS
// ==================================================

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code !==
            "ShiftRight"
        ) {
            return;
        }

        if (
            player.fighter !==
            "GOOSEY" ||
            player.respawning ||
            player.frozen ||
            player.invincible
        ) {
            return;
        }

        if (
            player.hasGregPower
        ) {

            gooseyGregAttack(
                player,
                player2
            );

            return;
        }

        if (
            player.hasAngyCapPower
        ) {

            gooseyAngyCapAttack(
                player,
                player2
            );

            return;
        }

        if (
            player.hasChatPower
        ) {

            gooseyChatRandomMove(
                player,
                player2
            );
        }
    }
);

window.addEventListener(
    "keydown",
    (event) => {

        if (
            event.code !==
            "f"
        ) {
            return;
        }

        if (
            player2.fighter !==
            "GOOSEY" ||
            player2.respawning ||
            player2.frozen ||
            player2.invincible
        ) {
            return;
        }

        if (
            player2.hasGregPower
        ) {

            gooseyGregAttack(
                player2,
                player
            );

            return;
        }

        if (
            player2.hasAngyCapPower
        ) {

            gooseyAngyCapAttack(
                player2,
                player
            );

            return;
        }

        if (
            player2.hasChatPower
        ) {

            gooseyChatRandomMove(
                player2,
                player
            );
        }
    }
);
// ==================================================
// 👻 GHOSTY SPECIAL P1
// ==================================================

onKeyPress("enter", () => {

    if (
        player.fighter !== "GHOSTY" ||
        player.respawning ||
        player.specialUsed
    ) {
        return;
    }

    player.specialUsed = true;
    player.invincible = true;

    player.knockbackActive = false;
    player.knockbackX = 0;

    player.vel.x = 0;
    player.vel.y = 0;

    specialStatus.text =
        "GHOSTY P1: INVINCIBLE!";

    wait(3, () => {

        player.invincible = false;

        player.knockbackActive = false;
        player.knockbackX = 0;

        player.vel.x = 0;

        player.specialUsed = false;

        specialStatus.text = "";
    });
});
// ==================================================
// 👻 GHOSTY SPECIAL P2
// ==================================================

window.addEventListener("keydown", (event) => {

    if (
        event.code !== "ShiftLeft"
    ) {
        return;
    }

    if (
        window.singlePlayerMode === true
    ) {
        return;
    }

    if (
        player2.fighter !== "GHOSTY" ||
        player2.respawning ||
        player2.specialUsed
    ) {
        return;
    }

    player2.specialUsed = true;
    player2.invincible = true;

    player2.knockbackActive = false;
    player2.knockbackX = 0;

    player2.vel.x = 0;
    player2.vel.y = 0;

    specialStatus.text =
        "GHOSTY P2: INVINCIBLE!";

    wait(3, () => {

        player2.invincible = false;

        player2.knockbackActive = false;
        player2.knockbackX = 0;

        player2.vel.x = 0;

        player2.specialUsed = false;

        specialStatus.text = "";
    });
});
// ==================================================
// ANGY-CAT SPECIAL P1
// ==================================================

onKeyPress("enter", () => {

    if (
        player.fighter !== "ANGY-CAT" ||
        player.respawning ||
        player.specialUsed
    ) {
        return;
    }

    player.specialUsed = true;
    player.catMod = true;

    player.scaleTo(CAT_MOD_SCALE);

    specialStatus.text =
        "ANGY-CAT P1: CAT MOD!!!";

    wait(CAT_MOD_TIME, () => {

        player.catMod = false;

        player.scaleTo(CAT_NORMAL_SCALE);

        specialStatus.text = "";
    });
});

// ==================================================
// ANGY-CAT SPECIAL P2
// ==================================================

window.addEventListener("keydown", (event) => {

    if (event.code !== "ShiftLeft") {
        return;
    }

    if (
        player2.fighter !== "ANGY-CAT" ||
        player2.respawning ||
        player2.specialUsed
    ) {
        return;
    }

    player2.specialUsed = true;
    player2.catMod = true;

    player2.scaleTo(CAT_MOD_SCALE);

    specialStatus.text =
        "ANGY-CAT P2: CAT MOD!!!";

    wait(CAT_MOD_TIME, () => {

        player2.catMod = false;

        player2.scaleTo(CAT_NORMAL_SCALE);

        specialStatus.text = "";
    });
});

// ==================================================
// MARK SPECIAL P1
// ==================================================

onKeyPress("enter", () => {

    if (
        player.fighter !== "MARK" ||
        player.respawning ||
        player.specialUsed
    ) {
        return;
    }

    player.specialUsed = true;

    markDimensionShift();
});

// ==================================================
// MARK SPECIAL — DIMENSION SHIFT
// ==================================================

function markDimensionShift() {

    specialStatus.text =
        "MARK: DIMENSION SHIFT!!!";

    const darkness = add([
        rect(800, 450),
        pos(0, 0),
        color(0, 0, 0),
        opacity(0),
        z(100),
    ]);

    tween(
        0,
        0.75,
        0.6,
        (value) => {
            darkness.opacity = value;
        }
    );

    for (let i = 0; i < 6; i++) {

        wait(i * 0.08, () => {

            const ring = add([
                circle(30),
                pos(400, 225),
                color(150, 0, 255),
                opacity(0.7),
                anchor("center"),
                z(101),
            ]);

            tween(
                30,
                500,
                0.8,
                (value) => {
                    ring.radius = value;
                    ring.opacity =
                        0.7 * (1 - value / 500);
                }
            );

            wait(0.8, () => {
                destroy(ring);
            });
        });
    }

    shake(15);

    wait(1, () => {

        shake(30);

        specialStatus.text =
            "WELCOME TO ANOTHER DIMENSION!";

        wait(0.5, () => {

            destroy(darkness);

            specialStatus.text = "";

            const markWorld =
                Math.floor(Math.random() * 5);

            markWorldActive = true;

            if (markWorld === 0) {

                SPEED -= 150;
                GOOSEY_SPEED -= 150;
                RED_SPEED -= 150;
                BLUE_SPEED -= 150;
                PENGUY_SPEED -= 150;

                specialStatus.text =
                    "🐌 SLOW WORLD!!!";

            } else if (markWorld === 1) {

                SPEED += 150;
                GOOSEY_SPEED += 150;
                RED_SPEED += 150;
                BLUE_SPEED += 150;
                PENGUY_SPEED += 150;

                specialStatus.text =
                    "⚡ SPEED WORLD!!!";

            } else if (markWorld === 2) {

                specialStatus.text =
                    "🌪️ CHAOS WORLD!!!";

                function chaosEffect() {

                    if (!markWorldActive) {
                        return;
                    }

                    const chaos =
                        Math.floor(Math.random() * 5);

                    if (chaos === 0) {

                        player.knockbackActive = true;

                        player.knockbackX =
                            (Math.random() < 0.5 ? -1 : 1) * 1200;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y = -400;

                        player2.knockbackActive = true;

                        player2.knockbackX =
                            (Math.random() < 0.5 ? -1 : 1) * 1200;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y = -400;

                    } else if (chaos === 1) {

                        player.vel.y = -1000;
                        player2.vel.y = -1000;

                    } else if (chaos === 2) {

                        player.facing *= -1;
                        player2.facing *= -1;

                    } else if (chaos === 3) {

                        player.knockbackActive = true;

                        player.knockbackX =
                            (Math.random() < 0.5 ? -1 : 1) * 1800;

                        player.vel.x =
                            player.knockbackX;

                        player2.knockbackActive = true;

                        player2.knockbackX =
                            (Math.random() < 0.5 ? -1 : 1) * 1800;

                        player2.vel.x =
                            player2.knockbackX;

                    } else {

                        player.knockbackActive = true;

                        player.knockbackX =
                            (Math.random() * 2400) - 1200;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y = -700;

                        player2.knockbackActive = true;

                        player2.knockbackX =
                            (Math.random() * 2400) - 1200;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y = -700;
                    }

                    wait(0.7, chaosEffect);
                }

                chaosEffect();

            } else if (markWorld === 3) {

                markIceWorld = true;

                specialStatus.text =
                    "🧊 ICE WORLD!!!";

            } else {

                specialStatus.text =
                    "🌑 VOID WORLD!!!";

                setGravity(4500);

                add([
                    rect(800, 450),
                    pos(0, 0),
                    color(0, 0, 0),
                    opacity(0.35),
                    z(50),
                ]);
            }
        });
    });
}

// ==================================================
// 🎲 CHAT SPECIAL — RANDOMIZER
// ==================================================

function activateChatSpecial(chat, opponent) {

    if (
        chat.fighter !== "CHAT" ||
        chat.respawning ||
        chat.specialUsed
    ) {
        return;
    }

    chat.specialUsed = true;

    const randomPower =
        Math.floor(Math.random() * 7);

    chat.chatPower = randomPower;

    // ==============================================
    // 🧲 MAGNET
    // ==============================================

    if (randomPower === 0) {

        specialStatus.text =
            "CHAT: 🧲 MAGNET!!!";

        wait(2, () => {
            specialStatus.text = "";
        });

    // ==============================================
    // 🟢 BOUNCY
    // ==============================================

    } else if (randomPower === 1) {

        specialStatus.text =
            "CHAT: 🟢 BOUNCY!!!";

        wait(2, () => {
            specialStatus.text = "";
        });

    // ==============================================
    // 🪨 ROCK SOLID
    // ==============================================

    } else if (randomPower === 2) {

        specialStatus.text =
            "CHAT: 🪨 ROCK SOLID!!!";

        chat.knockbackActive = false;
        chat.knockbackX = 0;
        chat.vel.x = 0;

        wait(2, () => {
            specialStatus.text = "";
        });

    // ==============================================
    // 🧊 ICE TRAIL
    // ==============================================

    } else if (randomPower === 3) {

        specialStatus.text =
            "CHAT: 🧊 ICE TRAIL!!!";

        wait(2, () => {
            specialStatus.text = "";
        });

    // ==============================================
    // 🔥 FIREBALL
    // ==============================================

    } else if (randomPower === 4) {

        specialStatus.text =
            "CHAT: 🔥 FIREBALL!!!";

        wait(2, () => {
            specialStatus.text = "";
        });

    // ==============================================
    // ❄️ FREEZE
    // ==============================================

    } else if (randomPower === 5) {

        opponent.frozen = true;

        specialStatus.text =
            "CHAT: ❄️ FREEZE!!!";

        wait(3, () => {

            opponent.frozen = false;
            specialStatus.text = "";

        });

    // ==============================================
    // ⚡ LIGHTNING
    // ==============================================

    } else {

        specialStatus.text =
            "CHAT: ⚡ LIGHTNING!!!";

        // 💀 CHAT LIGHTNING = 200% DAMAGE
        opponent.damage += 200;

        // ⚡ Lightning bolt pieces
        const strikeX = opponent.pos.x;
        const strikeY = opponent.pos.y;

        const bolt1 = add([
            rect(14, 120),
            pos(strikeX - 25, strikeY - 170),
            rotate(18),
            color(255, 255, 0),
            opacity(1),
            z(100),
        ]);

        const bolt2 = add([
            rect(14, 110),
            pos(strikeX + 5, strikeY - 90),
            rotate(-22),
            color(255, 255, 255),
            opacity(1),
            z(100),
        ]);

        const bolt3 = add([
            rect(14, 100),
            pos(strikeX - 10, strikeY - 20),
            rotate(15),
            color(255, 255, 0),
            opacity(1),
            z(100),
        ]);

        const impact = add([
            rect(100, 14),
            pos(strikeX, strikeY + 35),
            color(255, 255, 255),
            opacity(1),
            anchor("center"),
            z(100),
        ]);

        opponent.knockbackActive = true;

        opponent.knockbackX =
            1100 * chat.facing;

        opponent.vel.x =
            opponent.knockbackX;

        opponent.vel.y = -800;

        shake(30);

        wait(0.2, () => {

            if (bolt1.exists()) {
                destroy(bolt1);
            }

            if (bolt2.exists()) {
                destroy(bolt2);
            }

            if (bolt3.exists()) {
                destroy(bolt3);
            }

            if (impact.exists()) {
                destroy(impact);
            }
        });

        wait(2, () => {
            specialStatus.text = "";
        });
    }
}

// ==================================================
// 🎲 CHAT SPECIAL P1
// ==================================================

onKeyPress("enter", () => {

    activateChatSpecial(
        player,
        player2
    );
});

// ==================================================
// 🎲 CHAT SPECIAL P2
// ==================================================

window.addEventListener("keydown", (event) => {

    if (event.code !== "ShiftLeft") {
        return;
    }

    activateChatSpecial(
        player2,
        player
    );
});

// ==================================================
// 🧊 ICE WORLD PHYSICS
// ==================================================

onUpdate(() => {

    if (!markIceWorld) {
        return;
    }

    // ==============================================
    // 🧊 PLAYER 1 ICE
    // ==============================================

    if (
        !player.knockbackActive &&
        !player.respawning &&
        !player.frozen
    ) {

        player.vel.x *= ICE_FRICTION;

        if (player.vel.x > ICE_MAX_SPEED) {
            player.vel.x = ICE_MAX_SPEED;
        }

        if (player.vel.x < -ICE_MAX_SPEED) {
            player.vel.x = -ICE_MAX_SPEED;
        }
    }

    // ==============================================
    // 🧊 PLAYER 2 ICE
    // ==============================================

    if (
        !player2.knockbackActive &&
        !player2.respawning &&
        !player2.frozen
    ) {

        player2.vel.x *= ICE_FRICTION;

        if (player2.vel.x > ICE_MAX_SPEED) {
            player2.vel.x = ICE_MAX_SPEED;
        }

        if (player2.vel.x < -ICE_MAX_SPEED) {
            player2.vel.x = -ICE_MAX_SPEED;
        }
    }
});

// ==================================================
// 🙂 MARK SPECIAL P2 — DIMENSION SHIFT
// ==================================================

window.addEventListener("keydown", (event) => {

    if (event.code !== "ShiftLeft") {
        return;
    }

    if (
        player2.fighter !== "MARK" ||
        player2.respawning ||
        player2.specialUsed
    ) {
        return;
    }

    player2.specialUsed = true;

    markDimensionShift();
});

// ==================================================
// 💥 BLAST ZONES
// ==================================================

onUpdate(() => {

    if (
        !player.respawning &&
        (
            player.pos.x < -100 ||
            player.pos.x > 900 ||
            player.pos.y < -150 ||
            player.pos.y > 550
        )
    ) {

        player.respawning = true;
        player.stocks--;

        player.vel.x = 0;
        player.vel.y = 0;
        player.knockbackActive = false;

        if (player.stocks <= 0) {

            player.stocks = 0;

            go("win", {
                winner: player2.fighter,
            });

        } else {

            wait(1, () => {

                player.pos =
                    vec2(200, 200);

                player.vel.x = 0;
                player.vel.y = 0;

                player.damage = 0;
                player.knockbackActive = false;
                player.respawning = false;
            });
        }
    }

    if (
        !player2.respawning &&
        (
            player2.pos.x < -100 ||
            player2.pos.x > 900 ||
            player2.pos.y < -150 ||
            player2.pos.y > 550
        )
    ) {

        player2.respawning = true;
        player2.stocks--;

        player2.vel.x = 0;
        player2.vel.y = 0;
        player2.knockbackActive = false;

        if (player2.stocks <= 0) {

            player2.stocks = 0;

            go("win", {
                winner: player.fighter,
            });

        } else {

            wait(1, () => {

                player2.pos =
                    vec2(550, 200);

                player2.vel.x = 0;
                player2.vel.y = 0;

                player2.damage = 0;
                player2.knockbackActive = false;
                player2.respawning = false;
            });
        }
    }
});
});
// ==================================================
// WIN SCENE
// ==================================================

scene("win", (data) => {

    add([
        text("WINNER!!!"),
        pos(400, 50),
        anchor("center"),
        scale(2),
    ]);

    add([
        text(data.winner),
        pos(400, 100),
        anchor("center"),
        scale(1.5),
    ]);

    let winner;

    if (data.winner === "GOOSEY") {

        winner = add([
            sprite("hero", {
                anim: "idle",
            }),
            pos(400, 210),
            anchor("center"),
            scale(4),
        ]);

    } else if (data.winner === "GREG") {

        winner = add([
            sprite("Greg"),
            pos(400, 210),
            anchor("center"),
            scale(4),
        ]);

    } else if (data.winner === "GHOSTY") {

        winner = add([
            sprite("G"),
            pos(400, 210),
            anchor("center"),
            scale(6),
        ]);

    } else if (data.winner === "ANGY-CAT") {

        winner = add([
            sprite("AnGy-CaT"),
            pos(400, 210),
            anchor("center"),
            scale(2),
        ]);

    } else if (data.winner === "ANGY-CAP") {

        winner = add([
            sprite("Angy-Cap"),
            pos(400, 210),
            anchor("center"),
            scale(3),
        ]);

    } else if (data.winner === "PENGUY") {

        winner = add([
            sprite("Penguy"),
            pos(400, 210),
            anchor("center"),
            scale(4),
        ]);

    } else if (data.winner === "MARK") {

        winner = add([
            sprite("mark"),
            pos(400, 210),
            anchor("center"),
            scale(0.5),
        ]);

    } else if (data.winner === "CHAT") {

        winner = add([
            sprite("Chat"),
            pos(400, 210),
            anchor("center"),
            scale(0.5),
        ]);

    } else if (data.winner === "RED") {

        winner = add([
            rect(70, 70),
            pos(400, 210),
            anchor("center"),
            color(255, 0, 0),
            scale(1),
        ]);

    } else if (data.winner === "BLUE") {

        winner = add([
            rect(70, 70),
            pos(400, 210),
            anchor("center"),
            color(0, 0, 255),
            scale(1),
        ]);

    } else {

        winner = add([
            rect(70, 70),
            pos(400, 210),
            anchor("center"),
            color(0, 100, 255),
            scale(1),
        ]);
    }

    let winTime = 0;

    const winStartX = 400;
    const winStartY = 210;

    const baseScale = vec2(
        winner.scale.x,
        winner.scale.y
    );

    onUpdate(() => {

        winTime += dt();

        winner.pos.x =
            winStartX +
            Math.sin(winTime * 2.2) * 180;

        winner.pos.y =
            winStartY +
            Math.sin(winTime * 5) * 80;

        winner.angle =
            Math.sin(winTime * 8) * 180;

        winner.scaleTo(
            vec2(
                baseScale.x +
                Math.sin(winTime * 7) * 0.15,

                baseScale.y +
                Math.cos(winTime * 7) * 0.15
            )
        );
    });

    add([
        text("PRESS ENTER TO FIGHT AGAIN"),
        pos(400, 410),
        anchor("center"),
        scale(0.8),
    ]);

    onKeyPress("enter", () => {
        go("characterSelect");
    });
});

// ==================================================
// START GAME
// ==================================================

go("title");
