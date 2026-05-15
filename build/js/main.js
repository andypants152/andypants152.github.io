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

    attachEventListeners() {
        const canvas = this.screen.canvas;
        if (!canvas) return;

        window.addEventListener('resize', () => {
            this.screen.updateCanvasSize();
        });

        document.addEventListener('keydown', (event) => {
            if (event.key === ' ') {
                event.preventDefault();
            }
            switch (event.key) {
                case ' ':
                    this.screen.isAnimating = !this.screen.isAnimating;
                    if (this.screen.isAnimating) {
                        this.screen.animate();
                    }
                    break;
                case 'm':
                case 'M':
                    this.screen.effect.cycleMode();
                    break;
                case 'c':
                case 'C':
                    this.screen.changeBackgroundColor();
                    break;
                default:
                    break;

            }
        });

        canvas.addEventListener('mousemove', (event) => {
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

        canvas.addEventListener('touchstart', (event) => {
            handleDoubleTap(event);
            handleTouch(event);
        }, { passive: false });
        canvas.addEventListener('touchmove', handleTouch, { passive: false });
        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            this.screen.effect.setInteractivity(false);
        }, { passive: false });
        canvas.addEventListener('touchcancel', (event) => {
            event.preventDefault();
            this.screen.effect.setInteractivity(false);
        }, { passive: false });
        canvas.addEventListener('mouseleave', () => {
            this.screen.effect.setInteractivity(false);
        });
    }

    initializeUIControls() {
        const fab = document.getElementById('editFab');
        const dialog = document.getElementById('editDialog');
        const form = document.getElementById('editDialogForm');
        const cancelButton = document.getElementById('cancelEditButton');
        const textField = document.getElementById('displayTextField');
        const gradientInputs = Array.from(document.querySelectorAll('[data-gradient-input]'));
        const backgroundInput = document.getElementById('backgroundColorInput');
        const modeSelect = document.getElementById('modeSelect');
        const particleGapInput = document.getElementById('particleGapInput');
        const mouseRadiusInput = document.getElementById('mouseRadiusInput');
        const frictionInput = document.getElementById('frictionInput');
        const trailInput = document.getElementById('trailInput');
        const gradientSpeedInput = document.getElementById('gradientSpeedInput');
        const valueOutputs = Array.from(document.querySelectorAll('[data-value-for]'));

        if (
            !fab || !dialog || !form || !textField || !backgroundInput || !modeSelect ||
            !particleGapInput || !mouseRadiusInput || !frictionInput || !trailInput || !gradientSpeedInput
        ) {
            return;
        }

        const updateValueOutput = (id, value) => {
            const output = valueOutputs.find((element) => element.getAttribute('data-value-for') === id);
            if (output) {
                output.textContent = value;
            }
        };

        const applyTuning = () => {
            this.screen.effect.setMode(modeSelect.value);
            this.screen.effect.setParticleGap(Number(particleGapInput.value));
            this.screen.effect.setMouseRadius(Number(mouseRadiusInput.value));
            this.screen.effect.setParticleFriction(Number(frictionInput.value));
            this.screen.effect.setTrailAlpha(Number(trailInput.value));
            this.screen.effect.setGradientSpeed(Number(gradientSpeedInput.value));

            updateValueOutput('particleGapInput', particleGapInput.value);
            updateValueOutput('mouseRadiusInput', mouseRadiusInput.value);
            updateValueOutput('frictionInput', Number(frictionInput.value).toFixed(2));
            updateValueOutput('trailInput', Number(trailInput.value).toFixed(2));
            updateValueOutput('gradientSpeedInput', Number(gradientSpeedInput.value).toFixed(3));
        };

        const populateForm = () => {
            textField.value = this.screen.effect.text;
            const currentColors = this.screen.effect.getGradientColors();
            gradientInputs.forEach((input, index) => {
                input.value = currentColors[index] || currentColors[currentColors.length - 1] || '#ffffff';
            });
            backgroundInput.value = this.screen.color;
            const tuning = this.screen.effect.getTuning();
            modeSelect.value = tuning.mode;
            particleGapInput.value = String(tuning.gap);
            mouseRadiusInput.value = String(tuning.baseMouseRadius);
            frictionInput.value = tuning.friction.toFixed(2);
            trailInput.value = tuning.trailAlpha.toFixed(2);
            gradientSpeedInput.value = tuning.gradientSpeed.toFixed(3);
            applyTuning();
        };

        fab.addEventListener('click', () => {
            populateForm();
            dialog.open = true;
        });

        cancelButton?.addEventListener('click', (event) => {
            event.preventDefault();
            dialog.open = false;
        });

        [
            modeSelect,
            particleGapInput,
            mouseRadiusInput,
            frictionInput,
            trailInput,
            gradientSpeedInput
        ].forEach((element) => {
            element.addEventListener('input', applyTuning);
            element.addEventListener('change', applyTuning);
        });

        form.addEventListener('submit', (event) => {
            event.preventDefault();
            const newText = textField.value.trim();
            const colors = gradientInputs.map(input => input.value).filter(Boolean);
            if (newText.length) {
                this.screen.effect.setText(newText);
            }
            if (colors.length) {
                this.screen.effect.setGradientColors(colors);
            }
            if (backgroundInput.value) {
                this.screen.changeBackgroundColor(backgroundInput.value);
            }
            applyTuning();
            dialog.open = false;
        });
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const app = new tooDeeWorld();
    app.initializeUIControls();
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js').catch((error) => {
                console.error('Service worker registration failed:', error);
            });
        });
    }
});
