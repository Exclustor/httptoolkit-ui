// The available colours for manually tagging events in the UI. These
// mirror the category highlight palette (see categorization.ts) so that
// tag markers feel visually consistent with the category markers.
export const TAG_COLORS = {
    red: '#ce3939',
    orange: '#ff8c38',
    yellow: '#e9f05b',
    green: '#4caf7d',
    blue: '#2fb4e0',
    purple: '#6e40aa',
    pink: '#dd3a96',
    grey: '#888'
} as const;

export type TagColor = keyof typeof TAG_COLORS;

export const TAG_COLOR_NAMES = Object.keys(TAG_COLORS) as TagColor[];

export function isTagColor(value: unknown): value is TagColor {
    return typeof value === 'string' && value in TAG_COLORS;
}

export function getTagColorValue(color: TagColor): string {
    return TAG_COLORS[color];
}
