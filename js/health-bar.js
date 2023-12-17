class HealthBar {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.w = 405;
        this.h = 31;
    }

    show(healthPercent) {
        image(healthBarImgHollow, this.x, this.y);

        healthBarImgFill.resize(388 * healthPercent, 12);
        image(healthBarImgFill, this.x + 8, this.y + 10);
    }
}