import type { ReactNode } from "react";

export function Section({ children }: { children: ReactNode }) {
	return (
		<section className="flex flex-col sm:flex-row gap-4 sm:gap-8 p-4">
			{children}
		</section>
	);
}
