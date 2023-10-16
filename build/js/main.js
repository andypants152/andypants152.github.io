//main.js
import Screen from './screen.js';
import Control from './control.js';
import config from './defaults.js';

class tooDeeWorld {
    constructor(){
        this.screen = new Screen(config);
        this.screen.initialize();
        this.control = new Control(config, this.screen);
        this.run();
    }

run = () => {
    this.screen.animate();
    requestAnimationFrame(this.run)
    }
}

document.addEventListener('DOMContentLoaded', () => { new tooDeeWorld();});
