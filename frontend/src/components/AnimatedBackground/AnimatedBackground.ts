export function initAnimatedBackground() {
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const bgGrid = document.getElementById('bg-grid');
    if (!bgGrid) return;

    const handleMouseMove = (e: MouseEvent) => {
        targetX = (e.clientX / window.innerWidth - 0.5) * 40;
        targetY = (e.clientY / window.innerHeight - 0.5) * 40;
    };

    const animate = () => {
        mouseX += (targetX - mouseX) * 0.1;
        mouseY += (targetY - mouseY) * 0.1;

        if (bgGrid) {
            bgGrid.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
        }

        requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animate();
}

// Initialize
initAnimatedBackground();

// Support Astro View Transitions
document.addEventListener('astro:after-swap', initAnimatedBackground);
