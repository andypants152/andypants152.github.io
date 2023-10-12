//control.js
export default class Control {
    constructor(config, screen, godmode) {
        this.config = config;
        this.screen = screen;
        this.godmode = godmode;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // Add event listeners for mouse clicks and touch events
        // document.addEventListener('click', (e) => this.createRandomDot(e));
        // document.addEventListener('touchstart', (e) => this.createRandomDot(e));
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
                console.log("meh");
                this.godmode.toggleModal();
            }
        });
        window.addEventListener('resize', () => {
            this.screen.updateCanvasSize();
        });
    }

    // createRandomDot(event) {
    //     const size = Math.random() * this.config.maxSize + this.config.minSize;
    //     const color = `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`;
    //     this.screen.createDot(event.clientX, event.clientY, size, color);
    // }
}