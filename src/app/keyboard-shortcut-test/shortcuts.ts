export interface Shortcut {
	keys: string[];
	description: string;
	app?: "global" | "figma";
}

export const shortcuts: Shortcut[] = [
	{
		keys: ["cmd", "shift", "l"],
		description: "Move window to the right half of the screen",
		app: "global",
	},
	{
		keys: ["cmd", "shift", "h"],
		description: "Move window to the left half of the screen",
		app: "global",
	},
	{
		keys: ["cmd", "shift", "f"],
		description: "Maximize current window",
		app: "global",
	},
	{
		keys: ["cmd", "shift", "a"],
		description: "Open Raycast AI chat",
		app: "global",
	},
	{
		keys: ["shift", "a"],
		description: "Create auto layout",
		app: "figma",
	},
	{
		keys: ["cmd", "option", "k"],
		description: "Create component",
		app: "figma",
	},
	{
		keys: ["cmd", "g"],
		description: "Group selected layers",
		app: "figma",
	},
	{
		keys: ["cmd", "shift", "g"],
		description: "Ungroup selected layers",
		app: "figma",
	},
	{
		keys: ["cmd", "/"],
		description: "Show/hide UI",
		app: "figma",
	},
	{
		keys: ["cmd", "option", "t"],
		description: "Show/hide toolbar",
		app: "figma",
	},
	{
		keys: ["cmd", "\\"],
		description: "Toggle rulers",
		app: "figma",
	},
	{
		keys: ["cmd", "'"],
		description: "Toggle grid",
		app: "figma",
	},
	{
		keys: ["cmd", "option", "c"],
		description: "Copy properties",
		app: "figma",
	},
	{
		keys: ["t"],
		description: "Text tool",
		app: "figma",
	},
	{
		keys: ["r"],
		description: "Rectangle tool",
		app: "figma",
	},
	{
		keys: ["o"],
		description: "Ellipse tool",
		app: "figma",
	},
	{
		keys: ["l"],
		description: "Line tool",
		app: "figma",
	},
	{
		keys: ["p"],
		description: "Pen tool",
		app: "figma",
	},
];



export function matchShortcut(event: KeyboardEvent, shortcut: Shortcut): boolean {
  const pressedKeys = new Set<string>();
  if (event.metaKey) pressedKeys.add('cmd');
  if (event.ctrlKey) pressedKeys.add('ctrl');
  if (event.altKey) pressedKeys.add('option');
  if (event.shiftKey) pressedKeys.add('shift');

  // Handle letter keys and special cases
  if (event.key.length === 1) {
    // For cmd + option combinations, use event.code instead of event.key
    if (event.metaKey && event.altKey) {
      const key = event.code.replace('Key', '').toLowerCase();
      pressedKeys.add(key);
    } else {
      pressedKeys.add(event.key.toLowerCase());
    }
  }
  // Handle special keys
  else if (event.code === 'Space') {
    pressedKeys.add('space');
  }
  // Add more special key handlers if needed

  console.log('Pressed keys:', Array.from(pressedKeys));
  console.log('Expected shortcut:', shortcut.keys);

  // Check if all required keys are pressed and no extra keys are pressed
  const match = shortcut.keys.every(key => pressedKeys.has(key.toLowerCase())) &&
                pressedKeys.size === shortcut.keys.length;

  console.log('Match result:', match);

  return match;
}
