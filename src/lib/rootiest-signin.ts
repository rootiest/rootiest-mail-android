// Rootiest Mail: sign in with RootiestID from the app itself, no webmail or QR code needed.
// Kept apart from lib/rootiest, which the i18n code imports and so must stay free of the browser and network
// modules this one needs.

import { HandoffError, type OAuthTokens } from './oauth';
import { discoverOAuthMetadata, loginWithPkce } from './oauth-native';
import {
  ROOTIEST_ID_CLIENT_ID,
  ROOTIEST_ID_ISSUER,
  ROOTIEST_ID_REDIRECT_URI,
  ROOTIEST_ID_SCOPES,
  ROOTIEST_SERVER_URL,
} from './rootiest';

/**
 * Runs RootiestID's sign-in (authorization code with PKCE) in the system browser with the app's own client and
 * returns the token bundle for Rootiest's mail server. The bundle refreshes at RootiestID's token endpoint, as a
 * QR-paired one does. Throws HandoffCancelledError when the user closes the browser.
 */
export async function rootiestIdSignIn(opts?: { addAccount?: boolean }): Promise<OAuthTokens> {
  const metadata = await discoverOAuthMetadata(ROOTIEST_ID_ISSUER);
  if (!metadata) throw new HandoffError('RootiestID could not be reached. Check your connection and try again.');
  return loginWithPkce(ROOTIEST_SERVER_URL, metadata, {
    clientId: ROOTIEST_ID_CLIENT_ID,
    redirectUri: ROOTIEST_ID_REDIRECT_URI,
    scopes: ROOTIEST_ID_SCOPES,
    addAccount: opts?.addAccount,
  });
}
