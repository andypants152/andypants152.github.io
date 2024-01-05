class Square extends Shape {
    constructor(x, y, size, color) {
        super(x, y, size, color);
        this.sideLength = size;
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.sideLength, this.sideLength);
    }
}