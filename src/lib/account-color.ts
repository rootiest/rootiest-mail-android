// A signed-in account's colour: the one its user picked, or "automatic",
// the colour hashed from its address (avatar-utils generateAvatarColor), as
// the webmail gives every account. The account registry keeps the colour in
// effect in `avatarColor`, so everything that draws an account (the switcher,
// the sidebar, the account lists, the unified inbox, the widgets) follows the
// choice without knowing about it, and the choice itself in
// `customAvatarColor`.

import type { ThemePalette } from '../theme/tokens';
import { ACCOUNT_AVATAR_PALETTE, generateAvatarColor } from './avatar-utils';

const HEX_COLOR = /^#[0-9a-f]{6}$/i;

/** A colour an account can be given: `#rrggbb`. */
export function isAccountColor(value: unknown): value is string {
  return typeof value === 'string' && HEX_COLOR.test(value.trim());
}

/** The automatic colour of an account: hashed from its address. */
export function automaticAccountColor(account: { email?: string; username: string }): string {
  return generateAvatarColor(account.email || account.username);
}

// The theme's accents, in the order the picker shows them.
const ACCENT_TOKENS = [
  'primary', 'chart1', 'chart2', 'chart3', 'chart4', 'chart5', 'info', 'success', 'warning', 'error',
] as const satisfies readonly (keyof ThemePalette)[];

/**
 * The colours offered for an account: the theme's accents, so the choice
 * matches the palette the app is drawn in. A theme whose accents are not
 * plain hex colours offers the account palette instead.
 */
export function accountColorChoices(palette: Partial<Pick<ThemePalette, (typeof ACCENT_TOKENS)[number]>>): string[] {
  const out: string[] = [];
  for (const token of ACCENT_TOKENS) {
    const value = palette[token];
    if (!isAccountColor(value)) continue;
    const color = value.trim().toLowerCase();
    if (!out.includes(color)) out.push(color);
  }
  return out.length > 0 ? out : [...ACCOUNT_AVATAR_PALETTE];
}
