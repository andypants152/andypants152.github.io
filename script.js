// Get the canvas element and its 2D rendering context
const canvas = document.getElementById('fullPageCanvas');
const ctx = canvas.getContext('2d');

// Set the canvas dimensions to fill the entire viewport
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Function to draw on the canvas (for demonstration)
function draw() {
    ctx.fillStyle = 'gray';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}
// Array to store the dots
const dots = [];

// Gravity and friction
const gravity = 0.2;
const friction = 0.98;

// Function to create a new dot
function createDot(x, y) {
    const dot = {
        x,
        y,
        radius: 5,
        color: `rgb(${Math.random() * 255},${Math.random() * 255},${Math.random() * 255})`,
        velocity: {
            x: (Math.random() - 0.5) * 5, // Random horizontal velocity
            y: (Math.random() - 0.5) * 5, // Random vertical velocity
        },
    };
    dots.push(dot);
}

// Event listener for mouse click
canvas.addEventListener('click', (e) => {
    createDot(e.clientX - canvas.getBoundingClientRect().left, e.clientY - canvas.getBoundingClientRect().top);
});

// Animation loop
function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = 0; i < dots.length; i++) {
        const dot = dots[i];

        // Apply gravity
        dot.velocity.y += gravity;

        // Apply friction to slow down the dot
        dot.velocity.x *= friction;
        dot.velocity.y *= friction;

        // Update position
        dot.x += dot.velocity.x;
        dot.y += dot.velocity.y;

        // Bounce off the ground
        if (dot.y + dot.radius > canvas.height) {
            dot.y = canvas.height - dot.radius;
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

// Initial drawing
draw();

// Handle window resize to keep the canvas dimensions full-page
window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    draw(); // Redraw when the window is resized
});