//control.js
export default class Control {
    constructor(config, screen) {
        this.config = config;
        this.screen = screen;
        this.attachEventListeners();
    }

    attachEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape'){
                console.log("meh");
            }
        });
        window.addEventListener('resize', () => {
            this.screen.updateCanvasSize();
        });
    }


}

