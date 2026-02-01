'use client';

import { useEffect, useRef, useCallback } from 'react';
import { cn } from '@/utils/cn';

interface Particle {
  x: number;
  y: number;
  size: number;
  color: string;
  speedX: number;
  speedY: number;
  opacity: number;
  twinkleSpeed: number;
  twinklePhase: number;
}

interface ParticleFieldProps {
  particleCount?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  speed?: number;
  className?: string;
}

// Default colors from the Celestial Dreams palette
const DEFAULT_COLORS = ['#ffd66b', '#7f5af0', '#5bc0be']; // gold, violet, teal

export function ParticleField({
  particleCount = 50,
  colors = DEFAULT_COLORS,
  minSize = 1,
  maxSize = 3,
  speed = 0.5,
  className,
}: ParticleFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationFrameRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  // Initialize particles
  const initParticles = useCallback(
    (width: number, height: number) => {
      const particles: Particle[] = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: minSize + Math.random() * (maxSize - minSize),
          color: colors[Math.floor(Math.random() * colors.length)],
          // Slow diagonal/upward drift
          speedX: (Math.random() - 0.5) * speed * 0.5,
          speedY: -Math.random() * speed, // Negative = upward
          opacity: 0.3 + Math.random() * 0.7,
          twinkleSpeed: 0.5 + Math.random() * 1.5, // How fast to twinkle
          twinklePhase: Math.random() * Math.PI * 2, // Starting phase
        });
      }
      particlesRef.current = particles;
    },
    [particleCount, colors, minSize, maxSize, speed]
  );

  // Update and draw particles
  const animate = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, time: number) => {
      // Calculate delta time for smooth animation
      const deltaTime = lastTimeRef.current ? (time - lastTimeRef.current) / 16.67 : 1;
      lastTimeRef.current = time;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Update and draw each particle
      particlesRef.current.forEach((particle) => {
        // Update position with delta time for consistent speed
        particle.x += particle.speedX * deltaTime;
        particle.y += particle.speedY * deltaTime;

        // Update twinkle phase
        particle.twinklePhase += particle.twinkleSpeed * 0.02 * deltaTime;

        // Calculate current opacity with twinkle effect
        const twinkleOpacity = 0.3 + (Math.sin(particle.twinklePhase) + 1) * 0.35;
        const currentOpacity = particle.opacity * twinkleOpacity;

        // Wrap around screen edges
        if (particle.y < -particle.size) {
          particle.y = height + particle.size;
          particle.x = Math.random() * width;
        }
        if (particle.x < -particle.size) {
          particle.x = width + particle.size;
        } else if (particle.x > width + particle.size) {
          particle.x = -particle.size;
        }

        // Draw particle with glow effect
        ctx.save();
        ctx.globalAlpha = currentOpacity;

        // Outer glow
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          particle.size * 2
        );
        gradient.addColorStop(0, particle.color);
        gradient.addColorStop(1, 'transparent');
        ctx.fillStyle = gradient;
        ctx.fill();

        // Inner bright core
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();

        ctx.restore();
      });

      // Continue animation loop
      animationFrameRef.current = requestAnimationFrame((t) =>
        animate(ctx, width, height, t)
      );
    },
    []
  );

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle resize
    const handleResize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const { width, height } = parent.getBoundingClientRect();

      // Set canvas size with device pixel ratio for crisp rendering
      const dpr = window.devicePixelRatio || 1;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.scale(dpr, dpr);

      // Reinitialize particles on resize
      initParticles(width, height);
    };

    // Initial setup
    handleResize();

    // Start animation
    animationFrameRef.current = requestAnimationFrame((time) => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const { width, height } = parent.getBoundingClientRect();
      animate(ctx, width, height, time);
    });

    // Listen for resize
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [initParticles, animate]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'absolute inset-0 pointer-events-none',
        className
      )}
      aria-hidden="true"
    />
  );
}

export default ParticleField;
