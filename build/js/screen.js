//screen.js
export default class Screen {
    constructor(color) {
        this.canvas = null;
        this.ctx = null;
        this.color = color;
        this.frameCount = 0;
        this.lastTimestamp = Date.now();
        this.deltaTime = 0;
        this.isAnimating = true;
        this.effect = null;
        this.updateDocumentBackground(this.color);
    }

    initialize() {
        this.createCanvas();
        this.updateCanvasSize();
        this.effect = new Effect(this.ctx, this.canvas.width, this.canvas.height);
        this.effect.wrapText();
        this.animate();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'screen';
        this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
        document.body.appendChild(this.canvas);
    }

    updateCanvasSize() {
        const width = window.innerWidth || document.documentElement.clientWidth;
        const height = window.innerHeight || document.documentElement.clientHeight;

        this.canvas.width = width;
        this.canvas.height = height;
        this.canvas.style.width = `${width}px`;
        this.canvas.style.height = `${height}px`;

        if (this.effect) {
            this.effect.canvasWidth = this.canvas.width;
            this.effect.canvasHeight = this.canvas.height;
            this.effect.updateResponsiveMetrics();
            this.effect.textX = this.canvas.width / 2;
            this.effect.textY = this.canvas.height / 2;
            this.effect.wrapText();
        }
    }

    animate() {
        if (!this.isAnimating || !this.effect) {
            return;
        }

        const trailAlpha = this.effect.getTrailAlpha();
        if (trailAlpha >= 0.99) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
        } else {
            this.ctx.fillStyle = this.colorToRgba(this.color, trailAlpha);
        }

        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.effect.render();

        requestAnimationFrame(() => this.animate());
    }

    changeBackgroundColor(color) {
        this.color = color || this.randomColor();
        this.updateDocumentBackground(this.color);
    }

    randomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
    }

    colorToRgba(color, alpha) {
        const safeAlpha = Math.max(0, Math.min(1, alpha));
        const hex = color?.replace('#', '').trim();

        if (!hex) {
            return `rgba(0, 0, 0, ${safeAlpha})`;
        }

        const normalized = hex.length === 3
            ? hex.split('').map((value) => `${value}${value}`).join('')
            : hex;

        if (normalized.length !== 6) {
            return color;
        }

        const value = Number.parseInt(normalized, 16);
        const red = (value >> 16) & 255;
        const green = (value >> 8) & 255;
        const blue = value & 255;

        return `rgba(${red}, ${green}, ${blue}, ${safeAlpha})`;
    }

    updateDocumentBackground(color) {
        document.documentElement.style.setProperty('--bg-color', color);
        document.body.style.backgroundColor = color;
        document.documentElement.style.backgroundColor = color;

        const metaThemeColor = document.querySelector('meta[name="theme-color"]');
        if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
        }
    }

    logFPS() {
        const timestamp = Date.now();
        this.deltaTime += timestamp - this.lastTimestamp;
        this.lastTimestamp = timestamp;
        this.frameCount++;

        if (this.deltaTime >= 1000) {
            console.log(`FPS: ${this.frameCount}`);
            this.frameCount = 0;
            this.deltaTime = 0;
        }
    }
}

class Particle {
    constructor(effect, x, y) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = this.effect.canvasHeight;
        this.originX = x;
        this.originY = y;
        this.size = this.effect.gap;
        this.dx = 0;
        this.dy = 0;
        this.vx = 0;
        this.vy = 0;
        this.force = 0;
        this.angle = 0;
        this.distance = 0;
        this.noiseOffset = Math.random() * Math.PI * 2;
        this.friction = 0.35;
        this.ease = 0.08;
        this.resetTuning();
    }

    resetTuning() {
        this.size = this.effect.gap;
        const variance = (Math.random() - 0.5) * this.effect.frictionVariance;
        const friction = this.effect.friction + variance;
        this.friction = Math.max(0.05, Math.min(0.95, friction));

        const easeVariance = (Math.random() - 0.5) * this.effect.easeVariance;
        const ease = this.effect.ease + easeVariance;
        this.ease = Math.max(0.005, Math.min(0.3, ease));
    }

    draw() {
        this.effect.context.fillStyle = this.effect.getColorAt(this.originX, this.originY);
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }

    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        this.distance = Math.max(1, this.dx * this.dx + this.dy * this.dy);

        if (this.distance < this.effect.mouse.radius) {
            const mouseInfluence = this.effect.mouse.radius / this.distance;
            const baseAngle = Math.atan2(this.dy, this.dx);
            const force = this.effect.mouseStrength * mouseInfluence;

            switch (this.effect.mode) {
                case 'vortex':
                    this.vx += force * Math.cos(baseAngle + Math.PI / 2);
                    this.vy += force * Math.sin(baseAngle + Math.PI / 2);
                    break;
                case 'glitch':
                    this.vx -= force * Math.cos(baseAngle);
                    this.vy -= force * Math.sin(baseAngle);
                    this.vx += (Math.random() - 0.5) * this.effect.glitchAmount;
                    this.vy += (Math.random() - 0.5) * this.effect.glitchAmount;
                    break;
                case 'pulse': {
                    const pulseDirection = Math.sin(this.effect.time * 0.07 + this.noiseOffset) > 0 ? 1 : -1;
                    this.vx += pulseDirection * force * Math.cos(baseAngle);
                    this.vy += pulseDirection * force * Math.sin(baseAngle);
                    break;
                }
                case 'neon':
                default:
                    this.vx -= force * Math.cos(baseAngle);
                    this.vy -= force * Math.sin(baseAngle);
                    break;
            }
        }

        this.x += (this.vx *= this.friction) + (this.originX - this.x) * this.ease;
        this.y += (this.vy *= this.friction) + (this.originY - this.y) * this.ease;
    }
}

class Effect {
    constructor(context, canvasWidth, canvasHeight) {
        this.context = context;
        this.canvasWidth = canvasWidth;
        this.canvasHeight = canvasHeight;
        this.textX = this.canvasWidth / 2;
        this.textY = this.canvasHeight / 2;
        this.fontFamily = 'Helvetica';
        this.fontSize = 150;
        this.lineHeight = this.fontSize * 0.8;
        this.maxTextWidth = this.canvasWidth * 0.8;
        this.text = 'AndyPants';
        this.gradientColors = ['#ff0000', '#ff00ff', '#0000ff'];
        this.gradientColorStops = this.gradientColors.map((color) => this.hexToRgb(color));
        this.gradientAngle = 0;
        this.gradientSpeed = 0.008;

        this.particles = [];
        this.gap = 5;
        this.friction = 0.35;
        this.frictionVariance = 0.3;
        this.ease = 0.08;
        this.easeVariance = 0.06;
        this.baseMouseRadius = 15000;
        this.mouseStrength = 2.6;
        this.glitchAmount = 1.4;
        this.mode = 'neon';
        this.time = 0;
        this.trailAlpha = 1;

        this.mouse = {
            radius: this.baseMouseRadius,
            x: 0,
            y: 0
        };

        this.updateResponsiveMetrics();
    }

    updateResponsiveMetrics() {
        const shortestSide = Math.min(this.canvasWidth, this.canvasHeight);
        const dynamicFontSize = shortestSide * 0.18;
        this.fontSize = Math.max(36, Math.min(200, dynamicFontSize));
        this.lineHeight = this.fontSize * 0.8;
        this.maxTextWidth = this.canvasWidth * 0.85;
        const dynamicGap = Math.round(shortestSide / 200);
        this.gap = Math.max(2, Math.min(8, dynamicGap || 2));
        this.particles.forEach((particle) => particle.resetTuning());
    }

    updateInputPosition(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    setInteractivity(isActive) {
        this.mouse.radius = isActive ? this.baseMouseRadius : 0;
    }

    setText(text) {
        const nextText = text?.trim() || this.text || 'AndyPants';
        this.wrapText(nextText);
    }

    setGradientColors(colors = []) {
        const sanitized = colors
            .map((color) => color?.trim())
            .filter((color) => typeof color === 'string' && color.length > 0);

        if (!sanitized.length) {
            return;
        }

        this.gradientColors = sanitized;
        this.gradientColorStops = this.gradientColors.map((color) => this.hexToRgb(color));
    }

    setGradientSpeed(speed) {
        const value = Number(speed);
        if (!Number.isFinite(value)) return;
        this.gradientSpeed = Math.max(0, Math.min(0.06, value));
    }

    setMode(mode) {
        const allowedModes = ['neon', 'vortex', 'glitch', 'pulse'];
        if (!allowedModes.includes(mode)) {
            return;
        }

        this.mode = mode;
        const modeSettings = {
            neon: { strength: 2.6, glitchAmount: 0.8 },
            vortex: { strength: 3.2, glitchAmount: 0.6 },
            glitch: { strength: 2.2, glitchAmount: 2.6 },
            pulse: { strength: 2.4, glitchAmount: 1.0 }
        };

        const setting = modeSettings[mode] || modeSettings.neon;
        this.mouseStrength = setting.strength;
        this.glitchAmount = setting.glitchAmount;
    }

    cycleMode() {
        const modes = ['neon', 'vortex', 'glitch', 'pulse'];
        const currentIndex = modes.indexOf(this.mode);
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % modes.length;
        this.setMode(modes[nextIndex]);
    }

    setParticleGap(gap) {
        const value = Number(gap);
        if (!Number.isFinite(value)) return;
        this.gap = Math.max(2, Math.min(12, Math.round(value)));
        this.wrapText();
    }

    setMouseRadius(radius) {
        const value = Number(radius);
        if (!Number.isFinite(value)) return;
        this.baseMouseRadius = Math.max(1000, Math.min(60000, Math.round(value)));
        if (this.mouse.radius > 0) {
            this.mouse.radius = this.baseMouseRadius;
        }
    }

    setParticleFriction(friction) {
        const value = Number(friction);
        if (!Number.isFinite(value)) return;
        this.friction = Math.max(0.05, Math.min(0.95, value));
        this.particles.forEach((particle) => particle.resetTuning());
    }

    setTrailAlpha(alpha) {
        const value = Number(alpha);
        if (!Number.isFinite(value)) return;
        this.trailAlpha = Math.max(0.05, Math.min(1, value));
    }

    getTrailAlpha() {
        return this.trailAlpha;
    }

    getGradientColors() {
        return [...this.gradientColors];
    }

    getTuning() {
        return {
            mode: this.mode,
            gap: this.gap,
            baseMouseRadius: this.baseMouseRadius,
            friction: this.friction,
            trailAlpha: this.trailAlpha,
            gradientSpeed: this.gradientSpeed
        };
    }

    wrapText(text = this.text) {
        const safeText = text?.trim() || this.text || 'AndyPants';
        this.text = safeText;

        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.font = `${this.fontSize}px ${this.fontFamily}`;

        const linesArray = [];
        const words = this.text.split(' ');
        let lineCounter = 0;
        let line = '';

        for (let i = 0; i < words.length; i++) {
            const testLine = line + words[i] + ' ';
            if (this.context.measureText(testLine).width > this.maxTextWidth) {
                line = words[i] + ' ';
                lineCounter++;
            } else {
                line = testLine;
            }
            linesArray[lineCounter] = line;
        }

        const textHeight = this.lineHeight * lineCounter;
        this.textY = this.canvasHeight / 2 - textHeight / 2;

        this.context.fillStyle = '#ffffff';
        this.context.lineWidth = 3;
        this.context.strokeStyle = 'rgba(255,255,255,0.2)';

        linesArray.forEach((lineText, index) => {
            const y = this.textY + (index * this.lineHeight);
            this.context.fillText(lineText, this.textX, y);
            this.context.strokeText(lineText, this.textX, y);
        });

        this.convertToParticles();
    }

    convertToParticles() {
        this.particles = [];
        const pixels = this.context.getImageData(0, 0, this.canvasWidth, this.canvasHeight).data;
        this.context.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

        for (let y = 0; y < this.canvasHeight; y += this.gap) {
            for (let x = 0; x < this.canvasWidth; x += this.gap) {
                const index = (y * this.canvasWidth + x) * 4;
                const alpha = pixels[index + 3];
                if (alpha > 0) {
                    this.particles.push(new Particle(this, x, y));
                }
            }
        }
    }

    getColorAt(x, y) {
        const palette = this.gradientColorStops.length ? this.gradientColorStops : [{ r: 255, g: 255, b: 255 }];
        if (palette.length === 1) {
            const only = palette[0];
            return `rgb(${only.r}, ${only.g}, ${only.b})`;
        }

        const angleX = Math.cos(this.gradientAngle);
        const angleY = Math.sin(this.gradientAngle);
        const projection = x * angleX + y * angleY;
        const diagonal = Math.max(1, Math.sqrt(this.canvasWidth * this.canvasWidth + this.canvasHeight * this.canvasHeight));
        const normalized = ((projection / diagonal) + 0.5 + (Math.sin(this.time * 0.02) * 0.1));
        const looped = ((normalized % 1) + 1) % 1;

        const segmentLength = 1 / (palette.length - 1);
        const segmentIndex = Math.min(palette.length - 2, Math.floor(looped / segmentLength));
        const segmentStart = segmentIndex * segmentLength;
        const localT = segmentLength > 0 ? (looped - segmentStart) / segmentLength : 0;

        const from = palette[segmentIndex];
        const to = palette[segmentIndex + 1];

        const red = Math.round(from.r + (to.r - from.r) * localT);
        const green = Math.round(from.g + (to.g - from.g) * localT);
        const blue = Math.round(from.b + (to.b - from.b) * localT);

        return `rgb(${red}, ${green}, ${blue})`;
    }

    hexToRgb(color) {
        if (typeof color !== 'string') {
            return { r: 255, g: 255, b: 255 };
        }

        const hex = color.replace('#', '').trim();
        const normalized = hex.length === 3
            ? hex.split('').map((value) => `${value}${value}`).join('')
            : hex;

        const value = Number.parseInt(normalized, 16);
        if (Number.isNaN(value)) {
            return { r: 255, g: 255, b: 255 };
        }

        return {
            r: (value >> 16) & 255,
            g: (value >> 8) & 255,
            b: value & 255
        };
    }

    render() {
        this.time += 1;
        this.gradientAngle += this.gradientSpeed;

        this.particles.forEach((particle) => {
            particle.update();
            particle.draw();
        });
    }
}
