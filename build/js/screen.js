//screen.js
export default class Screen {
    constructor(color) {
        this.canvas = null;
        this.ctx = null;
        this.circles = [];
        this.squares = [];
        this.color = color;
        this.frameCount = 0;
        this.lastTimestamp = Date.now();
        this.deltaTime = 0;
        this.isAnimating = true;

    }

    initialize() {
        this.createCanvas();
        this.updateCanvasSize();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'screen';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    updateCanvasSize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        if (this.isAnimating) {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);


            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = 'red';
            this.ctx.beginPath();
            this.ctx.moveTo(this.canvas.width / 2, 0);
            this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
            this.ctx.stroke();


            this.ctx.strokeStyle = 'green';
            this.ctx.beginPath();
            this.ctx.moveTo(0, this.canvas.height / 2);
            this.ctx.lineTo(this.canvas.width, this.canvas.height / 2);
            this.ctx.stroke();

            const text = 'Hello';
            const textX = this.canvas.width / 2;
            const textY = this.canvas.height / 2;
            this.ctx.fillStyle = 'yellow';
            this.ctx.strokeStyle = 'white';

            this.ctx.font = '80px Helvetica';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(text, textX,textY);
            this.ctx.strokeText(text, textX, textY);







            this.logFPS();
            if (this.isAnimating) {
                requestAnimationFrame(() => this.animate());
            }
        }
    }

    changeBackgroundColor(color) {
        if (color) {
            this.color = color;
        } else {
            this.color = this.randomColor();
        }
    }

    randomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
    }

    logFPS() {
        const timestamp = Date.now();
        this.deltaTime += timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.frameCount++;

        if (this.deltaTime >= 1000) {
            console.log(`FPS: ${this.frameCount}`);
            this.frameCount = 0;
            this.deltaTime = 0;
        }
    }


}