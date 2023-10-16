export class Dot {
    constructor(x, y, size, color) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.radius = size;
        this.color = color;
        this.dx = 0;
        this.dy = 0;
    }

    update(canvas) {
        // Update dot position and handle collisions
        this.x += this.dx;
        this.y += this.dy;

        if (this.x + this.radius > canvas.width || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }
        if (this.y + this.radius > canvas.height || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        // Draw the dot
        const ctx = canvas.getContext('2d');
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.closePath();
    }
}
