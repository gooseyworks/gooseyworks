const k = kaplay({
    width: 800,
    height: 450,
    background: [135, 206, 235],
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

loadSprite("Bach", "assets/sprites/BACH.png", {
    sliceX: 52,
    sliceY: 1,
    anims: {
        bach: {
            from: 0,
            to: 51,
            loop: true,
            speed: 12,
        },
        bachSpecial: {
            from: 34,
            to: 51,
            loop: false,
            speed: 12,
        },
    },
});

loadSprite("Nathaniel", "assets/sprites/NATHANIEL.png", {
    sliceX: 20,
    sliceY: 1,
    anims: {
        nathaniel: {
            from: 0,
            to: 19,
            loop: true,
            speed: 12,
        },
        nathanielSpecial: {
            from: 7,
            to: 19,
            loop: false,
            speed: 12,
        },
    },
});

loadSprite("Kachen", "assets/sprites/Kachen.png");

loadSprite("Denku", "assets/sprites/Denku.png", {
    sliceX: 7,
    anims: {
        idle: 0,
        superhero: {
            from: 1,
            to: 6,
            loop: true,
            speed: 8,
        },
    },
});
// ==========================
// Songs
// ==========================
// Intro
loadSound(
    "Run Until the Sun Comes Up",
    "assets/sounds/Run Until the Sun Comes Up.mp3"
);
//Title/Character Select
loadSound("menuMusic", "assets/sounds/found_you_-_andynope.mp3");
// Win Scene
loadSound("victoryMusic", "assets/sounds/Fanfare March of Glory.mp3");
//Fight Scene
loadSound("rotten", "assets/sounds/LinWolinski - Zone-rage - 01 Rotten.ogg");
loadSound("contextRage", "assets/sounds/LinWolinski - Zone-rage - 02 Context rage.ogg");
loadSound("letSleep", "assets/sounds/LinWolinski - Zone-rage - 03 Let sleep.ogg");
loadSound("pray", "assets/sounds/LinWolinski - Zone-rage - 04 Pray.ogg");

// ==================================================
// GOOSEY SMASH — MUSIC MANAGER
// ==================================================

let currentMusicHandle = null;
let currentMusicKey = null;
let musicGeneration = 0;

const FIGHT_PLAYLIST = [
    "rotten",
    "contextRage",
    "letSleep",
    "pray",
];

let fightPlaylistIndex = 0;

// Stop whatever music is currently playing
function stopGameMusic() {
    musicGeneration++;

    if (currentMusicHandle) {
        currentMusicHandle.stop();
    }

    currentMusicHandle = null;
    currentMusicKey = null;
}

// Play a single track.
// If the same track is already playing, don't restart it.
function playGameMusic(track, shouldLoop = true) {
    if (currentMusicKey === track && currentMusicHandle) {
        return;
    }

    stopGameMusic();

    currentMusicKey = track;

    currentMusicHandle = play(track, {
        loop: shouldLoop,
        volume: 0.65,
    });
}

// Start the battle playlist
function playNextFightTrack() {
    const track = FIGHT_PLAYLIST[fightPlaylistIndex];
    const generation = musicGeneration;

    currentMusicKey = track;

    const handle = play(track, {
        loop: false,
        volume: 0.70,
    });

    currentMusicHandle = handle;

    // When this song finishes, advance to the next one.
    handle.onEnd(() => {
        if (generation !== musicGeneration) return;
        if (currentMusicHandle !== handle) return;

        fightPlaylistIndex =
            (fightPlaylistIndex + 1) % FIGHT_PLAYLIST.length;

        playNextFightTrack();
    });
}

// Start a fresh battle playlist
function startFightPlaylist() {
    stopGameMusic();
    fightPlaylistIndex = 0;
    playNextFightTrack();
}

// ==================================================
// CONSTANTS
// ==================================================

let SPEED = 300;
let GOOSEY_SPEED = 350;
let PENGUY_SPEED = 300;

const PENGUY_SLIDE_FRICTION = 0.97;
const PENGUY_KNOCKBACK_FRICTION = 0.985;

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

// BACH
const BACH_SPEED = 800;
const BACH_AURA_TIME = 10;
const JUMP_FORCE = 700;

const START_DAMAGE = 0;
const START_STOCKS = 3;

// GREG
const GREG_PUNCH_KNOCKBACK = 650;
const GREG_UPPERCUT_KNOCKBACK = 450;
const GREG_ATTACK_COOLDOWN = 0.45;

// GOOSEY
const GOOSEY_PUNCH_KNOCKBACK = 600;
const GOOSEY_UPPERCUT_KNOCKBACK = 400;

// ANGY-CAT
const CAT_MOD_TIME = 5;
const CAT_NORMAL_SCALE = 0.5;
const CAT_MOD_SCALE = 0.25;

// ANGY-CAP
const ANGY_CAP_DAMAGE = 10;
const ANGY_CAP_KNOCKBACK = 1800;

// DENKU
const DENKU_KNOCKBACK = 1100;
const DENKU_SPECIAL_TIME = 10;
const DENKU_SELF_DAMAGE = 10;

// ==================================================
// BACH BALL SYSTEM
// ==================================================

let bachBallP1 = null;
let bachBallP2 = null;

// ==================================================
// MAPS
// ==================================================

const MAP_GRASSLAND = 0;
const MAP_PARKOUR = 1;
const MAP_PARKOUR_NIGHTMARE = 2;
const MAP_GRAVITY_CHAOS = 3;
const MAP_PARKOUR_GRAVITY = 4;
const MAP_VOLCANO = 5;

let markWorldActive = false;
let timeScale = 1;
let markIceWorld = false;

const ICE_ACCELERATION = 900;
const ICE_MAX_SPEED = 600;
const ICE_FRICTION = 0.98;

// ==================================================
// GOOSEY PERSISTENT POWERS
// ==================================================

let gooseyPowersP1 = [];
let gooseyPowersP2 = [];
// ==================================================
// GOOSEY SMASH WORLD ULTIMATE — CINEMATIC INTRO
// ==================================================

function registerGooseyIntro() {

    const INTRO_DURATION = 167;
    const MUSIC_ID = "Run Until the Sun Comes Up";
    const GROUND_Y = 305;

    const CHARACTERS = {
        PENGUY: "Penguy",
        GREG: "Greg",
        GHOSTY: "G",
        MARK: "mark",
        "ANGY-CAT": "AnGy-CaT",
        "ANGY-CAP": "Angy-Cap",
        CHAT: "Chat",
        GOOSEY: "hero",
    };

    let introMusic = null;

    scene("gooseyIntro", () => {

        let elapsed = 0;
        let eventIndex = 0;
        let finished = false;

        let flashAlpha = 0;
        let flashHold = 0;
        let flashColor = [255, 255, 255];
        let stageObjects = [];
        let tabVisibilityHandler = null;

        let battle = null;
        let cameraShake = 0;
        let speedLines = [];

        function addStage(components) {
            const obj = add(components);
            stageObjects.push(obj);
            return obj;
        }

        function clearStage() {
            for (const obj of stageObjects) destroy(obj);
            stageObjects = [];
            speedLines = [];
            battle = null;
        }

        function backdrop(bgColor) {
            clearStage();
            setCamPos(400, 225);
            setCamScale(1);

            addStage([
                rect(800, 450),
                pos(0, 0),
                anchor("topleft"),
                color(...bgColor),
                z(-100),
            ]);

            addStage([
                rect(800, 90),
                pos(400, 340),
                anchor("center"),
                color(255, 170, 70),
                opacity(0.16),
                z(-90),
            ]);
        }

        function addText(message, y, size = 28, col = [255, 255, 255]) {
            return addStage([
                text(message, { size }),
                pos(400, y),
                anchor("center"),
                color(...col),
                z(50),
            ]);
        }

        function finalScaleFor(name) {
            if (name === "PENGUY") return 0.35;
            if (name === "CHAT") return 0.09;
            if (name === "ANGY-CAT" || name === "ANGY-CAP") return 0.55;
            return 2.6;
        }

        function addCharacter(name, x, y, size) {
            if (name === "RED" || name === "BLUE") {
                const boxColor = name === "RED" ? [255, 45, 45] : [45, 110, 255];
                return addStage([
                    rect(58, 58),
                    pos(x, y),
                    anchor("center"),
                    color(...boxColor),
                    outline(4, rgb(255, 255, 255)),
                    rotate(0),
                    z(10),
                ]);
            }

            const spriteId = CHARACTERS[name];
            if (!spriteId) return null;

            const character = addStage([
                sprite(spriteId),
                pos(x, y),
                anchor("center"),
                scale(size),
                rotate(0),
                z(10),
            ]);

            if (name === "GOOSEY") character.play("idle");
            return character;
        }

        function spawnDust(x, y, tint) {
            for (let i = 0; i < 5; i++) {
                const puff = addStage([
                    circle(4 + Math.random() * 5),
                    pos(x + rand(-10, 10), y),
                    anchor("center"),
                    color(...tint),
                    opacity(0.7),
                    z(8),
                ]);
                const drift = rand(-70, 70);
                tween(0, 1, 0.35, (t) => {
                    if (!puff.exists()) return;
                    puff.moveTo(x + drift * t, y - 28 * t);
                    puff.opacity = 0.7 * (1 - t);
                }, easings.linear);
            }
        }

        function spawnBurst(x, y, tint) {
            for (let i = 0; i < 10; i++) {
                const angle = (Math.PI * 2 * i) / 10 + Math.random() * 0.4;
                const dist = 40 + Math.random() * 70;
                const spark = addStage([
                    circle(rand(3, 7)),
                    pos(x, y),
                    anchor("center"),
                    color(...tint),
                    opacity(1),
                    z(140),
                ]);
                tween(0, 1, 0.28, (t) => {
                    if (!spark.exists()) return;
                    spark.moveTo(x + Math.cos(angle) * dist * t, y + Math.sin(angle) * dist * t);
                    spark.opacity = 1 - t;
                }, easings.easeOutQuad);
            }
        }

        function addSpeedLines(tint) {
            for (let i = 0; i < 14; i++) {
                const line = addStage([
                    rect(rand(40, 120), 3),
                    pos(rand(0, 800), rand(40, 400)),
                    anchor("center"),
                    color(...tint),
                    opacity(rand(0.15, 0.45)),
                    z(-20),
                ]);
                speedLines.push({ obj: line, speed: rand(280, 720) });
            }
        }

        function slideTitle(name) {
            const title = addText(name, 70, 42);
            title.moveTo(900, 70);
            tween(900, 400, 0.35, (x) => {
                if (title.exists()) title.moveTo(x, 70);
            }, easings.easeOutQuad);
        }

        // ---------- SPECIAL ENTRANCES ----------

        function entrancePenguy(char) {
            addStage([
                rect(800, 450),
                pos(0, 0),
                anchor("topleft"),
                color(150, 210, 255),
                opacity(0.38),
                z(-40),
            ]);
            for (let i = 0; i < 9; i++) {
                const spike = addStage([
                    rect(16, rand(50, 130)),
                    pos(30 + i * 90, -20),
                    anchor("top"),
                    color(210, 240, 255),
                    opacity(0.9),
                    outline(2, rgb(120, 180, 220)),
                    z(6),
                ]);
                tween(-20, rand(0, 18), 0.6, (y) => {
                    if (spike.exists()) spike.moveTo(spike.pos.x, y);
                }, easings.easeOutQuad);
            }
            tween(-180, 400, 0.85, (x) => {
                if (!char.exists()) return;
                char.moveTo(x, 312);
                char.angle = -18;
            }, easings.easeOutCubic);
            flashColor = [190, 230, 255];
            flashAlpha = 0.45;
        }

        function entranceRed(char) {
            const blood = addStage([
                rect(800, 450),
                pos(0, 0),
                anchor("topleft"),
                color(120, 0, 0),
                opacity(0),
                z(-40),
            ]);
            tween(0, 0.72, 0.45, (v) => {
                if (blood.exists()) blood.opacity = v;
            }, easings.easeOutQuad);

            tween(0, 1, 0.7, (t) => {
                if (!char.exists()) return;
                const x = -80 + 480 * t;
                const jump = Math.sin(t * Math.PI) * 150;
                char.moveTo(x, 300 - jump);
                char.angle = t < 0.5 ? -12 : 8;
            }, easings.easeOutQuad);
            flashColor = [180, 0, 0];
            flashAlpha = 0.35;
        }

        function entranceBlue(char) {
            addStage([
                rect(800, 70),
                pos(400, 360),
                anchor("center"),
                color(30, 120, 220),
                opacity(0.85),
                z(2),
            ]);
            tween(0, 1, 0.55, (t) => {
                if (!char.exists()) return;
                const x = -200 + 700 * t;
                const jump = Math.sin(Math.min(1, t * 1.3) * Math.PI) * 120;
                char.moveTo(Math.min(400, x), 300 - jump);
            }, easings.linear);
            wait(0.42, () => {
                if (!char.exists()) return;
                spawnBurst(char.pos.x, 340, [80, 180, 255]);
                for (let i = 0; i < 8; i++) {
                    const drop = addStage([
                        circle(rand(4, 9)),
                        pos(char.pos.x, 340),
                        anchor("center"),
                        color(120, 200, 255),
                        opacity(0.9),
                        z(20),
                    ]);
                    const dx = rand(-140, 140);
                    tween(0, 1, 0.45, (t) => {
                        if (!drop.exists()) return;
                        drop.moveTo(char.pos.x + dx * t, 340 - Math.sin(t * Math.PI) * 90);
                        drop.opacity = 1 - t;
                    }, easings.easeOutQuad);
                }
                cameraShake = 7;
            });
        }

        function entranceGreg(char) {
            tween(0, 1, 0.85, (t) => {
                if (!char.exists()) return;
                const x = -120 + 470 * Math.min(1, t / 0.62);
                const jumping = t > 0.62;
                const jt = jumping ? (t - 0.62) / 0.38 : 0;
                const y = jumping ? 300 - Math.sin(jt * Math.PI) * 110 : 300 - Math.abs(Math.sin(x * 0.08)) * 14;
                char.moveTo(x, y);
                char.angle = jumping ? -30 + jt * 50 : 0;
            }, easings.linear);
            wait(0.78, () => {
                cameraShake = 8;
                spawnBurst(470, 230, [180, 255, 160]);
                for (let i = 0; i < 7; i++) {
                    const x = 80 + i * 100;
                    const stalk = addStage([
                        rect(12, 120),
                        pos(x, 348),
                        anchor("bot"),
                        scale(1, 0.02),
                        color(30, 150, 55),
                        z(4),
                    ]);
                    tween(0.02, 1, 0.35, (v) => {
                        if (stalk.exists()) stalk.scale = vec2(1, v);
                    }, easings.easeOutBack);
                }
            });
        }

        function entranceGhosty(char) {
            flashColor = [255, 255, 255];
            flashAlpha = 1;
            flashHold = 1;
            tween(0, 1, 0.7, (t) => {
                if (!char.exists()) return;
                char.moveTo(-60 + 420 * t, 40 + 180 * t);
                char.angle = Math.sin(t * 10) * 12;
            }, easings.easeOutQuad);
            wait(1, () => {
                if (!char.exists()) return;
                char.moveTo(400, 290);
                char.angle = 0;
                for (let i = 0; i < 6; i++) {
                    const ghost = addStage([
                        sprite("G"),
                        pos(400, 290),
                        anchor("center"),
                        scale(0.7),
                        opacity(0.75),
                        z(9),
                    ]);
                    const tx = 140 + i * 100;
                    const ty = 250 + (i % 2) * 40;
                    tween(0, 1, 0.4, (t) => {
                        if (!ghost.exists()) return;
                        ghost.moveTo(400 + (tx - 400) * t, 290 + (ty - 290) * t);
                    }, easings.easeOutQuad);
                }
            });
        }

        function entranceMark(char) {
            tween(0, 1, 0.75, (t) => {
                if (!char.exists()) return;
                const x = -100 + 500 * Math.min(1, t / 0.7);
                const jumping = t > 0.7;
                const y = jumping ? 300 - 90 : 300 - Math.abs(Math.sin(x * 0.07)) * 16;
                char.moveTo(x, y);
            }, easings.linear);
            wait(0.72, () => {
                const beam = addStage([
                    rect(70, 420),
                    pos(400, 80),
                    anchor("top"),
                    color(170, 40, 255),
                    opacity(0),
                    z(40),
                ]);
                tween(0, 0.85, 0.2, (v) => {
                    if (beam.exists()) beam.opacity = v;
                }, easings.linear);
                flashColor = [160, 40, 255];
                flashAlpha = 0.45;
                cameraShake = 5;
            });
        }

        function entranceCat(char) {
            const points = [
                [-80, 300],
                [760, 80],
                [40, 40],
                [700, 260],
                [400, 280],
            ];
            let step = 0;
            function hop() {
                if (!char.exists() || step >= points.length - 1) return;
                const from = points[step];
                const to = points[step + 1];
                tween(0, 1, 0.28, (t) => {
                    if (!char.exists()) return;
                    const arc = Math.sin(t * Math.PI) * 30;
                    char.moveTo(
                        from[0] + (to[0] - from[0]) * t,
                        from[1] + (to[1] - from[1]) * t - arc
                    );
                    char.angle = (step % 2 === 0 ? 1 : -1) * 20;
                }, easings.linear).onEnd(() => {
                    spawnDust(char.pos.x, char.pos.y + 20, [255, 180, 220]);
                    cameraShake = 3;
                    step++;
                    hop();
                });
            }
            char.moveTo(points[0][0], points[0][1]);
            hop();
        }

        function entranceCap(char) {
            tween(0, 1, 1.05, (t) => {
                if (!char.exists()) return;
                const x = -100 + 500 * t;
                const stomp = Math.sin(t * Math.PI * 5);
                const y = 292 - Math.max(0, stomp) * 28;
                char.moveTo(x, y);
                char.scale = vec2(0.55, 0.55 * (stomp < 0 ? 0.82 : 1.08));
            }, easings.linear);
            for (let i = 0; i < 5; i++) {
                wait(0.12 + i * 0.18, () => {
                    if (!char.exists()) return;
                    cameraShake = 6;
                    spawnDust(char.pos.x, 340, [90, 90, 110]);
                    spawnBurst(char.pos.x, 336, [180, 180, 200]);
                });
            }
        }

        function entranceChat(char) {
            tween(0, 1, 0.8, (t) => {
                if (!char.exists()) return;
                const x = -60 + 420 * t;
                const y = 300 - Math.sin(t * Math.PI) * 160;
                char.moveTo(x, y);
                char.angle = t * 720;
            }, easings.easeOutQuad);
            wait(0.35, () => {
                if (!char.exists()) return;
                const ball = addStage([
                    text("🔴", { size: 36 }),
                    pos(char.pos.x, char.pos.y),
                    anchor("center"),
                    z(30),
                ]);
                tween(0, 1, 0.45, (t) => {
                    if (!ball.exists()) return;
                    ball.moveTo(char.pos.x + 260 * t, char.pos.y - 40 + Math.sin(t * 8) * 12);
                }, easings.easeOutQuad);
            });
        }

        function entranceGoosey(char) {
            tween(0, 1, 0.7, (t) => {
                if (!char.exists()) return;
                const x = -160 + 560 * Math.min(1, t / 0.65);
                const hop = Math.abs(Math.sin(x * 0.05)) * 18;
                char.moveTo(x, 292 - hop);
                char.angle = t > 0.65 ? (t - 0.65) / 0.35 * 360 : 0;
            }, easings.linear);
            wait(0.72, () => {
                if (!char.exists()) return;
                tween(220, 305, 0.12, (y) => {
                    if (char.exists()) char.moveTo(400, y);
                }, easings.easeInQuad).onEnd(() => {
                    char.angle = 0;
                    cameraShake = 14;
                    flashAlpha = 0.7;
                    flashColor = [255, 220, 120];
                    spawnBurst(400, 330, [255, 200, 80]);
                    spawnDust(400, 340, [255, 210, 140]);
                });
            });
        }

        function characterIntro(name, bgColor, subtitle) {
            backdrop(bgColor);
            addStage([
                rect(800, 10),
                pos(400, 338),
                anchor("center"),
                color(255, 255, 255),
                opacity(0.2),
                z(1),
            ]);

            const char = addCharacter(name, -160, 300, finalScaleFor(name));
            if (char) {
                if (name === "PENGUY") entrancePenguy(char);
                else if (name === "RED") entranceRed(char);
                else if (name === "BLUE") entranceBlue(char);
                else if (name === "GREG") entranceGreg(char);
                else if (name === "GHOSTY") entranceGhosty(char);
                else if (name === "MARK") entranceMark(char);
                else if (name === "ANGY-CAT") entranceCat(char);
                else if (name === "ANGY-CAP") entranceCap(char);
                else if (name === "CHAT") entranceChat(char);
            }

            slideTitle(name);
            addText(subtitle, 395, 20, [230, 240, 255]);
            cameraShake = Math.max(cameraShake, 3);
        }

        function createFighter(name, x, direction) {
            const size = name === "PENGUY" || name === "CHAT" || name === "ANGY-CAT" || name === "ANGY-CAP"
                ? finalScaleFor(name)
                : (name === "RED" || name === "BLUE" ? 1 : 2.2);

            return {
                name,
                obj: addCharacter(name, x, GROUND_Y, size),
                direction,
                vx: 0,
                vy: 0,
                damage: 0,
                moveDirection: direction,
                moveTimer: 0,
                attackCooldown: 0.35 + Math.random() * 0.35,
                attackTimer: 0,
                attackHit: false,
                dodgeCooldown: 0,
                invulnerable: 0,
                grounded: true,
                dashTimer: 0,
                hop: Math.random() * 6,
            };
        }

        function refreshDamageLabels() {
            if (!battle) return;

            if (battle.fighters) {
                if (battle.damageLabels) {
                    for (const label of battle.damageLabels) destroy(label);
                }
                battle.damageLabels = [];
                battle.fighters.forEach((fighter, index) => {
                    const row = index < 5 ? 0 : 1;
                    const column = index % 5;
                    battle.damageLabels.push(addStage([
                        text(fighter.name + " " + fighter.damage + "%", { size: 12 }),
                        pos(80 + column * 160, row === 0 ? 100 : 122),
                        anchor("center"),
                        color(255, 255, 255),
                        z(80),
                    ]));
                });
                return;
            }

            if (battle.leftDamageLabel) destroy(battle.leftDamageLabel);
            if (battle.rightDamageLabel) destroy(battle.rightDamageLabel);

            battle.leftDamageLabel = addStage([
                text(battle.left.name + "  " + battle.left.damage + "%", { size: 22 }),
                pos(190, 78),
                anchor("center"),
                color(255, 255, 255),
                z(80),
            ]);
            battle.rightDamageLabel = addStage([
                text(battle.right.name + "  " + battle.right.damage + "%", { size: 22 }),
                pos(610, 78),
                anchor("center"),
                color(255, 255, 255),
                z(80),
            ]);
        }

        function createPopup(message, x, y, popupColor) {
            if (!battle) return;
            const popup = addStage([
                text(message, { size: 28 }),
                pos(x, y),
                anchor("center"),
                color(...popupColor),
                z(160),
            ]);
            battle.popups.push({ obj: popup, timer: 0.55 });
        }

        function tryDodge(defender, attacker) {
            if (!defender.obj || !defender.grounded || defender.dodgeCooldown > 0) return;
            if (Math.random() > 0.5) return;
            defender.vy = -520;
            defender.grounded = false;
            defender.vx = -attacker.direction * 340;
            defender.invulnerable = 0.28;
            defender.dodgeCooldown = 0.7;
            spawnDust(defender.obj.pos.x, 330, [160, 220, 255]);
            createPopup("DODGE!", defender.obj.pos.x, defender.obj.pos.y - 80, [140, 230, 255]);
        }

        function startAttack(attacker, defender) {
            if (!attacker.obj || attacker.attackCooldown > 0 || attacker.attackTimer > 0) return;
            attacker.attackCooldown = 0.62;
            attacker.attackTimer = 0.18;
            attacker.attackHit = false;
            attacker.vx = attacker.direction * 640;
            spawnDust(attacker.obj.pos.x, 332, [255, 210, 120]);
            tryDodge(defender, attacker);
        }

        function landHit(attacker, defender) {
            if (!attacker.obj || !defender.obj) return;
            const damage = 8 + Math.floor(Math.random() * 10);
            defender.damage += damage;
            const knockback = Math.min(860, 320 + defender.damage * 2.6);
            defender.vx = attacker.direction * knockback;
            defender.vy = -340;
            defender.grounded = false;
            cameraShake = Math.min(18, cameraShake + 9);
            flashAlpha = Math.min(0.85, flashAlpha + 0.35);
            flashColor = damage > 13 ? [255, 80, 60] : [255, 230, 120];
            const hitX = (attacker.obj.pos.x + defender.obj.pos.x) / 2;
            const hitY = Math.min(attacker.obj.pos.y, defender.obj.pos.y);
            spawnBurst(hitX, hitY, flashColor);
            createPopup(damage + "%", hitX, hitY - 70, [255, 245, 160]);
            refreshDamageLabels();
        }

        function battleIntro(leftName, rightName, bgColor, subtitle) {
            backdrop(bgColor);
            addSpeedLines([255, 255, 255]);

            const vs = addText(leftName + "  VS  " + rightName, 52, 34);
            vs.scale = vec2(1.4);
            tween(1.4, 1, 0.25, (v) => {
                if (vs.exists()) vs.scale = vec2(v);
            }, easings.easeOutQuad);
            addText(subtitle || "FIGHT!", 400, 18, [255, 220, 140]);

            addStage([
                rect(800, 18),
                pos(400, 352),
                anchor("center"),
                color(30, 30, 40),
                z(0),
            ]);
            addStage([
                rect(760, 4),
                pos(400, 342),
                anchor("center"),
                color(255, 190, 80),
                opacity(0.7),
                z(1),
            ]);

            battle = {
                left: createFighter(leftName, -80, 1),
                right: createFighter(rightName, 880, -1),
                time: 0,
                popups: [],
                leftDamageLabel: null,
                rightDamageLabel: null,
            };

            if (battle.left.obj) {
                tween(-80, 220, 0.45, (x) => {
                    if (battle && battle.left.obj && battle.left.obj.exists()) {
                        battle.left.obj.moveTo(x, GROUND_Y - Math.abs(Math.sin(x * 0.08)) * 16);
                    }
                }, easings.easeOutQuad);
            }
            if (battle.right.obj) {
                tween(880, 580, 0.45, (x) => {
                    if (battle && battle.right.obj && battle.right.obj.exists()) {
                        battle.right.obj.moveTo(x, GROUND_Y - Math.abs(Math.sin(x * 0.08)) * 16);
                    }
                }, easings.easeOutQuad);
            }

            refreshDamageLabels();
            cameraShake = 5;
            flashAlpha = 0.4;
            flashColor = [255, 255, 255];
        }

        function decideMovement(fighter, opponent, distance) {
            if (fighter.moveTimer > 0) return;
            fighter.moveTimer = 0.22 + Math.random() * 0.28;
            const toward = opponent.obj.pos.x > fighter.obj.pos.x ? 1 : -1;
            if (distance > 160) {
                fighter.moveDirection = toward;
                if (Math.random() < 0.45) fighter.dashTimer = 0.22;
            } else {
                const choice = Math.random();
                if (choice < 0.4) fighter.moveDirection = toward;
                else if (choice < 0.7) fighter.moveDirection = -toward;
                else fighter.moveDirection = 0;
            }
            if (fighter.grounded && fighter.dodgeCooldown <= 0 && Math.random() < 0.16) {
                fighter.vy = -480;
                fighter.grounded = false;
                fighter.dodgeCooldown = 0.65;
            }
        }

        function updateFighter(fighter, opponent, frameDt) {
            if (!fighter.obj || !opponent.obj || !fighter.obj.exists()) return;
            const distance = Math.abs(opponent.obj.pos.x - fighter.obj.pos.x);
            fighter.direction = opponent.obj.pos.x > fighter.obj.pos.x ? 1 : -1;
            fighter.moveTimer -= frameDt;
            fighter.attackCooldown -= frameDt;
            fighter.dodgeCooldown -= frameDt;
            fighter.invulnerable -= frameDt;
            fighter.dashTimer -= frameDt;
            if (fighter.attackTimer <= 0) decideMovement(fighter, opponent, distance);

            let desiredSpeed = fighter.moveDirection * 210;
            if (fighter.dashTimer > 0) desiredSpeed = fighter.moveDirection * 520;
            if (fighter.attackTimer > 0) desiredSpeed = fighter.direction * 680;
            fighter.vx += (desiredSpeed - fighter.vx) * Math.min(1, frameDt * 9);
            if (fighter.moveDirection === 0 && fighter.attackTimer <= 0) {
                fighter.vx *= Math.max(0, 1 - frameDt * 7);
            }
            fighter.vy += 1400 * frameDt;
            fighter.obj.moveBy(fighter.vx * frameDt, fighter.vy * frameDt);

            if (fighter.obj.pos.y >= GROUND_Y) {
                if (!fighter.grounded) spawnDust(fighter.obj.pos.x, 338, [200, 200, 210]);
                fighter.obj.moveTo(fighter.obj.pos.x, GROUND_Y);
                fighter.vy = 0;
                fighter.grounded = true;
            } else {
                fighter.grounded = false;
            }
            if (fighter.grounded && Math.abs(fighter.vx) > 40) {
                fighter.hop += frameDt * 18;
                fighter.obj.moveTo(fighter.obj.pos.x, GROUND_Y - Math.abs(Math.sin(fighter.hop)) * 8);
            }
            if (fighter.obj.pos.x < 55) {
                fighter.obj.moveTo(55, fighter.obj.pos.y);
                fighter.vx = Math.abs(fighter.vx) * 0.4;
            }
            if (fighter.obj.pos.x > 745) {
                fighter.obj.moveTo(745, fighter.obj.pos.y);
                fighter.vx = -Math.abs(fighter.vx) * 0.4;
            }
            if (distance < 130 && fighter.attackCooldown <= 0 && fighter.attackTimer <= 0) {
                startAttack(fighter, opponent);
            }
            if (fighter.attackTimer > 0) {
                fighter.attackTimer -= frameDt;
                if (fighter.attackTimer <= 0.08 && !fighter.attackHit) {
                    fighter.attackHit = true;
                    const newDistance = Math.abs(opponent.obj.pos.x - fighter.obj.pos.x);
                    const verticalDistance = Math.abs(opponent.obj.pos.y - fighter.obj.pos.y);
                    if (newDistance < 145 && verticalDistance < 100 && opponent.invulnerable <= 0) {
                        landHit(fighter, opponent);
                    } else {
                        createPopup("MISS", fighter.obj.pos.x, fighter.obj.pos.y - 64, [210, 210, 210]);
                    }
                }
            }
        }

        function updateBattle(frameDt) {
            if (!battle) return;
            battle.time += frameDt;

            if (battle.fighters) {
                if (!battle.finalPose) {
                    for (const fighter of battle.fighters) {
                        if (!fighter.obj) continue;
                        let opponent = null;
                        let nearest = Infinity;
                        for (const candidate of battle.fighters) {
                            if (candidate === fighter || !candidate.obj) continue;
                            const distance = Math.abs(candidate.obj.pos.x - fighter.obj.pos.x);
                            if (distance < nearest) {
                                nearest = distance;
                                opponent = candidate;
                            }
                        }
                        if (!opponent) continue;
                        if (battle.time >= 9 && battle.time < 12.2) {
                            fighter.moveDirection = fighter.obj.pos.x < 400 ? 1 : -1;
                            fighter.moveTimer = 0.12;
                            fighter.dashTimer = 0.12;
                        }
                        updateFighter(fighter, opponent, frameDt);
                    }
                }
                if (battle.time >= 12.2 && !battle.finalStrike) {
                    battle.finalStrike = true;
                    for (let i = 0; i < battle.fighters.length; i++) {
                        const attacker = battle.fighters[i];
                        const defender = battle.fighters[(i + 1) % battle.fighters.length];
                        if (!attacker.obj || !defender.obj) continue;
                        attacker.direction = defender.obj.pos.x >= attacker.obj.pos.x ? 1 : -1;
                        landHit(attacker, defender);
                    }
                    spawnBurst(400, 280, [255, 220, 80]);
                    cameraShake = 18;
                    flashAlpha = 1;
                    flashColor = [255, 240, 180];
                }
                if (battle.time >= 13.4 && !battle.finalPose) {
                    battle.finalPose = true;
                    battle.fighters.forEach((fighter, index) => {
                        if (!fighter.obj) return;
                        const row = index < 5 ? 0 : 1;
                        const column = index % 5;
                        fighter.obj.moveTo(250 + column * 75, row === 0 ? 250 : 320);
                        fighter.vx = 0;
                        fighter.vy = 0;
                        fighter.grounded = true;
                    });
                    createPopup("FINAL CLASH", 400, 180, [255, 230, 90]);
                }
            } else {
                updateFighter(battle.left, battle.right, frameDt);
                updateFighter(battle.right, battle.left, frameDt);
            }

            for (let i = battle.popups.length - 1; i >= 0; i--) {
                const popup = battle.popups[i];
                popup.timer -= frameDt;
                popup.obj.moveBy(0, -55 * frameDt);
                popup.obj.opacity = Math.max(0, popup.timer / 0.55);
                if (popup.timer <= 0) {
                    destroy(popup.obj);
                    battle.popups.splice(i, 1);
                }
            }
        }

        function finalClash() {
            backdrop([8, 6, 24]);
            addSpeedLines([255, 180, 80]);
            addText("THE FINAL CLASH", 42, 40);
            addText("EVERYONE. RUN.", 82, 18, [255, 210, 120]);
            addStage([
                rect(800, 18),
                pos(400, 352),
                anchor("center"),
                color(40, 30, 55),
                z(0),
            ]);
            const names = [
                "PENGUY", "RED", "BLUE", "GREG", "GHOSTY",
                "MARK", "ANGY-CAT", "ANGY-CAP", "CHAT", "GOOSEY",
            ];
            battle = {
                fighters: names.map((name, index) => {
                    const fromLeft = index % 2 === 0;
                    return createFighter(name, fromLeft ? -60 - index * 20 : 860 + index * 12, fromLeft ? 1 : -1);
                }),
                time: 0,
                popups: [],
                damageLabels: [],
                finalStrike: false,
                finalPose: false,
            };
            battle.fighters.forEach((fighter, index) => {
                if (!fighter.obj) return;
                const targetX = 70 + index * 72;
                tween(fighter.obj.pos.x, targetX, 0.55, (x) => {
                    if (fighter.obj && fighter.obj.exists() && battle && !battle.finalPose) {
                        fighter.obj.moveTo(x, GROUND_Y - Math.abs(Math.sin((x + index) * 0.07)) * 14);
                    }
                }, easings.easeOutQuad);
            });
            refreshDamageLabels();
            flashAlpha = 0.8;
            flashColor = [255, 200, 80];
            cameraShake = 8;
        }

        function logoReveal() {
            backdrop([4, 6, 18]);
            addStage([
                circle(150),
                pos(400, 188),
                anchor("center"),
                color(255, 170, 40),
                opacity(0.22),
                z(-10),
            ]);
            addStage([
                circle(78),
                pos(400, 188),
                anchor("center"),
                color(255, 230, 120),
                opacity(0.85),
                z(-5),
            ]);
            addText("GOOSEY SMASH", 250, 52);
            addText("WORLD ULTIMATE", 310, 28, [255, 220, 130]);
            flashAlpha = 1;
            flashColor = [255, 244, 200];
            cameraShake = 3;
        }

        const timeline = [
            {
                at: 0,
                action: () => {
                    backdrop([8, 10, 28]);
                    addSpeedLines([255, 190, 90]);
                    addText("RUN.", 170, 64, [255, 220, 120]);
                    addText("UNTIL THE SUN COMES UP", 250, 24);
                    flashAlpha = 0.55;
                    flashColor = [255, 200, 90];
                },
            },
            { at: 6, action: () => characterIntro("PENGUY", [40, 90, 140], "A NEW WORLD AWAKENS") },
            { at: 12, action: () => characterIntro("RED", [90, 10, 10], "NO TURNING BACK") },
            { at: 18, action: () => characterIntro("BLUE", [10, 40, 90], "THE FUTURE IS CALLING") },
            { at: 24, action: () => characterIntro("GREG", [30, 70, 36], "READY FOR THE CHALLENGE") },
            { at: 30, action: () => characterIntro("GHOSTY", [20, 16, 40], "FROM THE SHADOWS") },
            { at: 38, action: () => characterIntro("MARK", [70, 20, 90], "THE HEAT IS RISING") },
            { at: 44, action: () => characterIntro("ANGY-CAT", [48, 22, 70], "A NEW CHALLENGER") },
            { at: 50, action: () => characterIntro("ANGY-CAP", [20, 20, 30], "NO HESITATION") },
            { at: 56, action: () => characterIntro("CHAT", [16, 20, 70], "THE MOON BASE") },

            { at: 63, action: () => battleIntro("PENGUY", "MARK", [110, 32, 18], "VOLCANO ARENA") },
            { at: 70, action: () => battleIntro("CHAT", "GREG", [16, 42, 100], "MOON BASE") },
            { at: 77, action: () => battleIntro("ANGY-CAT", "ANGY-CAP", [42, 16, 78], "HAUNTED FOREST") },
            { at: 84, action: () => battleIntro("RED", "BLUE", [90, 24, 48], "TORNADO PLAINS") },
            { at: 91, action: () => battleIntro("GHOSTY", "ANGY-CAT", [32, 14, 70], "THE SHADOWS STRIKE") },
            { at: 98, action: () => battleIntro("PENGUY", "MARK", [120, 40, 16], "ROUND TWO") },
            { at: 106, action: () => battleIntro("CHAT", "GREG", [14, 40, 110], "NO ONE BACKS DOWN") },
            { at: 114, action: () => battleIntro("RED", "BLUE", [16, 55, 130], "STILL RUNNING") },
            { at: 121, action: () => battleIntro("GHOSTY", "ANGY-CAP", [48, 18, 86], "FINAL ROUND") },

            {
                at: 130,
                action: () => {
                    backdrop([10, 22, 52]);
                    addSpeedLines([140, 200, 255]);
                    addText("GOOSEYWORKS HQ", 58, 30);
                    const g = addCharacter("GOOSEY", -160, 292, finalScaleFor("GOOSEY"));
                    if (g) entranceGoosey(g);
                    addText("THE FINAL CHALLENGER", 390, 22, [255, 230, 150]);
                },
            },
            { at: 136, action: () => battleIntro("GOOSEY", "GHOSTY", [12, 16, 48], "CATCH THEM") },
            { at: 145, action: () => finalClash() },
            { at: 161, action: () => logoReveal() },
        ];

        function finishIntro() {
            if (finished) return;
            finished = true;
            if (introMusic) {
                try {
                    introMusic.volume = 0;
                    introMusic.stop();
                } catch (e) {}
                introMusic = null;
            }
            if (tabVisibilityHandler && typeof document !== "undefined") {
                document.removeEventListener("visibilitychange", tabVisibilityHandler);
                tabVisibilityHandler = null;
            }
            setCamPos(400, 225);
            setCamScale(1);
            clearStage();
            go("title");
        }

        onSceneLeave(() => {
            if (introMusic) {
                try {
                    introMusic.volume = 0;
                    introMusic.stop();
                } catch (e) {}
                introMusic = null;
            }
        });

        onKeyPress("enter", finishIntro);

        try {
            introMusic = play(MUSIC_ID, { loop: false, volume: 0.85 });
            if (typeof document !== "undefined") {
                tabVisibilityHandler = () => {
                    if (!introMusic || finished) return;
                    introMusic.paused = document.hidden;
                };
                document.addEventListener("visibilitychange", tabVisibilityHandler);
            }
        } catch (error) {
            console.warn("Intro music could not start:", error);
        }

        const skipHint = add([
            text("PRESS ENTER TO SKIP", { size: 13 }),
            pos(400, 430),
            anchor("center"),
            color(230, 230, 230),
            opacity(0.7),
            z(200),
            fixed(),
        ]);

        const flashOverlay = add([
            rect(800, 450),
            pos(0, 0),
            anchor("topleft"),
            color(255, 255, 255),
            opacity(0),
            z(1000),
            fixed(),
        ]);

        onUpdate(() => {
            if (finished) return;
            const frameDt = dt();
            elapsed += frameDt;

            while (eventIndex < timeline.length && elapsed >= timeline[eventIndex].at) {
                timeline[eventIndex].action();
                eventIndex++;
            }

            for (const line of speedLines) {
                if (!line.obj.exists()) continue;
                line.obj.moveBy(-line.speed * frameDt, 0);
                if (line.obj.pos.x < -80) line.obj.moveTo(860, line.obj.pos.y);
            }

            updateBattle(frameDt);
            cameraShake = Math.max(0, cameraShake - frameDt * 12);

            const shakeX = Math.sin(elapsed * 9) * (battle ? 8 : 5) + Math.sin(elapsed * 27) * cameraShake;
            const shakeY = Math.cos(elapsed * 7) * (battle ? 4 : 3) + Math.cos(elapsed * 23) * cameraShake * 0.45;
            setCamPos(400 + shakeX, 225 + shakeY);
            setCamScale(1.03 + Math.sin(elapsed * (battle ? 6 : 2)) * 0.01 + cameraShake * 0.002);

            if (flashHold > 0) {
                flashHold -= frameDt;
                flashAlpha = 1;
            } else {
                flashAlpha = Math.max(0, flashAlpha - frameDt * 2.2);
            }
            flashOverlay.color = rgb(...flashColor);
            flashOverlay.opacity = flashAlpha;

            if (elapsed > 4) skipHint.opacity = 0.35 + Math.sin(elapsed * 3) * 0.2;
            if (elapsed >= INTRO_DURATION) finishIntro();
        });
    });
}

registerGooseyIntro();
go("gooseyIntro");
// ==================================================
// 🎬 TITLE SCREEN
// ==================================================

scene("title", () => {
playGameMusic("menuMusic", true);
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

    for (
        let i = 0;
        i < 80;
        i++
    ) {

        add([
            circle(
                Math.random() * 3 + 1
            ),
            pos(
                Math.random() * 800,
                Math.random() * 450
            ),
            color(
                255,
                255,
                255
            ),
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
        color(
            255,
            255,
            255
        ),
        z(100),
    ]);

    const title2 = add([
        text("WORLD ULTIMATE"),
        pos(400, 125),
        anchor("center"),
        scale(1.5),
        color(
            255,
            220,
            0
        ),
        z(100),
    ]);

    add([
        text(
            "THIS IS PROBABLY A BAD IDEA"
        ),
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
        "BACH",
        "NATHANIEL",
        "KACHEN",
        "DENKU",
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
                baseScale:
                    scaleAmount,

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

                spinSpeed:
                    spinSpeed,

                flipSpeed:
                    flipSpeed,

                directionTimer:
                    0,
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
                "while true:",
                "player.damage += 1000",
                "player_die = false",
                "if not player_die:",
                "player_die = true",
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
                                Math.random() * 20 -
                                10,
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

            const leftHand = add([
                circle(38),
                pos(450, 235),
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
                pos(350, 305),
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
                            Math.random() *
                            1 +
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
                            Math.random() *
                            1 +
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


        // ==================================================
        // ⚽ BACH
        // ==================================================

        else if (
            currentSpecial ===
            "BACH"
        ) {

            const bachTitle =
                add([
                    sprite("Bach", {
                        anim: "bach",
                    }),
                    pos(400, 255),
                    anchor("center"),
                    scale(1.5),
                    z(40),

                    {
                        bachTitleTime: 0,
                    },
                ]);

            specialObjects.push(
                bachTitle
            );


            // ⚽ SOCCER BALLS FLYING AROUND BACH

            for (
                let i = 0;
                i < 10;
                i++
            ) {

                const ball =
                    add([
                        text("⚽"),
                        pos(400, 255),
                        anchor("center"),
                        scale(0.45),
                        z(42),

                        {
                            orbitIndex: i,
                        },
                    ]);

                specialObjects.push(
                    ball
                );
            }
        }
    // ==================================================
// ⚡ DENKU LIGHTNING STORM
// ==================================================

else if (
    currentSpecial ===
    "DENKU"
) {

    specialObjects.push(
        add([
            text(
                "DENKU MODE!!!"
            ),
            pos(400, 205),
            anchor("center"),
            scale(1.2),
            color(
                80,
                255,
                80
            ),
            z(45),
        ])
    );

    function denkuLightningStrike() {

        if (
            currentSpecial !==
            "DENKU"
        ) {
            return;
        }

        const strikeX =
            Math.random() * 700 + 50;

        const boltColor =
            Math.random() < 0.5
                ? rgb(80, 255, 80)
                : rgb(200, 255, 200);

        add([
            rect(10, 140),
            pos(
                strikeX - 20,
                60
            ),
            rotate(
                Math.random() * 24 - 12
            ),
            color(boltColor),
            opacity(1),
            z(44),
            lifespan(
                0.15,
                {
                    fade: 0.1,
                }
            ),
        ]);

        add([
            rect(10, 130),
            pos(
                strikeX + 10,
                190
            ),
            rotate(
                Math.random() * 24 - 12
            ),
            color(boltColor),
            opacity(1),
            z(44),
            lifespan(
                0.15,
                {
                    fade: 0.1,
                }
            ),
        ]);

        add([
            circle(
                Math.random() * 20 + 15
            ),
            pos(
                strikeX,
                320
            ),
            anchor("center"),
            color(
                150,
                255,
                150
            ),
            opacity(0.8),
            z(43),
            lifespan(
                0.12,
                {
                    fade: 0.1,
                }
            ),
        ]);

        wait(
            Math.random() * 0.25 + 0.15,
            denkuLightningStrike
        );
    }

    denkuLightningStrike();
}   
        // ==================================================
        // 🟣 NATHANIEL
        // ==================================================

        else if (
            currentSpecial ===
            "NATHANIEL"
        ) {

            const nathanielTitle =
                add([
                    sprite("Nathaniel", {
                        anim: "nathaniel",
                    }),
                    pos(400, 255),
                    anchor("center"),
                    scale(1.5),
                    z(40),

                    {
                        nathanielTitleTime:
                            0,
                    },
                ]);

            specialObjects.push(
                nathanielTitle
            );


            // 🟣 PURPLE BALLS FLYING AROUND NATHANIEL

            for (
                let i = 0;
                i < 10;
                i++
            ) {

                const ball =
                    add([
                        circle(10),
                        pos(400, 255),
                        color(
                            180,
                            0,
                            255
                        ),
                        anchor("center"),
                        z(42),

                        {
                            orbitIndex: i,
                        },
                    ]);

                specialObjects.push(
                    ball
                );
            }
        }
    }

    // ==================================================
    // 🎬 START FIRST SPECIAL
    // ==================================================

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

                fighter.directionTimer =
                    0;

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

                fighter.pos.x =
                    45;

                fighter.vx =
                    Math.abs(
                        fighter.vx
                    );
            }


            if (
                fighter.pos.x > 755
            ) {

                fighter.pos.x =
                    755;

                fighter.vx =
                    -Math.abs(
                        fighter.vx
                    );
            }


            if (
                fighter.pos.y < 190
            ) {

                fighter.pos.y =
                    190;

                fighter.vy =
                    Math.abs(
                        fighter.vy
                    );
            }


            if (
                fighter.pos.y > 390
            ) {

                fighter.pos.y =
                    390;

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


            // ==================================================
            // 💬 CHAT ZOOM
            // ==================================================

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
// ⚽ BACH SPECIAL ANIMATION
// ==================================================

if (
    currentSpecial ===
    "BACH"
) {

    const bach =
        specialObjects[0];

    if (
        bach &&
        bach.exists()
    ) {

        bach.bachTitleTime +=
            dt();

        // Bach goes CRAZY
        bach.pos.x =
            400 +
            Math.sin(
                bach.bachTitleTime * 4
            ) * 90;

        bach.pos.y =
            255 +
            Math.sin(
                bach.bachTitleTime * 7
            ) * 35;

        bach.angle =
            Math.sin(
                bach.bachTitleTime * 10
            ) * 35;
    }


    // ⚽ ALL THE BALLS FLY AROUND BACH

    for (
        let i = 1;
        i < specialObjects.length;
        i++
    ) {

        const ball =
            specialObjects[i];

        if (
            ball &&
            ball.exists()
        ) {

            const angle =
                time() * 6 +
                ball.orbitIndex *
                (
                    Math.PI * 2 /
                    10
                );

            const radiusX =
                130 +
                Math.sin(
                    time() * 5 +
                    ball.orbitIndex
                ) * 35;

            const radiusY =
                85 +
                Math.cos(
                    time() * 4 +
                    ball.orbitIndex
                ) * 25;

            ball.moveTo(
                vec2(
                    bach.pos.x +
                    Math.cos(angle) *
                    radiusX,

                    bach.pos.y +
                    Math.sin(angle) *
                    radiusY
                )
            );

            ball.angle +=
                720 *
                dt();
        }
    }
}
   
// ==================================================
// 🟣 NATHANIEL SPECIAL ANIMATION
// ==================================================

if (
    currentSpecial ===
    "NATHANIEL"
) {

    const nathaniel =
        specialObjects[0];

    if (
        nathaniel &&
        nathaniel.exists()
    ) {

        nathaniel.nathanielTitleTime +=
            dt();

        // Nathaniel moves too
        nathaniel.pos.x =
            400 +
            Math.sin(
                nathaniel.nathanielTitleTime * 4
            ) * 90;

        nathaniel.pos.y =
            255 +
            Math.sin(
                nathaniel.nathanielTitleTime * 7
            ) * 35;

        nathaniel.angle =
            Math.sin(
                nathaniel.nathanielTitleTime * 10
            ) * 35;
    }


    // 🟣 PURPLE BALLS FLY AROUND HIM

    for (
        let i = 1;
        i < specialObjects.length;
        i++
    ) {

        const ball =
            specialObjects[i];

        if (
            ball &&
            ball.exists()
        ) {

            const angle =
                time() * 6 +
                ball.orbitIndex *
                (
                    Math.PI * 2 /
                    10
                );

            const radiusX =
                130 +
                Math.sin(
                    time() * 5 +
                    ball.orbitIndex
                ) * 35;

            const radiusY =
                85 +
                Math.cos(
                    time() * 4 +
                    ball.orbitIndex
                ) * 25;

            ball.moveTo(
                vec2(
                    nathaniel.pos.x +
                    Math.cos(angle) *
                    radiusX,

                    nathaniel.pos.y +
                    Math.sin(angle) *
                    radiusY
                )
            );

            ball.angle +=
                720 *
                dt();
        }
    }
}
        // ==================================================
        // ✴️ KACHEN
        // ==================================================

        else if (
            currentSpecial ===
            "KACHEN"
        ) {

            // ✴️ STARS FLYING AROUND THE TITLE

            for (
                let i = 0;
                i < 8;
                i++
            ) {

                const star =
                    add([
                        text("✴"),
                        pos(
                            Math.random() * 760 + 20,
                            Math.random() * 380 + 50
                        ),
                        anchor("center"),
                        scale(0.4),
                        z(42),

                        {
                            vx:
                                (
                                    Math.random() * 260 +
                                    120
                                ) *
                                (
                                    Math.random() < 0.5
                                        ? -1
                                        : 1
                                ),

                            vy:
                                (
                                    Math.random() * 220 +
                                    100
                                ) *
                                (
                                    Math.random() < 0.5
                                        ? -1
                                        : 1
                                ),

                            spin:
                                (
                                    Math.random() * 500 +
                                    300
                                ) *
                                (
                                    Math.random() < 0.5
                                        ? -1
                                        : 1
                                ),
                        },
                    ]);

                specialObjects.push(
                    star
                );
            }
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
        // 🥊 GREG
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
playGameMusic("menuMusic", true);
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
playGameMusic("menuMusic", true);
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
    playGameMusic("menuMusic", true);
// ==================================================
// 🔓 CHARACTER UNLOCKS
// ==================================================

const bachUnlocked =
    localStorage.getItem(
        "goosey_bach_unlocked_v101"
    ) === "true";

const nathanielUnlocked =
    localStorage.getItem(
        "goosey_nathaniel_unlocked_v101"
    ) === "true";

const kachenUnlocked =
    localStorage.getItem(
        "goosey_kachen_unlocked_v101"
    ) === "true";
    const denkuUnlocked =
    localStorage.getItem(
        "goosey_denku_unlocked_v101"
    ) === "true";
        // ==================================================
    // 🌌 WEBSITE BACKGROUND
    // ==================================================

    window.gooseyScene =
        "characterSelect";


    // ==================================================
    // 🔧 RESET GRAVITY
    // ==================================================

    setGravity(1800);


    // ==================================================
    // 🎮 PLAYER DATA
    // ==================================================

    let player1Category = 0;
    let player2Category = 1;

    let player1Special = 0;
    let player2Special = 1;

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
        "BACH",
        "NATHANIEL",
        "KACHEN",
        "DENKU",
    ];


    // ==================================================
    // 🤖 CPU MODE
    // ==================================================

    const singlePlayer =
        window.singlePlayerMode === true;
// ==================================================
// 🔒 CHECK CHARACTER LOCK
// ==================================================

function isCharacterLocked(
    character
) {

    if (
        character === "BACH" &&
        !bachUnlocked
    ) {

        return true;
    }

    if (
        character === "NATHANIEL" &&
        !nathanielUnlocked
    ) {

        return true;
    }

    if (
        character === "KACHEN" &&
        !kachenUnlocked
    ) {

        return true;
    }
if (
    character === "DENKU" &&
    !denkuUnlocked
) {

    return true;
}
    return false;
}
    // ==================================================
    // 🎲 CPU CHARACTER POOL
    // ==================================================

    function getRandomCPUCharacter() {

        const available = [];


        // 🔴 RED

        available.push({
            category: 0,
            special: 0,
            name: "RED",
        });


        // 🔵 BLUE

        available.push({
            category: 1,
            special: 0,
            name: "BLUE",
        });


        // ⭐ SPECIAL CHARACTERS

        for (
            let i = 0;
            i < specialCharacters.length;
            i++
        ) {

            const character =
                specialCharacters[i];


            // HARD CPU can use everyone.

            if (
                window.cpuDifficulty ===
                "HARD"
            ) {

                available.push({
                    category: 2,
                    special: i,
                    name: character,
                });

            // EASY / MEDIUM only use unlocked characters.

            } else if (
                !isCharacterLocked(
                    character
                )
            ) {

                available.push({
                    category: 2,
                    special: i,
                    name: character,
                });
            }
        }


        // ==================================================
        // 🎯 GET P1 NAME
        // ==================================================

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


        // ==================================================
        // 🎲 PICK DIFFERENT CPU CHARACTER
        // ==================================================

        let choice;


        do {

            choice =
                available[
                    Math.floor(
                        Math.random() *
                        available.length
                    )
                ];

        } while (
            available.length > 1 &&
            choice.name === player1Name
        );


        return choice;
    }


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

const specialCharacterDisplay = add([
    text("?"),
    pos(650, 180),
    anchor("center"),
    scale(1.2),
    z(10),
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


    if (
        singlePlayer
    ) {

        player2Cursor.color =
            rgb(255, 80, 80);
    }


    // ==================================================
    // 🎯 CURSOR POSITIONS
    // ==================================================

    function updatePlayer1Cursor() {

        if (
            player1Category === 0
        ) {

            player1Cursor.pos =
                vec2(
                    90,
                    145
                );

        } else if (
            player1Category === 1
        ) {

            player1Cursor.pos =
                vec2(
                    340,
                    145
                );

        } else {

            player1Cursor.pos =
                vec2(
                    590,
                    145
                );
        }
    }


    function updatePlayer2Cursor() {

        if (
            player2Category === 0
        ) {

            player2Cursor.pos =
                vec2(
                    90,
                    215
                );

        } else if (
            player2Category === 1
        ) {

            player2Cursor.pos =
                vec2(
                    340,
                    215
                );

        } else {

            player2Cursor.pos =
                vec2(
                    590,
                    215
                );
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


        if (
            player1Ready
        ) {

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

            const selected =
                specialCharacters[
                    player1Special
                ];


            if (
                isCharacterLocked(
                    selected
                )
            ) {

                player1SpecialText.text =
                    "SPECIAL: " +
                    selected +
                    " 🔒";

            } else {

                player1SpecialText.text =
                    "SPECIAL: " +
                    selected;
            }

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

            const selected =
                specialCharacters[
                    player2Special
                ];


            if (
                isCharacterLocked(
                    selected
                )
            ) {

                player2SpecialText.text =
                    "SPECIAL: " +
                    selected +
                    " 🔒";

            } else {

                player2SpecialText.text =
                    "SPECIAL: " +
                    selected;
            }

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

        if (
            player1Ready
        ) {
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

            player1Special--;


            if (
                player1Special < 0
            ) {

                player1Special =
                    specialCharacters.length - 1;
            }
        }


        updatePlayer1();
    });


    // ==================================================
    // ➡️ P1 RIGHT
    // ==================================================

    onKeyPress("right", () => {

        if (
            player1Ready
        ) {
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

            player1Special++;


            if (
                player1Special >=
                specialCharacters.length
            ) {

                player1Special =
                    0;
            }
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

            player2Special--;


            if (
                player2Special < 0
            ) {

                player2Special =
                    specialCharacters.length - 1;
            }
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

            player2Special++;


            if (
                player2Special >=
                specialCharacters.length
            ) {

                player2Special =
                    0;
            }
        }


        updatePlayer2();
    });
// ==================================================
// 🤖 CPU RANDOM CHARACTER
// ==================================================

function chooseCPUCharacter() {

    const choice =
        getRandomCPUCharacter();

    player2Category =
        choice.category;

    player2Special =
        choice.special;

    // Remember exactly who the CPU selected
    window.cpuCharacterName =
        choice.name;

    player2Ready =
        true;

    player2Cursor.color =
        rgb(
            255,
            255,
            0
        );

    updatePlayer2();
}
    // ==================================================
    // ✅ P1 ENTER
    // ==================================================

    onKeyPress("enter", () => {

        if (
            player1Ready
        ) {
            return;
        }


        // ==============================================
        // 🔒 BLOCK LOCKED CHARACTER
        // ==============================================

        if (
            player1Category === 2 &&
            isCharacterLocked(
                specialCharacters[
                    player1Special
                ]
            )
        ) {

            player1SpecialText.text =
                "🔒 BEAT HARD CPU TO UNLOCK";

            return;
        }


        player1Ready =
            true;

        player1Cursor.color =
            rgb(
                0,
                255,
                0
            );


        // ==============================================
        // 🤖 SINGLE PLAYER
        // ==============================================

        if (
            singlePlayer
        ) {

            chooseCPUCharacter();


            wait(
                0.5,
                () => {

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
                }
            );

            return;
        }


        updatePlayer1();

        checkReady();
    });


    // ==================================================
    // ✅ P2 ENTER
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


            // ==========================================
            // 🔒 BLOCK LOCKED CHARACTER
            // ==========================================

            if (
                player2Category === 2 &&
                isCharacterLocked(
                    specialCharacters[
                        player2Special
                    ]
                )
            ) {

                player2SpecialText.text =
                    "🔒 BEAT HARD CPU TO UNLOCK";

                return;
            }


            player2Ready =
                true;


            player2Cursor.color =
                rgb(
                    0,
                    255,
                    0
                );


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

            wait(
                0.5,
                () => {

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
                }
            );
        }
    }
// ==================================================
// ✨ SPECIAL CHARACTER DISPLAY
// ==================================================

let titleEffectTime = 0;

onUpdate(() => {

    titleEffectTime += dt();

    // ==============================================
    // ⭐ GET CURRENT P1 CHARACTER
    // ==============================================

    let selectedCharacterP1 = null;

    if (
        player1Category === 2
    ) {

        selectedCharacterP1 =
            specialCharacters[
                player1Special
            ];
    }

    // ==============================================
    // ⭐ DISPLAY CHARACTER
    // ==============================================

    if (
        selectedCharacterP1 === "BACH"
    ) {

        specialCharacterDisplay.text =
            "⚽";

    } else if (
        selectedCharacterP1 === "NATHANIEL"
    ) {

        specialCharacterDisplay.text =
            "🟣";

    } else if (
        selectedCharacterP1
    ) {

        specialCharacterDisplay.text =
            selectedCharacterP1;

    } else {

        specialCharacterDisplay.text =
            "?";
    }

    // ==============================================
    // ⚽ BACH TITLE EFFECT
    // ==============================================

    if (
        selectedCharacterP1 === "BACH" &&
        bachUnlocked
    ) {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const angle =
                titleEffectTime * 3 +
                i *
                (
                    Math.PI * 2 /
                    12
                );

            add([
                text("⚽"),

                pos(
                    650 +
                    Math.cos(angle) * 75,

                    180 +
                    Math.sin(angle) * 55
                ),

                anchor("center"),

                scale(0.3),

                z(30),

                opacity(1),

                lifespan(
                    0.1,
                    {
                        fade: 0.05,
                    }
                ),
            ]);
        }
    }

    // ==============================================
    // 🟣 NATHANIEL TITLE EFFECT
    // ==============================================

    if (
        selectedCharacterP1 === "NATHANIEL" &&
        nathanielUnlocked
    ) {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const angle =
                titleEffectTime * 3 +
                i *
                (
                    Math.PI * 2 /
                    12
                );

            add([
                text("🟣"),

                pos(
                    650 +
                    Math.cos(angle) * 75,

                    180 +
                    Math.sin(angle) * 55
                ),

                anchor("center"),

                scale(0.3),

                z(30),

                opacity(1),

                lifespan(
                    0.1,
                    {
                        fade: 0.05,
                    }
                ),
            ]);
        }
    }

    // ==============================================
    // ✴️ KACHEN TITLE EFFECT
    // ==============================================

    if (
        selectedCharacterP1 === "KACHEN"
    ) {

        for (
            let i = 0;
            i < 12;
            i++
        ) {

            const angle =
                titleEffectTime * 3 +
                i *
                (
                    Math.PI * 2 /
                    12
                );

            add([
                text("✴"),

                pos(
                    650 +
                    Math.cos(angle) * 75,

                    180 +
                    Math.sin(angle) * 55
                ),

                anchor("center"),

                scale(0.3),

                z(30),

                opacity(1),

                lifespan(
                    0.1,
                    {
                        fade: 0.05,
                    }
                ),
            ]);
        }
    }
});
});
// ==================================================
// FIGHT
// ==================================================

scene("fight", (data) => {
startFightPlaylist();
    // 🎲 RANDOM MAP
    const currentMap =
        Math.floor(Math.random() * 6);

    let player;

    // ==================================================
    // P1 CREATION
    // ==================================================

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
                hasRedPower:
                    gooseyPowersP1.includes(0),
                hasBluePower:
                    gooseyPowersP1.includes(1),
                hasGhostyPower:
                    gooseyPowersP1.includes(2),
                hasGregPower:
                    gooseyPowersP1.includes(3),
                hasCatPower:
                    gooseyPowersP1.includes(4),
                hasAngyCapPower:
                    gooseyPowersP1.includes(5),
                hasPenguyPower:
                    gooseyPowersP1.includes(6),
                hasMarkPower:
                    gooseyPowersP1.includes(7),
                hasChatPower:
                    gooseyPowersP1.includes(8),

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

    } else if (data.player1Special === 8) {

        player = add([
            sprite("Bach", {
                anim: "bach",
            }),

            pos(200, 200),

            // 64px sprite -> 96px displayed
            // Goosey is 32px x scale 3 = 96px
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

                fighter: "BACH",

                bachHasBall: true,
                bachAura: false,
                bachAuraTime: 0,
                bachOriginalSpeed: BACH_SPEED,
                bachOriginalDamage: 12,
                bachOriginalKnockback: 700,
            },

            "player",
        ]);
} else if (data.player1Special === 9) {

    player = add([
        sprite("Nathaniel", {
            anim: "nathaniel",
        }),

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

            fighter: "NATHANIEL",
        },

        "player",
    ]);
    } else if (
    data.player1Special === 10
) {

    player = add([
        sprite("Kachen"),

        pos(
            200,
            200
        ),

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

            fighter: "KACHEN",
        },

        "player",
    ]);
    } else if (data.player1Special === 11) {

    player = add([
        sprite("Denku", {
            anim: "idle",
        }),

        pos(
            200,
            200
        ),

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

            fighter: "DENKU",
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

    // ==================================================
    // P2 CREATION
    // ==================================================

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
                hasRedPower:
                    gooseyPowersP2.includes(0),
                hasBluePower:
                    gooseyPowersP2.includes(1),
                hasGhostyPower:
                    gooseyPowersP2.includes(2),
                hasGregPower:
                    gooseyPowersP2.includes(3),
                hasCatPower:
                    gooseyPowersP2.includes(4),
                hasAngyCapPower:
                    gooseyPowersP2.includes(5),
                hasPenguyPower:
                    gooseyPowersP2.includes(6),
                hasMarkPower:
                    gooseyPowersP2.includes(7),
                hasChatPower:
                    gooseyPowersP2.includes(8),

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

    } else if (data.player2Special === 8) {

        player2 = add([
            sprite("Bach", {
                anim: "bach",
            }),

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

                fighter: "BACH",

                bachHasBall: true,
                bachAura: false,
                bachAuraTime: 0,
                bachOriginalSpeed: BACH_SPEED,
                bachOriginalDamage: 12,
                bachOriginalKnockback: 700,
            },

            "player2",
        ]);
} else if (data.player2Special === 9) {

    player2 = add([
        sprite("Nathaniel", {
            anim: "nathaniel",
        }),

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

            fighter: "NATHANIEL",
        },

        "player2",
    ]);
    } else if (
    data.player2Special === 10
) {

    player2 = add([
        sprite("Kachen"),

        pos(
            550,
            200
        ),

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

            fighter: "KACHEN",
        },

        "player2",
    ]);
    } else if (data.player2Special === 11) {

    player2 = add([
        sprite("Denku", {
            anim: "idle",
        }),

        pos(
            550,
            200
        ),

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

            fighter: "DENKU",
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
    // ⚽ BACH BALL SYSTEM
    // ==================================================

    let bachBallP1 = null;
    let bachBallAuraP1 = [];
    let bachBallAuraP2 = [];
    function createBachBall() {

        if (
            player.fighter !== "BACH"
        ) {
            return;
        }

        if (
            bachBallP1 &&
            bachBallP1.exists()
        ) {
            destroy(bachBallP1);
        }

        player.bachHasBall = true;

        bachBallP1 = add([
            text("⚽"),
            pos(
                player.pos.x + 80,
                player.pos.y
            ),
            anchor("center"),
            scale(1),
            z(50),

            {
                flying: false,
                bachVX: 0,
                bachVY: 0,
            },
        ]);
    }

    createBachBall();


    // ==================================================
    // ⚽ BACH BALL MOVEMENT
    // ==================================================

    onUpdate(() => {

        if (
            player.fighter !== "BACH"
        ) {
            return;
        }

        if (
            !bachBallP1 ||
            !bachBallP1.exists()
        ) {
            return;
        }

        // ==============================================
        // ⚽ ORBIT BACH
        // ==============================================

        if (
            !bachBallP1.flying
        ) {

            const angle =
                time() * 5;

            const orbitX =
                player.pos.x +
                Math.cos(angle) * 100;

            const orbitY =
                player.pos.y -
                20 +
                Math.sin(angle) * 70;

            bachBallP1.moveTo(
                vec2(
                    orbitX,
                    orbitY
                )
            );

            return;
        }
        // ==============================================
        // ⚽ FLY
        // ==============================================

        bachBallP1.move(
            bachBallP1.bachVX,
            bachBallP1.bachVY
        );

        // ==============================================
        // ⚽ HIT P2
        // ==============================================

        if (
            !player2.invincible &&
            Math.abs(
                bachBallP1.pos.x -
                player2.pos.x
            ) < 40 &&
            Math.abs(
                bachBallP1.pos.y -
                player2.pos.y
            ) < 50
        ) {

            player2.damage +=
                20;

            player2.knockbackActive =
                true;

            player2.knockbackX =
                bachBallP1.bachVX > 0
                    ? 900
                    : -900;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y =
                -400;

            shake(8);

            // ==========================================
            // ⚽ BALL BOUNCES BACK TO BACH
            // ==========================================

            bachBallP1.bachVX =
                -bachBallP1.bachVX;

            bachBallP1.bachVY =
                0;

            return;
        }

        // ==============================================
        // ⚽ BACH RECLAIMS BALL
        // ==============================================

        const dx =
            bachBallP1.pos.x -
            player.pos.x;

        const dy =
            bachBallP1.pos.y -
            player.pos.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distance < 60 &&
            !player.respawning
        ) {

            bachBallP1.flying =
                false;

            bachBallP1.bachVX =
                0;

            bachBallP1.bachVY =
                0;

            player.bachHasBall =
                true;

            return;
        }

        // ==============================================
        // 💀 BALL LEAVES SCREEN
        // ==============================================

        if (
            bachBallP1.pos.x < -100 ||
            bachBallP1.pos.x > 900 ||
            bachBallP1.pos.y < -150 ||
            bachBallP1.pos.y > 550
        ) {

            player.bachHasBall =
                false;

            destroy(
                bachBallP1
            );

            bachBallP1 =
                null;
        }
    });
    // ==================================================
    // 🔵⚽ BACH AURA SPECIAL
    // ==================================================

    const BACH_AURA_DURATION = 10;
    const BACH_AURA_BOOST = 550;

    function activateBachSpecial(bach) {

        if (
            bach.fighter !== "BACH" ||
            bach.respawning ||
            bach.specialUsed
        ) {
            return;
        }

        bach.specialUsed =
            true;

        bach.bachAura =
            true;

        bach.bachAuraTime =
            BACH_AURA_DURATION;

        // ==============================================
        // 📈 +550 STATS
        // ==============================================

        bach.bachSpeedBonus =
            BACH_AURA_BOOST;

        bach.bachDamageBonus =
            BACH_AURA_BOOST;

        bach.bachKnockbackBonus =
            BACH_AURA_BOOST;

        bach.bachJumpBonus =
            BACH_AURA_BOOST;

        // ==============================================
        // 😎 SPECIAL ANIMATION
        // ==============================================

        bach.play(
            "bachSpecial"
        );

        specialStatus.text =
            "BACH: AURA MODE!!!";

        // ==============================================
        // ⏳ END AURA
        // ==============================================

        wait(
            BACH_AURA_DURATION,
            () => {

                bach.bachAura =
                    false;

                bach.bachSpeedBonus =
                    0;

                bach.bachDamageBonus =
                    0;

                bach.bachKnockbackBonus =
                    0;

                bach.bachJumpBonus =
                    0;

                bach.specialUsed =
                    false;

                bach.play(
                    "bach"
                );

                specialStatus.text =
                    "";
            }
        );
    }
    // ==================================================
    // 🔵 BACH AURA VISUAL
    // ==================================================

    onUpdate(() => {

        // ==================================================
        // 🔵 BACH P1 AURA
        // ==================================================

        if (
            player.fighter === "BACH" &&
            player.bachAura &&
            !player.respawning
        ) {

            for (
                let i = 0;
                i < 18;
                i++
            ) {

                const angle =
                    time() * 2 +
                    i * (
                        Math.PI * 2 /
                        18
                    );

                add([
                    text("🔵"),
                    pos(
                        player.pos.x +
                        Math.cos(angle) * 85,

                        player.pos.y +
                        Math.sin(angle) * 85
                    ),
                    anchor("center"),
                    scale(0.35),
                    z(45),
                    opacity(1),
                    lifespan(
                        0.12,
                        {
                            fade: 0.1,
                        }
                    ),
                ]);
            }
        }

        // ==================================================
        // 🔵 BACH P2 AURA
        // ==================================================

        if (
            player2.fighter === "BACH" &&
            player2.bachAura &&
            !player2.respawning
        ) {

            for (
                let i = 0;
                i < 18;
                i++
            ) {

                const angle =
                    time() * 2 +
                    i * (
                        Math.PI * 2 /
                        18
                    );

                add([
                    text("🔵"),
                    pos(
                        player2.pos.x +
                        Math.cos(angle) * 85,

                        player2.pos.y +
                        Math.sin(angle) * 85
                    ),
                    anchor("center"),
                    scale(0.35),
                    z(45),
                    opacity(1),
                    lifespan(
                        0.12,
                        {
                            fade: 0.1,
                        }
                    ),
                ]);
            }
        }

        // ==================================================
        // 🔵⚽ BACH BALL AURA — P1
        // ==================================================

        if (
            player.bachAura &&
            bachBallP1 &&
            bachBallP1.exists()
        ) {

            for (
                let i = 0;
                i < 18;
                i++
            ) {

                const angle =
                    time() * 2 +
                    i * (
                        Math.PI * 2 /
                        18
                    );

                add([
                    text("🔵"),
                    pos(
                        bachBallP1.pos.x +
                        Math.cos(angle) * 85,

                        bachBallP1.pos.y +
                        Math.sin(angle) * 85
                    ),
                    anchor("center"),
                    scale(0.35),
                    z(100),
                    opacity(1),
                    lifespan(
                        0.12,
                        {
                            fade: 0.1,
                        }
                    ),
                ]);
            }
        }

        // ==================================================
        // 🔵⚽ BACH BALL AURA — P2
        // ==================================================

        if (
            player2.bachAura &&
            bachBallP2 &&
            bachBallP2.exists()
        ) {

            for (
                let i = 0;
                i < 18;
                i++
            ) {

                const angle =
                    time() * 2 +
                    i * (
                        Math.PI * 2 /
                        18
                    );

                add([
                    text("🔵"),
                    pos(
                        bachBallP2.pos.x +
                        Math.cos(angle) * 85,

                        bachBallP2.pos.y +
                        Math.sin(angle) * 85
                    ),
                    anchor("center"),
                    scale(0.35),
                    z(100),
                    opacity(1),
                    lifespan(
                        0.12,
                        {
                            fade: 0.1,
                        }
                    ),
                ]);
            }
        }
    });
    // ==================================================
    // ⚽ BACH BALL SYSTEM — P2
    // ==================================================

    let bachBallP2 = null;

    function createBachBallP2() {

        if (
            player2.fighter !== "BACH"
        ) {
            return;
        }

        if (
            bachBallP2 &&
            bachBallP2.exists()
        ) {
            destroy(bachBallP2);
        }

        player2.bachHasBall = true;

        bachBallP2 = add([
            text("⚽"),
            pos(
                player2.pos.x + 80,
                player2.pos.y
            ),
            anchor("center"),
            scale(1),
            z(50),
        ]);
    }

    createBachBallP2();


    // ==================================================
    // ⚽ BACH BALL MOVEMENT — P2
    // ==================================================

    onUpdate(() => {

        if (
            player2.fighter !== "BACH"
        ) {
            return;
        }

        if (
            !bachBallP2 ||
            !bachBallP2.exists()
        ) {
            return;
        }

        // ==============================================
        // ⚽ ORBIT BACH P2
        // ==============================================

        if (!bachBallP2.flying) {

            const angle =
                time() * 5;

            const orbitX =
                player2.pos.x +
                Math.cos(angle) * 100;

            const orbitY =
                player2.pos.y -
                20 +
                Math.sin(angle) * 70;

            bachBallP2.moveTo(
                vec2(
                    orbitX,
                    orbitY
                )
            );

            return;
        }

        // ==============================================
        // ⚽ FLY
        // ==============================================

        bachBallP2.move(
            bachBallP2.bachVX,
            bachBallP2.bachVY
        );

        // ==============================================
        // ⚽ HIT P1
        // ==============================================

        if (
            !player.invincible &&
            Math.abs(
                bachBallP2.pos.x -
                player.pos.x
            ) < 40 &&
            Math.abs(
                bachBallP2.pos.y -
                player.pos.y
            ) < 50
        ) {

            player.damage += 20;

            player.knockbackActive = true;

            player.knockbackX =
                bachBallP2.bachVX > 0
                    ? 900
                    : -900;

            player.vel.x =
                player.knockbackX;

            player.vel.y =
                -400;

            shake(8);

            // ⚽ BOUNCE BACK TO P2

            bachBallP2.bachVX =
                -bachBallP2.bachVX;

            bachBallP2.bachVY =
                0;

            return;
        }

        // ==============================================
        // ⚽ P2 RECLAIMS BALL
        // ==============================================

        const dx =
            bachBallP2.pos.x -
            player2.pos.x;

        const dy =
            bachBallP2.pos.y -
            player2.pos.y;

        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );

        if (
            distance < 60 &&
            !player2.respawning
        ) {

            bachBallP2.flying = false;

            bachBallP2.bachVX = 0;

            bachBallP2.bachVY = 0;

            player2.bachHasBall = true;

            return;
        }

        // ==============================================
        // 💀 BALL LEAVES SCREEN
        // ==============================================

        if (
            bachBallP2.pos.x < -100 ||
            bachBallP2.pos.x > 900 ||
            bachBallP2.pos.y < -150 ||
            bachBallP2.pos.y > 550
        ) {

            player2.bachHasBall = false;

            destroy(
                bachBallP2
            );

            bachBallP2 = null;
        }
    });
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

        if (
            player.pos.x >
            player2.pos.x
        ) {

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
                attack.pos.x -
                player.pos.x
            ) < 90 &&
            Math.abs(
                attack.pos.y -
                player.pos.y
            ) < 60
        ) {

            player.damage += 10;

            player.knockbackActive =
                true;

            player.knockbackX =
                (
                    500 +
                    player.damage * 10
                ) *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y =
                -250;
        }
    }


    // ==================================================
    // 🤖 CPU SPECIAL
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

        if (
            player2.fighter ===
            "GOOSEY"
        ) {

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

            return;
        }


        // GHOSTY

        if (
            player2.fighter ===
            "GHOSTY"
        ) {

            player2.specialUsed =
                true;

            player2.invincible =
                true;

            specialStatus.text =
                "CPU GHOSTY: INVINCIBLE!";

            wait(2, () => {

                player2.invincible =
                    false;

                player2.specialUsed =
                    false;

                specialStatus.text =
                    "";
            });

            return;
        }


        // ANGY-CAT

        if (
            player2.fighter ===
            "ANGY-CAT"
        ) {

            player2.specialUsed =
                true;

            player2.catMod =
                true;

            player2.scaleTo(
                CAT_MOD_SCALE
            );

            specialStatus.text =
                "CPU ANGY-CAT: CAT MOD!!!";

            wait(
                CAT_MOD_TIME,
                () => {

                    player2.catMod =
                        false;

                    player2.scaleTo(
                        CAT_NORMAL_SCALE
                    );

                    player2.specialUsed =
                        false;

                    specialStatus.text =
                        "";
                }
            );

            return;
        }


        // MARK

        if (
            player2.fighter ===
            "MARK"
        ) {

            player2.specialUsed =
                true;

            markDimensionShift();

            wait(3, () => {

                player2.specialUsed =
                    false;
            });

            return;
        }


        // CHAT

        if (
            player2.fighter ===
            "CHAT"
        ) {

            activateChatSpecial(
                player2,
                player
            );

            return;
        }


        // BACH
        // Not using Bach's special yet.
        // For now, CPU Bach uses normal attack.

        cpuAttack();
    }


    // ==================================================
    // 🟢 EASY CPU
    // ==================================================

    function cpuEasyAction() {

        const distance =
            player.pos.x -
            player2.pos.x;

        const action =
            Math.floor(
                Math.random() * 5
            );

        if (
            action === 0
        ) {

            if (
                distance > 0
            ) {

                player2.move(
                    SPEED,
                    0
                );

                player2.facing =
                    1;

            } else {

                player2.move(
                    -SPEED,
                    0
                );

                player2.facing =
                    -1;
            }

        } else if (
            action === 1
        ) {

            if (
                distance > 0
            ) {

                player2.move(
                    -SPEED,
                    0
                );

                player2.facing =
                    -1;

            } else {

                player2.move(
                    SPEED,
                    0
                );

                player2.facing =
                    1;
            }

        } else if (
            action === 2
        ) {

            if (
                player2.isGrounded()
            ) {

                player2.jump(
                    JUMP_FORCE
                );
            }

        } else if (
            action === 3
        ) {

            cpuAttack();

        } else {

            // Do nothing.
        }
    }


    // ==================================================
    // 🟡 MEDIUM CPU
    // ==================================================

    function cpuMediumAction() {

        const distance =
            Math.abs(
                player.pos.x -
                player2.pos.x
            );

        cpuFaceOpponent();
        cpuRecovery();

        if (
            distance < 140
        ) {

            cpuAttack();

            if (
                Math.random() <
                0.35
            ) {

                cpuSpecial();
            }

            return;
        }

        if (
            player.pos.x >
            player2.pos.x
        ) {

            player2.move(
                SPEED,
                0
            );

            player2.facing =
                1;

        } else {

            player2.move(
                -SPEED,
                0
            );

            player2.facing =
                -1;
        }

        if (
            Math.random() < 0.18 &&
            player2.isGrounded()
        ) {

            player2.jump(
                JUMP_FORCE
            );
        }

        if (
            Math.random() < 0.12
        ) {

            cpuSpecial();
        }
    }


    // ==================================================
    // 🔴 HARD CPU
    // ==================================================

    function cpuHardAction() {

        const dx =
            player.pos.x -
            player2.pos.x;

        const distance =
            Math.abs(dx);

        cpuFaceOpponent();
        cpuRecovery();

        if (
            distance < 110
        ) {

            cpuAttack();

            if (
                Math.random() < 0.55
            ) {

                cpuSpecial();
            }

            return;
        }

        if (
            distance < 260
        ) {

            if (
                dx > 0
            ) {

                player2.move(
                    BLUE_SPEED,
                    0
                );

                player2.facing =
                    1;

            } else {

                player2.move(
                    -BLUE_SPEED,
                    0
                );

                player2.facing =
                    -1;
            }

            if (
                Math.random() < 0.3 &&
                player2.isGrounded()
            ) {

                player2.jump(
                    JUMP_FORCE
                );
            }

            if (
                Math.random() < 0.3
            ) {

                cpuSpecial();
            }

            return;
        }

        if (
            dx > 0
        ) {

            player2.move(
                BLUE_SPEED,
                0
            );

            player2.facing =
                1;

        } else {

            player2.move(
                -BLUE_SPEED,
                0
            );

            player2.facing =
                -1;
        }

        if (
            Math.random() < 0.2 &&
            player2.isGrounded()
        ) {

            player2.jump(
                JUMP_FORCE
            );
        }
    }


    // ==================================================
    // 🤖 CPU UPDATE
    // ==================================================

    onUpdate(() => {

        if (
            window.singlePlayerMode !==
            true
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

        cpuActionTimer +=
            dt();

        let cooldown =
            CPU_EASY_COOLDOWN;

        if (
            window.cpuDifficulty ===
            "MEDIUM"
        ) {

            cooldown =
                CPU_MEDIUM_COOLDOWN;

        } else if (
            window.cpuDifficulty ===
            "HARD"
        ) {

            cooldown =
                CPU_HARD_COOLDOWN;
        }

        if (
            cpuActionTimer >=
            cooldown
        ) {

            cpuActionTimer = 0;

            if (
                window.cpuDifficulty ===
                "EASY"
            ) {

                cpuEasyAction();

            } else if (
                window.cpuDifficulty ===
                "MEDIUM"
            ) {

                cpuMediumAction();

            } else if (
                window.cpuDifficulty ===
                "HARD"
            ) {

                cpuHardAction();
            }
        }

        cpuRecovery();
    });


    // ==================================================
    // 🗺️ MAP
    // ==================================================

    if (
        currentMap ===
        MAP_GRASSLAND
    ) {

        add([
            rect(700, 50),
            pos(25, 350),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

    } else if (
        currentMap ===
        MAP_PARKOUR
    ) {

        add([
            rect(220, 35),
            pos(25, 350),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(140, 25),
            pos(280, 300),
            color(0, 200, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(120, 25),
            pos(480, 230),
            color(0, 180, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(150, 25),
            pos(625, 310),
            color(0, 220, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(100, 25),
            pos(350, 150),
            color(0, 255, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

    } else if (
        currentMap ===
        MAP_PARKOUR_NIGHTMARE
    ) {

        add([
            rect(110, 25),
            pos(145, 250),
            color(100, 255, 100),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(110, 25),
            pos(545, 250),
            color(100, 255, 100),
            area(),
            body({
                isStatic: true,
            }),
        ]);

    } else if (
        currentMap ===
        MAP_GRAVITY_CHAOS
    ) {

        add([
            rect(220, 30),
            pos(25, 350),
            color(150, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(220, 30),
            pos(555, 70),
            color(150, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(30, 180),
            pos(25, 170),
            color(180, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(30, 180),
            pos(745, 170),
            color(180, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(180, 25),
            pos(310, 220),
            color(200, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

    } else if (
        currentMap ===
        MAP_PARKOUR_GRAVITY
    ) {

        add([
            rect(130, 25),
            pos(40, 340),
            color(0, 255, 100),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(130, 25),
            pos(630, 340),
            color(0, 255, 100),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        const movingPlatform =
            add([
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

        add([
            rect(90, 20),
            pos(355, 220),
            color(200, 0, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(110, 22),
            pos(120, 150),
            color(0, 200, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(110, 22),
            pos(570, 150),
            color(0, 200, 255),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(100, 20),
            pos(250, 80),
            color(255, 100, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(100, 20),
            pos(450, 80),
            color(255, 100, 0),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(140, 20),
            pos(330, 30),
            color(255, 0, 200),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        const verticalPlatform =
            add([
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

        onUpdate(() => {

            movingPlatform.move(
                160 *
                movingPlatform.moveDirection,
                0
            );

            if (
                movingPlatform.pos.x >
                640
            ) {

                movingPlatform.moveDirection =
                    -1;
            }

            if (
                movingPlatform.pos.x <
                40
            ) {

                movingPlatform.moveDirection =
                    1;
            }

            verticalPlatform.move(
                0,
                120 *
                verticalPlatform.moveDirection
            );

            if (
                verticalPlatform.pos.y >
                280
            ) {

                verticalPlatform.moveDirection =
                    -1;
            }

            if (
                verticalPlatform.pos.y <
                100
            ) {

                verticalPlatform.moveDirection =
                    1;
            }
        });
    }


    // ==================================================
    // 🌀 GRAVITY CHAOS
    // ==================================================

    if (
        currentMap ===
        MAP_GRAVITY_CHAOS
    ) {

        let gravityDirection =
            0;

        const gravityPower =
            1800;

        function changeGravity() {

            gravityDirection =
                Math.floor(
                    Math.random() * 4
                );

            if (
                gravityDirection === 0
            ) {

                setGravity(
                    gravityPower
                );

            } else if (
                gravityDirection === 1
            ) {

                setGravity(
                    -gravityPower
                );

            } else if (
                gravityDirection === 2
            ) {

                setGravity(0);

                player.vel.x -=
                    1200;

                player2.vel.x -=
                    1200;

            } else {

                setGravity(0);

                player.vel.x +=
                    1200;

                player2.vel.x +=
                    1200;
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

    if (
        currentMap ===
        MAP_PARKOUR_GRAVITY
    ) {

        const gravityPower =
            1800;

        function changeParkourGravity() {

            const direction =
                Math.floor(
                    Math.random() * 4
                );

            if (
                direction === 0
            ) {

                setGravity(
                    gravityPower
                );

            } else if (
                direction === 1
            ) {

                setGravity(
                    -gravityPower
                );

            } else {

                setGravity(0);
            }
        }

        changeParkourGravity();

        loop(2.5, () => {

            changeParkourGravity();
        });
    }


    // ==================================================
    // 🌋 VOLCANO
    // ==================================================

    if (
        currentMap ===
        MAP_VOLCANO
    ) {

        add([
            rect(500, 30),
            pos(150, 300),
            color(100, 60, 30),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(120, 25),
            pos(40, 220),
            color(120, 70, 35),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(120, 25),
            pos(640, 220),
            color(120, 70, 35),
            area(),
            body({
                isStatic: true,
            }),
        ]);

        add([
            rect(100, 25),
            pos(350, 160),
            color(140, 75, 30),
            area(),
            body({
                isStatic: true,
            }),
        ]);


        // ==================================================
        // 🔥 RISING LAVA
        // ==================================================

        const lava = add([
            rect(800, 120),
            pos(0, 430),
            color(255, 60, 0),
            area(),
        ]);

        let lavaSpeed = 100;

        let lavaP1Cooldown = 0;
        let lavaP2Cooldown = 0;

        onUpdate(() => {

            lava.pos.y -=
                lavaSpeed * dt();

            if (
                lavaP1Cooldown > 0
            ) {

                lavaP1Cooldown -=
                    dt();
            }

            if (
                lavaP2Cooldown > 0
            ) {

                lavaP2Cooldown -=
                    dt();
            }


            // P1

            if (
                !player.respawning &&
                !player.invincible &&
                lavaP1Cooldown <= 0 &&
                player.pos.y + 30 >=
                lava.pos.y
            ) {

                lavaP1Cooldown =
                    0.5;

                player.damage +=
                    15;

                player.knockbackActive =
                    true;

                player.knockbackX =
                    0;

                player.vel.x =
                    0;

                player.vel.y =
                    -1000;

                shake(15);
            }


            // P2

            if (
                !player2.respawning &&
                !player2.invincible &&
                lavaP2Cooldown <= 0 &&
                player2.pos.y + 30 >=
                lava.pos.y
            ) {

                lavaP2Cooldown =
                    0.5;

                player2.damage +=
                    15;

                player2.knockbackActive =
                    true;

                player2.knockbackX =
                    0;

                player2.vel.x =
                    0;

                player2.vel.y =
                    -1000;

                shake(15);
            }
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
            Math.floor(
                player.damage
            ) + "%";

        player2Percent.text =
            Math.floor(
                player2.damage
            ) + "%";

        playerStocks.text =
            "❤️".repeat(
                player.stocks
            );

        player2Stocks.text =
            "❤️".repeat(
                player2.stocks
            );
    });


    // ==================================================
    // 🐧 PENGUY SUPER-SLIPPERY MOVEMENT
    // ==================================================

    const PENGUY_ACCELERATION =
        1600;

    const PENGUY_MAX_SPEED =
        600;

    const PENGUY_GROUND_FRICTION =
        0.96;

    const PENGUY_AIR_FRICTION =
        0.985;

    const PENGUY_AIR_CONTROL =
        900;


    // ==================================================
    // P1 LEFT
    // ==================================================

    onKeyDown("left", () => {

        if (
            player.knockbackActive ||
            player.respawning ||
            player.frozen
        ) {
            return;
        }

        if (
            player.fighter ===
            "PENGUY"
        ) {

            player.vel.x -=
                PENGUY_ACCELERATION *
                dt();

            if (
                player.vel.x <
                -PENGUY_MAX_SPEED
            ) {

                player.vel.x =
                    -PENGUY_MAX_SPEED;
            }

            player.facing =
                -1;

            return;
        }

        if (
            markIceWorld
        ) {

            player.vel.x -=
                ICE_ACCELERATION *
                dt();

            if (
                player.vel.x <
                -ICE_MAX_SPEED
            ) {

                player.vel.x =
                    -ICE_MAX_SPEED;
            }

        } else if (
            player.fighter ===
            "GOOSEY"
        ) {

            player.move(
                -GOOSEY_SPEED,
                0
            );

        } else if (
            player.fighter ===
            "RED"
        ) {

            player.move(
                -RED_SPEED,
                0
            );

        } else if (
            player.fighter ===
            "BLUE"
        ) {

            player.move(
                -BLUE_SPEED,
                0
            );
        } else if (
            player.fighter ===
            "BACH"
        ) {

            player.move(
                -BACH_SPEED,
                0
            );
        } else {

            player.move(
                -SPEED,
                0
            );
        }

        player.facing =
            -1;
    });


    // ==================================================
    // P1 RIGHT
    // ==================================================

    onKeyDown("right", () => {

        if (
            player.knockbackActive ||
            player.respawning ||
            player.frozen
        ) {
            return;
        }

        if (
            player.fighter ===
            "PENGUY"
        ) {

            player.vel.x +=
                PENGUY_ACCELERATION *
                dt();

            if (
                player.vel.x >
                PENGUY_MAX_SPEED
            ) {

                player.vel.x =
                    PENGUY_MAX_SPEED;
            }

            player.facing =
                1;

            return;
        }

        if (
            markIceWorld
        ) {

            player.vel.x +=
                ICE_ACCELERATION *
                dt();

            if (
                player.vel.x >
                ICE_MAX_SPEED
            ) {

                player.vel.x =
                    ICE_MAX_SPEED;
            }

        } else if (
            player.fighter ===
            "GOOSEY"
        ) {

            player.move(
                GOOSEY_SPEED,
                0
            );

        } else if (
            player.fighter ===
            "RED"
        ) {

            player.move(
                RED_SPEED,
                0
            );

        } else if (
            player.fighter ===
            "BLUE"
        ) {

            player.move(
                BLUE_SPEED,
                0
            );
        } else if (
            player.fighter ===
            "BACH"
        ) {

            player.move(
                BACH_SPEED,
                0
            );
        } else {

            player.move(
                SPEED,
                0
            );
        }

        player.facing =
            1;
    });


    // ==================================================
    // P1 JUMP
    // ==================================================

    onKeyPress("up", () => {

        if (
            player.respawning ||
            player.frozen
        ) {
            return;
        }

        player.facingUp =
            true;

        if (
            player.isGrounded()
        ) {

            player.jump(
                JUMP_FORCE
            );
        }

        wait(0.5, () => {

            player.facingUp =
                false;
        });
    });


    // ==================================================
    // P2 LEFT
    // ==================================================

    onKeyDown("a", () => {

        if (
            player2.knockbackActive ||
            player2.respawning ||
            player2.frozen
        ) {
            return;
        }

        if (
            player2.fighter ===
            "PENGUY"
        ) {

            player2.vel.x -=
                PENGUY_ACCELERATION *
                dt();

            if (
                player2.vel.x <
                -PENGUY_MAX_SPEED
            ) {

                player2.vel.x =
                    -PENGUY_MAX_SPEED;
            }

            player2.facing =
                -1;

            return;
        }

        if (
            markIceWorld
        ) {

            player2.vel.x -=
                ICE_ACCELERATION *
                dt();

            if (
                player2.vel.x <
                -ICE_MAX_SPEED
            ) {

                player2.vel.x =
                    -ICE_MAX_SPEED;
            }

        } else if (
            player2.fighter ===
            "GOOSEY"
        ) {

            player2.move(
                -GOOSEY_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "RED"
        ) {

            player2.move(
                -RED_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "BLUE"
        ) {

            player2.move(
                -BLUE_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "BACH"
        ) {

            player2.move(
                -BACH_SPEED,
                0
            );

        } else {

            player2.move(
                -SPEED,
                0
            );
        }

        player2.facing =
            -1;
    });


    // ==================================================
    // P2 RIGHT
    // ==================================================

    onKeyDown("d", () => {

        if (
            player2.knockbackActive ||
            player2.respawning ||
            player2.frozen
        ) {
            return;
        }

        if (
            player2.fighter ===
            "PENGUY"
        ) {

            player2.vel.x +=
                PENGUY_ACCELERATION *
                dt();

            if (
                player2.vel.x >
                PENGUY_MAX_SPEED
            ) {

                player2.vel.x =
                    PENGUY_MAX_SPEED;
            }

            player2.facing =
                1;

            return;
        }

        if (
            markIceWorld
        ) {

            player2.vel.x +=
                ICE_ACCELERATION *
                dt();

            if (
                player2.vel.x >
                ICE_MAX_SPEED
            ) {

                player2.vel.x =
                    ICE_MAX_SPEED;
            }

        } else if (
            player2.fighter ===
            "GOOSEY"
        ) {

            player2.move(
                GOOSEY_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "RED"
        ) {

            player2.move(
                RED_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "BLUE"
        ) {

            player2.move(
                BLUE_SPEED,
                0
            );

        } else if (
            player2.fighter ===
            "BACH"
        ) {

            player2.move(
                BACH_SPEED,
                0
            );

        } else {

            player2.move(
                SPEED,
                0
            );
        }

        player2.facing =
            1;
    });


    // ==================================================
    // P2 JUMP
    // ==================================================

    onKeyPress("w", () => {

        if (
            player2.respawning ||
            player2.frozen
        ) {
            return;
        }

        player2.facingUp =
            true;

        if (
            player2.isGrounded()
        ) {

            player2.jump(
                JUMP_FORCE
            );
        }

        wait(0.5, () => {

            player2.facingUp =
                false;
        });
    });
    // ==================================================
    // 🔵⚽ BALL AURA — P1
    // ==================================================

    if (
        player.bachAura &&
        bachBallP1 &&
        bachBallP1.exists()
    ) {

        if (
            bachBallAuraP1.length === 0
        ) {

            for (
                let i = 0;
                i < 24;
                i++
            ) {

                bachBallAuraP1.push(
                    add([
                        text("🔵"),
                        pos(
                            bachBallP1.pos.x,
                            bachBallP1.pos.y
                        ),
                        anchor("center"),
                        scale(1),
                        z(100),
                    ])
                );
            }
        }

        for (
            let i = 0;
            i < 24;
            i++
        ) {

            const angle =
                time() * 2 +
                i * (
                    Math.PI * 2 /
                    24
                );

            bachBallAuraP1[i].moveTo(
                vec2(
                    bachBallP1.pos.x +
                    Math.cos(angle) * 55,

                    bachBallP1.pos.y +
                    Math.sin(angle) * 55
                )
            );
        }

    } else {

        for (
            const dot of bachBallAuraP1
        ) {

            if (
                dot.exists()
            ) {
                destroy(dot);
            }
        }

        bachBallAuraP1 = [];
    }
    // ==================================================
    // 🐧 PENGUY FRICTION + AIR CONTROL
    // ==================================================

    onUpdate(() => {

        if (
            player.fighter ===
            "PENGUY" &&
            !player.knockbackActive &&
            !player.respawning &&
            !player.frozen
        ) {

            if (
                player.isGrounded()
            ) {

                player.vel.x *=
                    PENGUY_GROUND_FRICTION;

            } else {

                player.vel.x *=
                    PENGUY_AIR_FRICTION;

                if (
                    isKeyDown("left")
                ) {

                    player.vel.x -=
                        PENGUY_AIR_CONTROL *
                        dt();
                }

                if (
                    isKeyDown("right")
                ) {

                    player.vel.x +=
                        PENGUY_AIR_CONTROL *
                        dt();
                }

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
        }


        if (
            player2.fighter ===
            "PENGUY" &&
            !player2.knockbackActive &&
            !player2.respawning &&
            !player2.frozen
        ) {

            if (
                player2.isGrounded()
            ) {

                player2.vel.x *=
                    PENGUY_GROUND_FRICTION;

            } else {

                player2.vel.x *=
                    PENGUY_AIR_FRICTION;

                if (
                    isKeyDown("a")
                ) {

                    player2.vel.x -=
                        PENGUY_AIR_CONTROL *
                        dt();
                }

                if (
                    isKeyDown("d")
                ) {

                    player2.vel.x +=
                        PENGUY_AIR_CONTROL *
                        dt();
                }

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
        }


        // CHAT MAGNET

        if (
            player.fighter ===
            "CHAT" &&
            player.chatPower === 0 &&
            !player.respawning
        ) {

            const dx =
                player.pos.x -
                player2.pos.x;

            if (
                Math.abs(dx) < 250
            ) {

                player2.vel.x +=
                    dx * 2 * dt();
            }
        }


        if (
            player2.fighter ===
            "CHAT" &&
            player2.chatPower === 0 &&
            !player2.respawning
        ) {

            const dx =
                player2.pos.x -
                player.pos.x;

            if (
                Math.abs(dx) < 250
            ) {

                player.vel.x +=
                    dx * 2 * dt();
            }
        }


        // CHAT BOUNCY

        if (
            player.fighter ===
            "CHAT" &&
            player.chatPower === 1 &&
            player.isGrounded()
        ) {

            if (
                Math.abs(
                    player.vel.y
                ) < 10
            ) {

                player.jump(900);
            }
        }


        if (
            player2.fighter ===
            "CHAT" &&
            player2.chatPower === 1 &&
            player2.isGrounded()
        ) {

            if (
                Math.abs(
                    player2.vel.y
                ) < 10
            ) {

                player2.jump(900);
            }
        }


        // CHAT ICE TRAIL

        if (
            player.fighter ===
            "CHAT" &&
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
            player2.fighter ===
            "CHAT" &&
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

        if (
            player.knockbackActive
        ) {

            if (
                player.fighter ===
                "CHAT" &&
                player.chatPower === 2
            ) {

                player.vel.x =
                    player.knockbackX *
                    0.1;

            } else {

                player.vel.x =
                    player.knockbackX;

                if (
                    player.fighter ===
                    "PENGUY"
                ) {

                    player.knockbackX *=
                        PENGUY_KNOCKBACK_FRICTION;

                } else {

                    player.knockbackX *=
                        KNOCKBACK_FRICTION;
                }
            }

            if (
                Math.abs(
                    player.knockbackX
                ) <
                KNOCKBACK_STOP
            ) {

                player.knockbackX =
                    0;

                player.knockbackActive =
                    false;

                player.vel.x =
                    0;
            }
        }


        if (
            player2.knockbackActive
        ) {

            if (
                player2.fighter ===
                "CHAT" &&
                player2.chatPower === 2
            ) {

                player2.vel.x =
                    player2.knockbackX *
                    0.1;

            } else {

                player2.vel.x =
                    player2.knockbackX;

                if (
                    player2.fighter ===
                    "PENGUY"
                ) {

                    player2.knockbackX *=
                        PENGUY_KNOCKBACK_FRICTION;

                } else {

                    player2.knockbackX *=
                        KNOCKBACK_FRICTION;
                }
            }

            if (
                Math.abs(
                    player2.knockbackX
                ) <
                KNOCKBACK_STOP
            ) {

                player2.knockbackX =
                    0;

                player2.knockbackActive =
                    false;

                player2.vel.x =
                    0;
            }
        }
    });


    // ==================================================
    // P1 ATTACK
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
                player.respawning ||
                player.frozen ||
                player.invincible
            ) {
                return;
            }
            // ==================================================
            // ⚽ BACH ATTACK
            // ==================================================

            if (
                player.fighter === "BACH"
            ) {

                // ==============================================
                // 📏 DISTANCE TO P2
                // ==============================================

                const distanceX =
                    Math.abs(
                        player2.pos.x -
                        player.pos.x
                    );

                const distanceY =
                    Math.abs(
                        player2.pos.y -
                        player.pos.y
                    );

                // ==============================================
                // 🦵 CLOSE RANGE KICK
                // ==============================================

                if (
                    distanceX < 100 &&
                    distanceY < 70
                ) {

                    const kick = add([
                        rect(110, 55),
                        pos(
                            player.pos.x +
                            player.facing * 65,
                            player.pos.y
                        ),
                        color(
                            255,
                            220,
                            0
                        ),
                        opacity(0.8),
                        anchor("center"),
                        z(40),
                        opacity(1),
                        lifespan(
                            0.18,
                            {
                                fade: 0.08,
                            }
                        ),
                    ]);

                    if (
                        !player2.invincible
                    ) {

                        player2.damage +=
                            12;

                        player2.knockbackActive =
                            true;

                        player2.knockbackX =
                            700 *
                            player.facing;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y =
                            -300;
                    }

                    return;
                }

                // ==============================================
                // ⚽ RANGED KICK
                // ==============================================

                if (
                    player.bachHasBall &&
                    bachBallP1 &&
                    bachBallP1.exists() &&
                    !bachBallP1.flying
                ) {

                    player.bachHasBall =
                        false;

                    bachBallP1.flying =
                        true;

                    bachBallP1.bachVX =
                        player.facing * 500;

                    bachBallP1.bachVY =
                        0;

                    return;
                }

                return;
            }
// ==================================================
// DENKU — SUPA STRONG ATTACK
// ==================================================

if (player.fighter === "DENKU") {

    const attack = add([
        rect(130, 60),
        pos(
            player.pos.x +
            player.facing * 80,
            player.pos.y
        ),
        color(255, 50, 50),
        opacity(0.7),
        area(),
        lifespan(0.15, {
            fade: 0.05,
        }),
    ]);

    // DAMAGE DENKU HIMSELF — no self-damage while in superhero mode
    if (player.denkuMode !== "SUPERHERO") {
        player.damage += 20;
    }

    // HIT PLAYER 2
    if (
        !player2.invincible &&
        Math.abs(
            attack.pos.x -
            player2.pos.x
        ) < 120 &&
        Math.abs(
            attack.pos.y -
            player2.pos.y
        ) < 70
    ) {

        // SUPA STRONG DAMAGE
        player2.damage += 30;

        player2.knockbackActive = true;

        // HUGE KNOCKBACK
        player2.knockbackX =
            (1400 +
            player2.damage * 12) *
            player.facing;

        player2.vel.x =
            player2.knockbackX;

        player2.vel.y = -650;
    }

    return;
}
            // ==================================================
// ✴️ KACHEN RANGED ATTACK — P1
// ==================================================

if (
    player.fighter ===
    "KACHEN"
) {

    const kachenProjectile =
        add([
            text("✴️"),
            pos(
                player.pos.x +
                player.facing * 45,
                player.pos.y - 15
            ),
            anchor("center"),
            scale(0.8),
            z(55),

            {
                vx:
                    player.facing * 700,
            },
        ]);

    kachenProjectile.onUpdate(() => {

        // ✴️ MOVE PROJECTILE

        kachenProjectile.move(
            kachenProjectile.vx,
            0
        );

        // ==========================================
        // 💥 HIT P2
        // ==========================================

        if (
            !player2.invincible &&
            Math.abs(
                kachenProjectile.pos.x -
                player2.pos.x
            ) < 35 &&
            Math.abs(
                kachenProjectile.pos.y -
                player2.pos.y
            ) < 45
        ) {

            player2.damage +=
                30;

            player2.knockbackActive =
                true;

            player2.knockbackX =
                1100 *
                player.facing;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y =
                -450;

            shake(10);

            destroy(
                kachenProjectile
            );

            return;
        }

        // ==========================================
        // 💀 LEAVE SCREEN
        // ==========================================

        if (
            kachenProjectile.pos.x <
                -100 ||
            kachenProjectile.pos.x >
                900
        ) {

            destroy(
                kachenProjectile
            );
        }
    });

    return;
}
            // ==================================================
            // 🔥 CHAT FIREBALL
            // ==================================================

            if (
                player.fighter ===
                "CHAT" &&
                player.chatPower === 4
            ) {

                const fireballDirection =
                    player.facing;

                const fireball = add([
                    circle(15),
                    pos(
                        player.pos.x +
                        fireballDirection * 55,
                        player.pos.y
                    ),
                    anchor("center"),
                    color(
                        255,
                        80,
                        0
                    ),
                    opacity(1),
                    area(),
                    {
                        speed: 750,
                        hit: false,
                    },
                    lifespan(
                        1.5,
                        {
                            fade: 0.3,
                        }
                    ),
                ]);


                fireball.onUpdate(
                    () => {

                        fireball.move(
                            fireball.speed *
                            fireballDirection,
                            0
                        );

                        if (
                            !fireball.hit &&
                            !player2.invincible &&
                            Math.abs(
                                fireball.pos.x -
                                player2.pos.x
                            ) < 40 &&
                            Math.abs(
                                fireball.pos.y -
                                player2.pos.y
                            ) < 50
                        ) {

                            fireball.hit =
                                true;

                            player2.damage +=
                                20;

                            player2.knockbackActive =
                                true;

                            player2.knockbackX =
                                700 *
                                fireballDirection;

                            player2.vel.x =
                                player2.knockbackX;

                            player2.vel.y =
                                -400;

                            shake(8);

                            destroy(
                                fireball
                            );
                        }
                    }
                );

                return;
            }
// ==================================================
// 🟣 NATHANIEL RANGED ATTACK
// ==================================================

if (
    player.fighter ===
    "NATHANIEL"
) {
player.play(
    "nathanielSpecial"
);
    // ==============================================
    // /null HAND EFFECT
    // ==============================================

    add([
        text("/null"),
        pos(
            player.pos.x +
            player.facing * 35,
            player.pos.y - 15
        ),
        anchor("center"),
        scale(0.6),
        z(60),
        opacity(1),

        lifespan(
            0.25,
            {
                fade: 0.15,
            }
        ),
    ]);

    // ==============================================
    // 🟣 PURPLE BALL
    // ==============================================

    const nathanielBall =
        add([
            circle(10),
            pos(
                player.pos.x +
                player.facing * 45,
                player.pos.y - 15
            ),
            color(
                180,
                0,
                255
            ),
            area(),
            z(55),

            {
                vx:
                    player.facing *
                    700,
            },
        ]);

    nathanielBall.onUpdate(() => {

        // 🟣 MOVE PROJECTILE

        nathanielBall.move(
            nathanielBall.vx,
            0
        );

        // ==========================================
        // 💥 HIT P2
        // ==========================================

        if (
            !player2.invincible &&
            Math.abs(
                nathanielBall.pos.x -
                player2.pos.x
            ) < 35 &&
            Math.abs(
                nathanielBall.pos.y -
                player2.pos.y
            ) < 45
        ) {

            player2.damage +=
                25;

            player2.knockbackActive =
                true;

            player2.knockbackX =
                1000 *
                player.facing;

            player2.vel.x =
                player2.knockbackX;

            player2.vel.y =
                -450;

            shake(10);

            destroy(
                nathanielBall
            );

            return;
        }

        // ==========================================
        // 💀 LEAVE SCREEN
        // ==========================================

        if (
            nathanielBall.pos.x <
                -100 ||
            nathanielBall.pos.x >
                900
        ) {

            destroy(
                nathanielBall
            );
        }
    });

    return;
}

            // ==================================================
            // GREG
            // ==================================================

            if (
                player.fighter ===
                "GREG"
            ) {

                if (
                    player.gregCooldown
                ) {
                    return;
                }

                player.gregCooldown =
                    true;

                wait(
                    GREG_ATTACK_COOLDOWN,
                    () => {

                        player.gregCooldown =
                            false;
                    }
                );


                if (
                    player.facingUp
                ) {

                    const attack = add([
                        rect(65, 160),
                        pos(
                            player.pos.x +
                            player.facing * 45,
                            player.pos.y - 80
                        ),
                        color(
                            255,
                            0,
                            0
                        ),
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

                        player2.damage +=
                            15;

                        player2.knockbackActive =
                            true;

                        player2.knockbackX =
                            (
                                GREG_UPPERCUT_KNOCKBACK +
                                player2.damage * 6
                            ) *
                            player.facing;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y =
                            -700;
                    }

                } else {

                    const attack = add([
                        rect(180, 45),
                        pos(
                            player.pos.x +
                            player.facing * 90,
                            player.pos.y
                        ),
                        color(
                            255,
                            255,
                            0
                        ),
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

                        player2.damage +=
                            10;

                        player2.knockbackActive =
                            true;

                        player2.knockbackX =
                            (
                                GREG_PUNCH_KNOCKBACK +
                                player2.damage * 6
                            ) *
                            player.facing;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y =
                            -250;
                    }
                }

                return;
            }


            // ==================================================
            // ANGY-CAT
            // ==================================================

            if (
                player.fighter ===
                "ANGY-CAT"
            ) {

                if (
                    player.facingUp
                ) {

                    const attackSize =
                        player.catMod
                            ? 160
                            : 80;

                    const attack =
                        add([
                            rect(
                                attackSize,
                                attackSize
                            ),
                            pos(
                                player.pos.x +
                                player.facing *
                                (
                                    player.catMod
                                        ? 90
                                        : 50
                                ),
                                player.pos.y -
                                (
                                    player.catMod
                                        ? 60
                                        : 40
                                )
                            ),
                            color(
                                255,
                                150,
                                0
                            ),
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
                        !player2.invincible &&
                        Math.abs(
                            attack.pos.x -
                            player2.pos.x
                        ) <
                        (
                            player.catMod
                                ? 130
                                : 70
                        ) &&
                        Math.abs(
                            attack.pos.y -
                            player2.pos.y
                        ) <
                        (
                            player.catMod
                                ? 130
                                : 75
                        )
                    ) {

                        player2.damage +=
                            15;

                        player2.knockbackActive =
                            true;

                        player2.knockbackX =
                            (
                                400 +
                                player2.damage *
                                10
                            ) *
                            player.facing;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y =
                            -700;
                    }

                    return;
                }


                const attackWidth =
                    player.catMod
                        ? 220
                        : 100;

                const attackHeight =
                    player.catMod
                        ? 55
                        : 40;

                const attackDistance =
                    player.catMod
                        ? 110
                        : 55;

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
                    color(
                        255,
                        150,
                        0
                    ),
                    opacity(0.6),
                    area(),
                    lifespan(
                        0.12,
                        {
                            fade: 0.05,
                        }
                    ),
                ]);

                const hitDistance =
                    player.catMod
                        ? 180
                        : 85;

                const hitHeight =
                    player.catMod
                        ? 70
                        : 50;

                if (
                    !player2.invincible &&
                    Math.abs(
                        attack.pos.x -
                        player2.pos.x
                    ) <
                    hitDistance &&
                    Math.abs(
                        attack.pos.y -
                        player2.pos.y
                    ) <
                    hitHeight
                ) {

                    player2.damage +=
                        player.catMod
                            ? 15
                            : 10;

                    player2.knockbackActive =
                        true;

                    player2.knockbackX =
                        (
                            550 +
                            player2.damage *
                            10
                        ) *
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

            if (
                player.fighter ===
                "ANGY-CAP"
            ) {

                if (
                    player.facingUp
                ) {

                    const attack =
                        add([
                            rect(50, 100),
                            pos(
                                player.pos.x +
                                player.facing * 45,
                                player.pos.y - 55
                            ),
                            color(
                                150,
                                100,
                                50
                            ),
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

                        player2.damage +=
                            15;

                        player2.knockbackActive =
                            true;

                        player2.knockbackX =
                            (
                                900 +
                                player2.damage *
                                15
                            ) *
                            player.facing;

                        player2.vel.x =
                            player2.knockbackX;

                        player2.vel.y =
                            -700;
                    }

                    return;
                }


                const attack =
                    add([
                        rect(75, 25),
                        pos(
                            player.pos.x +
                            player.facing * 35,
                            player.pos.y
                        ),
                        color(
                            150,
                            100,
                            50
                        ),
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

                    player2.knockbackActive =
                        true;

                    player2.knockbackX =
                        ANGY_CAP_KNOCKBACK *
                        player.facing;

                    player2.vel.x =
                        player2.knockbackX;

                    player2.vel.y =
                        -300;
                }

                return;
            }


            // ==================================================
            // GENERAL UPPERCUT
            // ==================================================

            if (
                player.facingUp
            ) {

                const attack =
                    add([
                        rect(45, 90),
                        pos(
                            player.pos.x +
                            player.facing * 45,
                            player.pos.y - 55
                        ),
                        color(
                            255,
                            0,
                            0
                        ),
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
                        player.fighter ===
                            "RED"
                            ? RED_UPPERCUT_DAMAGE
                            : player.fighter ===
                                "BLUE"
                                ? BLUE_UPPERCUT_DAMAGE
                                : 15;

                    player2.knockbackActive =
                        true;

                    let knockback;

                    if (
                        player2.fighter ===
                        "GOOSEY" &&
                        player2.hasRedPower
                    ) {

                        knockback =
                            RED_UPPERCUT_KNOCKBACK;

                    } else if (
                        player2.fighter ===
                        "GOOSEY"
                    ) {

                        knockback =
                            GOOSEY_UPPERCUT_KNOCKBACK;

                    } else if (
                        player.fighter ===
                        "RED"
                    ) {

                        knockback =
                            RED_UPPERCUT_KNOCKBACK;

                    } else if (
                        player.fighter ===
                        "BLUE"
                    ) {

                        knockback =
                            BLUE_UPPERCUT_KNOCKBACK;

                    } else {

                        knockback =
                            300;
                    }

                    player2.knockbackX =
                        (
                            knockback +
                            player2.damage * 10
                        ) *
                        player.facing;

                    player2.vel.x =
                        player2.knockbackX;

                    player2.vel.y =
                        -700;
                }

                return;
            }


            // ==================================================
            // GENERAL PUNCH
            // ==================================================

            const attack =
                add([
                    rect(90, 45),
                    pos(
                        player.pos.x +
                        player.facing * 65,
                        player.pos.y
                    ),
                    color(
                        255,
                        255,
                        0
                    ),
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
                    player.fighter ===
                        "GOOSEY" &&
                        player.hasRedPower
                        ? RED_PUNCH_DAMAGE
                        : player.fighter ===
                            "RED"
                            ? RED_PUNCH_DAMAGE
                            : player.fighter ===
                                "BLUE"
                                ? BLUE_PUNCH_DAMAGE
                                : 10;

                player2.knockbackActive =
                    true;

                let knockback;

                if (
                    player.fighter ===
                    "GOOSEY"
                ) {

                    knockback =
                        GOOSEY_PUNCH_KNOCKBACK;

                } else if (
                    player.fighter ===
                    "RED"
                ) {

                    knockback =
                        RED_PUNCH_KNOCKBACK;

                } else if (
                    player.fighter ===
                    "BLUE"
                ) {

                    knockback =
                        BLUE_PUNCH_KNOCKBACK;

                } else {

                    knockback =
                        500;
                }

                player2.knockbackX =
                    (
                        knockback +
                        player2.damage * 10
                    ) *
                    player.facing;

                player2.vel.x =
                    player2.knockbackX;

                player2.vel.y =
                    -250;
            }
        }
    );


    // ==================================================
    // P2 ATTACK
    // ==================================================

    onKeyPress(
        "f",
        () => {

            if (
                player2.respawning ||
                player2.frozen ||
                player2.invincible
            ) {
                return;
            }
            // ==================================================
            // ⚽ BACH ATTACK — P2
            // ==================================================

            if (
                player2.fighter ===
                "BACH"
            ) {

                const closeToOpponent =
                    Math.abs(
                        player.pos.x -
                        player2.pos.x
                    ) < 100 &&
                    Math.abs(
                        player.pos.y -
                        player2.pos.y
                    ) < 70;

                // 🦵 NORMAL KICK

                if (
                    closeToOpponent
                ) {

                    if (
                        !player.invincible
                    ) {

                        player.damage +=
                            12;

                        player.knockbackActive =
                            true;

                        player.knockbackX =
                            700 *
                            player2.facing;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y =
                            -300;
                    }

                    return;
                }

                // ⚽ RANGED KICK

                if (
                    player2.bachHasBall &&
                    bachBallP2 &&
                    bachBallP2.exists() &&
                    !bachBallP2.flying
                ) {

                    player2.bachHasBall =
                        false;

                    bachBallP2.flying =
                        true;

                    bachBallP2.bachVX =
                        player2.facing *
                        450;

                    bachBallP2.bachVY =
                        0;

                    return;
                }

                return;
            }
// ==================================================
// DENKU — SUPA STRONG ATTACK
// ==================================================

if (player2.fighter === "DENKU") {

    const attack = add([
        rect(130, 60),
        pos(
            player2.pos.x +
            player2.facing * 80,
            player2.pos.y
        ),
        color(255, 50, 50),
        opacity(0.7),
        area(),
        lifespan(0.15, {
            fade: 0.05,
        }),
    ]);

    // DAMAGE DENKU HIMSELF — no self-damage while in superhero mode
    if (player2.denkuMode !== "SUPERHERO") {
        player2.damage += 20;
    }

    // HIT PLAYER 1
    if (
        !player.invincible &&
        Math.abs(
            attack.pos.x -
            player.pos.x
        ) < 120 &&
        Math.abs(
            attack.pos.y -
            player.pos.y
        ) < 70
    ) {

        // SUPA STRONG DAMAGE
        player.damage += 30;

        player.knockbackActive = true;

        // HUGE KNOCKBACK
        player.knockbackX =
            (1400 +
            player.damage * 12) *
            player2.facing;

        player.vel.x =
            player.knockbackX;

        player.vel.y = -650;
    }

    return;
}
            // ==================================================
// ✴️ KACHEN RANGED ATTACK — P2
// ==================================================

if (
    player2.fighter ===
    "KACHEN"
) {

    const kachenProjectileP2 =
        add([
            text("✴️"),
            pos(
                player2.pos.x +
                player2.facing * 45,
                player2.pos.y - 15
            ),
            anchor("center"),
            scale(0.8),
            z(55),

            {
                vx:
                    player2.facing * 700,
            },
        ]);

    kachenProjectileP2.onUpdate(() => {

        // ✴️ MOVE PROJECTILE

        kachenProjectileP2.move(
            kachenProjectileP2.vx,
            0
        );

        // ==========================================
        // 💥 HIT P1
        // ==========================================

        if (
            !player.invincible &&
            Math.abs(
                kachenProjectileP2.pos.x -
                player.pos.x
            ) < 35 &&
            Math.abs(
                kachenProjectileP2.pos.y -
                player.pos.y
            ) < 45
        ) {

            player.damage +=
                30;

            player.knockbackActive =
                true;

            player.knockbackX =
                1100 *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y =
                -450;

            shake(10);

            destroy(
                kachenProjectileP2
            );

            return;
        }

        // ==========================================
        // 💀 LEAVE SCREEN
        // ==========================================

        if (
            kachenProjectileP2.pos.x <
                -100 ||
            kachenProjectileP2.pos.x >
                900
        ) {

            destroy(
                kachenProjectileP2
            );
        }
    });

    return;
}
            // ==================================================
            // 🔥 CHAT FIREBALL — P2
            // ==================================================

            if (
                player2.fighter ===
                "CHAT" &&
                player2.chatPower === 4
            ) {

                const fireballDirection =
                    player2.facing;

                const fireball = add([
                    circle(15),
                    pos(
                        player2.pos.x +
                        fireballDirection * 55,
                        player2.pos.y
                    ),
                    anchor("center"),
                    color(
                        255,
                        80,
                        0
                    ),
                    opacity(1),
                    area(),
                    {
                        speed: 750,
                        hit: false,
                    },
                    lifespan(
                        1.5,
                        {
                            fade: 0.3,
                        }
                    ),
                ]);


                fireball.onUpdate(
                    () => {

                        fireball.move(
                            fireball.speed *
                            fireballDirection,
                            0
                        );

                        if (
                            !fireball.hit &&
                            !player.invincible &&
                            Math.abs(
                                fireball.pos.x -
                                player.pos.x
                            ) < 40 &&
                            Math.abs(
                                fireball.pos.y -
                                player.pos.y
                            ) < 50
                        ) {

                            fireball.hit =
                                true;

                            player.damage +=
                                20;

                            player.knockbackActive =
                                true;

                            player.knockbackX =
                                700 *
                                fireballDirection;

                            player.vel.x =
                                player.knockbackX;

                            player.vel.y =
                                -400;

                            shake(8);

                            destroy(
                                fireball
                            );
                        }
                    }
                );

                return;
            }
// ==================================================
// 🟣 NATHANIEL RANGED ATTACK — P2
// ==================================================

if (
    player2.fighter ===
    "NATHANIEL"
) {

    player2.play(
        "nathanielSpecial"
    );

    // /null HAND EFFECT

    add([
        text("/null"),
        pos(
            player2.pos.x +
            player2.facing * 35,
            player2.pos.y - 15
        ),
        anchor("center"),
        scale(0.6),
        z(60),
        opacity(1),

        lifespan(
            0.25,
            {
                fade: 0.15,
            }
        ),
    ]);

    // ==============================================
    // 🟣 PURPLE BALL
    // ==============================================

    const nathanielBallP2 =
        add([
            circle(10),
            pos(
                player2.pos.x +
                player2.facing * 45,
                player2.pos.y - 15
            ),
            color(
                180,
                0,
                255
            ),
            area(),
            z(55),

            {
                vx:
                    player2.facing *
                    700,
            },
        ]);

    nathanielBallP2.onUpdate(() => {

        nathanielBallP2.move(
            nathanielBallP2.vx,
            0
        );

        // ==========================================
        // 💥 HIT P1
        // ==========================================

        if (
            !player.invincible &&
            Math.abs(
                nathanielBallP2.pos.x -
                player.pos.x
            ) < 35 &&
            Math.abs(
                nathanielBallP2.pos.y -
                player.pos.y
            ) < 45
        ) {

            player.damage +=
                25;

            player.knockbackActive =
                true;

            player.knockbackX =
                1000 *
                player2.facing;

            player.vel.x =
                player.knockbackX;

            player.vel.y =
                -450;

            shake(10);

            destroy(
                nathanielBallP2
            );

            return;
        }

        // ==========================================
        // 💀 LEAVE SCREEN
        // ==========================================

        if (
            nathanielBallP2.pos.x <
                -100 ||
            nathanielBallP2.pos.x >
                900
        ) {

            destroy(
                nathanielBallP2
            );
        }
    });

    return;
}
            // ==================================================
            // GREG
            // ==================================================

            if (
                player2.fighter ===
                "GREG"
            ) {

                if (
                    player2.gregCooldown
                ) {
                    return;
                }

                player2.gregCooldown =
                    true;

                wait(
                    GREG_ATTACK_COOLDOWN,
                    () => {

                        player2.gregCooldown =
                            false;
                    }
                );


                if (
                    player2.facingUp
                ) {

                    const attack =
                        add([
                            rect(65, 160),
                            pos(
                                player2.pos.x +
                                player2.facing * 45,
                                player2.pos.y - 85
                            ),
                            color(
                                255,
                                100,
                                100
                            ),
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

                        player.damage +=
                            15;

                        player.knockbackActive =
                            true;

                        player.knockbackX =
                            (
                                GREG_UPPERCUT_KNOCKBACK +
                                player.damage * 6
                            ) *
                            player2.facing;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y =
                            -750;
                    }

                    return;
                }


                const attack =
                    add([
                        rect(180, 45),
                        pos(
                            player2.pos.x +
                            player2.facing * 110,
                            player2.pos.y
                        ),
                        color(
                            255,
                            150,
                            0
                        ),
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

                    player.damage +=
                        10;

                    player.knockbackActive =
                        true;

                    player.knockbackX =
                        (
                            GREG_PUNCH_KNOCKBACK +
                            player.damage * 6
                        ) *
                        player2.facing;

                    player.vel.x =
                        player.knockbackX;

                    player.vel.y =
                        -300;
                }

                return;
            }


            // ==================================================
            // ANGY-CAT
            // ==================================================

            if (
                player2.fighter ===
                "ANGY-CAT"
            ) {

                if (
                    player2.facingUp
                ) {

                    const attackSize =
                        player2.catMod
                            ? 160
                            : 80;

                    const attack =
                        add([
                            rect(
                                attackSize,
                                attackSize
                            ),
                            pos(
                                player2.pos.x +
                                player2.facing *
                                (
                                    player2.catMod
                                        ? 90
                                        : 50
                                ),
                                player2.pos.y -
                                (
                                    player2.catMod
                                        ? 60
                                        : 40
                                )
                            ),
                            color(
                                255,
                                150,
                                0
                            ),
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
                        !player.invincible &&
                        Math.abs(
                            attack.pos.x -
                            player.pos.x
                        ) <
                        (
                            player2.catMod
                                ? 130
                                : 70
                        ) &&
                        Math.abs(
                            attack.pos.y -
                            player.pos.y
                        ) <
                        (
                            player2.catMod
                                ? 130
                                : 75
                        )
                    ) {

                        player.damage +=
                            15;

                        player.knockbackActive =
                            true;

                        player.knockbackX =
                            (
                                400 +
                                player.damage *
                                10
                            ) *
                            player2.facing;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y =
                            -700;
                    }

                    return;
                }


                const attack =
                    add([
                        rect(100, 40),
                        pos(
                            player2.pos.x +
                            player2.facing * 55,
                            player2.pos.y
                        ),
                        color(
                            255,
                            150,
                            0
                        ),
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

                    player.damage +=
                        10;

                    player.knockbackActive =
                        true;

                    player.knockbackX =
                        (
                            550 +
                            player.damage *
                            10
                        ) *
                        player2.facing;

                    player.vel.x =
                        player.knockbackX;

                    player.vel.y =
                        -300;
                }

                return;
            }


            // ==================================================
            // ANGY-CAP
            // ==================================================

            if (
                player2.fighter ===
                "ANGY-CAP"
            ) {

                if (
                    player2.facingUp
                ) {

                    const attack =
                        add([
                            rect(50, 100),
                            pos(
                                player2.pos.x +
                                player2.facing * 45,
                                player2.pos.y - 55
                            ),
                            color(
                                150,
                                100,
                                50
                            ),
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

                        player.damage +=
                            15;

                        player.knockbackActive =
                            true;

                        player.knockbackX =
                            (
                                900 +
                                player.damage *
                                15
                            ) *
                            player2.facing;

                        player.vel.x =
                            player.knockbackX;

                        player.vel.y =
                            -700;
                    }

                    return;
                }


                const attack =
                    add([
                        rect(75, 25),
                        pos(
                            player2.pos.x +
                            player2.facing * 35,
                            player2.pos.y
                        ),
                        color(
                            150,
                            100,
                            50
                        ),
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

                    player.knockbackActive =
                        true;

                    player.knockbackX =
                        ANGY_CAP_KNOCKBACK *
                        player2.facing;

                    player.vel.x =
                        player2.knockbackX;

                    player.vel.y =
                        -300;
                }

                return;
            }


            // ==================================================
            // GENERAL UPPERCUT
            // ==================================================

            if (
                player2.facingUp
            ) {

                const attack =
                    add([
                        rect(45, 90),
                        pos(
                            player2.pos.x +
                            player2.facing * 45,
                            player2.pos.y - 55
                        ),
                        color(
                            255,
                            0,
                            0
                        ),
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
                        player2.fighter ===
                            "RED"
                            ? RED_UPPERCUT_DAMAGE
                            : player2.fighter ===
                                "BLUE"
                                ? BLUE_UPPERCUT_DAMAGE
                                : 15;

                    player.knockbackActive =
                        true;

                    let knockback;

                    if (
                        player2.fighter ===
                        "GOOSEY" &&
                        player2.hasRedPower
                    ) {

                        knockback =
                            RED_UPPERCUT_KNOCKBACK;

                    } else if (
                        player2.fighter ===
                        "GOOSEY"
                    ) {

                        knockback =
                            GOOSEY_UPPERCUT_KNOCKBACK;

                    } else if (
                        player2.fighter ===
                        "RED"
                    ) {

                        knockback =
                            RED_UPPERCUT_KNOCKBACK;

                    } else if (
                        player2.fighter ===
                        "BLUE"
                    ) {

                        knockback =
                            BLUE_UPPERCUT_KNOCKBACK;

                    } else {

                        knockback =
                            300;
                    }

                    player.knockbackX =
                        (
                            knockback +
                            player.damage * 10
                        ) *
                        player2.facing;

                    player.vel.x =
                        player.knockbackX;

                    player.vel.y =
                        -700;
                }

                return;
            }


            // ==================================================
            // GENERAL PUNCH
            // ==================================================

            const attack =
                add([
                    rect(90, 45),
                    pos(
                        player2.pos.x +
                        player2.facing * 65,
                        player2.pos.y
                    ),
                    color(
                        255,
                        255,
                        0
                    ),
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
                    player2.fighter ===
                        "GOOSEY" &&
                        player2.hasRedPower
                        ? RED_PUNCH_DAMAGE
                        : player2.fighter ===
                            "RED"
                            ? RED_PUNCH_DAMAGE
                            : player2.fighter ===
                                "BLUE"
                                ? BLUE_PUNCH_DAMAGE
                                : 10;

                player.knockbackActive =
                    true;

                let knockback;

                if (
                    player2.fighter ===
                    "GOOSEY"
                ) {

                    knockback =
                        GOOSEY_PUNCH_KNOCKBACK;

                } else if (
                    player2.fighter ===
                    "RED"
                ) {

                    knockback =
                        RED_PUNCH_KNOCKBACK;

                } else if (
                    player2.fighter ===
                    "BLUE"
                ) {

                    knockback =
                        BLUE_PUNCH_KNOCKBACK;

                } else {

                    knockback =
                        500;
                }

                player.knockbackX =
                    (
                        knockback +
                        player.damage * 10
                    ) *
                    player2.facing;

                player.vel.x =
                    player.knockbackX;

                player.vel.y =
                    -250;
            }
        }
    );


    // ==================================================
    // 🪿 GOOSEY SPECIAL SYSTEM
    // ==================================================

    const GOOSEY_SPECIAL_COOLDOWN =
        3;

    const GOOSEY_GREG_COOLDOWN =
        1;


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

    function setupGooseyPower(
        goosey
    ) {

        if (
            !goosey.gooseyPowers
        ) {

            goosey.gooseyPowers =
                [];
        }

        if (
            !goosey.hasRedPower
        ) {

            goosey.hasRedPower =
                goosey.gooseyPowers.includes(
                    0
                );
        }

        if (
            !goosey.hasBluePower
        ) {

            goosey.hasBluePower =
                goosey.gooseyPowers.includes(
                    1
                );
        }

        if (
            !goosey.hasGhostyPower
        ) {

            goosey.hasGhostyPower =
                goosey.gooseyPowers.includes(
                    2
                );
        }

        if (
            !goosey.hasGregPower
        ) {

            goosey.hasGregPower =
                goosey.gooseyPowers.includes(
                    3
                );
        }

        if (
            !goosey.hasCatPower
        ) {

            goosey.hasCatPower =
                goosey.gooseyPowers.includes(
                    4
                );
        }

        if (
            !goosey.hasAngyCapPower
        ) {

            goosey.hasAngyCapPower =
                goosey.gooseyPowers.includes(
                    5
                );
        }

        if (
            !goosey.hasPenguyPower
        ) {

            goosey.hasPenguyPower =
                goosey.gooseyPowers.includes(
                    6
                );
        }

        if (
            !goosey.hasMarkPower
        ) {

            goosey.hasMarkPower =
                goosey.gooseyPowers.includes(
                    7
                );
        }

        if (
            !goosey.hasChatPower
        ) {

            goosey.hasChatPower =
                goosey.gooseyPowers.includes(
                    8
                );
        }


        if (
            goosey.hasRedPower
        ) {

            goosey.gooseySpeed =
                RED_SPEED;
        }


        if (
            goosey.hasBluePower
        ) {

            goosey.gooseySpeed =
                BLUE_SPEED;
        }


        if (
            !goosey.hasRedPower &&
            !goosey.hasBluePower
        ) {

            goosey.gooseySpeed =
                GOOSEY_SPEED;
        }


        if (
            goosey.hasCatPower
        ) {

            goosey.catMod =
                true;

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
                Math.random() *
                12
            );


        if (
            randomPower === 0
        ) {

            opponent.frozen =
                true;

            specialStatus.text =
                `GOOSEY P${playerNumber}: FREEZE!`;

            wait(10, () => {

                opponent.frozen =
                    false;
            });

            wait(2, () => {

                specialStatus.text =
                    "";
            });

            return;
        }


        if (
            randomPower === 1
        ) {

            opponent.damage +=
                100;

            specialStatus.text =
                `GOOSEY P${playerNumber}: +100% DAMAGE!`;

            wait(2, () => {

                specialStatus.text =
                    "";
            });

            return;
        }


        if (
            randomPower === 2
        ) {

            opponent.knockbackActive =
                true;

            opponent.knockbackX =
                1400 *
                goosey.facing;

            opponent.vel.x =
                opponent.knockbackX;

            opponent.vel.y =
                -600;

            specialStatus.text =
                `GOOSEY P${playerNumber}: SUPER KNOCKBACK!`;

            wait(2, () => {

                specialStatus.text =
                    "";
            });

            return;
        }


        if (
            !goosey.gooseyPowers
        ) {

            goosey.gooseyPowers =
                [];
        }

        const copiedPower =
            randomPower - 3;


        if (
            goosey.gooseyPowers.includes(
                copiedPower
            )
        ) {

            specialStatus.text =
                `GOOSEY P${playerNumber}: ALREADY HAS THAT POWER!`;

            wait(1.5, () => {

                specialStatus.text =
                    "";
            });

            return;
        }


        goosey.gooseyPowers.push(
            copiedPower
        );

        goosey.hasCopiedPower =
            true;


        if (
            copiedPower === 0
        ) {

            goosey.hasRedPower =
                true;

            goosey.gooseySpeed =
                RED_SPEED;

            specialStatus.text =
                `GOOSEY P${playerNumber}: COPIED RED!`;

        } else if (
            copiedPower === 1
        ) {

            goosey.hasBluePower =
                true;

            goosey.gooseySpeed =
                BLUE_SPEED;

            specialStatus.text =
                `GOOSEY P${playerNumber}: COPIED BLUE!`;

        } else if (
            copiedPower === 2
        ) {

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

        } else if (
            copiedPower === 3
        ) {

            goosey.hasGregPower =
                true;

            goosey.gregCooldown =
                false;

            specialStatus.text =
                `GOOSEY P${playerNumber}: COPIED GREG!`;

        } else if (
            copiedPower === 4
        ) {

            goosey.hasCatPower =
                true;

            goosey.catMod =
                true;

            goosey.scaleTo(
                CAT_MOD_SCALE
            );

            specialStatus.text =
                `GOOSEY P${playerNumber}: CAT MOD!!!`;

        } else if (
            copiedPower === 5
        ) {

            goosey.hasAngyCapPower =
                true;

            specialStatus.text =
                `GOOSEY P${playerNumber}: COPIED ANGY-CAP!`;

        } else if (
            copiedPower === 6
        ) {

            goosey.hasPenguyPower =
                true;

            specialStatus.text =
                `GOOSEY P${playerNumber}: SUPER SLIPPERY!`;

        } else if (
            copiedPower === 7
        ) {

            goosey.hasMarkPower =
                true;

            specialStatus.text =
                `GOOSEY P${playerNumber}: COPIED MARK!`;

            wait(0.4, () => {

                markDimensionShift();
            });

        } else if (
            copiedPower === 8
        ) {

            goosey.hasChatPower =
                true;

            if (
                !goosey.gooseyChatPowers
            ) {

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

            specialStatus.text =
                "";
        });
    }


    // ==================================================
    // 👻 GHOSTY COPY EFFECT
    // ==================================================

    onUpdate(() => {

        if (
            player.fighter ===
            "GOOSEY" &&
            player.hasGhostyPower &&
            player.ghostyActive
        ) {

            player.invincible =
                true;
        }


        if (
            player2.fighter ===
            "GOOSEY" &&
            player2.hasGhostyPower &&
            player2.ghostyActive
        ) {

            player2.invincible =
                true;
        }
    });


    // ==================================================
    // 🐧 GOOSEY PENGUY PHYSICS
    // ==================================================

    onUpdate(() => {

        if (
            player.fighter ===
            "GOOSEY" &&
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
            player2.fighter ===
            "GOOSEY" &&
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

        const attack =
            add([
                rect(180, 45),
                pos(
                    goosey.pos.x +
                    goosey.facing * 110,
                    goosey.pos.y
                ),
                color(
                    255,
                    150,
                    0
                ),
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

            opponent.damage +=
                10;

            opponent.knockbackActive =
                true;

            opponent.knockbackX =
                (
                    GREG_PUNCH_KNOCKBACK +
                    opponent.damage *
                    6
                ) *
                goosey.facing;

            opponent.vel.x =
                opponent.knockbackX;

            opponent.vel.y =
                -250;
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

        if (
            !goosey.hasAngyCapPower
        ) {
            return false;
        }

        const attack =
            add([
                rect(120, 30),
                pos(
                    goosey.pos.x +
                    goosey.facing * 90,
                    goosey.pos.y
                ),
                color(
                    150,
                    100,
                    50
                ),
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

            opponent.vel.y =
                -300;
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

        if (
            !goosey.hasChatPower
        ) {
            return;
        }

        const randomChat =
            Math.floor(
                Math.random() *
                GOOSEY_CHAT_POWERS.length
            );

        const power =
            GOOSEY_CHAT_POWERS[
            randomChat
            ];


        if (
            power ===
            "MAGNET"
        ) {

            specialStatus.text =
                "GOOSEY CHAT: 🧲 MAGNET!";

            opponent.vel.x +=
                (
                    goosey.pos.x -
                    opponent.pos.x
                ) *
                2 *
                dt();

        } else if (
            power ===
            "BOUNCY"
        ) {

            specialStatus.text =
                "GOOSEY CHAT: 🟢 BOUNCY!";

            goosey.vel.y =
                -900;

        } else if (
            power ===
            "ROCK_SOLID"
        ) {

            specialStatus.text =
                "GOOSEY CHAT: 🪨 ROCK SOLID!";

            goosey.knockbackActive =
                false;

            goosey.knockbackX =
                0;

            goosey.vel.x =
                0;

        } else if (
            power ===
            "ICE_TRAIL"
        ) {

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

        } else if (
            power ===
            "FIREBALL"
        ) {

            specialStatus.text =
                "GOOSEY CHAT: 🔥 FIREBALL!";

            const direction =
                goosey.facing;

            const fireball =
                add([
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

            fireball.onUpdate(
                () => {

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

                        fireball.hit =
                            true;

                        opponent.damage +=
                            20;

                        opponent.knockbackActive =
                            true;

                        opponent.knockbackX =
                            700 *
                            direction;

                        opponent.vel.x =
                            opponent.knockbackX;

                        opponent.vel.y =
                            -400;

                        shake(8);

                        destroy(
                            fireball
                        );
                    }
                }
            );

        } else if (
            power ===
            "FREEZE"
        ) {

            specialStatus.text =
                "GOOSEY CHAT: ❄️ FREEZE!";

            opponent.frozen =
                true;

            wait(3, () => {

                opponent.frozen =
                    false;
            });

        } else {

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

            opponent.vel.y =
                -800;

            shake(30);
        }

        wait(2, () => {

            specialStatus.text =
                "";
        });
    }
onKeyPress("enter", () => {

    if (
        player.fighter !== "DENKU" ||
        player.respawning
    ) {
        return;
    }

    // TOGGLE OFF (manual)
    if (player.denkuMode === "SUPERHERO") {

        player.denkuMode = null;

        player.play("idle");

        return;
    }

    // TOGGLE ON — no self-damage while active, lasts 10 seconds
    player.denkuMode = "SUPERHERO";

    player.play("superhero");

    wait(DENKU_SPECIAL_TIME, () => {

        if (
            player.fighter === "DENKU" &&
            !player.respawning &&
            player.denkuMode === "SUPERHERO"
        ) {
            player.denkuMode = null;
            player.play("idle");
        }
    });
});
window.addEventListener("keydown", (event) => {

    if (event.code !== "ShiftLeft") {
        return;
    }

    if (
        player2.fighter !== "DENKU" ||
        player2.respawning
    ) {
        return;
    }

    // TOGGLE OFF (manual)
    if (player2.denkuMode === "SUPERHERO") {

        player2.denkuMode = null;

        player2.play("idle");

        return;
    }

    // TOGGLE ON — no self-damage while active, lasts 10 seconds
    player2.denkuMode = "SUPERHERO";

    player2.play("superhero");

    wait(DENKU_SPECIAL_TIME, () => {

        if (
            player2.fighter === "DENKU" &&
            !player2.respawning &&
            player2.denkuMode === "SUPERHERO"
        ) {
            player2.denkuMode = null;
            player2.play("idle");
        }
    });
});
    // ==================================================
    // 🪿 GOOSEY P1 SPECIAL
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            if (
                player.fighter !==
                "GOOSEY" ||
                player.respawning ||
                player.specialUsed
            ) {
                return;
            }

            player.specialUsed =
                true;

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
        }
    );


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
    // 🔵⚽ BACH SPECIAL P1
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            activateBachSpecial(
                player
            );
        }
    );
    // ==================================================
    // 🔵⚽ BACH SPECIAL P2
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

            activateBachSpecial(
                player2
            );
        }
    );
    // ==================================================
    // 👻 GHOSTY SPECIAL P1
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            if (
                player.fighter !==
                "GHOSTY" ||
                player.respawning ||
                player.specialUsed
            ) {
                return;
            }

            player.specialUsed =
                true;

            player.invincible =
                true;

            player.knockbackActive =
                false;

            player.knockbackX =
                0;

            player.vel.x =
                0;

            player.vel.y =
                0;

            specialStatus.text =
                "GHOSTY P1: INVINCIBLE!";

            wait(3, () => {

                player.invincible =
                    false;

                player.knockbackActive =
                    false;

                player.knockbackX =
                    0;

                player.vel.x =
                    0;

                player.specialUsed =
                    false;

                specialStatus.text =
                    "";
            });
        }
    );


    // ==================================================
    // 👻 GHOSTY SPECIAL P2
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
                window.singlePlayerMode ===
                true
            ) {
                return;
            }

            if (
                player2.fighter !==
                "GHOSTY" ||
                player2.respawning ||
                player2.specialUsed
            ) {
                return;
            }

            player2.specialUsed =
                true;

            player2.invincible =
                true;

            player2.knockbackActive =
                false;

            player2.knockbackX =
                0;

            player2.vel.x =
                0;

            player2.vel.y =
                0;

            specialStatus.text =
                "GHOSTY P2: INVINCIBLE!";

            wait(3, () => {

                player2.invincible =
                    false;

                player2.knockbackActive =
                    false;

                player2.knockbackX =
                    0;

                player2.vel.x =
                    0;

                player2.specialUsed =
                    false;

                specialStatus.text =
                    "";
            });
        }
    );


    // ==================================================
    // ANGY-CAT SPECIAL P1
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            if (
                player.fighter !==
                "ANGY-CAT" ||
                player.respawning ||
                player.specialUsed
            ) {
                return;
            }

            player.specialUsed =
                true;

            player.catMod =
                true;

            player.scaleTo(
                CAT_MOD_SCALE
            );

            specialStatus.text =
                "ANGY-CAT P1: CAT MOD!!!";

            wait(
                CAT_MOD_TIME,
                () => {

                    player.catMod =
                        false;

                    player.scaleTo(
                        CAT_NORMAL_SCALE
                    );

                    specialStatus.text =
                        "";
                }
            );
        }
    );


    // ==================================================
    // ANGY-CAT SPECIAL P2
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
                "ANGY-CAT" ||
                player2.respawning ||
                player2.specialUsed
            ) {
                return;
            }

            player2.specialUsed =
                true;

            player2.catMod =
                true;

            player2.scaleTo(
                CAT_MOD_SCALE
            );

            specialStatus.text =
                "ANGY-CAT P2: CAT MOD!!!";

            wait(
                CAT_MOD_TIME,
                () => {

                    player2.catMod =
                        false;

                    player2.scaleTo(
                        CAT_NORMAL_SCALE
                    );

                    specialStatus.text =
                        "";
                }
            );
        }
    );


    // ==================================================
    // MARK SPECIAL P1
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            if (
                player.fighter !==
                "MARK" ||
                player.respawning ||
                player.specialUsed
            ) {
                return;
            }

            player.specialUsed =
                true;

            markDimensionShift();
        }
    );


    // ==================================================
    // MARK SPECIAL
    // ==================================================

    function markDimensionShift() {

        specialStatus.text =
            "MARK: DIMENSION SHIFT!!!";

        const darkness =
            add([
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

                darkness.opacity =
                    value;
            }
        );


        for (
            let i = 0;
            i < 6;
            i++
        ) {

            wait(
                i * 0.08,
                () => {

                    const ring =
                        add([
                            circle(30),
                            pos(400, 225),
                            color(
                                150,
                                0,
                                255
                            ),
                            opacity(0.7),
                            anchor("center"),
                            z(101),
                        ]);

                    tween(
                        30,
                        500,
                        0.8,
                        (value) => {

                            ring.radius =
                                value;

                            ring.opacity =
                                0.7 *
                                (
                                    1 -
                                    value / 500
                                );
                        }
                    );

                    wait(
                        0.8,
                        () => {

                            destroy(
                                ring
                            );
                        }
                    );
                }
            );
        }


        shake(15);


        wait(
            1,
            () => {

                shake(30);

                specialStatus.text =
                    "WELCOME TO ANOTHER DIMENSION!";

                wait(
                    0.5,
                    () => {

                        destroy(
                            darkness
                        );

                        specialStatus.text =
                            "";

                        const markWorld =
                            Math.floor(
                                Math.random() *
                                5
                            );

                        markWorldActive =
                            true;


                        if (
                            markWorld === 0
                        ) {

                            SPEED -=
                                150;

                            GOOSEY_SPEED -=
                                150;

                            RED_SPEED -=
                                150;

                            BLUE_SPEED -=
                                150;

                            PENGUY_SPEED -=
                                150;

                            specialStatus.text =
                                "🐌 SLOW WORLD!!!";

                        } else if (
                            markWorld === 1
                        ) {

                            SPEED +=
                                150;

                            GOOSEY_SPEED +=
                                150;

                            RED_SPEED +=
                                150;

                            BLUE_SPEED +=
                                150;

                            PENGUY_SPEED +=
                                150;

                            specialStatus.text =
                                "⚡ SPEED WORLD!!!";

                        } else if (
                            markWorld === 2
                        ) {

                            specialStatus.text =
                                "🌪️ CHAOS WORLD!!!";


                            function chaosEffect() {

                                if (
                                    !markWorldActive
                                ) {
                                    return;
                                }

                                const chaos =
                                    Math.floor(
                                        Math.random() *
                                        5
                                    );


                                if (
                                    chaos === 0
                                ) {

                                    player.knockbackActive =
                                        true;

                                    player.knockbackX =
                                        (
                                            Math.random() <
                                                0.5
                                                ? -1
                                                : 1
                                        ) *
                                        1200;

                                    player.vel.x =
                                        player.knockbackX;

                                    player.vel.y =
                                        -400;

                                    player2.knockbackActive =
                                        true;

                                    player2.knockbackX =
                                        (
                                            Math.random() <
                                                0.5
                                                ? -1
                                                : 1
                                        ) *
                                        1200;

                                    player2.vel.x =
                                        player2.knockbackX;

                                    player2.vel.y =
                                        -400;

                                } else if (
                                    chaos === 1
                                ) {

                                    player.vel.y =
                                        -1000;

                                    player2.vel.y =
                                        -1000;

                                } else if (
                                    chaos === 2
                                ) {

                                    player.facing *=
                                        -1;

                                    player2.facing *=
                                        -1;

                                } else if (
                                    chaos === 3
                                ) {

                                    player.knockbackActive =
                                        true;

                                    player.knockbackX =
                                        (
                                            Math.random() <
                                                0.5
                                                ? -1
                                                : 1
                                        ) *
                                        1800;

                                    player.vel.x =
                                        player.knockbackX;

                                    player2.knockbackActive =
                                        true;

                                    player2.knockbackX =
                                        (
                                            Math.random() <
                                                0.5
                                                ? -1
                                                : 1
                                        ) *
                                        1800;

                                    player2.vel.x =
                                        player2.knockbackX;

                                } else {

                                    player.knockbackActive =
                                        true;

                                    player.knockbackX =
                                        (
                                            Math.random() *
                                            2400
                                        ) -
                                        1200;

                                    player.vel.x =
                                        player.knockbackX;

                                    player.vel.y =
                                        -700;

                                    player2.knockbackActive =
                                        true;

                                    player2.knockbackX =
                                        (
                                            Math.random() *
                                            2400
                                        ) -
                                        1200;

                                    player2.vel.x =
                                        player2.knockbackX;

                                    player2.vel.y =
                                        -700;
                                }

                                wait(
                                    0.7,
                                    chaosEffect
                                );
                            }

                            chaosEffect();

                        } else if (
                            markWorld === 3
                        ) {

                            markIceWorld =
                                true;

                            specialStatus.text =
                                "🧊 ICE WORLD!!!";

                        } else {

                            specialStatus.text =
                                "🌑 VOID WORLD!!!";

                            setGravity(
                                4500
                            );

                            add([
                                rect(
                                    800,
                                    450
                                ),
                                pos(0, 0),
                                color(
                                    0,
                                    0,
                                    0
                                ),
                                opacity(0.35),
                                z(50),
                            ]);
                        }
                    }
                );
            }
        );
    }


    // ==================================================
    // 🎲 CHAT SPECIAL
    // ==================================================

    function activateChatSpecial(
        chat,
        opponent
    ) {

        if (
            chat.fighter !==
            "CHAT" ||
            chat.respawning ||
            chat.specialUsed
        ) {
            return;
        }

        chat.specialUsed =
            true;

        const randomPower =
            Math.floor(
                Math.random() * 7
            );

        chat.chatPower =
            randomPower;


        if (
            randomPower === 0
        ) {

            specialStatus.text =
                "CHAT: 🧲 MAGNET!!!";

            wait(
                2,
                () => {
                    specialStatus.text =
                        "";
                }
            );

        } else if (
            randomPower === 1
        ) {

            specialStatus.text =
                "CHAT: 🟢 BOUNCY!!!";

            wait(
                2,
                () => {
                    specialStatus.text =
                        "";
                }
            );

        } else if (
            randomPower === 2
        ) {

            specialStatus.text =
                "CHAT: 🪨 ROCK SOLID!!!";

            chat.knockbackActive =
                false;

            chat.knockbackX =
                0;

            chat.vel.x =
                0;

            wait(
                2,
                () => {
                    specialStatus.text =
                        "";
                }
            );

        } else if (
            randomPower === 3
        ) {

            specialStatus.text =
                "CHAT: 🧊 ICE TRAIL!!!";

            wait(
                2,
                () => {
                    specialStatus.text =
                        "";
                }
            );

        } else if (
            randomPower === 4
        ) {

            specialStatus.text =
                "CHAT: 🔥 FIREBALL!!!";

            wait(
                2,
                () => {
                    specialStatus.text =
                        "";
                }
            );

        } else if (
            randomPower === 5
        ) {

            opponent.frozen =
                true;

            specialStatus.text =
                "CHAT: ❄️ FREEZE!!!";

            wait(
                3,
                () => {

                    opponent.frozen =
                        false;

                    specialStatus.text =
                        "";
                }
            );

        } else {

            specialStatus.text =
                "CHAT: ⚡ LIGHTNING!!!";

            opponent.damage +=
                200;

            const strikeX =
                opponent.pos.x;

            const strikeY =
                opponent.pos.y;

            const bolt1 =
                add([
                    rect(14, 120),
                    pos(
                        strikeX - 25,
                        strikeY - 170
                    ),
                    rotate(18),
                    color(
                        255,
                        255,
                        0
                    ),
                    opacity(1),
                    z(100),
                ]);

            const bolt2 =
                add([
                    rect(14, 110),
                    pos(
                        strikeX + 5,
                        strikeY - 90
                    ),
                    rotate(-22),
                    color(
                        255,
                        255,
                        255
                    ),
                    opacity(1),
                    z(100),
                ]);

            const bolt3 =
                add([
                    rect(14, 100),
                    pos(
                        strikeX - 10,
                        strikeY - 20
                    ),
                    rotate(15),
                    color(
                        255,
                        255,
                        0
                    ),
                    opacity(1),
                    z(100),
                ]);

            const impact =
                add([
                    rect(100, 14),
                    pos(
                        strikeX,
                        strikeY + 35
                    ),
                    color(
                        255,
                        255,
                        255
                    ),
                    opacity(1),
                    anchor("center"),
                    z(100),
                ]);

            opponent.knockbackActive =
                true;

            opponent.knockbackX =
                1100 *
                chat.facing;

            opponent.vel.x =
                opponent.knockbackX;

            opponent.vel.y =
                -800;

            shake(30);

            wait(
                0.2,
                () => {

                    if (
                        bolt1.exists()
                    ) {
                        destroy(
                            bolt1
                        );
                    }

                    if (
                        bolt2.exists()
                    ) {
                        destroy(
                            bolt2
                        );
                    }

                    if (
                        bolt3.exists()
                    ) {
                        destroy(
                            bolt3
                        );
                    }

                    if (
                        impact.exists()
                    ) {
                        destroy(
                            impact
                        );
                    }
                }
            );

            wait(
                2,
                () => {

                    specialStatus.text =
                        "";
                }
            );
        }
    }


    // ==================================================
    // 🎲 CHAT SPECIAL P1
    // ==================================================

    onKeyPress(
        "enter",
        () => {

            activateChatSpecial(
                player,
                player2
            );
        }
    );


    // ==================================================
    // 🎲 CHAT SPECIAL P2
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

            activateChatSpecial(
                player2,
                player
            );
        }
    );


    // ==================================================
    // 🧊 ICE WORLD PHYSICS
    // ==================================================

    onUpdate(() => {

        if (
            !markIceWorld
        ) {
            return;
        }


        if (
            !player.knockbackActive &&
            !player.respawning &&
            !player.frozen
        ) {

            player.vel.x *=
                ICE_FRICTION;

            if (
                player.vel.x >
                ICE_MAX_SPEED
            ) {

                player.vel.x =
                    ICE_MAX_SPEED;
            }

            if (
                player.vel.x <
                -ICE_MAX_SPEED
            ) {

                player.vel.x =
                    -ICE_MAX_SPEED;
            }
        }


        if (
            !player2.knockbackActive &&
            !player2.respawning &&
            !player2.frozen
        ) {

            player2.vel.x *=
                ICE_FRICTION;

            if (
                player2.vel.x >
                ICE_MAX_SPEED
            ) {

                player2.vel.x =
                    ICE_MAX_SPEED;
            }

            if (
                player2.vel.x <
                -ICE_MAX_SPEED
            ) {

                player2.vel.x =
                    -ICE_MAX_SPEED;
            }
        }
    });


    // ==================================================
    // 🙂 MARK SPECIAL P2
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
                "MARK" ||
                player2.respawning ||
                player2.specialUsed
            ) {
                return;
            }

            player2.specialUsed =
                true;

            markDimensionShift();
        }
    );
    // ==================================================
    // 💥 BLAST ZONES
    // ==================================================

    onUpdate(() => {

        // P1

        if (
            !player.respawning &&
            (
                player.pos.x <
                -100 ||
                player.pos.x >
                900 ||
                player.pos.y <
                -150 ||
                player.pos.y >
                550
            )
        ) {

            player.respawning =
                true;

            player.stocks--;

            player.vel.x =
                0;

            player.vel.y =
                0;

            player.knockbackActive =
                false;


            if (
                player.stocks <= 0
            ) {

                player.stocks =
                    0;

                go(
                    "win",
                    {
                        winner:
                            player2.fighter,
                    }
                );

            } else {

                wait(
                    1,
                    () => {

                        player.pos =
                            vec2(
                                200,
                                200
                            );

                        player.vel.x =
                            0;

                        player.vel.y =
                            0;

                        player.damage =
                            0;

                        player.knockbackActive =
                            false;

                        player.respawning =
                            false;

                        // ⚽ BACH GETS A NEW BALL
                        // AT THE START OF A NEW STOCK

                        if (
                            player.fighter ===
                            "BACH"
                        ) {

                            player.bachHasBall =
                                true;

                            if (
                                !bachBallP1 ||
                                !bachBallP1.exists()
                            ) {

                                bachBallP1 =
                                    add([
                                        text("⚽"),
                                        pos(
                                            player.pos.x +
                                            50,
                                            player.pos.y
                                        ),
                                        anchor(
                                            "center"
                                        ),
                                        scale(
                                            0.8
                                        ),
                                        z(30),

                                        {
                                            flying:
                                                false,
                                            vx: 0,
                                            vy: 0,
                                            angleAround:
                                                0,
                                        },
                                    ]);
                            }
                        }
                    }
                );
            }
        }


        // P2

        if (
            !player2.respawning &&
            (
                player2.pos.x <
                -100 ||
                player2.pos.x >
                900 ||
                player2.pos.y <
                -150 ||
                player2.pos.y >
                550
            )
        ) {

            player2.respawning =
                true;

            player2.stocks--;

            player2.vel.x =
                0;

            player2.vel.y =
                0;

            player2.knockbackActive =
                false;


            if (
                player2.stocks <= 0
            ) {

                player2.stocks =
                    0;
// ==================================================
// 🔓 HARD CPU REWARD
// ==================================================

if (
    window.singlePlayerMode === true &&
    window.cpuDifficulty === "HARD"
) {

    localStorage.setItem(
        "goosey_bach_unlocked_v101",
        "true"
    );

    localStorage.setItem(
        "goosey_nathaniel_unlocked_v101",
        "true"
    );
}
                go(
                    "win",
                    {
                        winner:
                            player.fighter,
                    }
                );

            } else {

                wait(
                    1,
                    () => {

                        player2.pos =
                            vec2(
                                550,
                                200
                            );

                        player2.vel.x =
                            0;

                        player2.vel.y =
                            0;

                        player2.damage =
                            0;

                        player2.knockbackActive =
                            false;

                        player2.respawning =
                            false;
                    }
                );
            }
        }
    });
});
// ==================================================
// WIN SCENE
// ==================================================

scene("win", (data) => {
    playGameMusic("victoryMusic", true);
// ==================================================
// 🔓 HARD CPU UNLOCK PROGRESSION
// ==================================================

if (
    window.singlePlayerMode === true &&
    window.cpuDifficulty === "HARD" &&
    data.player1Won === true
) {

    const bachIsUnlocked =
        localStorage.getItem(
            "goosey_bach_unlocked_v101"
        ) === "true";

    const kachenIsUnlocked =
        localStorage.getItem(
            "goosey_kachen_unlocked_v101"
        ) === "true";

    const denkuIsUnlocked =
        localStorage.getItem(
            "goosey_denku_unlocked_v101"
        ) === "true";

    // 🔓 BACH — first HARD CPU victory

    if (!bachIsUnlocked) {

        localStorage.setItem(
            "goosey_bach_unlocked_v101",
            "true"
        );

        console.log("🔓 BACH UNLOCKED!");
    }

    // 🔓 KACHEN — beat HARD CPU while CPU = BACH

    else if (
        window.cpuCharacterName === "BACH" &&
        !kachenIsUnlocked
    ) {

        localStorage.setItem(
            "goosey_kachen_unlocked_v101",
            "true"
        );

        console.log("🔓 KACHEN UNLOCKED!");
    }

    // 🔓 NATHANIEL — beat HARD CPU while CPU = KACHEN

    else if (
        window.cpuCharacterName === "KACHEN"
    ) {

        localStorage.setItem(
            "goosey_nathaniel_unlocked_v101",
            "true"
        );

        console.log("🔓 NATHANIEL UNLOCKED!");
    }

    // 🔓 DENKU — beat HARD CPU AS Denku, once Bach is unlocked

    if (
        bachIsUnlocked &&
        !denkuIsUnlocked &&
        data.player1Fighter === "DENKU"
    ) {

        localStorage.setItem(
            "goosey_denku_unlocked_v101",
            "true"
        );

        console.log("🔓 DENKU UNLOCKED!");
    }
}
// ==================================================
// WINNER TEXT
// ==================================================

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

// ==================================================
// CREATE WINNER
// ==================================================

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

    } else if (data.winner === "BACH") {

        winner = add([
            sprite("Bach", {
                anim: "bach",
            }),
            pos(400, 210),
            anchor("center"),
            scale(1.5),
        ]);

    } else if (data.winner === "NATHANIEL") {

        winner = add([
            sprite("Nathaniel", {
                anim: "nathaniel",
            }),
            pos(400, 210),
            anchor("center"),
            scale(1.5),
        ]);

    } else if (data.winner === "KACHEN") {

        // Kachen just stands still
        winner = add([
            sprite("Kachen"),
            pos(400, 210),
            anchor("center"),
            scale(1.5),
        ]);
    } else if (data.winner === "DENKU") {

        winner = add([
            sprite("Denku", {
                anim: "idle",
            }),
            pos(400, 210),
            anchor("center"),
            scale(3),
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

// ==================================================
// NORMAL WIN ANIMATION SETUP
// ==================================================

    let winTime = 0;

    const winStartX = 400;
    const winStartY = 210;

    const baseScale = vec2(
        winner.scale.x,
        winner.scale.y
    );

    let bachWinBall = null;

// ==================================================
// BACH WIN BALL
// ==================================================

    if (data.winner === "BACH") {

        bachWinBall = add([
            text("⚽"),
            pos(
                winner.pos.x + 90,
                winner.pos.y
            ),
            anchor("center"),
            scale(0.8),
            z(10),
        ]);

        bachWinBall.onUpdate(() => {

            const ballAngle =
                time() * 5;

            const orbitX =
                winner.pos.x +
                Math.cos(ballAngle) * 90;

            const orbitY =
                winner.pos.y +
                Math.sin(ballAngle) * 65;

            bachWinBall.moveTo(
                vec2(
                    orbitX,
                    orbitY
                )
            );
        });
    }

// ==================================================
// KACHEN ✴ WIN EFFECT
// ==================================================

    let kachenWinStar = null;

    if (data.winner === "KACHEN") {

        kachenWinStar = add([
            text("✴"),
            pos(
                winner.pos.x + 100,
                winner.pos.y
            ),
            anchor("center"),
            scale(1.2),
            z(10),
        ]);

        kachenWinStar.onUpdate(() => {

            const starAngle = time() * 4;

            const starX =
                winner.pos.x +
                Math.cos(starAngle) * 100;

            const starY =
                winner.pos.y +
                Math.sin(starAngle) * 70;

            kachenWinStar.moveTo(
                vec2(
                    starX,
                    starY
                )
            );

            kachenWinStar.angle =
                time() * 360;
        });
    }

// ==================================================
// GENERAL WIN ANIMATION
// KACHEN IS EXCLUDED
// ==================================================

    onUpdate(() => {

        // Kachen stays completely still
        if (data.winner === "KACHEN") {
            return;
        }

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

// ==================================================
// FIGHT AGAIN
// ==================================================

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

go("gooseyIntro");
