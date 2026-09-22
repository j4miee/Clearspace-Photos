/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    // Legacy aliases (kept for backward compatibility)
    text: '#19272B',
    tint: '#C95F3E',

    // Core surfaces
    background: '#F6F3ED',
    foreground: '#19272B',

    // Cards / elevated surfaces
    card: '#FFFDF8',
    cardForeground: '#19272B',

    // Primary action color (buttons, links, active states)
    primary: '#C95F3E',
    primaryForeground: '#FFFDF8',

    // Secondary / less-emphasis interactive surfaces
    secondary: '#E4EDE5',
    secondaryForeground: '#294038',

    // Muted / subdued elements (dividers, timestamps, placeholders)
    muted: '#E9E5DE',
    mutedForeground: '#687478',

    // Accent highlights (badges, selected items, focus rings)
    accent: '#F0C85B',
    accentForeground: '#4E3B10',

    // Destructive actions (delete, error states)
    destructive: '#B64339',
    destructiveForeground: '#FFFDF8',

    // Borders and input outlines
    border: '#DCD9D1',
    input: '#DCD9D1',
  },

  // Border radius (in px). Sync from the sibling web artifact's --radius
  // CSS variable. This value applies to cards, buttons, inputs, and modals.
  radius: 18,
};

export default colors;
