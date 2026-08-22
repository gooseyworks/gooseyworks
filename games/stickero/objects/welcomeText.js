export function addWelcomeText() {
    const txt = add([
        text("Stickero Platformer\n 1.0.0", { align: "center" }),
        pos(center().add(0, -150)),
        anchor("center"),
    ]);

    return txt;
}
