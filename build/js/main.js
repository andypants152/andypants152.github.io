//main.js
import Screen from './screen.js';
import config from './defaults.js';

class tooDeeWorld {
    constructor() {
        this.screen = new Screen(config.bgColor);
        this.screen.initialize();
        this.lastTouchTime = 0;
        this.lastTouchX = 0;
        this.lastTouchY = 0;
        this.doubleTapThreshold = 300;
        this.doubleTapMoveTolerance = 30;
        this.run();
        this.attachEventListeners();

    }

    updateInputPositionFromEvent = (event) => {
        const point = event.touches && event.touches.length
            ? event.touches[0]
            : event;

        const x = point?.clientX ?? point?.x;
        const y = point?.clientY ?? point?.y;

        if (typeof x === 'number' && typeof y === 'number') {
            this.screen.effect.updateInputPosition(x, y);
        }
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

        window.addEventListener('mousemove', (event) => {
            this.screen.effect.setInteractivity(true);
            this.updateInputPositionFromEvent(event);
        });

        const handleDoubleTap = (event) => {
            if (!event.touches || event.touches.length !== 1) return;
            const touch = event.touches[0];
            const now = Date.now();
            const deltaTime = now - this.lastTouchTime;
            const dx = touch.clientX - this.lastTouchX;
            const dy = touch.clientY - this.lastTouchY;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (deltaTime <= this.doubleTapThreshold && distance <= this.doubleTapMoveTolerance) {
                this.screen.changeBackgroundColor();
                this.lastTouchTime = 0;
            } else {
                this.lastTouchTime = now;
                this.lastTouchX = touch.clientX;
                this.lastTouchY = touch.clientY;
            }
        };

        const handleTouch = (event) => {
            event.preventDefault();
            this.screen.effect.setInteractivity(true);
            this.updateInputPositionFromEvent(event);
        };

        window.addEventListener('touchstart', (event) => {
            handleDoubleTap(event);
            handleTouch(event);
        }, { passive: false });
        window.addEventListener('touchmove', handleTouch, { passive: false });
        window.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.screen.effect.setInteractivity(false);
        }, { passive: false });
    }
}

document.addEventListener('DOMContentLoaded', () => { new tooDeeWorld(); });
