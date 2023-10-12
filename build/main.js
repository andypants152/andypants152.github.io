//main.js
import Screen from './screen.js';
import Godmode from './godmode.js';
import Control from './control.js';
import { Settings } from './settings.js';
import config from './config.js';

class tooDeeWorld {
    constructor(){
        //this.settings = new Settings();
        this.initialize();
        this.oldTime = Date.now();
        this.screen = new Screen(config);
        this.screen.initialize();
        this.godmode = new Godmode(config, this.screen);
        this.control = new Control(config, this.screen, this.godmode);
        this.run();
    }

initialize(){
    console.log(config);
    for (let prop in config) {
        Settings.create(prop, config[prop]);
    }
    console.log(Settings.read('dotCount')); // Example usage

}

run = () => {
    let newTime = Date.now();
    Settings.update = (newTime - this.oldTime)/1000;
    // console.log(this.settings.dotMinSize);
    this.screen.animate();
    requestAnimationFrame(this.run)
    }
}

document.addEventListener('DOMContentLoaded', () => { new tooDeeWorld();});
