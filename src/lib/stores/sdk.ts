import { writable } from 'svelte/store';

/**
 * A store to track the initialization status of external SDKs.
 */
export const sdkReady = writable({
  google: false,
  facebook: false,
});
