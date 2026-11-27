import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as WebBrowser from 'expo-web-browser';

vi.mock('../client-cert', () => {
  const fetchFn = vi.fn();
  return { secureFetch: fetchFn, fetchWithoutForeignRedirect: fetchFn };
});

import { fetchWithoutForeignRedirect } from '../client-cert';
import { HandoffCancelledError, type OAuthTokens } from '../oauth';
import { endProviderSession, revokeRefreshToken } from '../oauth-native';
import { rootiestIdSignIn } from '../rootiest-signin';
import {
  isRootiestIdToken,
  rootiestSupportUrl,
  ROOTIEST_ID_CLIENT_ID,
  ROOTIEST_ID_REDIRECT_URI,
} from '../rootiest';

const mockFetch = fetchWithoutForeignRedirect as ReturnType<typeof vi.fn>;
const mockOpenAuthSession = WebBrowser.openAuthSessionAsync as ReturnType<typeof vi.fn>;

const discovery = {
  issuer: 'https://auth.rootiest.dev',
  authorization_endpoint: 'https://auth.rootiest.dev/authorize',
  token_endpoint: 'https://auth.rootiest.dev/api/oidc/token',
  end_session_endpoint: 'https://auth.rootiest.dev/api/oidc/end-session',
  scopes_supported: ['openid', 'profile', 'email', 'groups', 'offline_access'],
};

function json(body: unknown) {
  return { ok: true, url: '', json: async () => body, headers: { get: () => 'application/json' } };
}

const rootiestTokens: OAuthTokens = {
  accessToken: 'a',
  refreshToken: 'r',
  tokenEndpoint: discovery.token_endpoint,
  clientId: ROOTIEST_ID_CLIENT_ID,
  source: 'native',
};

describe('rootiestIdSignIn', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("opens RootiestID's sign-in with the app's own client, scheme and PKCE", async () => {
    mockFetch.mockResolvedValue(json(discovery));
    await expect(rootiestIdSignIn()).rejects.toBeInstanceOf(HandoffCancelledError);
    expect(mockFetch.mock.calls[0][0]).toMatch(/^https:\/\/auth\.rootiest\.dev\/\.well-known\//);
    const [authUrl, redirectUri] = mockOpenAuthSession.mock.calls[0];
    const url = new URL(authUrl as string);
    expect(url.origin + url.pathname).toBe('https://auth.rootiest.dev/authorize');
    expect(url.searchParams.get('client_id')).toBe(ROOTIEST_ID_CLIENT_ID);
    expect(url.searchParams.get('redirect_uri')).toBe(ROOTIEST_ID_REDIRECT_URI);
    expect(redirectUri).toBe(ROOTIEST_ID_REDIRECT_URI);
    expect(url.searchParams.get('scope')).toBe('openid profile email offline_access');
    expect(url.searchParams.get('code_challenge_method')).toBe('S256');
    expect(url.searchParams.get('resource')).toBeNull();
    expect(url.searchParams.get('prompt')).toBeNull();
  });

  it('asks for the account picker when adding an account', async () => {
    mockFetch.mockResolvedValue(json(discovery));
    await expect(rootiestIdSignIn({ addAccount: true })).rejects.toBeInstanceOf(HandoffCancelledError);
    const url = new URL(mockOpenAuthSession.mock.calls[0][0] as string);
    expect(url.searchParams.get('prompt')).toBe('select_account');
  });

  it('says RootiestID is unreachable when discovery fails', async () => {
    mockFetch.mockRejectedValue(new Error('offline'));
    await expect(rootiestIdSignIn()).rejects.toThrow(/RootiestID could not be reached/);
    expect(mockOpenAuthSession).not.toHaveBeenCalled();
  });
});

describe('sign-out with a RootiestID token', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('is recognised by its client id', () => {
    expect(isRootiestIdToken(rootiestTokens)).toBe(true);
    expect(isRootiestIdToken({ clientId: 'bulwark-webmail' })).toBe(false);
    expect(isRootiestIdToken(null)).toBe(false);
  });

  it("sends the refresh token to no revocation endpoint (RootiestID has none, the server's isn't its)", async () => {
    await revokeRefreshToken('https://mail.rootiest.dev', rootiestTokens);
    expect(mockFetch).not.toHaveBeenCalled();
  });

  it("leaves RootiestID's browser session alone", async () => {
    await endProviderSession('https://mail.rootiest.dev', rootiestTokens);
    expect(mockFetch).not.toHaveBeenCalled();
    expect(mockOpenAuthSession).not.toHaveBeenCalled();
  });
});

describe('rootiestSupportUrl', () => {
  it('prefills a problem ticket for Mail on the support desk', () => {
    const url = new URL(rootiestSupportUrl({ version: '0.1.96-r4', commit: 'abc1234' }, 'Android 15 (API 35) · Pixel 8'));
    expect(url.origin + url.pathname).toBe('https://support.rootiest.dev/new');
    expect(url.searchParams.get('category')).toBe('problem');
    expect(url.searchParams.get('service')).toBe('stalwart');
    expect(url.searchParams.get('subject')).toBe('Rootiest Mail app: ');
    const body = url.searchParams.get('body') ?? '';
    expect(body).toContain('App: Rootiest Mail v0.1.96-r4 (abc1234)');
    expect(body).toContain('Platform: Android 15 (API 35) · Pixel 8');
    expect(body.split('\n').length).toBeGreaterThan(5);
  });
});
