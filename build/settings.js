//settings.js
export class Settings {
    static #props = {};

    // Create: Add a new property to the settings
    static create(prop, value) {
        this.#props[prop] = value;
    }

    // Read: Get the value of a property
    static read(prop) {
        return this.#props[prop];
    }

    // Update: Update the value of an existing property
    static update(prop, value) {
        if (this.#props.hasOwnProperty(prop)) {
            this.#props[prop] = value;
        } else {
            console.log(`Property '${prop}' does not exist.`);
        }
    }

    // Delete: Remove a property from the settings
    static delete(prop) {
        if (this.#props.hasOwnProperty(prop)) {
            delete this.#props[prop];
        } else {
            console.log(`Property '${prop}' does not exist.`);
        }
    }
}
