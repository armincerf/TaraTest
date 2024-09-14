type RGB = [number, number, number];
type HSL = [number, number, number];

function randomInt(min: number, max: number): number {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function rgbToHsl(r: number, g: number, b: number): HSL {
	r /= 255;
	g /= 255;
	b /= 255;
	const min = Math.min(r, g, b);
	let h = 0;
	let s = 0;
	const l = (Math.max(r, g, b) + min) / 2;

	if (Math.max(r, g, b) === min) {
		h = s = 0;
	} else {
		const d = Math.max(r, g, b) - min;
		s =
			l > 0.5
				? d / (2 - Math.max(r, g, b) - min)
				: d / (Math.max(r, g, b) + min);
		switch (Math.max(r, g, b)) {
			case r:
				h = (g - b) / d + (g < b ? 6 : 0);
				break;
			case g:
				h = (b - r) / d + 2;
				break;
			case b:
				h = (r - g) / d + 4;
				break;
		}
		h /= 6;
	}

	return [h * 360, s * 100, l * 100];
}

function hslToRgb(h: number, s: number, l: number): RGB {
	h /= 360;
	s /= 100;
	l /= 100;
	let r, g, b;

	if (s === 0) {
		r = g = b = l;
	} else {
		const hue2rgb = (p: number, q: number, t: number) => {
			if (t < 0) t += 1;
			if (t > 1) t -= 1;
			if (t < 1 / 6) return p + (q - p) * 6 * t;
			if (t < 1 / 2) return q;
			if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
			return p;
		};

		const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
		const p = 2 * l - q;
		r = hue2rgb(p, q, h + 1 / 3);
		g = hue2rgb(p, q, h);
		b = hue2rgb(p, q, h - 1 / 3);
	}

	return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function generateRandomColor(): RGB {
	return [randomInt(0, 255), randomInt(0, 255), randomInt(0, 255)];
}

function generateComplementaryColor(baseColor: RGB): RGB {
	const [h, s, l] = rgbToHsl(...baseColor);
	return hslToRgb((h + 180) % 360, s, l);
}

function generateAnalogousColors(baseColor: RGB): [RGB, RGB] {
	const [h, s, l] = rgbToHsl(...baseColor);
	return [hslToRgb((h + 30) % 360, s, l), hslToRgb((h + 330) % 360, s, l)];
}

function generateTriadicColors(baseColor: RGB): [RGB, RGB] {
	const [h, s, l] = rgbToHsl(...baseColor);
	return [hslToRgb((h + 120) % 360, s, l), hslToRgb((h + 240) % 360, s, l)];
}

function rgbToHex(r: number, g: number, b: number): string {
	return `#${[r, g, b]
		.map((x) => {
			const hex = x.toString(16);
			return hex.length === 1 ? `0${hex}` : hex;
		})
		.join("")}`;
}

function generateHarmoniousPalette(): { colors: RGB[], harmonyType: string } {
  const baseColor = generateRandomColor();
  const harmonyType = randomInt(0, 2);

  switch (harmonyType) {
    case 0: // Complementary
      return {
        colors: [baseColor, generateComplementaryColor(baseColor)],
        harmonyType: "complementary"
      };
    case 1: // Analogous
      return {
        colors: [baseColor, ...generateAnalogousColors(baseColor)],
        harmonyType: "analogous"
      };
    case 2: // Triadic
      return {
        colors: [baseColor, ...generateTriadicColors(baseColor)],
        harmonyType: "triadic"
      };
    default:
      return { colors: [baseColor], harmonyType: "monochromatic" };
  }
}

function generateNonHarmoniousPalette(): { colors: RGB[], harmonyType: string } {
  const colors: RGB[] = [];
  for (let i = 0; i < 3; i++) {
    colors.push(generateRandomColor());
  }
  return { colors, harmonyType: "non-harmonious" };
}

// Generate a set of palettes for the test
export function generateColorPalettes(count: number): { colors: string[], isHarmonious: boolean, harmonyType: string }[] {
  const palettes = [];
  for (let i = 0; i < count; i++) {
    const isHarmonious = Math.random() < 0.5;
    const { colors: rgbColors, harmonyType } = isHarmonious ? generateHarmoniousPalette() : generateNonHarmoniousPalette();
    const hexColors = rgbColors.map(color => rgbToHex(...color));
    palettes.push({ colors: hexColors, isHarmonious, harmonyType });
  }
  return palettes;
}
