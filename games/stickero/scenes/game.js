import { addWelcomeText } from "../objects/welcomeText.js";

scene("game", ({ levelldx }) => {
    addWelcomeText();
    setGravity(500);
    onUpdate(() => {
        setCamPos(vec2(main.pos.x+50, main.pos.y + 250))
    })
    let hVar = 100;
    const LEVELS = [
        [
            "           @",
            "===== =======",
            "",
            "^^           &   _",
            "==================",
        ],
        [
            "^^^^^^^^^^^^^^^^&",
            "       ",
            "     ",
            "       ",
            "      ",
            "@@@@@@@@@@@@@@@@@"
        ],

        [
            "^^^^^^^^^^^^^^^^&",
            "       ",
            "     ",
            "       ",
            "      ",
            "@@@@@@@@@@@@@@@@@"
        ],

        [
            "^^^^^^^^^^^^^^^^&",
            "       ",
            "     ",
            "       ",
            "      ",
            "@@@@@@@@@@@@@@@@@"
        ],

        [
            "^^^^^^^^^^^^^^^^&",
            "       ",
            "     ",
            "       ",
            "      ",
            "@@@@@@@@@@@@@@@@@"
        ],
        [
            "^^^^&",
            " ",
            "",
            "",
            "             @",
            "==============",
        ],
        [
            "^^^^@",
            "=========  =====",
            "",
            "^ ^ ^   =  =",
            "         &",
            "==============",
        ],
        [
            "@",
            "===   ===",
            "",
            "",
            "",
            "",
            "   _&   ",
            "============",
        ],
        [
            "  @",
            "====   ==",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "  &  _",
            "======"  
        ],
        [
            "  @",
            "====   ==",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "     _",
            "==   ===   ",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "  &  _",
            "======"
        ],
        [
            "@",
            "===   ===",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "   _  &   ",
            "=====    ",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "      _____",
            "===========",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "^",
            "^^",
            "^^^",
            "^^^^",
            "^^^^^",
            "^^^^^^",
            "^^^^^^^",
            "^^^^^^^^",
            "^^^^^^^^^",
            "^^^^^^^^^^^  ___                                                 &",
            "=============",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "_______________________________________________________________________________",
        ],
        [
            "    ^^^^^      ^^^^^^^",
            "    =====      =======",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "______________________________________________________________________________________",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@"
        ],
        [
            "                        @",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "& ^^^^^^^^^^^^^^^^^^^^^^^^^______",
            "=================================_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "@",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "&",
            "_",
        ],
        [
            "&                                      _                                 @",
            "###    ###  # # # # # # # # ## # #     #           #############   ###  ##",
        ],
        [
            "     @     ",
            "###      ###",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "     &   ___",
            "###      ###",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "^^",
            "      __",
            "========",
        ],
        [
            "     _",
            "     !     ",
            "",
            "",
            "",
            "___  &  ___",
            "==========="
        ],
            ]
    const level = addLevel(LEVELS[levelldx], {
        tileWidth: 32,
        tileHeight: 32,
        pos: vec2(100, 200),
        tiles: {
            "&": () => [
                sprite("main"),
                body(),
                area(),
                anchor("center"),
                scale(2),
                "main",
            ],
            "=": () => [
                sprite("box"),
                body({ isStatic: true }),
                area(),
                anchor("center"),
                scale(0.06),
                "block",
            ],
            "#": () => [
                sprite("no"),
                body({ isStatic: true }),
                area(),
                anchor("center"),
                scale(0.06),
                "no",
            ],
                "^": () => [
                sprite("evil"),
                body(),
                area(),
                anchor("center"),
                scale(2),
                "evil",
            ],
            "@": () => [
                sprite("flag"),
                body({ isStatic: true }),
                area(),
                anchor("center"),
                "flag"
            ],
            "_": () => [
                sprite("plate"),
                body({ isStatic: true }),
                area(),
                anchor("center"),
                "plate"
            ],
            "!": () => [
                sprite("End"),
                body({ isStatic: true }),
                area(),
                scale(5),
                anchor("center"),
                "End"
            ],
        }
    })
    const main = level.get("main")[0];
    onCollide("flag", "main", () => {
        go("game", { levelldx: levelldx + 1 })
        debug.log("Next Level!");
    })
    const two_SPEED = 800
    loop(0.25, () => {
        let chosey = choose(["left", "right", "jump","Super Jump"])
        if (chosey == "left") {
            boss.move(-two_SPEED, 0);
        }
        else if (chosey == "right") {
            boss.move(two_SPEED, 0);
        }
        else if (chosey == "jump") {
            if (boss.isGrounded()) {
                boss.jump(400)
            }
        }
        else if (chosey == "Super Jump") {
            if (boss.isGrounded()) {
                boss.jump(600)
            }
        }
    })
    const plate = add([
        sprite("plate"),
        pos(center()),
        scale(0.05),
        anchor("center"),
        rotate(0),
        area(),
        body({isStatic: true}),
    ])
    /*
    const main = add([
        sprite("main"),
        pos(center()),
        scale(3.14159265358973223),
        anchor("center"),
        rotate(0),
        // health(3),
        area(),
        body(),
    ]) */

    add([
        rect(100, 25),
        pos(0, 550),
        anchor("center"),
        area(),
        body({ isStatic: true }),


    ])
    let healthText = add([
        text("health: " + hVar),
    ])

    let SPEED = 400;
    onKeyDown("left", () => {
        main.move(-SPEED, 0);
    })
    onKeyDown("right", () => {
        main.move(SPEED, 0);
    })
    onKeyDown("up", () => {
        if (main.isGrounded()) {
            main.jump(400)
        }
    })
    onKeyPress("space", () => {
        if (main.isGrounded()) {
            main.jump(600)
        }
    })
    onKeyPress("w", () => {
        if (main.isGrounded()) {
            main.jump(200)
        }
    })
    onKeyPress("d", () => {
        main.move(SPEED, 0);
    })
    onKeyPress("a", () => {
        main.move(-SPEED, 0);
    })
    /* const evil = add([
        sprite("evil"),
        pos(center()),
        scale(3.14159265358973223),
        anchor("center"),
        rotate(0),
        area(),
        body(),
        "evil",
    ])  */
    const boss = add([
        sprite("boss"),
        pos(center()),
        scale(3.14159265358973223),
        anchor("center"),
        rotate(0),
        area(),
        body(),
        "boss",
    ])
    /* const end = add ([
        sprite("End"),
        pos(center()),
        scale(20),
        anchor("center"),
        rotate(0),
        area(),
        body({isStatic: true}),
        "End",
    ]) */
    
    
    main.onCollide("boss", () => {
        hVar -= 20
        healthText = "Health: " + hVar
        if (hVar <= 0) {
            hVar = 0
            destroy(main)
            debug.log("Game Over")
        }
    })
    main.onCollide("evil", () => {
        hVar -= 20
        healthText = "Health: " + hVar
        if (hVar <= 0) {
            hVar = 0
            destroy(main)
            debug.log("Game Over")
        }
    })
    main.onCollide("plate", () => {
        if (main.isGrounded()) {
            main.jump(1000)
        }
        debug.log("FLY TIME!!!")
    })
    boss.onCollide("plate", () => {
        if (boss.isGrounded()) {
            boss.jump(1000)
        }
    })
    /* const flag = add([
        sprite("flag"),
        pos(500, 150),
        scale(3.14159265358973223),
        anchor("center"),
        rotate(0),
        area(),
        body({ isStatic: true }),
    ]) */
    main.onCollide("flag", () => { })

})
