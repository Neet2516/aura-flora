/**
 * AuraFlora Native Web Audio & Procedural Bioacoustic Engine
 * Zero external audio file dependencies — generates living nature ambiances natively,
 * records real microphone streams, and drives real-time audio visualizers.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private activeGenerators: { stop: () => void }[] = [];
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private micStream: MediaStream | null = null;
  private isSynthesizing = false;

  private getContext(): AudioContext {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  public getAnalyser(): AnalyserNode {
    const ctx = this.getContext();
    if (!this.analyser) {
      this.analyser = ctx.createAnalyser();
      this.analyser.fftSize = 512;
      this.analyser.smoothingTimeConstant = 0.85;
    }
    return this.analyser;
  }

  /**
   * Generates procedural ambient nature soundscapes based on biome type
   */
  public playAmbient(type: 'forest' | 'creek' | 'rain' | 'meadow' | 'urban_park'): void {
    this.stopAmbient();
    const ctx = this.getContext();
    const analyser = this.getAnalyser();

    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.35, ctx.currentTime);
    masterGain.connect(analyser);
    analyser.connect(ctx.destination);

    this.isSynthesizing = true;

    // 1. Pink/Brown Noise Generator for Wind & Foliage
    const bufferSize = ctx.sampleRate * 2;
    const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.06;
      b6 = white * 0.115926;
    }

    const noiseSource = ctx.createBufferSource();
    noiseSource.buffer = noiseBuffer;
    noiseSource.loop = true;

    // Filter configuration based on biome
    const filter = ctx.createBiquadFilter();
    if (type === 'forest') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(450, ctx.currentTime);
    } else if (type === 'creek') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1400, ctx.currentTime);
      filter.Q.setValueAtTime(1.2, ctx.currentTime);
    } else if (type === 'rain') {
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2200, ctx.currentTime);
      filter.Q.setValueAtTime(0.8, ctx.currentTime);
    } else if (type === 'meadow') {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(650, ctx.currentTime);
    } else {
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, ctx.currentTime);
    }

    noiseSource.connect(filter);
    filter.connect(masterGain);
    noiseSource.start();

    // 2. Periodic natural acoustic events (bird trill, water droplet, insect pulse)
    let intervalId: any = null;

    if (type === 'forest' || type === 'meadow') {
      // Procedural bird song / cricket pulses
      intervalId = setInterval(() => {
        if (!this.isSynthesizing || !this.ctx) return;
        this.triggerChirp(this.ctx, masterGain, type === 'meadow' ? 4500 : 2800);
      }, 1600);
    } else if (type === 'creek') {
      // Fluid droplet acoustic resonances
      intervalId = setInterval(() => {
        if (!this.isSynthesizing || !this.ctx) return;
        this.triggerDroplet(this.ctx, masterGain);
      }, 700);
    }

    this.activeGenerators.push({
      stop: () => {
        try {
          noiseSource.stop();
          noiseSource.disconnect();
          if (intervalId) clearInterval(intervalId);
          masterGain.disconnect();
        } catch {}
      },
    });
  }

  private triggerChirp(ctx: AudioContext, destination: AudioNode, baseFreq: number): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    osc.type = 'sine';
    const variance = (Math.random() - 0.5) * 400;
    osc.frequency.setValueAtTime(baseFreq + variance, now);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + variance + 800, now + 0.08);
    osc.frequency.exponentialRampToValueAtTime(baseFreq + variance - 200, now + 0.18);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.08, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.25);
  }

  private triggerDroplet(ctx: AudioContext, destination: AudioNode): void {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const now = ctx.currentTime;

    const startFreq = 800 + Math.random() * 900;
    osc.type = 'sine';
    osc.frequency.setValueAtTime(startFreq, now);
    osc.frequency.exponentialRampToValueAtTime(startFreq + 1200, now + 0.12);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.05, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);

    osc.connect(gain);
    gain.connect(destination);

    osc.start(now);
    osc.stop(now + 0.15);
  }

  public stopAmbient(): void {
    this.isSynthesizing = false;
    this.activeGenerators.forEach((gen) => gen.stop());
    this.activeGenerators = [];
  }

  /**
   * Start microphone recording and attach to AnalyserNode
   */
  public async startMicRecording(): Promise<void> {
    const ctx = this.getContext();
    const analyser = this.getAnalyser();

    this.micStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: 16000,
        echoCancellation: false,
        noiseSuppression: false,
      },
    });

    const source = ctx.createMediaStreamSource(this.micStream);
    source.connect(analyser);

    this.audioChunks = [];
    this.mediaRecorder = new MediaRecorder(this.micStream);
    this.mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        this.audioChunks.push(e.data);
      }
    };
    this.mediaRecorder.start();
  }

  /**
   * Stop microphone recording and return Base64 audio string
   */
  public async stopMicRecording(): Promise<string> {
    return new Promise((resolve) => {
      if (!this.mediaRecorder) {
        resolve('');
        return;
      }

      this.mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = (reader.result as string).split(',')[1] || '';
          resolve(base64Data);
        };
        reader.readAsDataURL(audioBlob);

        if (this.micStream) {
          this.micStream.getTracks().forEach((track) => track.stop());
          this.micStream = null;
        }
      };

      this.mediaRecorder.stop();
    });
  }

  /**
   * Speak whisper prompt via SpeechSynthesis or ElevenLabs audio playback
   */
  public async speakPrompt(text: string, audioUrl?: string, onEnd?: () => void): Promise<void> {
    if (audioUrl) {
      try {
        const audio = new Audio(audioUrl);
        audio.onended = () => {
          if (onEnd) onEnd();
        };
        await audio.play();
        return;
      } catch (e) {
        console.warn('Backend audio playback fallback to Web Speech:', e);
      }
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85; // Slow, deliberate tempo
      utterance.pitch = 0.9; // Calm low pitch
      utterance.volume = 0.85;

      const voices = window.speechSynthesis.getVoices();
      const naturalVoice = voices.find(
        (v) => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Daniel') || v.name.includes('Samantha'))
      );
      if (naturalVoice) utterance.voice = naturalVoice;

      utterance.onend = () => {
        if (onEnd) onEnd();
      };
      utterance.onerror = () => {
        if (onEnd) onEnd();
      };

      window.speechSynthesis.speak(utterance);
    } else {
      if (onEnd) setTimeout(onEnd, 4000);
    }
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Play short sensory UI click / tap haptic feedback sound
   */
  public playHaptic(): void {
    try {
      const ctx = this.getContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const now = ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.05);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch {}
  }
}

export const soundEngine = new SoundEngine();
