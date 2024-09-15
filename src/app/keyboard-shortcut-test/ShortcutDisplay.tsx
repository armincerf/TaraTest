import React from "react";
import KeyIcon from "./KeyIcon";
import type { Shortcut } from "./shortcuts";

interface ShortcutDisplayProps {
	shortcut: Shortcut;
}

export default function ShortcutDisplay({ shortcut }: ShortcutDisplayProps) {
	return (
		<div className="flex items-center justify-center space-x-2">
			{shortcut.keys.map((key, index) => (
				<React.Fragment key={key}>
					<KeyIcon keyName={key} />
					{index < shortcut.keys.length - 1 && (
						<span className="text-2xl">+</span>
					)}
				</React.Fragment>
			))}
			{shortcut.app === "figma" && (
				<img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" className="w-6 h-6 ml-4" />
			)}
		</div>
	);
}
