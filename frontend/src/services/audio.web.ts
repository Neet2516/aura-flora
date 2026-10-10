/**
 * Web Audio Service — Native Browser Implementation (No expo-av dependency)
 * Uses standard MediaRecorder, Web Audio API, and HTMLAudioElement.
 */
export class AudioService {
  private static mediaRecorder: MediaRecorder | null = null;
  private static audioChunks: Blob[] = [];
  private static currentAudio: HTMLAudioElement | null = null;

  static async requestPermissions(): Promise<boolean> {
    try {
      if (typeof navigator !== 'undefined' && navigator.mediaDevices) {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((track) => track.stop());
        return true;
      }
      return true;
    } catch (e) {
      console.warn('Microphone permission denied on web:', e);
      return false;
    }
  }

  static async startRecording(): Promise<void> {
    try {
      this.audioChunks = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      this.mediaRecorder = recorder;

      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      recorder.start();
    } catch (err) {
      console.warn('Web media recording error:', err);
    }
  }

  static async stopRecording(): Promise<string> {
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return new Promise<string>((resolve) => {
        if (!this.mediaRecorder) {
          resolve(this.generateSyntheticPcm());
          return;
        }

        this.mediaRecorder.onstop = () => {
          try {
            const blob = new Blob(this.audioChunks, { type: 'audio/wav' });
            const reader = new FileReader();
            reader.readAsDataURL(blob);
            reader.onloadend = () => {
              const base64 = (reader.result as string)?.split(',')[1] || '';
              resolve(base64);
            };
          } catch {
            resolve(this.generateSyntheticPcm());
          }
        };

        this.mediaRecorder.stop();
        this.mediaRecorder.stream?.getTracks().forEach((t) => t.stop());
      });
    }

    return this.generateSyntheticPcm();
  }

  static async playAudio(url: string, onComplete?: () => void): Promise<void> {
    if (!url) {
      setTimeout(() => onComplete?.(), 4000);
      return;
    }

    try {
      if (this.currentAudio) {
        this.currentAudio.pause();
        this.currentAudio = null;
      }

      const audio = new Audio(url);
      this.currentAudio = audio;

      audio.onended = () => {
        onComplete?.();
      };

      audio.onerror = () => {
        console.warn('Audio element error playing:', url);
        setTimeout(() => onComplete?.(), 4000);
      };

      await audio.play();
    } catch (err) {
      console.warn('Playback error:', err);
      setTimeout(() => onComplete?.(), 4000);
    }
  }

  static async stopAudio(): Promise<void> {
    if (this.currentAudio) {
      this.currentAudio.pause();
      this.currentAudio = null;
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
