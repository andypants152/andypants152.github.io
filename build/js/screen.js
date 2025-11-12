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
        this.effect.wrapText('AndyPants');
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
        }
    }

    animate() {
        if (this.isAnimating) {

            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = this.color;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            this.effect.render();

            // this.logFPS();
            if (this.isAnimating) {
                requestAnimationFrame(() => this.animate());
            }
        }
    }

    changeBackgroundColor(color) {
        if (color) {
            this.color = color;
        } else {
            this.color = this.randomColor();
        }
        this.updateDocumentBackground(this.color);
    }

    randomColor() {
        return `#${Math.floor(Math.random() * 16777215).toString(16)}`;
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
    constructor(effect, x, y, color) {
        this.effect = effect;
        this.x = Math.random() * this.effect.canvasWidth;
        this.y = this.effect.canvasHeight;
        this.color = color;
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
        this.friction = Math.random() * 0.6 + 0.15;
        this.ease = Math.random() * 0.1 + 0.005;

    }
    draw() {
        if( this.effect.context.fillStyle != this.color ){
            this.effect.context.fillStyle = this.color;
        }
        this.effect.context.fillRect(this.x, this.y, this.size, this.size);
    }
    update() {
        this.dx = this.effect.mouse.x - this.x;
        this.dy = this.effect.mouse.y - this.y;
        // this.distance = Math.sqrt(this.dx * this.dx + this.dy * this.dy);  
        this.distance = this.dx * this.dx + this.dy * this.dy; //performance enhancement
        this.force = -this.effect.mouse.radius / this.distance;
        if (this.distance < this.effect.mouse.radius) {
            this.angle = Math.atan2(this.dy, this.dx);
            this.vx += this.force * Math.cos(this.angle);
            this.vy += this.force * Math.sin(this.angle);
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
        this.fontSize = 150;
        this.lineHeight = this.fontSize * 0.8;
        this.maxTextWidth = this.canvasWidth * 0.8;

        this.particles = [];
        this.gap = 5;
        this.baseMouseRadius = 15000;
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
    }

    updateInputPosition(x, y) {
        this.mouse.x = x;
        this.mouse.y = y;
    }

    setInteractivity(isActive) {
        this.mouse.radius = isActive ? this.baseMouseRadius : 0;
    }

    wrapText(text) {
        const gradient = this.context.createLinearGradient(0, 0, this.canvasWidth, this.canvasHeight);
        gradient.addColorStop(0.3, 'red');
        gradient.addColorStop(0.5, 'fuchsia');
        gradient.addColorStop(0.7, 'blue');
        this.context.fillStyle = gradient;
        this.context.textAlign = 'center';
        this.context.textBaseline = 'middle';
        this.context.lineWidth = 3;
        this.context.strokeStyle = 'white';
        this.context.font = this.fontSize + 'px Helvetica';
        let linesArray = [];
        let words = text.split(' ');
        let lineCounter = 0;
        let line = '';
        for (let i = 0; i < words.length; i++) {
            let testline = line + words[i] + ' ';
            if (this.context.measureText(testline).width > this.maxTextWidth) {
                line = words[i] + ' ';
                lineCounter++;
            }
            else {
                line = testline;
            }
            linesArray[lineCounter] = line;
        }
        let textHeight = this.lineHeight * lineCounter;
        this.textY = this.canvasHeight / 2 - textHeight / 2;
        linesArray.forEach((el, index) => {
            this.context.fillText(el, this.textX, this.textY + (index * this.lineHeight));
            this.context.strokeText(el, this.textX, this.textY + (index * this.lineHeight));

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
                    const red = pixels[index];
                    const green = pixels[index + 1];
                    const blue = pixels[index + 2];
                    const color = 'rgb(' + red + ',' + green + ',' + blue + ')';
                    this.particles.push(new Particle(this, x, y, color));
                }
            }
        }
    }

    render() {
        this.particles.forEach(particle => {
            particle.update();
            particle.draw();
        })
    }
}
