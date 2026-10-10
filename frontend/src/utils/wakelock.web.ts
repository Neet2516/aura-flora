let wakeLockSentinel: any = null;

export const activateKeepAwake = async (): Promise<void> => {
  try {
    if (typeof navigator !== 'undefined' && 'wakeLock' in navigator) {
      wakeLockSentinel = await (navigator as any).wakeLock.request('screen');
    }
  } catch {
    // Wake lock failed or not supported
  }
};

export const deactivateKeepAwake = async (): Promise<void> => {
  try {
    if (wakeLockSentinel) {
      await wakeLockSentinel.release();
      wakeLockSentinel = null;
    }
  } catch {
    // Ignored
  }
};
