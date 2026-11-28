import { describe, it, expect, beforeEach } from 'vitest';
import { accountColorChoices, automaticAccountColor, isAccountColor } from '../account-color';
import { ACCOUNT_AVATAR_PALETTE, generateAvatarColor } from '../avatar-utils';
import { ROOTIEST_THEME } from '../../theme/rootiest-theme';
import { useAccountStore } from '../../stores/account-store';

const ACCENTS = { primary: '', chart1: '', chart2: '', chart3: '', chart4: '', chart5: '', info: '', success: '', warning: '', error: '' };

function add(email: string): string {
  return useAccountStore.getState().addAccount({
    serverUrl: 'https://mail.example.com',
    username: email,
    displayName: email.split('@')[0],
    email,
    lastLoginAt: 0,
    isConnected: true,
    hasError: false,
  });
}

const account = (id: string) => useAccountStore.getState().getAccountById(id)!;

describe('account colour choices', () => {
  it('offers the theme accents, deduplicated and lowercased', () => {
    const dark = ROOTIEST_THEME.dark;
    const choices = accountColorChoices(dark);
    expect(choices).toEqual(['#a6e3a1', '#89b4fa', '#f9e2af', '#cba6f7', '#f38ba8']);
    expect(accountColorChoices(ROOTIEST_THEME.light)[0]).toBe('#dd7878');
  });

  it('falls back to the account palette when the theme has no hex accents', () => {
    expect(accountColorChoices({ ...ACCENTS, primary: 'hsl(10, 50%, 50%)' })).toEqual([...ACCOUNT_AVATAR_PALETTE]);
  });

  it('accepts only #rrggbb colours', () => {
    expect(isAccountColor('#A6E3A1')).toBe(true);
    expect(isAccountColor('#abc')).toBe(false);
    expect(isAccountColor('red')).toBe(false);
    expect(isAccountColor(null)).toBe(false);
  });

  it('hashes the automatic colour from the address, else the username', () => {
    expect(automaticAccountColor({ email: 'ada@example.com', username: 'ada' })).toBe(generateAvatarColor('ada@example.com'));
    expect(automaticAccountColor({ email: '', username: 'ada' })).toBe(generateAvatarColor('ada'));
  });
});

describe('account store: chosen colour (#16)', () => {
  beforeEach(() => {
    useAccountStore.setState({ accounts: [], activeAccountId: null, defaultAccountId: null });
  });

  it('starts automatic, with the hashed colour', () => {
    const id = add('ada@example.com');
    expect(account(id).avatarColor).toBe(generateAvatarColor('ada@example.com'));
    expect(account(id).customAvatarColor).toBeUndefined();
  });

  it('stores the chosen colour as the one in effect', () => {
    const id = add('ada@example.com');
    const other = add('bob@example.com');
    useAccountStore.getState().setAccountColor(id, '#A6E3A1');
    expect(account(id).avatarColor).toBe('#a6e3a1');
    expect(account(id).customAvatarColor).toBe('#a6e3a1');
    expect(account(other).avatarColor).toBe(generateAvatarColor('bob@example.com'));
    expect(account(other).customAvatarColor).toBeUndefined();
  });

  it('goes back to the hashed colour when set to automatic', () => {
    const id = add('ada@example.com');
    useAccountStore.getState().setAccountColor(id, '#a6e3a1');
    useAccountStore.getState().setAccountColor(id, null);
    expect(account(id).avatarColor).toBe(generateAvatarColor('ada@example.com'));
    expect('customAvatarColor' in account(id)).toBe(false);
  });

  it('ignores a colour that is not #rrggbb', () => {
    const id = add('ada@example.com');
    useAccountStore.getState().setAccountColor(id, '#a6e3a1');
    useAccountStore.getState().setAccountColor(id, 'not-a-colour');
    expect(account(id).avatarColor).toBe('#a6e3a1');
  });

  it('keeps the chosen colour when the account signs in again', () => {
    const id = add('ada@example.com');
    useAccountStore.getState().setAccountColor(id, '#cba6f7');
    expect(add('ada@example.com')).toBe(id);
    expect(account(id).avatarColor).toBe('#cba6f7');
    expect(account(id).customAvatarColor).toBe('#cba6f7');
  });
});
