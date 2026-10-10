import { Platform } from 'react-native';

// In Docker / local browser: window.location.hostname:8080 or process.env
const getBackendUrl = (): string => {
  if (process.env.EXPO_PUBLIC_BACKEND_URL) {
    return process.env.EXPO_PUBLIC_BACKEND_URL;
  }
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    // Web running in browser connects to backend on port 8080
    return `${window.location.protocol}//${window.location.hostname}:8080`;
  }
  if (Platform.OS === 'android') {
    return 'http://10.0.2.2:8080'; // Android emulator localhost alias
  }
  return 'http://localhost:8080';
};

export const Config = {
  backendBaseUrl: getBackendUrl(),
  groundEndpoint: '/api/v1/ground',
  sampleRate: 16000,
  minRecordingMs: 3000,
  maxRecordingMs: 10000,
  badgeDisplayMs: 2200,
  errorDismissMs: 3500,
  idlePulsePeriodMs: 3000,
  recordingPulsePeriodMs: 1500,
};
