// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('fullPageCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to fill the entire viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const touches = [];

// Array to store the dots
const dots = [];

// Gravity and friction
const gravity = 1;
const friction = 0.98;

// Function to create a new dot
function createDot(x, y) {
    const dot = {
        x,
        y,
        radius: 20,
        color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
        velocity: {
            x: (Math.random() - 0.5) * 5, // Random horizontal velocity
            y: (Math.random() - 0.5) * 5, // Random vertical velocity
        },
    };
    dots.push(dot);
}

// Function to calculate the gravitational attraction between two dots
function calculateGravitationalForce(dot1, dot2) {
    const dx = dot2.x - dot1.x;
    const dy = dot2.y - dot1.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance > 0) {
        const force = (gravity * dot1.radius * dot2.radius) / (distance * distance);

        const angle = Math.atan2(dy, dx);
        const forceX = force * Math.cos(angle);
        const forceY = force * Math.sin(angle);

        dot1.velocity.x += forceX;
        dot1.velocity.y += forceY;
        dot2.velocity.x -= forceX;
        dot2.velocity.y -= forceY;
    }
}

// Function to check for collisions between dots
function checkCollisions() {
    for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
            const dot1 = dots[i];
            const dot2 = dots[j];
            const dx = dot2.x - dot1.x;
            const dy = dot2.y - dot1.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < dot1.radius + dot2.radius) {
                // Elastic collision response
                const angle = Math.atan2(dy, dx);
                const v1 = dot1.velocity.x * Math.cos(angle) + dot1.velocity.y * Math.sin(angle);
                const v2 = dot2.velocity.x * Math.cos(angle) + dot2.velocity.y * Math.sin(angle);

                const m1 = Math.PI * dot1.radius * dot1.radius;
                const m2 = Math.PI * dot2.radius * dot2.radius;
                const u1 = ((m1 - m2) * v1 + 2 * m2 * v2) / (m1 + m2);
                const u2 = ((m2 - m1) * v2 + 2 * m1 * v1) / (m1 + m2);

                dot1.velocity.x = u1 * Math.cos(angle);
                dot1.velocity.y = u1 * Math.sin(angle);
                dot2.velocity.x = u2 * Math.cos(angle);
                dot2.velocity.y = u2 * Math.sin(angle);
            }
        }
    }
}

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'gray';
  ctx.fillRect(0, 0, canvas.width, canvas.height);


    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Apply gravity between dots
        for (let j = 0; j < dots.length; j++) {
            if (i !== j) {
                calculateGravitationalForce(dot, dots[j]);
            }
        }

        // Apply friction to slow down the dot
        dot.velocity.x *= friction;
        dot.velocity.y *= friction;

        // Update position
        dot.x += dot.velocity.x;
        dot.y += dot.velocity.y;

        // Bounce off all sides of the canvas
        if (dot.x + dot.radius > canvas.width || dot.x - dot.radius < 0) {

            dot.velocity.x = -dot.velocity.x;
        }
        if (dot.y + dot.radius > canvas.height || dot.y - dot.radius < 0) {
            dot.velocity.y = -dot.velocity.y;
        }

        // Draw the dot
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
        ctx.fillStyle = dot.color;
        ctx.fill();
        ctx.closePath();
    }
}

animate();

// Handle window resize to keep the canvas dimensions full-page
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(); // Redraw when the window is resized
});

// Event listener for mouse click
canvas.addEventListener('click', (e) => {
    createDot(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
});

// Event listener for touchstart
canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    for (let i = 0; i < e.changedTouches.length; i++) {
        createDot(
            e.changedTouches[i].pageX - canvas.getBoundingClientRect().left,
            e.changedTouches[i].pageY - canvas.getBoundingClientRect().top
        );
    }
});

// Function to create a specified number of random dots
function createRandomDots(count) {
    for (let i = 0; i < count; i++) {
        const randomX = Math.random() * canvas.width;
        const randomY = Math.random() * canvas.height;

        createDot(randomX, randomY);
    }
}

function calculateDotsForCoverage(percentage) {
    if (percentage <= 0 || percentage >= 100) {
        return 0; // Invalid input, cannot achieve 0% or 100% coverage.
    }

    const canvasArea = canvas.width * canvas.height;
    const dotArea = Math.PI * Math.pow(20, 2);
    const requiredDotCount = Math.ceil((percentage / 100) * (canvasArea / dotArea));

    return requiredDotCount;
}

// Initialize the board with some dots
const requiredDotCount = calculateDotsForCoverage(2);
createRandomDots(requiredDotCount);