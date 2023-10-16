//screen.js
export default class Screen {
    constructor(config) {
        this.canvas = null;
        this.ctx = null;
        this.config = config;
    }

    initialize() {
        this.createCanvas();
        this.updateCanvasSize();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'screen';
        this.ctx = this.canvas.getContext('2d');
        document.body.appendChild(this.canvas);
    }

    updateCanvasSize() {
        console.log("updating");
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    animate() {
        this.background();
        //need to add logic for adding elements...

    }

    background(){
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = this.config.bgColor; // Use configured background color
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    
}