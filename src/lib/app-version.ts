import { NativeModules } from 'react-native';
import Constants from 'expo-constants';
import { isRootiest } from './rootiest';

/**
 * The version to show: the Android build's own in the rootiest build, which
 * carries the Rootiest revision (0.1.96-r1), else upstream's VERSION.
 */
export const APP_VERSION: string =
  (isRootiest && (NativeModules.BulwarkBuild?.versionName as string | undefined))
  || Constants.expoConfig?.version
  || '0.0.0';
