//control.js
export default class Control {
    constructor(config, screen) {
        this.config = config;
        this.screen = screen;
        this.attachEventListeners();
    }

    attachEventListeners() {
        // document.addEventListener('keydown', (e) => {
        //     if (e.key === 'Escape'){
        //         console.log("meh");
        //     }
        // });
        window.addEventListener('resize', () => {
            this.screen.updateCanvasSize();
        });

        document.addEventListener('keydown', () => {this.screen.changeBackgroundColor()});
        document.addEventListener('mousedown', () => {this.screen.changeBackgroundColor()});
        document.addEventListener('touchstart', () => {this.screen.changeBackgroundColor()});
        // document.addEventListener('gamepadconnected', handleInput);

    }


}

