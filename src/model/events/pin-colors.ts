// The colour values themselves are set per theme (pinColors in styles.ts), so that
// each one stays readable against that theme's background:
export const PIN_COLOR_NAMES = [
    'red',
    'orange',
    'yellow',
    'green',
    'blue',
    'purple',
    'pink'
] as const;

export type PinColor = typeof PIN_COLOR_NAMES[number];

export function isPinColor(value: unknown): value is PinColor {
    return typeof value === 'string' && PIN_COLOR_NAMES.includes(value as PinColor);
}
