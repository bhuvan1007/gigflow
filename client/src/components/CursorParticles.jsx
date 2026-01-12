import { useEffect, useRef } from 'react';

const CursorParticles = () => {
    const canvasRef = useRef(null);
    const particles = useRef([]);
    const mouse = useRef({ x: 0, y: 0 });
    const lastMouse = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Google/Antigravity Blue-ish shades
        const colors = ['#4285F4', '#8AB4F8', '#1967D2', '#174EA6', '#E8F0FE'];

        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                // Dash/Confetti size
                this.w = Math.random() * 8 + 4; // Width 4-12px
                this.h = Math.random() * 3 + 2; // Height 2-5px

                // Random angle
                this.angle = Math.random() * Math.PI * 2;
                this.angleSpeed = (Math.random() - 0.5) * 0.2; // Rotation speed

                // Physics: Spread out from movement vector
                this.speedX = (Math.random() - 0.5) * 3;
                this.speedY = (Math.random() - 0.5) * 3;

                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.life = 100;
                this.decay = Math.random() * 2 + 1; // Faster decay for snappier feel
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.angle += this.angleSpeed;

                // Gravity/Float effect
                this.speedY += 0.05; // Slight gravity
                this.speedX *= 0.95; // Air resistance
                this.speedY *= 0.95;

                this.life -= this.decay;
                if (this.w > 0.1) this.w -= 0.05; // Shrink
                if (this.h > 0.1) this.h -= 0.02;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate(this.angle);
                ctx.fillStyle = this.color;
                ctx.globalAlpha = this.life / 100;
                // Draw Dash/Rectangle
                ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
                ctx.restore();
            }
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            for (let i = 0; i < particles.current.length; i++) {
                particles.current[i].update();
                particles.current[i].draw();

                if (particles.current[i].life <= 0) {
                    particles.current.splice(i, 1);
                    i--;
                }
            }
            requestAnimationFrame(animate);
        };

        animate();

        const handleMouseMove = (e) => {
            mouse.current.x = e.clientX;
            mouse.current.y = e.clientY;

            // Calculate distance moved to determine spawn density
            const dx = mouse.current.x - lastMouse.current.x;
            const dy = mouse.current.y - lastMouse.current.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Only spawn if moved enough (creates "gaps" naturally)
            if (distance > 5) {
                const spawnCount = Math.min(Math.floor(distance / 5), 5); // Cap at 5 per frame

                for (let i = 0; i < spawnCount; i++) {
                    // Spread logic
                    const spread = 20;
                    const offsetX = (Math.random() - 0.5) * spread;
                    const offsetY = (Math.random() - 0.5) * spread;
                    particles.current.push(new Particle(e.clientX + offsetX, e.clientY + offsetY));
                }
            }

            lastMouse.current.x = e.clientX;
            lastMouse.current.y = e.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-0"
            style={{ opacity: 1 }}
        />
    );
};

export default CursorParticles;
