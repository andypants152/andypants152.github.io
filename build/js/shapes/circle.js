class Circle extends Shape {
    constructor(x, y, size, color) {
        super(x, y, size, color);
        this.radius = size;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}