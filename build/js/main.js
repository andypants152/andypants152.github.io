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

        window.addEventListener('mousemove', (e) => {
            // Call the updateMousePosition method to update the mouse position in the Effect class
            this.screen.effect.updateInputPosition(e.x, e.y);
        });

        document.addEventListener('touchstart', (event) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.screen.effect.updateTouchPosition(touch.clientX, touch.clientY);
                });

        document.addEventListener('touchmove', (event) => {
            e.preventDefault();
            const touch = e.touches[0];
            this.screen.effect.updateTouchPosition(touch.clientX, touch.clientY);
                });

        document.addEventListener('touchend', (event) => {
            // Handle touchend event
        });
    }
}

document.addEventListener('DOMContentLoaded', () => { new tooDeeWorld(); });
