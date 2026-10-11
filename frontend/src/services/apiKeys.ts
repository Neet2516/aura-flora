export interface ApiKeyConfig {
  useCustomKeys: boolean;
  gemmaApiKey: string;
  gemmaModel: string;
  elevenlabsApiKey: string;
  elevenlabsVoiceId: string;
  tabpfnApiKey: string;
}

const STORAGE_KEY = 'aura_flora_api_config_v1';

export const DEFAULT_CONFIG: ApiKeyConfig = {
  useCustomKeys: false,
  gemmaApiKey: '',
  gemmaModel: 'gemini-2.5-flash',
  elevenlabsApiKey: '',
  elevenlabsVoiceId: 'EXAVITQu4vr4xnSDxMaL',
  tabpfnApiKey: '',
};

export class ApiKeyManager {
  static getConfig(): ApiKeyConfig {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
      }
    } catch {
      // Fallback to default
    }
    return DEFAULT_CONFIG;
  }

  static saveConfig(config: ApiKeyConfig): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch (e) {
      console.error('Failed to save API config to localStorage', e);
    }
  }

  static resetToDefaults(): ApiKeyConfig {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return DEFAULT_CONFIG;
  }
}
