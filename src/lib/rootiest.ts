// Rootiest Mail: what differs in the rootiest build (android/app/rootiest.gradle).
// Upstream code reads these in the few places it has to, so merging a new
// Bulwark Mobile release touches as little as possible.

import { androidDistribution } from './platform-capabilities';

/** True in the Rootiest Mail build. */
export const isRootiest = androidDistribution === 'rootiest';

/** The app's name, as the launcher shows it (scripts/brand.py). */
export const ROOTIEST_APP_NAME = 'Rootiest Mail';

/** Rootiest's own push relay, the default in place of the hosted Bulwark one. */
export const ROOTIEST_RELAY_BASE_URL = 'https://relay.rootiest.dev';
