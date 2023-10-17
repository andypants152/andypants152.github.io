//main.js
import Screen from './screen.js';
import config from './defaults.js';

class tooDeeWorld {
    constructor() {
        this.screen = new Screen(config.bgColor);
        this.screen.initialize();
        this.run();
        this.attachEventListeners();

    }

    //run = async () => { //i feel like this is going to be right but isn't for now
    run = () => {
        //i don't know anymore...

    }



    attachEventListeners() {
        window.addEventListener('resize', () => {
            this.screen.updateCanvasSize();
            this.screen.effect.wrapText('AndyPants!');
        });

        //document.addEventListener('keydown', () => { this.changeBackgroundColor() });

        // // Handle the click event to draw a square
        // document.addEventListener('click', (event) => {
        //     const x = event.clientX;
        //     const y = event.clientY;
        //     const size = Math.floor(Math.random() * (50 + 1));; // Adjust the size as needed
        //     const color = 'green'; // Adjust the color as needed
        //     const square = new Square(x, y, size, this.randomColor());
        //     this.squares.push(square);
        // });

        // // Handle the touchstart event to draw a circle
        // document.addEventListener('touchstart', (event) => {
        //     const x = event.touches[0].clientX;
        //     const y = event.touches[0].clientY;
        //     const color = 'green';
        //     const size = 50; // Adjust the size as needed
        //     const circle = new Circle(x, y, size, this.randomColor());
        //     this.circles.push(circle);
        // });

        document.addEventListener('keydown', (event) => {
            switch (event.key) {
                case ' ':
                    console.log("toggle?")
                    this.screen.isAnimating = !this.screen.isAnimating; // Toggle animation state
                    if (this.screen.isAnimating) {
                        this.screen.animate(); // Resume animation
                    }
                    break;
                default:
                    this.screen.changeBackgroundColor();
                    break;

            }
        });

    }
}

document.addEventListener('DOMContentLoaded', () => { new tooDeeWorld(); });
