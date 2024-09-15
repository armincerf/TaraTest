import { generateRandomHexColor } from "./generateColourPalletes";

export function isColorContrastGood(color1: string, color2: string): boolean {
	const contrastRatio = getContrastRatio(color1, color2);

	// WCAG 2.0 level AA requires a contrast ratio of at least 4.5:1 for normal text
	// and 3:1 for large text. We'll use 4.5:1 as our threshold.
	return contrastRatio >= 4.5;
}

export function getContrastRatio(color1: string, color2: string): number {
	const luminance1 = getRelativeLuminance(hexToRGB(color1));
	const luminance2 = getRelativeLuminance(hexToRGB(color2));

	const lighter = Math.max(luminance1, luminance2);
	const darker = Math.min(luminance1, luminance2);

	return (lighter + 0.05) / (darker + 0.05);
}

function hexToRGB(hex: string): [number, number, number] {
	const r = Number.parseInt(hex.slice(1, 3), 16);
	const g = Number.parseInt(hex.slice(3, 5), 16);
	const b = Number.parseInt(hex.slice(5, 7), 16);
	return [r, g, b];
}

 function getRelativeLuminance(rgb: [number, number, number]): number {
    const [r, g, b] = rgb.map((channel) => {
        const sRGB = channel / 255;
        return sRGB <= 0.03928 ? sRGB / 12.92 : ((sRGB + 0.055) / 1.055) ** 2.4;
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function generateColorPairWithContrast(isGood: boolean) {
	let bgColor = generateRandomHexColor();
	let textColor = generateRandomHexColor();
	do {
		bgColor = generateRandomHexColor();
		textColor = generateRandomHexColor();
	} while (isColorContrastGood(bgColor, textColor) !== isGood);
	return { bgColor, textColor };
}
