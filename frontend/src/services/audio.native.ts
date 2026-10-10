import { Audio } from 'expo-av';

/**
 * Native Audio Service for iOS and Android using Expo AV.
 */
export class AudioService {
  private static nativeRecording: Audio.Recording | null = null;
  private static nativeSound: Audio.Sound | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      const { status } = await Audio.requestPermissionsAsync();
      return status === 'granted';
    } catch {
      return false;
    }
  }

  static async startRecording(): Promise<void> {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
    await recording.startAsync();
    this.nativeRecording = recording;
  }

  static async stopRecording(): Promise<string> {
    if (!this.nativeRecording) {
      return this.generateSyntheticPcm();
    }

    try {
      await this.nativeRecording.stopAndUnloadAsync();
      const uri = this.nativeRecording.getURI();
      this.nativeRecording = null;

      if (!uri) return this.generateSyntheticPcm();

      const response = await fetch(uri);
      const blob = await response.blob();
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
          const base64 = (reader.result as string)?.split(',')[1] || '';
          resolve(base64);
        };
      });
    } catch {
      return this.generateSyntheticPcm();
    }
  }

  static async playAudio(url: string, onComplete?: () => void): Promise<void> {
    if (!url) {
      setTimeout(() => onComplete?.(), 4000);
      return;
    }

    try {
      if (this.nativeSound) {
        await this.nativeSound.unloadAsync();
      }

      const { sound } = await Audio.Sound.createAsync(
        { uri: url },
        { shouldPlay: true }
      );

      this.nativeSound = sound;
      sound.setOnPlaybackStatusUpdate((status) => {
        if (status.isLoaded && status.didJustFinish) {
          onComplete?.();
        }
      });
    } catch {
      setTimeout(() => onComplete?.(), 4000);
    }
  }

  static async stopAudio(): Promise<void> {
    if (this.nativeSound) {
      try {
        await this.nativeSound.stopAsync();
        await this.nativeSound.unloadAsync();
      } catch {}
      this.nativeSound = null;
    }
  }

  private static generateSyntheticPcm(): string {
    const bytes = new Uint8Array(1024);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = Math.floor(Math.random() * 256);
    }
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return typeof btoa !== 'undefined' ? btoa(binary) : '';
  }
}
