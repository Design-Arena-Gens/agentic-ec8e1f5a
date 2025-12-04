"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import VideoGenerator from "@/components/VideoGenerator";
import VideoDisplay from "@/components/VideoDisplay";

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    setProgress(0);
    setGeneratedVideo(null);

    // Simulate video generation with progress
    const duration = 8000; // 8 seconds
    const interval = 50;
    const steps = duration / interval;
    let currentStep = 0;

    const progressInterval = setInterval(() => {
      currentStep++;
      setProgress((currentStep / steps) * 100);

      if (currentStep >= steps) {
        clearInterval(progressInterval);
        // Generate video after completion
        setTimeout(() => {
          setGeneratedVideo(prompt);
          setIsGenerating(false);
        }, 200);
      }
    }, interval);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black">
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-6xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
            Sora-2
          </h1>
          <p className="text-xl text-gray-400">
            Generate stunning videos from your imagination
          </p>
        </motion.div>

        <VideoGenerator
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
          progress={progress}
        />

        <AnimatePresence mode="wait">
          {(isGenerating || generatedVideo) && (
            <VideoDisplay
              prompt={generatedVideo || prompt}
              isGenerating={isGenerating}
            />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
