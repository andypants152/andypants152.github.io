//screen.js
export default class Screen {
    constructor(config) {
        this.canvas = null;
        this.ctx = null;
        this.config = config;
        // this.dots = [];
    }

    initialize() {
        this.createCanvas();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'screen';
        this.ctx = this.canvas.getContext('2d');
        this.updateCanvasSize();
        document.body.appendChild(this.canvas);
        // this.updateDots();
    }

    updateCanvasSize() {
        console.log("updating");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        // requestAnimationFrame(() => this.animate());
        this.background();

    }

    background(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.config.bgColor; // Use configured background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

    // updateDots() {
    //     // Update the positions and check for collisions
    //     this.dots.forEach((dot) => {
    //         dot.update(this.canvas);
    //     });
    // }