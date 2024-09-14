"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

export default function TaraTest() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const timer = setTimeout(() => setIsLoading(false), 2000);
		return () => clearTimeout(timer);
	}, []);

	return (
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
	);
}
