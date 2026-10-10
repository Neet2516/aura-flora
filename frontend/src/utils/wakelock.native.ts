import { activateKeepAwakeAsync, deactivateKeepAwake as deactivateNative } from 'expo-keep-awake';

export const activateKeepAwake = async (): Promise<void> => {
  try {
    await activateKeepAwakeAsync();
  } catch {}
};

export const deactivateKeepAwake = async (): Promise<void> => {
  try {
    await deactivateNative();
  } catch {}
};
