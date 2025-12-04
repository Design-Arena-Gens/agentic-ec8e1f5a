"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface VideoDisplayProps {
  prompt: string;
  isGenerating: boolean;
}

export default function VideoDisplay({ prompt, isGenerating }: VideoDisplayProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    let animationId: number;
    let frame = 0;

    // Generate a unique seed based on the prompt
    const seed = prompt.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);

    // Pseudo-random function with seed
    const seededRandom = (seed: number, x: number) => {
      const val = Math.sin(seed * 12.9898 + x * 78.233) * 43758.5453;
      return val - Math.floor(val);
    };

    const animate = () => {
      frame++;

      // Create gradient background
      const gradient = ctx.createLinearGradient(0, 0, width, height);
      const hue1 = (seed * 137.5 + frame * 0.5) % 360;
      const hue2 = (seed * 137.5 + 120 + frame * 0.5) % 360;
      gradient.addColorStop(0, `hsla(${hue1}, 70%, 50%, 0.8)`);
      gradient.addColorStop(1, `hsla(${hue2}, 70%, 30%, 0.8)`);

      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, width, height);

      // Draw animated particles
      for (let i = 0; i < 50; i++) {
        const x = (seededRandom(seed, i) * width + frame * (1 + seededRandom(seed, i + 100))) % width;
        const y = (seededRandom(seed, i + 50) * height + frame * 0.5 * (1 + seededRandom(seed, i + 150))) % height;
        const size = 2 + seededRandom(seed, i + 200) * 4;

        ctx.fillStyle = `hsla(${(seed + i * 7 + frame) % 360}, 80%, 70%, 0.6)`;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw flowing shapes
      for (let i = 0; i < 8; i++) {
        const offsetX = Math.sin(frame * 0.02 + i) * 100;
        const offsetY = Math.cos(frame * 0.02 + i) * 100;
        const x = width / 2 + offsetX + seededRandom(seed, i) * 200 - 100;
        const y = height / 2 + offsetY + seededRandom(seed, i + 10) * 200 - 100;
        const radius = 30 + seededRandom(seed, i + 20) * 50;

        const circleGradient = ctx.createRadialGradient(x, y, 0, x, y, radius);
        circleGradient.addColorStop(0, `hsla(${(seed * 2 + i * 30 + frame) % 360}, 80%, 60%, 0.3)`);
        circleGradient.addColorStop(1, `hsla(${(seed * 2 + i * 30 + frame) % 360}, 80%, 60%, 0)`);

        ctx.fillStyle = circleGradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // Add some noise/texture
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (Math.random() < 0.02) {
          const noise = Math.random() * 50;
          data[i] += noise;
          data[i + 1] += noise;
          data[i + 2] += noise;
        }
      }
      ctx.putImageData(imageData, 0, 0);

      animationId = requestAnimationFrame(animate);
    };

    if (!isGenerating) {
      animate();
    }

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [prompt, isGenerating]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
      className="max-w-5xl mx-auto"
    >
      <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border-2 border-gray-700">
        <div className="aspect-video relative bg-black">
          {isGenerating ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 180, 360],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full"
              />
            </div>
          ) : (
            <canvas
              ref={canvasRef}
              width={1280}
              height={720}
              className="w-full h-full"
            />
          )}
        </div>

        <div className="p-6">
          <h3 className="text-lg font-semibold mb-2">Prompt:</h3>
          <p className="text-gray-400">{prompt}</p>
        </div>
      </div>
    </motion.div>
  );
}
