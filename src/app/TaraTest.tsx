"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const implementedTests = [{ name: "Typing Speed", href: "/typing-speed" }];

const comingSoonTests = [
  { name: "Figma Wireframe Speed", href: "#" },
  { name: "UI Element Recognition", href: "#" },
  { name: "Color Harmony Test", href: "#" },
  { name: "User Flow Completion", href: "#" },
  { name: "Accessibility Checklist", href: "#" },
  { name: "Heuristic Evaluation", href: "#" },
  { name: "Interaction Design Speed", href: "#" },
  { name: "Information Architecture Sorting", href: "#" },
  { name: "Visual Hierarchy Analysis", href: "#" },
];

export default function TaraTest() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 text-white">
      <header className="p-4 md:p-6 bg-white bg-opacity-10">
        <div className="container mx-auto flex flex-col md:flex-row items-center justify-between">
          <motion.div
            className="text-4xl font-bold mb-4 md:mb-0"
            whileHover={{ scale: 1.1, rotate: [0, -10, 10, -10, 0] }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-yellow-300">Tara</span>
            <span className="text-blue-300">Test</span>
          </motion.div>
          <nav className="w-full md:w-auto">
            <ul className="flex flex-wrap justify-center gap-2 md:gap-4">
              {implementedTests.map((test) => (
                <motion.li
                  key={test.name}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href={test.href}
                    className="text-xs md:text-sm bg-white bg-opacity-20 px-2 py-1 md:px-3 md:py-2 rounded-full hover:bg-opacity-30 transition-all duration-300 inline-block"
                  >
                    {test.name}
                  </Link>
                </motion.li>
              ))}
              {comingSoonTests.map((test) => (
                <motion.li
                  key={test.name}
                  whileHover={{ scale: 1.05 }}
                  className="opacity-50 cursor-not-allowed"
                >
                  <span className="text-xs md:text-sm bg-white bg-opacity-20 px-2 py-1 md:px-3 md:py-2 rounded-full inline-block">
                    {test.name} (Coming Soon)
                  </span>
                </motion.li>
              ))}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-6">
        <motion.div
          className="bg-white bg-opacity-10 rounded-lg p-6 min-h-[400px] flex items-center justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {isLoading ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
              }}
            >
              <Loader2 className="w-12 h-12 text-blue-300" />
            </motion.div>
          ) : (
            <h2 className="text-2xl font-bold">Welcome to TaraTest!</h2>
          )}
        </motion.div>
      </main>

      <footer className="container mx-auto p-4 md:p-6 text-center">
        <motion.p
          className="text-lg font-semibold"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          You've got this! Every test is a chance to learn and grow. 🌟
        </motion.p>
      </footer>
    </div>
  );
}
