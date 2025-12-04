"use client";

import { motion } from "framer-motion";
import { Sparkles } from "./Icons";

interface VideoGeneratorProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  progress: number;
}

export default function VideoGenerator({
  prompt,
  setPrompt,
  onGenerate,
  isGenerating,
  progress,
}: VideoGeneratorProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="max-w-4xl mx-auto mb-12"
    >
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the video you want to create... (e.g., 'A serene lake at sunset with mountains in the background')"
            disabled={isGenerating}
            className="w-full h-32 px-6 py-4 text-lg bg-gray-900/50 border-2 border-gray-700 rounded-2xl focus:outline-none focus:border-purple-500 transition-colors resize-none placeholder-gray-500 backdrop-blur-sm"
            rows={4}
          />
        </div>

        {isGenerating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4"
          >
            <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">
              Generating your video... {Math.round(progress)}%
            </p>
          </motion.div>
        )}

        <motion.button
          type="submit"
          disabled={isGenerating || !prompt.trim()}
          whileHover={{ scale: isGenerating ? 1 : 1.02 }}
          whileTap={{ scale: isGenerating ? 1 : 0.98 }}
          className="mt-6 w-full py-4 px-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:shadow-lg hover:shadow-purple-500/50 flex items-center justify-center gap-2"
        >
          {isGenerating ? (
            <>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Sparkles className="w-5 h-5" />
              </motion.div>
              Generating...
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              Generate Video
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
