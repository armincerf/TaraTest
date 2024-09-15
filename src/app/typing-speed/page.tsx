"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ScoreInput from "@/app/components/ScoreInput";

export default function TypingSpeedPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white bg-opacity-10 rounded-lg p-8 text-center max-w-2xl"
      >
        <motion.h1
          className="text-4xl font-bold mb-6"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 120 }}
        >
          Typing Speed Test
        </motion.h1>
        <motion.p
          className="text-xl mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          Ready to test your typing skills? Click the button below to start your
          typing test on TypeRacer!
        </motion.p>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mb-8"
        >
          <Link
            href="https://monkeytype.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-full transition-colors duration-300"
          >
            Start Typing Test
            <motion.span
              className="ml-2"
              initial={{ x: -5 }}
              animate={{ x: 5 }}
              transition={{
                repeat: Infinity,
                duration: 0.8,
                repeatType: "reverse",
              }}
            >
              <ArrowRight size={24} />
            </motion.span>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <h2 className="text-2xl font-semibold mb-4">Record Your Score</h2>
          <ScoreInput
            testName="Typing Speed (WPM)"
            scoreType="number"
            unit="WPM"
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
